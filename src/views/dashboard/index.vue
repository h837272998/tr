<template>
  <div class="dashboard-container">

    <el-carousel
      :interval="5000"
      type="card"
      height="380px"
      style="margin-top: 5%;"
    >
      <el-carousel-item v-for="item in items" :key="item" style="display: table">
        <img style="display: table-cell;vertical-align: middle" :src="item"></img>
      </el-carousel-item>
    </el-carousel>

    <div class="components-container">
      <split-pane split="vertical" @resize="resize">
        <template slot="paneL">
          <div class="left-container">
            <div>
              <el-row>
                <el-container
                  style="height:550px;border-radius: 5px;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0,
                  0, .04);"
                >
                  <el-header style="background-color: #F1F1F1;text-align: center;line-height: 60px;font-weight: bold;">
                    新闻公告
                  </el-header>
                  <div class="infinite-list-wrapper" style="overflow:auto">
<!--                    <ul-->
<!--                      v-infinite-scroll="load"-->
<!--                      class="list"-->
<!--                      infinite-scroll-disabled="disabled"-->
<!--                    >-->
<!--                      <li v-for="i in count" class="list-item">{{ i }}</li>-->
<!--                    </ul>-->
                    <P v-if="count">暂无公告</P>
                    <p v-if="loading">加载中...</p>
                    <p v-if="noMore">没有更多了</p>
                  </div>
                </el-container>
              </el-row>
            </div>
          </div>
        </template>
        <template slot="paneR">
          <split-pane split="horizontal">
            <template slot="paneL">
              <split-pane split="vertical">
                <template slot="paneL">
                  <el-card class="el-change-card" style="">
                    <div slot="header">
                      <span class="redTitle">热度榜</span>
                    </div>
                    <div v-for="row in heatList">
                      <el-link style="font-weight: bold;line-height: 20px" @click="handleResolve(row.id)"
                               :underline="false">
                        {{row.articleTitle
                        }}</el-link>
                    </div>
                  </el-card>
                </template>
                <template slot="paneR">
                  <el-card class="el-change-card">
                    <div slot="header">
                      <span class="redTitle">评论榜</span>
                    </div>
                    <div v-for="row in disNumList">
                      <el-link style="font-weight: bold;line-height: 20px" :underline="false"  @click="handleResolve(row.id)">
                        {{row.articleTitle
                        }}</el-link>
                    </div>
                  </el-card>
                </template>
              </split-pane>
            </template>
            <template slot="paneR">
              <split-pane split="vertical">
                <template slot="paneL">
                  <div class="top-container">
                    <el-card class="el-change-card" style="margin-bottom: 50px">
                      <div slot="header">
                        <span class="redTitle">最新榜</span>
                      </div>
                      <div v-for="row in createList">
                        <el-link style="font-weight: bold;line-height: 20px" :underline="false"  @click="handleResolve(row.id)">
                          {{row.articleTitle
                          }}</el-link>
                      </div>
                    </el-card>
                  </div>
                </template>
                <template slot="paneR">
                  <!--                  <div class="left-container" >-->
                  <el-card class="el-change-card">
                    <div slot="header">
                      <span class="redTitle">最新评论</span>
                    </div>
                    <div v-for="row in disTimeList">
                      <el-link style="font-weight: bold;line-height: 20px" :underline="false"  @click="handleResolve(row.id)">
                        {{row.articleTitle
                        }}</el-link>
                    </div>
                  </el-card>
                  <!--                  </div>-->
                </template>
              </split-pane>
            </template>
          </split-pane>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import splitPane from 'vue-splitpane'
import { index } from '@/api/article'
export default {
  name: 'Dashboard',
  components: { splitPane },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      items: ['/image/index_card_1.png', '/image/index_card_2.png', '/image/index_card_3.png',
        '/image/index_card_4.png'],
      count: 5,
      loading: false,
      heatList: [],
      disNumList: [],
      disTimeList: [],
      createList: []
    }
  },
  computed: {
    noMore() {
      return this.count >= 10
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  created() {
    this.generateIndex()
  },
  methods: {
    resize() {
      console.log('resize')
    },
    load() {
      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 2000)
    },
    handleResolve(id) {
      const routeUrl = this.$router.resolve({
        path: `/article/${id}`,
      })
      window.open(routeUrl .href, '_blank')
    },
    generateIndex() {
      index('now_heat').then(resp => {
        this.heatList = resp.data
      })
      index('discuss_number').then(resp => {
        this.disNumList = resp.data
      })
      index('create_time').then(resp => {
        this.createList = resp.data
      })
      index('discuss_time').then(resp => {
        this.disTimeList = resp.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    padding: 32px;
    background-color: #eef6fe;
    margin-top: 1em;
    position: relative;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.el-change-card .el-card__header{
  padding: 10px 10px 10px 10px;
  font-weight: bold;
  font-size: 14px;
}
.el-change-card {
  height: 100%
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
.components-container {
  /*position: relative;*/
  height: 100vh;
  padding-top: 50px;
}

.left-container {
  /*background-color: #F38181;*/
  /*height: 10%;*/
  height: 100px;
}

.right-container {
  /*background-color: #FCE38A;*/
  height: 200px;
}

.top-container {
  /*background-color: #FCE38A;*/
  width: 100%;
  height: 100%;
}

.bottom-container {
  width: 100%;
  background-color: #95E1D3;
  height: 100%;
}

.list {
  list-style-type: none;
}
.infinite-list-wrapper {
  /*height: 300px;*/
  text-align: center;
}
.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list-wrapper .list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #e8f3fe;
  color: #7dbcfc;
}
.infinite-list-wrapper .list-item+.list-item {
  margin-top: 10px;
}
</style>
