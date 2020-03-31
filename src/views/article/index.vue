<template>
  <div v-loading="articleLoading" v-cloak element-loading-text="加载中...">
    <el-container class="border-tr">
      <el-aside width="160px" style="background-color: #f5f5f5;margin-top: 20px;">
        <div class="border-tr" style="margin:5px;background-color: #b3cae6;padding:5px;font-size: 13px">
          <span>查看: {{ content.clickNumber }}</span><el-divider direction="vertical"></el-divider>
          <span>评论: {{ content.discussNumber }}</span>
        </div>
        <div class="border-tr" style="margin:5px;padding:10px;background-color: #b3cae6">
          <el-tag style="float: right" type="warning" size="small">楼主</el-tag>
          <div v-if="avatarIf">
            <pan-thumb width="75px" height="75px" :image="avatar"></pan-thumb>
          </div>
<!--          <span style="font-size: 12px"></span>-->
          <el-row style="font-size: 13px;margin-top: 10px">
            <el-popover
              placement="top-start"
              width="400"
              trigger="click">
              <el-link :underline="false" type="primary" slot="reference" @click="content.userIf=true"
                       style="float: left;font-size:13px"><span style="color: black">作者： </span>{{content.authorUsername
                }}</el-link>
              <user-dialog v-if="content.userIf" :username="content.authorUsername"> </user-dialog>
            </el-popover>
<!--            作者：{{content.author}}-->
          </el-row>
        </div>
      </el-aside>
      <el-main>
        <h4>{{ content.articleTitle }}</h4>
        <el-divider />
        <el-row>
          <el-link v-for="item in content.subordinates" type="info" style="font-size: 12px">{{ item }}/</el-link>
          <el-link style="font-size: 12px;float: right;">发布时间：{{ content.createTime }}</el-link>
        </el-row>
        <el-row>
          <el-link style="font-size: 12px;float: right;">最后编辑：{{ content.createTime }}</el-link>
          <el-tag v-for="item in content.categories" style="margin-right: 5px" type="success" size="mini">{{ item.name }}</el-tag>
        </el-row>
        <el-divider />
        &nbsp;&nbsp;
        <div class="tui-editor-contents" style="margin-bottom: 50px" v-html="content.articleHtml" />
        <el-card class="box-card"
                 v-if="(content && content.listFile && content.listFile.length!=0)">
<!--          <div>{{content.listFile}}</div>-->
          <div slot="header" class="clearfix" style="padding-left: 30px;margin: -10px">
            <el-button type="text">文件区</el-button>
          </div>
          <div class="grid" style="border: #99a9bf;margin-bottom: 30px">
            <div v-for="item of content.listFile" :key="item.fileId" class="image-preview">
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  文件名:&nbsp;{{ item.fileName }} </br>
                  文件大小:&nbsp;{{ (item.size/(1024*1024)).toFixed(3) }}MB </br>
                  文件描述:&nbsp;{{ item.describe }}
                </div>
                <div class="icon-item image-preview-wrapper">
                  <img :src="generateImage(item.fileName)" width="80px">
                  <span class="item-span" style="">{{ item.fileName }}</span>
                  <div class="image-preview-action">
                    <i class="el-icon-download" @click="downloadFile(item)" />
                    <!--                    /f/files/get-v1?fileId=-->
                  </div>
                </div>
              </el-tooltip>
            </div>
          </div>
        </el-card>
        <el-footer style="padding-top: 30px;height: 150px">
          <div class="icon-item-1">
            <svg-icon icon-class="nogood" @click="addGood(content.authorUsername,false)"
                      class-name="disabled" />
            <span style="font-size: 10px">踩一踩{{content.noGoodNumber}}</span>
          </div>
          <div class="icon-item-2">
            <svg-icon icon-class="good" @click="addGood(content.authorUsername,true)" class-name="disabled" />
            <span style="font-size: 10px">赞一下{{content.goodNumber}}</span>
          </div>
          <div class="icon-item-3">
            <svg-icon icon-class="collect" @click="addCollect(content.id)" class-name="disabled" />
            <span style="font-size: 10px"> 收 藏 {{content.collectNumber}}</span>
          </div>
        </el-footer>
      </el-main>
      <!--      <el-footer>-->
