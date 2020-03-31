<template>
  <div v-cloak v-loading="loading" class="app-container">
    <Mallki :text="$store.getters.name" />
    <h3>我的评论</h3>
    <div>
      <el-link v-if="query.total===0">暂无评论</el-link>
      <el-collapse accordion class="el-collapse-discuss" @change="handleChange">
        <el-collapse-item v-for="row in list" :name="row.id">
          <template slot="title">
              <el-link>
                {{row.articleTitle}}
                <el-badge v-if="row.notifyNumber>0" :value="row.notifyNumber" :max="99" class="item">
                </el-badge>
              </el-link>
            <div style="margin:0 0 0 auto">
              <el-link icon="el-icon-chat-dot-square" style="font-size: 10px" :underline="false">{{ row.discussNumber }}</el-link>
              <el-link class="" icon="el-icon-view" style="font-size: 10px" :underline="false">{{ row.clickNumber }}</el-link>
            </div>
          </template>
          <div v-loading="divLoading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0,0, 0, 0.8)" style="min-height: 50px">
            <el-table
              fit
              :data="underList"
              stripe
              header-row-class-name="tableHead"
              border
              style="width: 100%;">
              <template slot="empty">
                没有未读评论！
                <el-link :href="`/article/${row.id}`" target="_blank"> 查看原文</el-link>
              </template>

              <el-table-column prop="username" width="120px" label="用户">
              </el-table-column>
              <el-table-column label="内容" >
                <template slot-scope="{row}">
                  <span class="reply-content" v-html="row.content"></span>
                  <span class="reply-content" v-if="row.to">
                    <span style="color:lightskyblue;font-weight: bold">回复我的</span>
                    <span v-html="row.to"></span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="回复时间" width="180">
              </el-table-column>
              <el-table-column prop="floor" label="楼层" width="100"></el-table-column>
              <el-table-column align="center" label="操作" width="250" >
                <template slot-scope="{row}">
                  <el-link type="success" size="mini" @click="handleDeleteNotify(row)">删除通知</el-link>&nbsp;
<!--                  <el-link type="danger" size="mini" target="_blank" :href="generateUrl(row)">跳转-->
                  <el-link type="danger" size="mini" @click="generateUrl(row)">跳转
                  </el-link>&nbsp;
                  <el-link type="primary" size="mini" @click="handleQuickReply(row)">快速回复</el-link>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                  style="float: right"
                  background
                  :page-count="underQuery.total"
                  :total="underQuery.total"
                  :page-size="10"
                  :current-page.sync="underQuery.current"
                  @current-change="handCurrentChangeUnder"
                  v-if="underQuery.total>0"
                  layout="total, prev, pager, next, jumper"
                  small>

            </el-pagination>

          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
      <el-pagination style="float: right;margin-top: 10px"
                     background
                     :current-page.sync="query.page"
                     :page-size="20"
                     :total="query.total"
                     v-if="query.total>0"
                     prev-text="上一页"
                     next-text="下一页"
                     @current-change="handCurrentChange"
                     layout="prev, pager, next, jumper"/>
    <el-dialog
      title="快速回复"
      :visible.sync="dialogVisible "
      width="30%"
      center>
      <el-input v-model="quickReply"></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleSumbitReply">确 定</el-button>
    </span>
    </el-dialog>
  </div>

</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'
import {personDiscuss,getPersonDiscussNotifyList,deleteNotify,addDiscuss,getParentFloor} from '@/api/article'
export default {
  name: "index",
  components: {Mallki},
  data() {
    return {
      loading: false,
      list: [],
      divLoading: false,
      query: {
        page: 1,
        limit: 10,
        total: 0
      },
      underList: [],
      underQuery: {
        current: 1,
        username: this.$store.getters.username,
        total: 0
      },
      dialogVisible: false,
      quickReply: '',
      dialogData: {},
      activeNumber: ''
    }
  },
  created() {
    this.get()
  },
  methods: {
    get() {
      personDiscuss(this.query).then(resp => {
        this.list = resp.data.records
        this.query.total = resp.data.total
      });
    },
    handleChange(activeNumber) {
      this.divLoading = true;
      if (!activeNumber) {
        return
      }
      this.activeNumber = activeNumber
      getPersonDiscussNotifyList(activeNumber, this.underQuery).then(resp=>{
        this.underList = resp.data.records
        this.underQuery.total = resp.data.total
        this.underQuery.current = resp.data.current
        this.divLoading = false;
      });
    },
    handCurrentChange(val) {
      this.query.page = val
      this.get()
    },
    handCurrentChangeUnder(val) {
      this.underQuery.current = val
      this.handleChange(this.activeNumber)
    },
    handleDeleteNotify(row) {
      deleteNotify(row.discussId).then(resp => {
        if (resp.data) {
          this.handleChange(row.articleId)
        }
      });
    },
    handleQuickReply(row) {
      this.dialogVisible = true
      this.dialogData = row
    },
    handleSumbitReply() {
      var topP = ''
      if (this.dialogData.topParentId === "-1" || this.dialogData.topParentId === -1) {
        topP = this.dialogData.discussId;
      } else {
        topP = this.dialogData.topParentId
      }
      const query = {
        content: this.quickReply,
        // parentId: item.discussId,
        parentId: this.dialogData.discussId,
        topParentId: topP
      };
      // this.faceInput = ''
      addDiscuss(this.dialogData.articleId, query).then(resp => {
        this.$notify({
          type: 'success',
          title: '评论成功！'
        })
        this.quickReply = ''
        this.dialogVisible = false
        this.handleDeleteNotify(this.dialogData)
      }).catch(err => {
        this.$notify({
          type:'error',
          title: '评论失败'
        })
        this.dialogVisible = false
      });
    },
    generateUrl(row) {
      console.info(row)
      if (!row.to) {
        const url =  `/article/${row.articleId}?page=${Math.ceil(row.floor/10)}&jump=${row.floor}`;
        const routeUrl = this.$router.resolve({
          path: url,
        })
        window.open(routeUrl .href, '_blank')
      } else {
        getParentFloor(row.topParentId).then(reps => {
          if (reps.data) {
            const url =
              `/article/${row.articleId}?page=${Math.ceil(row.floor/10)}&jump=${reps.data}&jump_under=${reps.floor}`;
            const routeUrl = this.$router.resolve({
              path: url,
            })
            window.open(routeUrl .href, '_blank')
          }
        });
      }
    }
  }
}
</script>

<style lang="scss">
  .el-collapse-discuss .el-collapse-item__arrow{
    margin: 0 0 0 0;
  }
  .reply-content p {
    margin: 0 0 0 0;
  }
</style>
