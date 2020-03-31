<template>
  <div class="resource-container">
    <div class="search-container">
        <el-input v-model="searchForm.searchInput" placeholder="请输入搜索内容" class="input-with-select" style="width: 50%">
          <el-select slot="prepend" v-model="searchForm.select" placeholder="请选择" style="width:8em">
            <el-option label="全部" value="all"  />
            <el-option label="标题" value="title" />
          </el-select>
      </el-input>
      <el-button slot="append" type="primary" icon="el-icon-search" @click="handleSearch" circle />
    </div>

    <panel-group class="panel-group-container"></panel-group>

    <div class="table-container">
      <div class="head-container">
        <el-button type="primary" @click="handlePublice" style="margin: 10px 10px 0 20px" size="small">发 帖</el-button>
        <el-pagination style="float: right;margin-top: 10px"
                       background
                       :current-page.sync="url.current"
                       :page-size="20"
                       :total="total"
                       prev-text="上一页"
                       next-text="下一页"
                       @current-change="handCurrentChange"
                       layout="prev, pager, next, jumper"/>
<!--        <hr>-->
        <el-divider></el-divider>
        <el-button  style="margin: 0 20px 0 20px"  size="mini" @click="url.category='';url.current=1">全部</el-button>
        <el-badge style="margin: 0 20px 0 20px" type="warning" v-for="row in categoryList" :value="row.number" >
          <el-button size="mini" @click="url.category=row.id;url.current=1">{{row.categoryName}}</el-button>
        </el-badge>
        <el-divider ></el-divider>


      </div >
      <el-table
        size="small"
        :data="tableData"
        v-loading="loading"
        :cell-class-name="tableCell"
        style="width: 100%;padding: 0px 10px 10px 10px;">
        <el-table-column
          prop="articleTitle"
          label="标题"
          min-width="500px">
          <template slot-scope="{row}" slot="header">
            <el-link @click="url.orderBy = 'create_time'">最新&nbsp;</el-link>
            <el-link  @click="url.orderBy = 'now_heat'">热门&nbsp;</el-link>
            <el-popover trigger="click"
                    placement="right">
              <el-row> 排序:
                <el-link size="mini" :type="generateLinkType('create_time')" @click="url.orderBy='create_time'">发帖时间</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link size="mini" :type="generateLinkType('discuss_number')" @click="url.orderBy='discuss_number'">回复/查看</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link size="mini" :type="generateLinkType('click_number')" @click="url.orderBy='click_number'">查看</el-link>
              </el-row>
              <el-row> 时间:
                <el-link size="mini" :type="generateLinkDateline('')" @click="url.dateline=''">全部时间</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link size="mini" :type="generateLinkDateline(24)" @click="url.dateline=24">一天</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link size="mini" :type="generateLinkDateline(48)" @click="url.dateline=48">两天</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link size="mini" :type="generateLinkDateline(168)" @click="url.dateline=168">一周</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link size="mini" :type="generateLinkDateline(720)" @click="url.dateline=720">一个月</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link size="mini" :type="generateLinkDateline(2160)" @click="url.dateline=2160">三个月</el-link>
              </el-row>
              <el-link slot="reference">更多<i class="el-icon-caret-right"></i>&nbsp;</el-link>
            </el-popover>
            <el-popover trigger="click"
                        placement="right" style="width: 400px">
              <el-cascader v-model="infoValue" :options="infoOptions" style="width: 400px" :props="subProps"
                          filterable clearable />
              <el-link slot="reference">信息<i class="el-icon-caret-right"></i>&nbsp;</el-link>
            </el-popover>
          </template>
          <template slot-scope="{row}">
            <div style="vertical-align: baseline">
              <el-link :underline="false" :href="`/#/article/${row.id}`" target="_blank">
                <img title="新窗口打开" src="/image/resource/folder_common.gif"></img>
              </el-link>
              <el-link>[</el-link>
              <el-link :href="generateRegionHref(row.region)" :type="generateRegionColor(row.region)">{{regionMap[row.region]}}</el-link>
              <el-link>]</el-link> &nbsp;
              <el-link :href="`/article/${row.id}`">
                {{row.articleTitle}}
              </el-link>
              &nbsp;<el-tag style="padding: 1px 1px 1px 1px;font-size: 8px" :type="generateTagType(row.name)" size="mini" v-for="row in row.categories">{{row.name}}</el-tag>
              <el-tag style="padding: 1px 1px 1px 1px;font-size: 10px" title="登录可看" v-if="row.isLogged" type="danger" size="mini"><i class="el-icon-lock"></i></el-tag>
              <img src="/image/resource/hot_3.gif" :title="`热度:${row.nowHeat}`" v-if="row.nowHeat>=heat"></img>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="信息"
          style="word-break:break-all;"
          width="120px">
          <template slot-scope="{row}">
            <span class="author">
              <el-link type="primary" style="font-size: 8px" @click="url.collegeId=row.subordinates.collegeId" v-if="row.subordinates.collegeName">{{row.subordinates.collegeName}}</el-link>
              <el-link type="primary" style="font-size: 8px" @click="url.majorId=row.subordinates.majorId" v-if="row.subordinates.majorName">{{row.subordinates.majorName}}</el-link>
              <el-link type="primary" style="font-size: 8px" @click="url.courseId=row.subordinates.courseId" v-if="row.subordinates.courseName">{{row.subordinates.courseName}}</el-link>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="作者"
          style="word-break:break-all;"
          width="120px">
          <template slot-scope="{row}">
            <span class="author">
              <el-popover
                placement="top-start"
                width="400"
                trigger="click">
                <el-link  type="primary" @click="row.popover=true" slot="reference"
                          style="line-height: 14px;font-size:12px">{{row.author}}</el-link>
                <user-dialog v-if="row.popover" :username="row.authorUsername"></user-dialog>
              </el-popover>
                <br/>
              <em style="line-height: 14px">{{row.createTime|parseTime('{y}-{m}-{d}')}}</em>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="回复/查看"
                         style="word-break:break-all;" width="80px">
          <template slot-scope="{row}">
            <span class="author">
              <el-link type="primary" style="font-size: 12px" :underline="false">{{row.discussNumber}}</el-link><br/>
              <em>{{row.clickNumber}}</em>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="最后发表"
                         style="word-break:break-all;" width="90px">
          <template slot-scope="{row}">
            <span class="author">

              <el-popover
                placement="top-start"
                width="400"
                trigger="click">
                <el-link  type="primary" @click="row.lastPopover=true" slot="reference"
                          style="line-height: 14px;font-size:12px">{{row.lastDiscussUsername}}</el-link>
                <user-dialog v-if="row.lastPopover" :username="row.lastDiscussUsername"></user-dialog>
              </el-popover><br/>

