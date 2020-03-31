<template>
  <div v-cloak v-loading="loading" class="app-container">
    <!--    <h1>我的发表1</h1>-->
    <el-row>
      <el-col :offset="8">
        <Mallki :text="$store.getters.username" style="font-size: 18px;margin-bottom: 20px" />
      </el-col>
    </el-row>

    <el-container>
      <el-main style="padding-left: 15px;">
        <div v-if="total===0">
          <el-link>没有找到共享文章！</el-link>
        </div>
        <el-collapse v-for="row in list">
          <el-collapse-item>
            <template slot="title">
              <el-tag v-if="row.status===0" type="warning" effect="plain" size="mini" style="margin-right: 5px">
                稿
              </el-tag>
              <el-tag size="mini" type="danger" v-if="row.isLogged">
                <i class="el-icon-lock"></i>
              </el-tag>
              <el-tag size="mini" effect="plain" style="margin-right: 5px">
                {{ generateRegion(row.region) }}
              </el-tag>
              <el-link :underline="false">
                {{ row.articleTitle }}
                <img v-if="row.nowHeat>=heat" src="/image/resource/hot_3.gif" :title="`热度:${row.nowHeat}`"></img>

              </el-link>
            </template>
            <div>

              <div style="font-size: 15px;margin-bottom: 20px">
                &nbsp;&nbsp;&nbsp;&nbsp;{{ row.summary }}
              </div>
              <div style="float: right" />
              <el-row>

                <div style="float: left;">
                  <!--              <el-link style="font-size: 12px;color: #99a9bf" v-for="item in row.subordinates">{{item}}/</el-link>-->
                  <el-link v-if="row.subordinates.collegeName" type="info" style="font-size: 8px" @click="url.collegeId=row.subordinates.collegeId">{{ row.subordinates.collegeName }}/</el-link>
                  <el-link v-if="row.subordinates.majorName" type="info" style="font-size: 8px" @click="url.majorId=row.subordinates.majorId">{{ row.subordinates.majorName }}/</el-link>
                  <el-link v-if="row.subordinates.courseName" type="info" style="font-size: 8px" @click="url.courseId=row.subordinates.courseId">{{ row.subordinates.courseName }}</el-link>
                </div>

                <div style="float: right;font-size: 12px;color: #99a9bf">
                  创建时间:{{ row.createTime }} 更新时间:{{ row.updateTime }}
                </div>
              </el-row>
              <el-row>
                <div style="float: right">
                  <el-tag effect="plain" size="mini" type="danger" style="margin-left: 5px">
                    {{ generateLogged(row.isLogged) }}
                  </el-tag>
                  <el-tag
                    :style="{'text-decoration': row.isDiscuss?'none':'line-through'}"
                    size="mini"
                    type="primary"
                    style="margin-left: 5px;text-decoration"
                  >
                    评论
                  </el-tag>
                </div>
              </el-row>
              <div style="float: left">
                <el-tag v-for="item in row.categories" type="success" style="margin-right: 5px" size="mini">{{ item.name }}</el-tag>
              </div>
              <div style="float: right">
                <el-link :underline="false" style="font-size: 13px" target="_blank" @click="toggleStatus(row.id,row.status)">{{ row.status==0?'发布': '草稿' }}</el-link>
                <el-link type="danger" :underline="false" style="font-size: 13px" target="_blank" @click="toggleStatus(row.id,-1)">删除</el-link>
                <router-link v-if="row.region>=0" :to="`/personal/operate/edit/${row.id}`">
                  <el-link style="font-size:13px" :underline="false">编辑</el-link>
                </router-link>
                <router-link v-else :to="`/personal/operate/editComm/${row.id}`">
                  <el-link style="font-size:13px" :underline="false">编辑</el-link>
                </router-link>
                <el-link :underline="false" :href="`/article/${row.id}`" style="font-size: 13px" target="_blank">查看</el-link>

                <el-link icon="el-icon-view" style="font-size: 10px" :underline="false">{{ row.clickNumber }}</el-link>
                <el-link icon="el-icon-chat-dot-square" style="font-size: 10px" :underline="false">{{ row.discussNumber }}</el-link>

                <el-link style="font-size: 10px" :underline="false"><svg-icon icon-class="good"/>{{ row.goodNumber
                  }}</el-link>
                <el-link style="font-size: 10px" :underline="false"><svg-icon
                  icon-class="nogood"/>{{ row.noGoodNumber}}</el-link>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-main>
      <el-aside>
        <div>
          <el-input v-model="search" placeholder="搜搜看" style="margin-bottom: 50px">
            <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-card class="el-change-card" style="margin-bottom: 50px">
            <div slot="header">
              <span class="redTitle">归档</span>
            </div>
            <el-link type="primary" @click="handleAll" v-if="query.month!==''">全部</el-link>
            <el-row v-for="row in archive">
              <el-link  @click="handleArchive(row.date)">{{ row.date }}</el-link>
              <el-link style="float: right">{{ row.count }}</el-link>
            </el-row>
          </el-card>

          <el-card class="el-change-card" style="margin-bottom: 50px">
            <div slot="header">
              <span class="redTitle">排序</span>
            </div>
            <div v-if="total!==0">
              <el-link @click="handleOrderBy('create_time')">按发布时间</el-link> <br>
              <el-link @click="handleOrderBy('now_heat')">按热度</el-link><br>
              <el-link @click="handleOrderBy('click_number')">按查看</el-link><br>
              <el-link @click="handleOrderBy('discuss_number')">按评论</el-link><br>
              <el-link @click="handleOrderBy('region')">按发布区域</el-link>
            </div>
          </el-card>

          <el-card class="el-change-card">
            <div slot="header">
              <span class="redTitle">阅读排行榜</span>
            </div>
            <el-row v-for="(row,index) in myLeaderboard">
              <el-link type="primary" style="padding: 5px" @click="handleResolve(row.id)">{{ index+1 }}. {{ row.articleTitle }}({{ row.clickNumber }})</el-link>
            </el-row>
          </el-card>
        </div>
      </el-aside>
    </el-container>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="query.page"
      :limit.sync="query.limit"
      @pagination="get"
    />

  </div>