<!--      </el-footer>-->
    </el-container>

    <div v-loading="discussLoading" element-loading-text="评论加载中...">
      <el-container v-for="(row,index) in replyList" class="border-tr" style="min-height: 200px">
        <el-aside width="160px" style="background-color: #f5f5f5;margin-top: 5px;">
          <div class="border-tr" style="margin:5px;padding:10px;background-color: #b3cae6">
            <el-tag style="float: right" v-if="content.author===row.username" type="warning" size="small">楼主</el-tag>
            <pan-thumb width="75px" height="75px" :image="row.avator"></pan-thumb>
            <el-row style="font-size: 13px;margin-top: 10px">
              <el-popover
                placement="top-start"
                width="400"
                trigger="click">
                <el-link :underline="false" type="primary" slot="reference" @click="row.showPopover = true"
                         style="float: left;font-size:13px"><span style="color: black">作者： </span>{{row.username
                  }}</el-link>
                <user-dialog v-if="row.showPopover" :username="row.username"> </user-dialog>
              </el-popover>
            </el-row>
          </div>
        </el-aside>
<!--        <el-avatar :size="50" fit="cover" style="object-fit: cover;" shape="square" src="https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191"></el-avatar>-->
        <el-main>
          <div v-html="row.content" style="min-height: 150px" :id="`tab${row.floor}`" :name="`tab${row.floor}`"
               :ref="`tab${row.floor}`"></div>
          <el-row>
            <el-row>
              <el-link style="background-color: #F7F8FA;float: left;padding: 2px 10px 5px 10px" @click="getReply(row,true)">回复{{ row.discussNumber>0?'('+row.discussNumber+')':''}}</el-link>
              <el-link style="float: right">{{row.floor}} 楼  {{row.createTime}}</el-link>
            </el-row>
            <div style="background-color: #F7F8FA;
                    padding:10px;border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                    overflow-y: visible;" v-if="row && row.show">
              <div v-for="item in row.reply.records" :id="`tab${row.floor}-${item.floor}`"
                   :name="`tab${row.floor}-${item.floor}`"
                   :ref="`tab${row.floor}-${item.floor}`">
                <el-row>
                  <el-image
                    style="width: 45px; height: 45px;border-radius: 6px;float: left"
                    :src="item.avator"
                    fit="cover"></el-image>
<!--                  <el-link type="primary" style="float: left;font-size: 17px" :underline="false" >-->
<!--                    <p>{{item.username}} {{ item.to===row.username ? '':'回复 '+ item.to}}:&nbsp;</p>-->
<!--                  </el-link>-->
                    <el-popover
                      placement="top-start"
                      width="400"
                      trigger="click">
                      <el-link :underline="false" type="primary" @click="item.showPopover=true" slot="reference"
                               style="float: left;font-size:17px"><p>&nbsp;{{item.username
                        }}<span style="color: black">:</span></p></el-link>:
                      <user-dialog v-if="item.showPopover" :username="item.username"> </user-dialog>
                    </el-popover>
                    <el-popover
                      v-if="item.to!=row.username"
                      placement="top-start"
                      width="400"
                      trigger="click">
                      <el-link :underline="false" type="primary" @click="item.toShowPopover=true"  slot="reference"
                               style="float: left;font-size:17px"><p><span style="color: black"> 回复</span> {{item.to}}:
                      </p></el-link>
                      <user-dialog v-if="item.toShowPopover" :username="item.to"> </user-dialog>
                    </el-popover>