<!--              <el-link type="primary" style="font-size: 12px" :underline="false">{{row.lastDiscussUsername}}</el-link><br/>-->
              <span :title="row.lastDiscussTime" style="font-size: 10px">{{row.lastDiscussTime|formatTime()}}</span>
            </span>
          </template>
        </el-table-column>
        <div slot="append" style="text-align: center">
          <!--在此处添加你想要插入在表格最后一行的内容-->
          <div v-loading="appendLoading" text="加载中..."></div>
          <el-button style="width: 100%;" @click="nextPage">下一页</el-button>
        </div>
      </el-table>
      <div class="head-container">
        <el-button type="primary" @click="handlePublice" style="margin: 10px 10px 0 20px" size="small">发 帖</el-button>
        <el-pagination style="float: right;margin-top: 10px"
                       background
                       :current-page.sync="url.current"
                       :page-size="20"
                       :total="total"
                       prev-text="上一页"
                       next-text="下一页"
                       @current-change="handCurrentChange"
                       layout="prev, pager, next, jumper"/>
      </div>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import Pagination from '@/components/Pagination'
import { getCategory } from '@/api/article'
import {getArticleList, getHeat} from "@/api/article";
import { parseTime, formatTime} from "@/utils";
import queryString from 'query-string'
import { college, getMajorByCollege, getCourseByMajor } from '@/api/college'
import UserDialog from "@/components/UserDialog/index";

