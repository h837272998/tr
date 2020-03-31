<template>
  <div class="search-contianer">
    <div class="search-container" style="padding-left: 220px">
      <el-input v-model="url.search" placeholder="请输入搜索内容" class="input-with-select" style="width: 50%">
<!--        <el-select slot="prepend" placeholder="请选择" style="width:8em">-->
<!--          <el-option label="未知" value="1" />-->
<!--          <el-option label="未知" value="2" />-->
<!--        </el-select>-->
      </el-input>
      <el-button slot="append" type="primary" icon="el-icon-search" @click="handleSearch" circle />
    </div>

    <el-container>
      <el-aside width="200px" class="need-change">
        <el-menu style="padding-bottom: 30px"
                 default-active="all" @select="filedSelect">
          <el-menu-item index="all">
            全文搜索
          </el-menu-item>
          <el-menu-item index="title">
            标题搜索
          </el-menu-item>
        </el-menu>
        <el-menu default-active="-1" @select="timeSelect" style="padding-bottom: 30px">
          <el-menu-item index="-1">
            全部时间
          </el-menu-item>
          <el-menu-item index="24">
            1天内
          </el-menu-item>
          <el-menu-item index="168">
            1周内
          </el-menu-item>
          <el-menu-item index="720">
            1个月内
          </el-menu-item>
        </el-menu>
        <el-menu default-active="defaule" @select="sortSelect">
          <el-menu-item index="defaule">
            默认排序
          </el-menu-item>
          <el-menu-item index="time">
            按时间排序
          </el-menu-item>
          <el-menu-item index="region">
            按共享区排序
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main v-loading="loading">
        <el-link v-if="total===0">没有数据</el-link>
        <div class="title" v-for="row in content" >
          <el-link :underline="false" :href="`/article/${row.id}`" target="_blank">
            <span style="font-size: Medium;
            line-height: 1.3;
            font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Arial,sans-serif;
            font-weight: bold" v-html="row.showTitle" ></span>
          </el-link>
          <div style="font-size: Small" class="my-span" v-html="row.showContent"></div>
          <el-link type="success" style="font-size: Small">发布时间: {{row.create_time}}
            <i class="el-icon-s-comment"></i>{{row.discuss_number}}
            <i class="el-icon-view"></i>{{row.click_number}}</el-link>
          <el-divider></el-divider>
        </div>

        <el-pagination style="float: right;margin-top: 10px"
                       background
                       :current-page.sync="url.page"
                       :page-size="20"
                       :total="total"
                       v-if="total>0"
                       prev-text="上一页"
                       next-text="下一页"
                       @current-change="handCurrentChange"
                       layout="prev, pager, next, jumper"/>
      </el-main>
      <el-aside width="400px">
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import {getSearch} from '@/api/article'
import queryString from 'query-string'

export default {
  name: 'Search',
  data() {
    return {
      total: 0,
      pages: '0',
      url: {
        page: this.$route.query && this.$route.query.page || 1,
        search: this.$route.query && this.$route.query.search || '',
        filed: this.$route.query && this.$route.query.filed || 'all',
        time: this.$route.query && this.$route.query.time || '-1',
        sort: this.$route.query && this.$route.query.sort || 'default',
        region: this.$route.query && this.$route.query.region || -1,
        author: this.$route.query && this.$route.query.author || ''
      },
      content: [],
      lock: false,
      loading: false
    }
  },
  created() {
    this.toggleUrl(this.url)
    this.get()
  },
  watch:{
    url: {
      deep: true,
      handler: function (val){
        if (!this.lock) {
          this.toggleUrl(val);
          this.get()
        }
      }
    },
  },
  methods: {
    get() {
      this.loading = true
      getSearch(this.url).then(resp => {
        const title = this.$route.query && this.$route.query.search || ''
        document.title = '搜索-' + title;
        this.$route.meta.title = '搜索-' + title
        this.content = resp.data.content
        this.total = resp.data.totalElements
        this.pages = resp.data.totalPages
        this.loading = false
      }).catch(err => {
        this.loading = false
      });
    },
    handCurrentChange() {
      this.get()
    },
    toggleUrl(val) {
      var param = queryString.parseUrl(window.location.href);
      var url = queryString.stringifyUrl({url: param.url,query: val})
      history.pushState({}, "", url);
    },
    handleSearch() {
      this.get()
    },
    filedSelect(index) {
      this.url.filed = index
    },
    timeSelect(index) {
      this.url.time = index
    },
    sortSelect(index) {
      this.url.sort = index
    }
  }
}
</script>

<style lang="scss">
.search-contianer {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  margin: 20px 20px 20px 20px;
}
  .title em {
    font-style: normal;
    color: red;
  }
  .need-change{
    .el-menu-item, .el-submenu__title{
      font-size: 13px;
      height: 36px;
      line-height: 36px;
    }
  }
  .my-span p {
    display: inline;
    white-space: nowrap;
    margin: 0 0 0 0;
  }
</style>