<!--                  <span class="comments-list-item-content" style="float: left;font-size: 17px;margin-top: 18px;" >{{item.content}}</span>-->
                  <span style="float: left;font-size: 17px;margin-top: 16px;line-height: 20px" v-html="item.content"></span>
                  <el-link style="float: right;margin-top: 30px;">&nbsp;楼层{{row.floor}}-{{item.floor}}</el-link>
                  <el-link style="float: right;margin-top: 30px;">&nbsp;&nbsp;{{item.createTime}}</el-link>
                  <el-link style="float: right;margin-top: 30px;" @click="changReply(item)">回复 </el-link>
                </el-row><hr>
              </div>

              <el-row>
                <el-pagination style="padding: 10px;float: right" small background :current-page.sync="row.reply.current"
                               :page-size="10"
                               :total="row.reply.total"
                               @current-change="handReplyCurrentChange(row)"
                               layout="prev, pager, next, jumper"/>
              </el-row>

              <el-row >
                <el-link>To:{{repluObject.text}}</el-link>
                <face-input v-model="faceInput" @testEmit="testEmit(row)"></face-input>
              </el-row>
            </div>
          </el-row>
        </el-main>
      </el-container>
    </div>

    <el-row>
      <el-container style="margin-top: 10px;float: right">

              <el-pagination background
                              :current-page.sync="url.page"
                              :page-size="10"
                              :total="total"
                              prev-text="上一页"
                              next-text="下一页"
                             @current-change="handCurrentChange"
                              layout="prev, pager, next, jumper">
              </el-pagination>
      </el-container>
    </el-row>

    <el-container style="min-height: 200px">
      <el-aside width="160px" style="background-color: #f5f5f5;margin-top: 5px;">

      </el-aside>
      <el-main >
         <el-form>
           <el-form-item>
             <Tinymce ref="editor" v-model="discuss" :height="200" />
           </el-form-item>
           <el-form-item>
             <el-button type="primary" @click="submitDiscuss" :disabled="!content.isDiscuss" size="small">发表回复</el-button>
           </el-form-item>
         </el-form>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import {oneArticle, addClick, addDiscuss, getDiscuss, addGood, addCollect} from '@/api/article';
import { getAvatar } from "@/api/user"
import Tinymce from '@/components/Tinymce'
import PanThumb from '@/components/PanThumb'
import 'tui-editor/dist/tui-editor-contents.css' // editor content
import Pagination from '@/components/Pagination'
import FaceInput from '@/components/FaceInput1/Comment'
import queryString from "query-string";
import fileIcons from '@/utils/file-icon.js'
import {isEmpty} from '@/utils'
import svgIcons from '@/utils/svg-icons'
  import UserDialog from "@/components/UserDialog";


