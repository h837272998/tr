<template>
  <div>
    <h3>我的收藏</h3>
    <div v-if="cif">
      <div v-if="query.total===0">
        <el-link>收藏夹是空的哦</el-link>
      </div>
      <div v-else style="min-height: 300px">
        <div v-for="row in query.records" style="padding-right: 10px">
          <div >
            <el-link :href="`/article/${row.id}`" target="_blank" style="font-weight: bold">{{row.articleTitle}}</el-link>
            <el-link type="danger" style="float:right;font-size: 13px" @click="canceCollect(row.id)">取消收藏</el-link>
            <span :title="row.createTime"  style="float: right;font-size: 12px">收藏时间:{{row.createTime|formatTime}}&nbsp;
            &nbsp;</span>
          </div>
          <hr>
        </div>
      </div>
      <el-pagination style="float: right"
                     v-if="query.total>0"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="query.current"
                     :page-sizes="[20, 50]"
                     :page-size.sync="query.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="query.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getCollect, deleteCollect } from '@/api/article'
import { formatTime} from "@/utils";

export default {
  name: 'Collect',
  filters: {formatTime},
  data() {
    return {
      cif: false,
      query: {
        records: [],
        current: 1,
        total: 0,
        size: 20
      }
    }
  },
  created() {
    this.get()
  },
  methods: {
    get() {
      console.info(this.query)
      const _this = this
      getCollect(_this.query.current, _this.query.size).then(reps => {
        this.query = reps.data
        this.cif = true
      });
    },
    canceCollect(articleId) {
      console.info(111)
      this.$confirm('确定取消操作？', '提示！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(resp => {
        deleteCollect(articleId).then(re => {
          this.$notify({
            type: 'success',
            message: re.msg
          })
          this.get()
        });
      });
    },
    handleSizeChange(number) {
      this.query.size = number
      this.get()
    },
    handleCurrentChange(page) {
      this.query.current = page
      this.get()
    }
  }
}
</script>

<style scoped>

</style>
