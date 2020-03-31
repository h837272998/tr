<template>
  <div class="upload-container">
    <el-upload
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      class="image-uploader"
      :before-upload="beforeUpload"
      drag
      action="https://httpbin.org/post"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <div class="image-preview image-app-preview">
      <div v-show="imageUrl.length>1" class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage" />
        </div>
      </div>
    </div>
    <div class="image-preview">
      <div v-show="imageUrl.length>1" class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'
import { upload_v1 } from "@/api/file"
import SparkMD5 from 'spark-md5'

export default {
  name: 'SingleImageUpload3',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' }
    }
  },
  computed: {
    imageUrl() {
      var spark = new SparkMD5()
      spark.appendBinary(this.value)
      var md5 = spark.end()
      console.info(md5)
      return this.value
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(file) {
      this.emitInput(file.files.file)
    },
    beforeUpload(file) {
      const _self = this
      var spark = new SparkMD5()
      var fr = new FileReader()
      fr.readAsBinaryString(file)
      fr.onload = function (f) {
        spark.appendBinary(f.target.result)
        var md5 = spark.end()
        const data = new FormData()
        data.append('file', file)
        data.append('md5', md5)
        return new Promise((resolve, reject) => {
          upload_v1(data).then(resp => {
            if (resp.code == 200 && resp.data) {
              const url = process.env.VUE_APP_BASE_API + '/f/files/image' + resp.data.url
              this.tempUrl = url
              resolve(true)
            }
          }).catch(err => {
            reject(false)
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 35%;
    float: left;
  }
  .image-preview {
     width: 200px;
     height: 200px;
     position: relative;
     border: 1px dashed #d9d9d9;
     float: left;
     margin-left: 50px;
     .image-preview-wrapper {
       position: relative;
       width: 100%;
       height: 100%;
       img {
         width: 100%;
         height: 100%;
       }
     }
     .image-preview-action {
       position: absolute;
       width: 100%;
       height: 100%;
       left: 0;
       top: 0;
       cursor: default;
       text-align: center;
       color: #fff;
       opacity: 0;
       font-size: 20px;
       background-color: rgba(0, 0, 0, .5);
       transition: opacity .3s;
       cursor: pointer;
       text-align: center;
       line-height: 200px;
       .el-icon-delete {
         font-size: 36px;
       }
     }
     &:hover {
       .image-preview-action {
         opacity: 1;
       }
     }
   }
  .image-app-preview {
    width: 320px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }
}
</style>
