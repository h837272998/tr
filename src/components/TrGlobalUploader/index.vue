<template>
  <div id="global-uploader">
    <uploader
      ref="uploader"
      :options="options"
      :auto-start="false"
      class="uploader-app"
      :file-status-text="fileStatusText"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
    >
      <uploader-unsupport />
      <uploader-btn class="global-uploader-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>
      <el-collapse-transition>
        <uploader-list v-show="panelShow">
          <div slot-scope="props" class="file-panel" :class="{'collapse': collapse}">
            <div class="file-title">
              <span>文件列表</span>
              <div class="operate">
                <el-button type="text" :title="collapse ? '展开':'折叠' " @click="fileListShow">
                  <i :class="collapse ? 'el-icon-document-copy': 'el-icon-minus'" />
                </el-button>
                <el-button type="text" title="关闭" @click="close">
                  <i class="el-icon-close" />
                </el-button>
              </div>
            </div>

            <ul v-show="ulShow" ref="fileList" class="file-list">
              <li v-for="file in props.fileList" :key="file.id">
                <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true" />
              </li>
              <div v-if="!props.fileList.length" class="no-file"><i class="iconfont icon-empty-file" /> 暂无待上传文件</div>
            </ul>
          </div>
        </uploader-list>
      </el-collapse-transition>

    </uploader>
  </div>
</template>

<script>
import { ACCEPT_CONFIG } from './config'
import Bus from './bus'
import SparkMD5 from 'spark-md5'
import $ from "jquery"
import { getToken } from '@/utils/auth'

export default {
  name: 'TrGlobalUploader',
  data() {
    console.info(getToken())
    return {
      options: {
        target: '/api/f/files/upload-v2',
        chunkSize: '5242880',
        fileParameterName: 'file',
        maxChunkRetries: 3,
        testChunks: true, // 是否开启服务器分片效验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          const objMessage = JSON.parse(message)
          if (objMessage.skipUpload) {
            return true
          }
          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
      },
      attrs: {
        accept: ACCEPT_CONFIG.getAll()
      },
      panelShow: false,
      collapse: false,
      ulShow: true,
    }
  },
  computed: {
    uploader() {
      return this.$refs.uploader.uploader
    }
  },
  mounted() {
    Bus.$on('openUploader', query => {
      this.params = query || {}
      if (this.$refs.uploadBtn) {
        this.$refs.uploadBtn.$el.click()
      }
    })
  },
  destroyed() {
    Bus.$off('openUploader')
  },
  methods: {
    onFileAdded(file) {
      this.panelShow = true
      this.computeMD5(file)
      Bus.$emit('fileAdded')
    },
    onFileProgress(rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess(rootFile, file, response, chunk) {
      const res = JSON.parse(response)
      // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
      let fileId;
      if (!res.id && !res.data) {
        this.$message({message: res.data.message, type: 'error'});
        // 文件状态设为“失败”
        this.statusSet(file.id, 'failed');
        return
      } else if(res.id) {
        fileId = res.id
      }
      if (res.data) {
        fileId = res.data.id
      }
      const f = {
        id: fileId,
        type: file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length),
        name: file.name,
        size: file.size,
        describe: '',
        edit: false,
        originalDescribe: ''
      };
      Bus.$emit('fileSuccess', f);
      // console.log('上传成功')

    },
    onFileError(rootFile, file, response, chunk) {
      this.$message({
        message: response,
        type: 'error'
      })
    },
    computeMD5(file) {
      const fileReader = new FileReader()
      const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer
      // 改变文件状态未校检文件中
      this.statusSet(file.id, 'md5')
      file.pause()
      loadNext()
      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          // 实时显示MD的计算进度
          this.$nextTick(() => {
            $(`.myStatus_${file.id}`).text('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
          });
        } else {
          const md5 = spark.end()
          this.computeMD5Success(md5, file)
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }
      fileReader.onerror = function() {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }
      function loadNext() {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
    computeMD5Success(md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      Object.assign(this.uploader.opts, {
        query: {
          ...this.params
        }
      })
      file.uniqueIdentifier = md5
      file.resume()
      this.statusRemove(file.id)
    },
    /**
     * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
     * @param id
     * @param status
     */
    statusSet(id, status) {
      const statusMap = {
        md5: {
          text: '校验MD5',
          bgc: '#fff'
        },
        merging: {
          text: '合并中',
          bgc: '#e2eeff'
        },
        transcoding: {
          text: '转码中',
          bgc: '#e2eeff'
        },
        failed: {
          text: '上传失败',
          bgc: '#e2eeff'
        }
      }
      this.$nextTick(() => {
        $(`<span class="myStatus_${id}"></span>`).appendTo(`.file_${id} .uploader-file-status`).css({
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'right': '0',
          'bottom': '0',
          'zIndex': '1',
          'backgroundColor': statusMap[status].bgc
        }).text(statusMap[status].text)
      })
    },
    statusRemove(id) {
      this.$nextTick(() => {
        $(`.myStatus_${id}`).remove()
      })
    },
    error(msg) {
      this.$notify({
        title: '错误',
        message: msg,
        type: 'error',
        duration: 2000
      })
    },
    fileListShow() {
      this.ulShow = !this.ulShow
      this.collapse = !this.collapse
    },
    close() {
      this.uploader.cancel()
      this.panelShow = false
    },
    fileStatusText(status, response) {
      const statusTextMap = {
        success: '成功',
        error: '错误',
        uploading: '上传中',
        paused: '暂停',
        waiting: '等待',
        md5: 'md5..'
      }
      return statusTextMap[status]
    }
  }

}
</script>

<style scoped lang="scss">
  #global-uploader {
    position: fixed;
    z-index: 20;
    right: 15px;
    bottom: 15px;

    .uploader-app {
      width: 620px;
    }

    .file-panel {
      background-color: #fff;
      border: 1px solid #e2e2e2;
      border-radius: 7px 7px 0 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, .2);

      .file-title {
        display: flex;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        border-bottom: 1px solid #ddd;

        .operate {
          flex: 1;
          text-align: right;
        }
      }

      .file-list {
        position: relative;
        height: 240px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;
        margin: 0 0 0 0;
        padding: 0 0 0 1px;

        > li {
          background-color: #fff;
          list-style-type: none;
          padding-left: 0px;

        }
      }

      &.collapse {
        .file-title {
          background-color: #E7ECF2;
        }
      }
    }

    .no-file {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
    }

    /deep/ .uploader-file-icon {
      &:before {
        content: '' !important;
      }

      &[icon=image] {
        background: url(/image/image-icon.png);
      }

      &[icon=video] {
        background: url(/image/video-icon.png);
      }

      &[icon=document] {
        background: url(/image/text-icon.png);
      }
    }

    /deep/ .uploader-file-actions > span {
      margin-right: 6px;
    }
  }

  /* 隐藏上传按钮 */
  .global-uploader-btn {
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }
</style>
