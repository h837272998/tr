<template xmlns="http://www.w3.org/1999/html">
  <div class="tr-upload-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="padding: 0px 0px">
        <!--        <span>文件上传</span>-->
        <el-button icon="el-icon-upload" size="small" @click="handleUpload" style="float: left"></el-button>
        <el-radio-group v-model="viewType" size="small" style="float: right; padding: 3px 0">
          <el-radio-button label="document">文件视图</el-radio-button>
          <el-radio-button label="list">列表视图</el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="viewType==='document'" class="grid" style="min-height: 300px">
        <div v-for="item of fileList" :key="item.id">
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              文件名:&nbsp;{{ item.name }} </br>
              文件大小:&nbsp;{{ (item.size/(1024*1024)).toFixed(3) }}MB </br>
              文件类型:&nbsp;{{ item.type }} </br>
              文件描述:&nbsp;{{ item.describe }}
            </div>
            <div class="icon-item">
              <!--              <svg-icon :icon-class="item" class-name="disabled" />-->
              <img :src="generateImage(item.type)" width="80px">
              <span class="item-span" style="">{{ item.name }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div v-else style="padding: 0px;margin:0 0 0px 0px;min-height: 300px">
        <el-table
          fit
          :data="fileList"
          stripe
          header-row-class-name="tableHead"
          style="width: 100%;">
          <el-table-column prop="name" label="文件名">
          </el-table-column>
          <el-table-column label="大小" width="80px">
            <template slot-scope="{row}">
              <span>{{ (row.size/(1024*1024)).toFixed(3) }}MB</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="type" label="文件类型" width="100px">
          </el-table-column>
          <el-table-column
            prop="describe" label="文件描述">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.describe" class="edit-input" size="small" />
                <el-button
                  class="cancel-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEdit(row)"
                >
                </el-button>
              </template>
              <span v-else>{{ row.describe }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Actions" width="150" >
            <template slot-scope="{row}">
              <el-button
                v-if="row.edit"
                type="success"
                size="small"
                icon="el-icon-circle-check-outline"
                @click="confirmEdit(row)"
              >
                确定
              </el-button>
              <el-button
                v-else
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="row.edit=!row.edit"
              >
              </el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="deleteFile(row)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-card>
  </div>
</template>

<script>
  import Bus from '@/components/TrGlobalUploader/bus.js'
  import fileIcons from '@/utils/file-icon.js'

  export default {
    name: "index",
    props: {
      value: Array
    },
    data() {
      return {
        viewType: 'document',
        fileList: this.value
      };
    },
    watch: {
      value(newValue) {
        this.fileList = newValue
      }
    },
    mounted() {
      // 文件选择后的回调
      Bus.$on('fileAdded', () => {
        // console.log('文件已选择1')
      })
      // 文件上传成功的回调
      Bus.$on('fileSuccess', (file) => {
        for (var i in this.fileList) {
          if (this.fileList[i].name == file.name) {
            this.$message({
              type: 'warnning',
              message: '重复的文件名'
            });
            return
          }
        }
        this.fileList.push(file)
        // console.info(file)
        // console.info(this.fileList)
        // console.log('文件上传成功')
      })
    },
    methods: {
      handleUpload() {
        // 打开文件选择框
        Bus.$emit('openUploader', {
          id: '1111'  // 传入的参数
        })
      },
      generateIconCode(symbol) {
        // return `<svg-icon icon-class="${symbol}" />`
        return symbol
      },
      generateImage(type) {
        // const type = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length)
        // console.info('文件类型', type)
        if (fileIcons.indexOf(type) === -1) {
          return '/image/file-icon/null.png';
        } else {
          return '/image/file-icon/' + type + '.png';
        }
      },
      cancelEdit(row) {
        row.describe = row.originalDescribe
        row.edit = false
      },
      confirmEdit(row) {
        row.edit = false
        row.originalDescribe = row.describe
      },
      deleteFile(row) {
        for (var i in this.fileList) {
          if (this.fileList[i].name == row.name) {
            this.fileList.splice(i, 1);
          }
        }
        // this.fileList.splice()
      }
    },
    destroyed() {
      Bus.$off('fileAdded');
      Bus.$off('fileSuccess');
    },
  }
</script>

<style >
  .tr-upload-container {
    padding: 10px 10px 10px 10px;

  }

  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 10px;
  }

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 10px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  .item-span {
    display: block;
    font-size: 12px;
    line-height: 12px;
    /*margin-top: 10px;*/
    word-wrap: break-word;
  }

  .edit-input {
    padding-right: 70px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  /*}*/
</style>