</template>

<script>
import { personArticle, updateStatus, getHeat, getPersonArchive, leaderboard } from '@/api/article'
import Mallki from '@/components/TextHoverEffect/Mallki'
import Pagination from '@/components/Pagination'

export default {
  name: 'Index',
  components: { Mallki, Pagination },
  data() {
    return {
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        year: '',
        month: '',
        orderBy: 'create_time'
      },
      loading: false,
      heat: 10000,
      archive: [],
      myLeaderboard: [],
      search: ''
    }
  },
  created() {
    getHeat().then(resp => {
      this.heat = resp.data
    })
    this.get()
    getPersonArchive(this.$store.getters.username).then(resp => {
      this.archive = resp.data
    })
    leaderboard(this.$store.getters.username).then(resp => {
      this.myLeaderboard = resp.data.records
    })
  },
  mounted() {
  },
  methods: {
    get() {
      this.loading = true
      personArticle(this.query).then(resp => {
        this.list = resp.data.records
        this.loading = false
        this.total = resp.data.total
      })
    },
    generateLogged(logged) {
      if (logged === false) {
        return '公开'
      } else {
        return '登录可看'
      }
    },
    generateRegion(region) {
      if (region === 0) {
        return '选修区'
      } else if (region === 1) {
        return '学生区'
      } else if (region === -1 || region === -2) {
        return '交流区';
      } else {
        return '教师区'
      }
    },
    toggleStatus(id, status) {
      var text = ''
      var type = 'success'
      if (status === 0) {
        text = '是否发布共享！'
        status = 1
      } else if (status === 1) {
        text = '收回共享，存为草稿！'
        status = 0
      } else if (status === -1) {
        text = '该操作将会移除共享到回收站，且不可看！，是否继续？'
        type = 'error'
        status = -1
      }
      this.$confirm(text,'警告！',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type
      }).then(()=>{
        updateStatus(id, status).then(resp => {
          if (resp) {
            this.$notify({
              type: 'success',
              title: '操作成功！'
            })
            this.get()
          }
        })
      })
    },
    handleResolve(id) {
      const routeUrl = this.$router.resolve({
        path: `/article/${id}`,
      })
      window.open(routeUrl .href, '_blank')
    },
    handleArchive(date) {
      if (date.length !== 8) {
        this.$message.error("归档错误")
        return
      }
      const str = date.toString()
      this.query.year = str.substring(0,4)
      this.query.month = str.substring(5,7)
      this.get()
    },
    handleSearch() {
      if (!this.search) {
        return
      }
      const search = this.search
      const routeUrl = this.$router.resolve({
        path: `/resourceRegion/search?search=${search}&author=${this.$store.getters.username}`,
      })
      window.open(routeUrl .href, '_blank')
    },
    handleAll() {
      this.query.year = ''
      this.query.month = ''
      this.get()
    },
    handleOrderBy(orderBy) {
      this.query.orderBy = orderBy
      this.get()
    }
  }
}
</script>

<style lang="scss">
  .border-tr {
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  .el-change-card .el-card__header{
    padding: 10px 10px 10px 10px;
    font-weight: bold;
    font-size: 14px;
  }
  .el-change-card .redTitle::before{
    display: inline-block;
    margin-right: 8px;
    content: '';
    width: 4px;
    height: 22px;
    vertical-align: -6px;
    background-color: #ca0c16;
  }

</style>