export default {
  name: 'Index',
  components: {PanThumb, Tinymce, Pagination, FaceInput, svgIcons, UserDialog},
  data() {
    return {
      discussLoading: true,
      articleLoading: true,
      content: {
        userIf: false
      },
      avatar: '',
      showReply: '',
      discuss: '',
      url: {
        page: this.$route.query && this.$route.query.page || 1,
        jump: this.$route.query && this.$route.query.jump || 0,
        jump_under: this.$route.query && this.$route.query.jump_under || 0,
      },
      total: 0,
      replyList: '',
      faceInput: '',
      repluObject: {text: '', parentId: ''},
      avatarIf: false
    }
  },
  created() {
    this.toggleUrl(this.url)
    this.get()
    // this.getDiscussLimit()
  },
  watch: {
    url: {
      deep: true,
      handler: function (val) {
        this.toggleUrl(val);
      }
    },
  },
  methods: {
    get() {
      const id = this.$route.params && this.$route.params.id
      new Promise(resolve => {
        this.articleLoading = true
        oneArticle(id).then(resp => {
          if (resp.msg != '' && resp.msg != null) {
            this.$message({
              type: 'error',
              message: resp.msg,
              duration: 0
            })
            return
          }
          this.articleLoading = false
          resp.data.userIf = false
          this.content = resp.data
          // this.content.userIf = false;
          this.$route.meta.title = this.content.articleTitle
          document.title = this.content.articleTitle
          if (!this.content.isDiscuss) {
            this.discuss = `<p style="text-align: center;">&nbsp;</p>\n<p style="text-align: center;">&nbsp;</p>\n<p style="text-align: center;"><span style="color: #ff0000;">不允许评论！</span></p>`
          }
          resolve(true)
          getAvatar(this.content.authorUsername).then(resp => {
            this.avatar = resp.data
            this.avatarIf = true
          }).catch(err => {
            this.avatar = "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          });
        }).catch(err => {
          this.articleLoading = false
        });
      }).then(resp => {
        if (resp) {
          addClick(id).then(resp => {
          })
          this.getDiscussLimit()
        }
      });

    },
    emoji(word) {
      // 生成html
      const type = word.substring(1, word.length - 1);
      return `<span class="emoji-item-common emoji-${type} emoji-size-small" ></span>`;
    },
    generateImage(fileName) {
      const type = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length)
      // console.info('文件类型', type)
      if (fileIcons.indexOf(type) === -1) {
        return '/image/file-icon/null.png';
      } else {
        return '/image/file-icon/' + type + '.png';
      }
    },
    downloadFile(item) {
      // console.info(item.fileId)
      window.open(`/api/f/files/get-v1?fileId=${item.fileId}`, '_blank')
      // download_v1(item.fileId)
    },
    submitDiscuss() {
      const query = {
        content: this.discuss,
        parentId: -1
      }
      addDiscuss(this.content.id, query).then(resp => {
        this.$notify({
          type: 'success',
          title: '评论成功！'
        })
        this.getDiscussLimit()
      }).catch(err => {
        this.$notify({
          type: 'error',
          title: '评论失败'
        })
      });
    },
    getDiscussLimit() {
      const id = this.$route.params && this.$route.params.id
      this.discussLoading = true
      getDiscuss(id, this.url.page, -1).then(resp => {
        this.discussLoading = false
        resp.data.records.map(row => {
          row.show = false;
          row.reply = {};
          row.reply.current = 1;
          row.reply.total = 0;
          row.showPopover = false
          return row
        });
        this.replyList = resp.data.records
        this.url.page = resp.data.current
        this.total = resp.data.total
        // this.$notify({
        this.jump()

      }).catch(err => {
        //   type:'error',
        //   title: '加载评论失败！',
        //   duration: 0
        // })
        console.error(err)
        this.discussLoading = false
      });
    },
    handCurrentChange(val) {
      this.url.page = val
      this.getDiscussLimit()
    },
    getReply(row, show) {
      return new Promise(((resolve, reject) => {
        if (row.show && row.show === true && show) {
          row.show = false
          return
        }
        const id = this.$route.params && this.$route.params.id;
        getDiscuss(id, row.reply.current, row.discussId).then(resp => {
          resp.data.records.map(row=>{row.showPopover = false;row.toShowPopover=false})
          row.reply = resp.data
          row.reply.to = row.username
          // this.test = row.username
          this.changReply(row)
          row.show = true
          resolve(true)
        }).catch(err => {
          this.$notify({
            type: 'error',
            title: '加载失败！',
            duration: 0
        })
          console.warn(err)
          this.discussLoading = false
          reject()
        });
      }));
    },
    handReplyCurrentChange(row) {
      console.info(row)
      this.getReply(row, false)
    },
    testEmit(item) {
      const query = {
        content: this.faceInput,
        // parentId: item.discussId,
        parentId: this.repluObject.parentId,
        topParentId: item.discussId
      }
      // this.faceInput = ''
      addDiscuss(this.content.id, query).then(resp => {
        this.$notify({
          type: 'success',
          title: '评论成功！'
        })
        this.getReply(item, false)
      }).catch(err => {
        this.$notify({
          type: 'error',
          title: '评论失败'
        })
      });
    },
    changReply(rowReply) {
      console.info(rowReply)
      this.repluObject.text = rowReply.username
      this.repluObject.parentId = rowReply.discussId
    },
    jump() {
      console.info('url',this.url)
      setTimeout(() => {
        if (this.url.jump && this.url.jump != 0) {
          if (this.url.jump > 10) {
            this.url.page = Math.ceil(this.url.jump / 10)
            const id = this.$route.params && this.$route.params.id;
            this.discussLoading = true;
            getDiscuss(id, this.url.page, -1).then(resp => {
              this.discussLoading = false
              resp.data.records.map(row => {
                row.show = false;
                row.reply = {};
                row.reply.current = 1;
                row.reply.total = 0;
                row.showPopover = false
                return row
              });
              this.replyList = resp.data.records
              this.url.page = resp.data.current
              this.total = resp.data.total
              this.discussLoading = false
              setTimeout(() => {
                var div = document.getElementById('tab' + this.url.jump);
                console.info('跳转评论', div)
                if (div) {
                  div.scrollIntoView({behavior: "smooth", block: "center", inline: "start"})
                }
              },1000);
            });
            this.discussLoading = true;
            // this.getDiscussLimit()
          } else {
            var div = document.getElementById('tab' + this.url.jump);
            console.info('跳转评论',div)
            if (div) {
              div.scrollIntoView({behavior: "smooth", block: "center", inline: "start"})
            }
          }

        }
        console.info(!isEmpty(this.url.jump_under) && this.url.jump_under != 0 && !isEmpty(this.url.jump) &&
          this.url.jump != 0 ,'是否跳转子 评论')
        if (!isEmpty(this.url.jump_under) && this.url.jump_under != 0 && !isEmpty(this.url.jump) && this.url.jump !=
          0) {
          (this.replyList[this.url.jump % 10 - 1]).show = true;
          (this.replyList[this.url.jump % 10 - 1]).reply.current = Math.ceil(this.url.jump_under / 10);
          this.getReply(this.replyList[this.url.jump % 10 - 1], false).then(resp => {
            if (resp) {
              var div1 = document.getElementById('tab' + this.url.jump + '-' + this.url.jump_under);
              console.log('子页数', Math.ceil(this.url.jump_under / 10))
              console.log('跳转div：','tab' + this.url.jump + '-' + this.url.jump_under)
              if (div1) {
                div1.scrollIntoView({behavior: "smooth", block: "center", inline: "start"})
              }
              setTimeout(() => {
                this.url.jump = 0
                this.url.jump_under = 0
              }, 20000);
            }
          });
        }
      },500);



    },
    toggleUrl(val) {
      var param = queryString.parseUrl(window.location.href);
      var url = queryString.stringifyUrl({url: param.url, query: val})
      history.pushState({}, "", url);
    },
    addGood(username,val) {
      console.info(username,this.$store.getters.username)
      if (username === this.$store.getters.username) {
        return false
      }
      this.$confirm('继续操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        new Promise((resolve, reject) => {
          if (val) {
            addGood(this.content.id, 'good').then(resp => {
              resolve(resp)
            });
          } else {
            addGood(this.content.id, 'nogood').then(resp => {
              resolve(resp)
            });
          }
        }).then(result => {
          if (!isEmpty(result.data)) {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
          } else {
            var showMsg = ''
            if ((!isEmpty(result.msg)) && result.msg === 'good') {
              showMsg = '已经点赞过啦！'
            } else if (!isEmpty(result.msg) && result.msg === 'nogood') {
              showMsg = '已经踩过啦！'
            }
            this.$notify({
              type: 'success',
              title: showMsg
            });
          }
        });
      });

    },
    addCollect(id) {
      this.$confirm('继续操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        addCollect(id).then(resp => {
          if (resp) {
            this.$notify({
              type: 'success',
              message: resp.msg
            })
          }
        });
      })
    }
  }
};
</script>

