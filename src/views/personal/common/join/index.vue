<template>
  <div v-cloak v-loading="loading" class="app-container">
    <Mallki :text="$store.getters.name" />
    <h3>我的参与</h3>
    <div>
      <el-link v-if="query.total===0">暂无参与</el-link>
      <el-collapse accordion class="el-collapse-discuss" @change="handleChange">
        <el-collapse-item v-for="row in list" :name="row.id">
          <template slot="title">
            <el-link style="font-weight: bold;">
              {{ row.articleTitle }} - 作者：{{row.authorUsername}}
              <el-badge v-if="row.notifyNumber>0" :value="row.notifyNumber" :max="99" class="item" />
            </el-link>
            <div style="margin:0 0 0 auto">
              <el-link icon="el-icon-chat-dot-square" style="font-size: 10px" :underline="false">{{ row.discussNumber }}</el-link>
              <el-link class="" icon="el-icon-view" style="font-size: 10px" :underline="false">{{ row.clickNumber }}</el-link>
            </div>
          </template>
          <div
            v-loading="divLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0,0, 0, 0.8)"
            style="min-height: 50px;padding-left: 20px;padding-bottom: 20px;padding-top: 20px"
          >
            <div v-for="row in underList"" >
              <el-row v-if="row.replyDiscussId !==null">
                {{ row.replyUsername }}
                <el-link type="primary" style="font-size: 18px">“</el-link>
                <span v-html="row.replyContent"></span>
                <el-link type="primary" style="font-size: 18px">”</el-link>
                <span style="font-weight: bold">回复我的</span>
                <el-link type="primary" style="font-size: 18px">”</el-link>
                <span class="my-span" v-html="row.content"></span>
                <el-link type="primary" style="font-size: 18px">“</el-link>
                <el-tag v-if="row.replyNotifyId!== null" type="success" :key="row.id"
                        closable
                        :disable-transitions="row.replyNotifyId===null"
                        @close="handleClose(row)"
                        size="mini">
                  未读
                </el-tag>
                <div style="float: right">
                  <el-link
                    :href="`/article/${row.articleId}?page=${Math.ceil(row.floor/10)}&jump=${row.floor}&jump_under=${row.replyFloor}`"
                           target="_blank">跳转</el-link>
                  <el-link>{{row.replyTime|formatTime}}</el-link>
                  <el-link>楼层：{{row.floor}}-{{row.replyFloor}}</el-link>
                </div>
                <el-divider></el-divider>
              </el-row>
              <el-row v-else>
                {{row.username}}
                <span style="font-weight: bold">回复文章</span>
                <el-link type="primary" style="font-size: 18px">“</el-link>
                <span class="my-span" v-html="row.content"></span>
                <el-link type="primary" style="font-size: 18px">”</el-link>
                <div style="float: right">
                  <el-link
                    :href="`/article/${row.articleId}?page=${Math.ceil(row.floor/10)}&jump=${row.floor}`"
                    target="_blank">跳转</el-link>
                  <el-link>{{row.createTime | formatTime}}</el-link>
                  <el-link>楼层：{{row.floor}}</el-link>
                </div>
                <el-divider></el-divider>
              </el-row>
            </div>
            <el-pagination
              v-if="underQuery.total>0"
              background
              :page-count="underQuery.total"
              :total="underQuery.total"
              :page-size="10"
              :current-page.sync="underQuery.current"
              layout="total, prev, pager, next, jumper"
              small
              @current-change="handCurrentChangeUnder"
            />

          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-pagination
      v-if="query.total>0"
      style="float: right;margin-top: 10px"
      background
      :current-page.sync="query.page"
      :page-size="20"
      :total="query.total"
      prev-text="上一页"
      next-text="下一页"
      layout="prev, pager, next, jumper"
      @current-change="handCurrentChange"
    />
<!--    <el-dialog-->
<!--      title="快速回复"-->
<!--      :visible.sync="dialogVisible "-->
<!--      width="30%"-->
<!--      center-->
<!--    >-->
<!--      <el-input v-model="quickReply" />-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="handleSumbitReply">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
  </div>

</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'
import {personJoin, getPersonJoinNotifyUnder, addDiscuss, deleteNotify} from '@/api/article';
import { parseTime, formatTime} from "@/utils";

import queryString from 'query-string'
export default {
  name: 'Index',
  components: { Mallki },
  filters: {
    formatTime
  },
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
      personJoin(this.query).then(resp => {
        this.list = resp.data.records
        this.query.total = resp.data.total
      })
    },
    handleChange(activeNumber) {
      this.divLoading = true;
      if (!activeNumber) {
        return
      }
      this.activeNumber = activeNumber
      getPersonJoinNotifyUnder(activeNumber, this.underQuery).then(resp=>{
        this.underList = resp.data.records
        this.underQuery.total = resp.data.total
        this.underQuery.current = resp.data.current
        this.divLoading = false;
      });
    },
    getReply(row, show) {
      if (row.show && row.show === true && show) {
        row.show = false
        return
      }
      const id = this.$route.params && this.$route.params.id;
      getDiscuss(id, row.reply.current, row.discussId).then(resp => {
        const data = resp.data
        row.reply = resp.data
        row.reply.to = row.username
        // this.test = row.username
        this.changReply(row)
        row.show = true
      }).catch(err => {
        this.$notify({
          type:'error',
          title: '加载失败！',
          duration: 0
        })
        this.discussLoading = false
      });
    },
    getDiscussLimit() {
      const id = this.$route.params && this.$route.params.id
      this.discussLoading = true
      getDiscuss(id, this.page, -1).then(resp => {
        this.discussLoading = false
        resp.data.records.map(row => {
          row.show = false;
          row.reply = {};
          row.reply.current = 1;
          row.reply.total = 0;
          return row
        });
        this.replyList = resp.data.records
        this.page = resp.data.current
        this.total = resp.data.total
      }).catch(err => {
        this.$notify({
          type:'error',
          title: '加载评论失败！',
          duration: 0
        })
        this.discussLoading = false
      });
    },
    handCurrentChangeUnder() {
      this.handleChange(this.activeNumber)
    },
    handCurrentChange() {
      this.get()
    },
    handleClose(row){
      if (!row.replyDiscussId) {
        return
      }
      deleteNotify(row.replyDiscussId).then(resp => {
        row.replyNotifyId = null
      });
    }
  }
}
</script>

<style lang="scss">
  @import "/emoji.css"; // 导入精灵图样式
  .el-collapse-discuss .el-collapse-item__arrow{
    margin: 0 0 0 0;
  }
  .reply-content p {
    margin: 0 0 0 0;
  }
  .my-span p {
    display: inline;
    white-space: nowrap;
    margin: 0 0 0 0;
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

</style>
