<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleLink('All')">
        <div class="card-panel-icon-wrapper"
        :class="{'icon-all':current!=='All','icon-all-bg':current==='All','card-panel-icon-wrapper-option':current==='All'}">
          <svg-icon icon-class="all" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            全部资源
          </div>
          <count-to :start-val="0" :end-val="valList[0]" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleLink('Teacher')">
        <div class="card-panel-icon-wrapper"
             :class="{'icon-teacher':current!=='Teacher','icon-teacher-bg':current==='Teacher','card-panel-icon-wrapper-option':current==='Teacher'}">
          <svg-icon icon-class="teacher" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            教师共享区
          </div>
          <count-to :start-val="0" :end-val="valList[1]" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleLink('Student')">
        <div class="card-panel-icon-wrapper"
             :class="{'icon-student':current!=='Student','icon-student-bg':current==='Student','card-panel-icon-wrapper-option':current==='Student'}">
          <svg-icon icon-class="student" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            学生共享区
          </div>
          <count-to :start-val="0" :end-val="valList[2]" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleLink('Elective')">
        <div class="card-panel-icon-wrapper"
             :class="{'icon-elective':current!=='Elective','icon-elective-bg':current==='Elective','card-panel-icon-wrapper-option':current==='Elective'}">
          <svg-icon icon-class="share" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            选修课共享区
          </div>
          <count-to :start-val="0" :end-val="valList[3]" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import pathToRegexp from "path-to-regexp"
import { scrollTo } from '@/utils/scroll-to'
import { getRegionNumber } from '@/api/article'

export default {
  components: {
    CountTo
  },
  data(){
    var region = this.$router.options.routes
    return {
      current: '',
      isRouter: false,
      valList: [0,0,0,0],
      region: region.filter(item=>{
        if (item.path == '/resourceRegion') {
          return item
        }})[0].children
    }
  },
  watch: {
    $route(route) {
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
    getRegionNumber().then(resp => {
      this.valList = resp.data
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '主页' }}].concat(matched)
      }

      let levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
      this.current = levelList[levelList.length-1].name
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === '主页'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(name) {
      let row = this.region.filter(item=>{
        if (item.name == name) {
          return item
        }
      })
      const { redirect, path } = row[0]
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
      scrollTo(142, 800)
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-all {
          background: #40c9c6;
        }

        .icon-teacher {
          background: #36a3f7;
        }

        .icon-student {
          background: #b56bf5;
        }

        .icon-elective {
          background: #e7ad7b
        }
      }

      .card-panel-icon-wrapper-option {
        color: #fff;
      }

      .icon-all {
        color: #40c9c6;
      }

      .icon-all-bg {
        background-color: #40c9c6;
      }

      .icon-teacher {
        color: #36a3f7;
      }

      .icon-teacher-bg {
        background-color: #36a3f7;
      }

      .icon-student {
        color: #b56bf5;
      }

      .icon-student-bg {
        background-color: #b56bf5;
      }

      .icon-elective {
        color: #e7ad7b;
      }

      .icon-elective-bg {
        background-color: #e7ad7b;
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
