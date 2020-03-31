<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="9" :sticky-top="personalNavbar.opened?50:0" :class-name="'sub-navbar '+postForm.status">
        <ConnentTypeDropdown v-model="postForm.contentType" />
        <CommentDropdown v-model="postForm.comment" />
        <LoggedDropdown v-model="postForm.logged" />
<!--        <SharePlatformDropdown v-model="postForm.shareZone" />-->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit?'保存':'发布' }}
        </el-button>
        <el-button v-if="!isEdit" v-loading="loading" type="warning" @click="draftForm">
          草稿
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <!--          <Warning />-->

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-form-item label-width="45px" label="作者:" prop="author" class="postInfo-container-item">
                <el-select v-model="postForm.author" default-first-option placeholder="请选择...">
                  <el-option v-for="(item,index) in authorList" :key="item+index" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-form-item label="归属:" label-width="45px" prop="subValue" @click="checkOption">
          <el-cascader
            v-model="postForm.subValue"
            :options="subOptions"
            style="width: 50%"
            :props="subProps"
            filterable
            clearable
          />
          <el-button type="text" size="mini" @click="dialogVisible=(!dialogVisible)">没有找到课程？</el-button>
        </el-form-item>

<!--        <el-form-item label-width="45px" prop="category" label="分类:" @click="checkOption">-->
<!--          <el-drag-select v-model="postForm.category" style="width:50%;" multiple placeholder="请选择">-->
<!--            <el-option v-for="item in categoryOptions" :key="item.id" :label="item.categoryName" :value="item.id" />-->
<!--          </el-drag-select>-->
<!--        </el-form-item>-->

        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input
            v-model="displaySummary"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入内容（最长200）..."
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}词</span>
        </el-form-item>

        <el-form-item v-if="postForm.contentType==='markdown'" prop="contentMarkDown" style="margin-bottom: 30px;">
          <markdown-editor ref="markdownEditor" v-model="postForm.contentMarkDown" language="zh_CN" height="500px" />
        </el-form-item>

        <el-form-item v-else prop="contentHtml" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.contentHtml" :height="400" />
        </el-form-item>

<!--        <el-form-item>-->
<!--          <tr-upload v-model="postForm.fileList" />-->
<!--        </el-form-item>-->

      </div>

    </el-form>

    <el-dialog title="添加课程" :visible.sync="dialogVisible">
      <el-form ref="dialogDate" :model="add" :rules="dialogRules">
        <el-form-item label="请选择" label-width="80px">
          <el-cascader
            v-model="add.sub"
            :options="add.subOptions"
            style="width: 50%"
            :props="add.subProps"
            placeholder="请先选择专业"
            filterable
            clearable
          />
          <template v-if="add.sub.length === 2">
            <el-select v-model="add.value" filterable placeholder="搜索并查看已有的课程">
              <el-option
                v-for="item in add.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-form-item>
        <template v-if="add.sub.length === 2">

          <el-form-item label="课程名" label-width="80px" prop="courseName">
            <el-input v-model="add.courseName" placeholder="请输入课程名" />
          </el-form-item>
          <el-form-item label="开课教师" label-width="80px" prop="teacher">
            <el-select v-model="add.teacher" filterable placeholder="">
              <el-option
                v-for="item in add.teachers"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="年份" label-width="80px" prop="years">
            <el-date-picker
              v-model="add.years"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
            />
          </el-form-item>
          <el-form-item label-width="80px">
            <el-button style="" type="primary" @click="submitAdd">提交</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import MarkdownEditor from '@/components/MarkdownEditor'
import ElDragSelect from '@/components/DragSelect'
import Warning from './Warning'
import { CommentDropdown, SharePlatformDropdown, ConnentTypeDropdown, LoggedDropdown } from './Dropdown'
import { mapState } from 'vuex'
import TrUpload from '@/components/TrUploader'
import Bus from '@/components/TrGlobalUploader/bus.js'
import { college, getMajorByCollege, getCourseByMajor, addCourse } from '@/api/college'
import { getCategory, addArticle, oneArticle } from '@/api/article'
import { getTeacherList } from '@/api/user'

const defaultForm = {
  status: 'draft',
  id: undefined,
  title: '', // 文章题目
  author: '',
  content: '',
  contentHtml: '',
  contentMarkDown: '', // 文章内容
  contentMarkDownHtml: '',
  contentShort: '', // 文章摘要
  comment: true,
  shareZone: '',
  contentType: '富文本',
  file: '',
  // fileList: [],
  logged: false,
  // category: [],
  subValue: [],
  version: ''
}

