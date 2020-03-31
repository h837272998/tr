<template>
  <div v-if="cif">
    <h2 v-if="!this.$route.params.username" style="padding-left: 20px">
      Hi, {{ username }}
    </h2>
      <div class="info-container border-tr">
        <div style="margin: 0 auto;text-align: center" align="center" >
          <pan-thumb :image="form.avatar" style="width: 100px;height: 100px"/>
        </div>
        <div style="float: right;padding-right: 200px">———— {{form.signature}}</div>
        <el-form label-width="280px" style="padding-top: 30px">
          <el-form-item label="用户名">
            {{form.username}}
          </el-form-item>
          <el-form-item label="角色">
            {{form.type|formatRole}}
          </el-form-item>
          <el-form-item label="学院">
            {{subText}}
          </el-form-item>
          <el-form-item label="介绍">
            <span v-html="form.introduction"></span>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb/index'
import { isEmpty, formatMobile } from '@/utils'
import { mapGetters } from 'vuex'
import { getInfoV1, getInfoV2 } from '@/api/user'
import { getInfoCollege } from '@/api/college'
export default {
  name: 'showInfo',
  components: { PanThumb },
  filters: {
    formatRole(role) {
      const map = {
        student: '学生',
        teacher: '教师'
      }
      return map[role]
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'username'
    ])
  },
  data() {
    return {
      cif: false,
      form: {
        id: '',
        username: '',
        realName: '',
        avatar: '',
        type: '',
        signature: '',
        introduction: '',
        age: '',
        sub: ''
      },
      subText: '',
    }
  },
  created() {
    if (!this.$route.params.username) {
      new Promise((resolve, reject) => {
        getInfoV1().then(resp => {
          this.form = resp.data
          getInfoCollege(this.$store.getters.username).then(resp => {
            if (!isEmpty(resp.data)) {
              this.subText = resp.data
            }
            resolve(true)
          }).catch(err => {
            resolve(true)
          });
        })
      }).then(result => {
        if (result) {
          this.cif = true;
        }
      });
    } else {
      new Promise((resolve, reject) => {
        getInfoV2(this.$route.params.username).then(resp => {
          this.form = resp.data
          getInfoCollege(this.$route.params.username).then(resp => {
            if (!isEmpty(resp.data)) {
              this.subText = resp.data
            }
            resolve(true)
          }).catch(err => {
            resolve(true)
          });
        })
      }).then(result => {
        if (result) {
          this.cif = true;
        }
      });
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
  .info-container {
    margin: 10px 10px 10px 10px;
    padding: 20px 20px 20px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
</style>
