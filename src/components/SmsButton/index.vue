<template>
  <el-button type="primary" @click="getCode" :disabled="canClick">
    {{buttonMessage}}
  </el-button>
</template>

<script>
import {getSms} from '@/api/user'
export default {
  name: "index",
  props: {
    mobile: {
      type: String,
      default: ''
    },
    canClick: {
      type: Boolean,
      default: false
    },
    totalTime: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      buttonMessage: '获取验证码',
      // canClick: false,
    }
  },
  created() {
    const pre = this.$store.getters.smsTime
    if (pre) {
      const inteval = (new Date().getTime() - pre)/1000
      if (inteval < 60) {
        this.canClick = true
        this.totalTime = Math.floor(60-inteval)
        this.countDown();
      }
    }
  },
  methods: {
    getCode() {
      var _this = this
      getSms(this.mobile).then(resp=>{
        _this.buttonMessage = '获取成功'
        _this.$store.dispatch('settings/changeSetting',{key:'smsTime',value:new Date().getTime()})
        _this.canClick = true
        _this.countDown()
      })
    },
    countDown() {
      if(!this.canClick) return
      this.buttonMessage = this.totalTime + 's后重新发送'
      let clock = window.setInterval(() => {
        this.totalTime--
        this.buttonMessage = this.totalTime + 's后重新发送'
        if (this.totalTime < 0) {
          window.clearInterval(clock)
          this.canClick = false
          this.buttonMessage = '获取验证码'
          this.totalTime = 60
          // this.loginFormPhone.canClick = true  //这里重新开启
        }
      },1000)
    }
  },

}
</script>

<style scoped>

</style>