<style lang="scss">
  @import "~@/styles/mixin.scss";
  @import "/emoji.css"; // 导入精灵图样式
  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .box-card .el-card__header {
    padding: 8px 10px;
  }

  .emoji-item-common {
    background: url("/emoji_sprite.png");
    display: inline-block;
    &:hover {
      cursor: pointer;
    }
  }
  .emoji-size-small {
    // 表情大小
    zoom: 0.3;
  }

  .border-tr {
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .icon-item-1 {
    text-align: center;
    font-size: 30px;
    cursor: pointer;
    float: right;
    width: 30px;
    height: 30px;
    color:#f5deb4;
    margin-right: 30px;
    margin-top: 10px;
    span {
      font-size: 14px;
      line-height: 10px;
    }
    &:hover {
      color: #5a5e66;
    }
  }

  .icon-item-2 {
    text-align: center;
    font-size: 30px;
    cursor: pointer;
    float: right;
    width: 30px;
    height: 30px;
    color:#63f5f0;
    margin-right: 30px;
    margin-top: 10px;
    span {
      font-size: 14px;
      line-height: 10px;
    }
    &:hover {
      color: #5a5e66;
    }
  }
  .icon-item-3 {
    text-align: center;
    font-size: 30px;
    cursor: pointer;
    float: right;
    width: 30px;
    height: 30px;
    color: #e2a4f4;
    margin-right: 30px;
    margin-top: 10px;
    span {
      font-size: 14px;
      line-height: 10px;
    }
    &:hover {
      color: #5a5e66;
    }
  }

  .item-span {
    display: block;
    font-size: 11px;
    line-height: 12px;
    /*margin-top: 10px;*/
    word-wrap: break-word;
  }

  .image-preview {
    width: 70px;
    height: 66px;
    position: relative;
    /*border: 1px dashed #d9d9d9;*/
    float: left;
    margin-left: 10px;
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
    line-height: 88px;
  .el-icon-download {
    font-size: 36px;
  }
  }
  &:hover {
  .image-preview-action {
    opacity: 1;
  }
  }
  }

</style>