export default {
  name: 'ArticleDetail',
  components: {
    ConnentTypeDropdown, SharePlatformDropdown, Tinymce, MDinput, Upload, Sticky, Warning, CommentDropdown,
    MarkdownEditor, TrUpload, LoggedDropdown, ElDragSelect
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('必传项'))
      } else {
        callback()
      }
    }
    const validateRequireArray = (rule, value, callback) => {
      if (value === '' || value.length === 0) {
        callback(new Error('必传项'))
      } else {
        callback()
      }
    }
    const validateContent = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          type: 'error',
          message: '正文不能为空！'
        })
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        // category: [{ validator: validateRequireArray }],
        contentMarkDown: [{ validator: validateContent }],
        author: [{ validator: validateRequire }],
        subValue: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        contentHtml: [{ validator: validateContent }]
      },
      tempRoute: {},
      authorList: [this.$store.getters.name, this.$store.getters.username],
      options: {
        // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
        target: '//localhost:3000/upload',
        testChunks: false
      },
      attrs: {
        accept: 'image/*'
      },
      subOptions: [],
      // categoryOptions: [],
      dialogVisible: false,
      subProps: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level, data } = node
          if (level === 1) {
            getMajorByCollege(data.value).then(resp => {
              if (resp.data) {
                const list = resp.data.map(row => {
                  return { label: row.majorName, value: row.id, leaf: level >= 2 }
                })
                resolve(list)
              } else {
                resolve(false)
              }
            })
          }
          if (level === 2) {
            getCourseByMajor(data.value).then(resp => {
              if (resp.data) {
                console.info()
                const list = resp.data.map(row => {
                  return { label: row.courseName, value: row.id, leaf: level >= 2 }
                })
                resolve(list)
              } else {
                resolve(false)
              }
            })
          }
          // setTimeout(() => {
          //   const nodes = Array.from({ length: level + 1 })
          //     .map(item => ({
          //       value: ++id,
          //       label: `选项${id}`,
          //       leaf: level >= 2
          //     }));
          //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          //   resolve(nodes)
          // }, 1000)
        }
      },
      add: {
        sub: [],
        subOptions: [],
        subProps: {
          lazy: true,
          checkStrictly: true,
          lazyLoad(node, resolve) {
            const { level, data } = node
            if (level === 1) {
              getMajorByCollege(data.value).then(resp => {
                if (resp.data) {
                  const list = resp.data.map(row => {
                    return { label: row.majorName, value: row.id, leaf: level >= 1 }
                  })
                  resolve(list)
                } else {
                  resolve(false)
                }
              })
            }
          }
        },
        value: '',
        years: '',
        options: [],
        teachers: [],
        teacher: '',
        courseName: ''
      },
      dialogRules: {
        courseName: [{ validator: validateRequire }],
        teacher: [{ validator: validateRequire }],
        years: [{ validator: validateRequire }]
      }
    }
  },
  watch: {
    'add.sub': function(val, oldval) {
      if (val.length === 2 && oldval.length === 2 && val[1] === oldval[1]) {
        return
      }
      if (val.length == 2) {
        this.generateAddOptions(val[1])
      }
    },
    'add.value': function(val, oldval) {
      this.add.value = ''
    }
  },
  mounted() {
    this.generateOptions()
  },
  computed: {
    ...mapState({
      personalNavbar: state => state.app.personalNavbar
    }),
    contentShortLength() {
      return this.postForm.contentShort.length
    },
    displaySummary: {
      get() {
        return this.postForm.contentShort.length >= 200
          ? this.postForm.contentShort.substr(0, 200) : this.postForm.contentShort
      },
      set(val) {
        this.postForm.contentShort = val.length >= 200 ? val.substr(0, 200) : val
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      console.info(id)
      this.fetchData(id)
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    this.postForm.shareZone = this.$store.getters.userType === 'student' ? 'studentC' : 'teacherC';
  },
  destroyed() {
    Bus.$off('fileAdded')
    Bus.$off('fileSuccess')
  },
  methods: {
    fetchData(id) {
      oneArticle(id).then(resp => {
        console.info(resp)
        const data = resp.data
        this.postForm.id = data.id
        this.postForm.title = data.articleTitle
        this.postForm.author = data.author
        // this.postForm.category = data.categories.map(row => {
        //   return parseInt(row.id)
        // })
        this.postForm.contentShort = data.summary
        this.postForm.contentType = data.articleType
        if (data.articleType === 'markdown') {
          this.postForm.contentMarkDown = data.articleCode
        } else {
          this.postForm.content = data.articleCode
          this.postForm.contentHtml = data.articleHtml
        }
        // this.postForm.fileList = data.listFile.map(row => {
        //   return { id: row.fileId, describe: row.describe, name: row.fileName, size: row.size, type: row.fileName.substr(row.fileName.lastIndexOf('.') + 1, row.fileName.length) }
        // })
        this.postForm.logged = data.isLogged
        this.postForm.comment = data.isDiscuss
        // set tagsview title
        this.setTagsViewTitle()
        // set page title
        this.setPageTitle()
      })
    },
    setTagsViewTitle() {
      const title = this.postForm.title
      const route = Object.assign({}, this.tempRoute, { title: `编辑-${title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = this.postForm.title
      document.title = `编辑-${title}`
    },
    submitForm() {
      // console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.version) {
            this.$message({
              type: 'error',
              message: '请勿重新提交表单'
            })
            return
          }
          if (!this.postForm.subValue||this.postForm.subValue.length===0) {
            this.$message({
              type: 'error',
              message: '选择归属！'
            })
            return
          }
          this.loading = true
          if (this.postForm.contentType === 'markdown') {
            this.postForm.contentMarkDownHtml = this.$refs.markdownEditor.getHtml()
          } else {
            this.postForm.content = window.tinymce.get(this.$refs.editor.id).getContent({ 'format': 'text' })
          }
          addArticle(this.postForm).then(resp => {
            this.version = resp.data
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '操作失败！'
            })
            this.loading = false
          })
          this.postForm.status = 'published'
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.contentHtml.length === 0 && this.postForm.contentMarkDown.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      if (this.version) {
        this.$message({
          type: 'error',
          message: '请勿重新提交表单'
        })
        return
      }
      // this.$message({
      //   message: '保存成功',
      //   type: 'success',
      //   showClose: true,
      //   duration: 1000
      // })
      this.postForm.status = 'draft'
      this.loading = true
      if (this.postForm.contentType === 'markdown') {
        this.postForm.contentMarkDownHtml = this.$refs.markdownEditor.getHtml()
      } else {
        this.postForm.content = window.tinymce.get(this.$refs.editor.id).getContent({ 'format': 'text' })
      }
      addArticle(this.postForm).then(resp => {
        this.version = resp.data
        this.$notify({
          title: '成功',
          message: '存为草稿成功',
          type: 'success',
          duration: 2000
        })
        this.loading = false
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '操作失败！'
        })
        this.loading = false
      })
    },
    checkOption() {
      if (!this.subOptions) {
        college().then(resp => {
          if (resp.data) {
            this.subOptions = resp.data.map(row => {
              return { value: row.id, label: row.collegeName }
            })
          }
        })
      }
      // if (!this.categoryOptions) {
      //   if (resp.data) {
      //     this.categoryOptions = resp.data
      //   }
      // }
    },
    generateOptions() {
      college().then(resp => {
        if (resp.data) {
          this.subOptions = resp.data.map(row => {
            return { value: row.id, label: row.collegeName }
          })
          this.add.subOptions = this.subOptions
        }
      })
      // getCategory().then(resp => {
      //   if (resp.data) {
      //     this.categoryOptions = resp.data
      //     // this.categoryOptions = resp.data.map(row=>{return {value: row, label: row.categoryName, id: row.id}})
      //   }
      // })
    },
    generateAddOptions(value) {
      getCourseByMajor(value).then(resp => {
        if (resp.data) {
          const list = resp.data.map(row => {
            return { label: row.courseName, value: row.id }
          })
          this.add.options = list
        } else {
        }
      })
      getTeacherList().then(resp => {
        if (resp.data) {
          const list = resp.data.map(row => {
            const value = row.id + '-' + row.realName
            return { label: row.realName, value: value }
          })
          this.add.teachers = list
        }
      })
    },
    submitAdd() {
      this.$refs.dialogDate.validate(valid => {
        if (valid) {
          const teacherId = this.add.teacher.substring(0, this.add.teacher.indexOf('-'))
          const remark = this.add.teacher.substring(this.add.teacher.indexOf('-') + 1, this.add.teacher.length)
          const data = {
            courseName: this.add.courseName,
            teacherId: teacherId,
            remark: remark,
            years: this.add.years,
            majorId: this.add.sub[1]
          }
          addCourse(data).then(resp => {
            if (resp) {
              this.$notify({
                type: 'success',
                title: resp.msg
              })
              this.subProps.lazy = false
              // this.subProps.lazy = true
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