export default {
  name: 'Index',
  components: {UserDialog, PanelGroup, Pagination },
  filters: {
    parseTime,formatTime
  },
  created() {
    getCategory().then(resp => {
      this.categoryList = resp.data
    });
    getHeat().then(resp => {
      this.heat = resp.data
    });
    this.toggleUrl(this.url)
    getArticleList(this.url).then(resp => {
      // this.tableData = resp.data.records
      this.tableData = []
      resp.data.records.map( row => {
        row.popover = false
        row.lastPopover = false
        this.tableData.push(row)
      })
      this.url.current = resp.data.current
      this.total = resp.data.total
      this.loading = false
    });
    this.generateOptions()
  },
  data() {
    const regionMap = {
      0: '选修课共享区',
      1: '学生共享区',
      2: '教师共享区'
    }
    return {
      categoryList: '',
      searchForm: {
        select: '',
        searchInput: ''
      },
      heat: '',
      tableData: [],
      regionMap: regionMap,
      url: {
        current: this.$route.query && this.$route.query.current || 1,
        orderBy: this.$route.query && this.$route.query.orderBy || 'create_time',
        region: this.generateRegion(),
        category: '',
        collegeId: '',
        majorId: '',
        courseId: '',
        dateline: ''
      },
      pages: 1,
      total: 0,
      loading: true,
      appendLoading: false,
      lock: false,
      infoValue: [],
      infoOptions: [],
      subProps: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level, data } = node
          console.info(level)
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
                const list = resp.data.map(row => {
                  return { label: row.courseName, value: row.id, leaf: level >= 2 }
                })
                resolve(list)
              } else {
                resolve(false)
              }
            })
          }
        }
      }
    }
  },
  watch: {
    url: {
      deep: true,
      handler: function (val){
        if (!this.lock) {
          this.toggleUrl(val);
          this.refreshTable()
        }
      }
    },
    infoValue: {
      deep: true,
      handler: function (val) {
        if (!this.lock) {
          this.url.collegeId = val[0] || '',
          this.url.majorId = val[1] || '',
          this.url.courseId = val[2] || ''
        }
      }
    }
  },
  methods: {
    // getList() {
    //   return this.tableData
    // },
    handCurrentChange(val) {
      // this.loading = true
      // this.url.current = val
      // // const query = {current: this.url.current ,region: '',category: '',orderBy:'',collegeId: '',majorId: '', courseId: ''}
      // getArticleList(this.url).then(resp => {
      //   this.loading = false
      //   this.tableData = resp.data.records
      //   this.url.current = resp.data.current
      //   this.total = resp.data.total
      //   this.pages = resp.data.pages
      // });
    },
    generateRegionColor(region) {
      const map = { 0: 'info',1: 'warning', 2: 'primary'}
      return map[region]
    },
    generateRegionHref(region) {
      const map = { 0:'/resourceRegion/elective',
        1:'/resourceRegion/student',
        2: '/resourceRegion/teacher' }
      if (map[region]) {
        return map[region];
      } else {
        return '/resourceRegion/all'
      }
    },
    tableCell({row, column, rowIndex, columnIndex}) {
      return 'background-color: #4edb9b'
    },
    generateTagType(id) {
      const map = {
        课堂资料: 'primary',
        复习资料: 'success',
        学习工具: 'warning',
        课外拓展: 'info',
        其他分类: 'info'}
      return map[id];
    },
    nextPage() {
      if (this.url.current > this.pages) {
        return;
      }
      this.lock = true
      this.appendLoading = true
      this.url.current = this.url.current + 1
      // const query = {current: this.url.current ,region: '',category: '',orderBy:'',collegeId: '',majorId: '', courseId: ''}
      getArticleList(this.url).then(resp => {
        resp.data.records.map( row => {
          row.popover = false
          row.lastPopover = false
          this.tableData.push(row)
        })
        this.url.current = resp.data.current
        this.total = resp.data.total
        this.pages = resp.data.pages
        this.loading = false
        this.appendLoading = false
        this.lock = false
      }).catch(r=>{
        this.lock = false
      })

    },
    refreshTable() {
      this.loading = true
      getArticleList(this.url).then(resp => {
        // this.tableData = resp.data.records
        this.tableData = []
        resp.data.records.map( row => {
          row.popover = false
          row.lastPopover = false
          this.tableData.push(row)
        })
        this.url.current = resp.data.current
        this.total = resp.data.total
        this.pages = resp.data.pages
        this.loading = false
        this.appendLoading = false
      });
    },
    toggleUrl(val) {
      var param = queryString.parseUrl(window.location.href);
      var url = queryString.stringifyUrl({url: param.url,query: val})
      history.pushState({}, "", url);
    },
    generateRegion () {
      const map = {
        All: '',
        Elective: 0,
        Student: 1,
        Teacher: 2
      }
      const isIf = this.$route.query && this.$route.query.region
      if (this.$route.query && this.$route.query.region) {
        return isIf
      }
      return map[this.$route.name];
    },
    generateLinkType(row) {
      const bool = this.url.orderBy === row;
      if (bool) {
        return 'primary'
      } else {
        return 'default'
      }
    },
    generateLinkDateline(row) {
      const bool = this.url.dateline === row
      if (bool) {
        return 'primary';
      } else {
        return 'default'
      }
    },
    generateOptions() {
      college().then(resp => {
        if (resp.data) {
          this.infoOptions = resp.data.map(row => {
            return {value: row.id, label: row.collegeName}
          })
        }
      })
    },
    handleSearch() {
      const search = this.searchForm.searchInput
      const routeUrl = this.$router.resolve({
        path: `/resourceRegion/search?filed=${this.searchForm.select}&search=${search}`,
      })
      window.open(routeUrl .href, '_blank')
    },
    handlePublice() {
      const routeUrl = this.$router.resolve({
        path: '/personal/operate/share',
      })
      window.open(routeUrl .href, '_blank')
    }
  }
}
</script>

<style lang="scss">
  .el-table .cell {
    line-height: 12px;
  }
  .resource-container {
    margin-top: 1em;
    margin-left: 1em;
    margin-right: 1em;
    padding-bottom: 2em;
    background-color: #f9fbff;
    position: relative;
    min-height: 20em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  .search-container {
    padding-left: 10px;
    padding-top: 10px;
  }
  .panel-group-container {
    padding-left: 10px;
    padding-right: 10px;
  }
  .head-container {
    background-color: #ffffff;
    padding: 10px 0 10px 0;
  }
  .table-container {
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  .table-cell {
    background-color: #4edb9b;
    line-height: 14px;
  }
</style>
