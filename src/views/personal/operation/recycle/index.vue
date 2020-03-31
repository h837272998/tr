<template>
  <div>
    <h3>文章回收站</h3>
    <el-container>
      <el-main style="padding-left: 15px;">
        <div v-if="total===0">
          <el-link>空的回收站！</el-link>
        </div>
        <el-collapse v-for="row in list" class="el-collapse-discuss">
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
              <el-link :underline="false" style="font-weight: bold">
                {{ row.articleTitle }}
<!--                <img v-if="row.nowHeat>=heat" src="/image/resource/hot_3.gif" :title="`热度:${row.nowHeat}`"></img>-->
              </el-link>
              <div style="margin:0 0 0 auto;">
                <el-link :title="row.updateTime" style="font-size: 10px">删除时间： {{row.updateTime | formatTime}}</el-link>
                <el-link type="success" style="font-size:12px" @click="redo(row.id,1)">撤销为发布</el-link>
                <el-link type="success" style="font-size:12px" @click="redo(row.id,0)">撤销为草稿</el-link>
                <el-link type="danger" style="font-size:10px" @click="deleteArticle(row.id)">永久移除</el-link>
              </div>
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
                  创建时间:{{ row.createTime }}
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
                <el-link icon="el-icon-view" style="font-size: 10px" :underline="false">{{ row.clickNumber }}</el-link>
                <el-link icon="el-icon-chat-dot-square" style="font-size: 10px" :underline="false">{{ row.discussNumber }}</el-link>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-main>
      <el-footer>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="get"
        />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import {getRecycle, updateStatus, deleteOne} from '@/api/article';
import Pagination from '@/components/Pagination'
import {formatTime} from '@/utils'
export default {
  name: 'Index',
  components: {Pagination},
  filters: {formatTime},
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
    };
  },
  created() {
    this.get()
  },
  methods: {
    get() {
      getRecycle(this.query).then(resp => {
        this.list = resp.data.records
        this.total = resp.data.total
        this.query.page = resp.data.current
      });
    },
    generateRegion(region) {
      if (region === 0) {
        return '选修区'
      } else if (region === 1) {
        return '学生区'
      } else {
        return '教师区'
      }
    },
    generateLogged(logged) {
      if (logged === false) {
        return '公开'
      } else {
        return '登录可看'
      }
    },
    deleteArticle(articleId) {
      this.$confirm('该操作将会永久删除共享，是否继续？','警告！',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(()=>{
        deleteOne(articleId).then(resp => {
          if (resp) {
            this.$notify({
              type: 'warning',
              title: '永久删除成功！'
            })
            this.get()
          }
        });
      })
    },
    redo(articleId, status) {
      this.$confirm('是否撤回删除的共享！','请确认！',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(()=>{
        updateStatus(articleId, status).then(resp => {
          if (resp) {
            this.$notify({
              type: 'success',
              title: '操作成功！'
            })
            this.get()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .el-collapse-discuss .el-collapse-item__arrow{
    margin: 0 0 0 0;
  }
</style>
