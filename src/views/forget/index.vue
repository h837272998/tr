<template>
  <div class="login-container">
    <el-row>
      <el-col :offset="1">
        <Mallki text="忘记密码" style="font-size: 18px" />
      </el-col>
    </el-row>
    <br>
    <br>
    <el-form
      ref="rform"
      v-loading="loading"
      :model="rform"
      class="container"
      status-icon
      :rules="rules"
      label-position="right"
      label-width="70px"
    >
      <el-form-item prop="password" label="新密码">
        <el-input
          v-model="rform.password"
          type="password"
          auto-complete="off"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <el-form-item prop="mobile" label="手机号">
        <el-input
          v-model="rform.mobile"
          type="text"
          auto-complete="off"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item prop="validcode" label="验证码">
        <el-col :span="11">
          <el-input
            v-model="rform.validcode"
            type="text"
            auto-complete="off"
            placeholder="请输入验证码"
          />
        </el-col>
        <el-col :span="6" :offset="4">
          <el-button type="primary" :disabled="canClick" @click="getCode">
            {{ buttonMessage }}
          </el-button>
        </el-col>
      </el-form-item>
      <el-form-item style="margin-top: 20px">
        <el-button type="success" @click="submit">提交</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'
import { checkUsernameOrPhone, getSms, forget } from '@/api/user'

export default {
  name: 'Index',
  components: { Mallki },
  data() {
    return {
      rform: {
        password: '',
        mobile: '',
        validcode: ''
      },
      canClick: false,
      totalTime: 60,
      buttonMessage: '获取验证码',
      rules: {
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z]([-_a-zA-Z0-9]{5,17})$/,
            message: '以字母开头，长度在6-18之间， 只能包含字符、数字和下划线',
            trigger:
                'blur'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空！', trigger: 'blur' },
          {
            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: '请输入正确的手机号码!', trigger: ['blur', 'change']
          }
        ],
        validcode: [
          { required: true, message: '验证码不能为空！', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created() {
    const pre = this.$store.getters.smsTime
    if (pre) {
      const inteval = (new Date().getTime() - pre) / 1000
      if (inteval < 60) {
        this.canClick = true
        this.totalTime = Math.floor(60 - inteval)
        this.countDown()
      }
    }
  },
  methods: {
    getCode: function() {
      var _this = this
      _this.$refs.rform.validateField('mobile', (vmsg) => {
        if (vmsg == '') {
          getSms(this.rform.mobile).then(resp => {
            _this.buttonMessage = '获取成功'
            _this.$store.dispatch('settings/changeSetting', { key: 'smsTime', value: new Date().getTime() })
            _this.canClick = true
            _this.countDown()
          })
        }
      })
    },
    submit: function() {
      this.$refs.rform.validate((valid) => {
        if (valid) {
          this.loading = true
          forget(this.rform).then(resp => {
            if (resp&&resp.data>=1) {
              this.$message({
                type: 'success',
                message: '修改密码成功！'
              })
              this.loading = false
            }
            const _this = this
            setTimeout(() => {
              _this.$router.push({ path: '/login' || '/' })
            }, 2000)
          }).catch(err => {
            this.$message({
              type: 'success',
              message: '修改失败，请重试！'
            })
            this.loading = false
          })
        }
      })
    },
    countDown() {
      if (!this.canClick) return
      this.buttonMessage = this.totalTime + 's后重新发送'
      const clock = window.setInterval(() => {
        this.totalTime--
        this.buttonMessage = this.totalTime + 's后重新发送'
        if (this.totalTime < 0) {
          window.clearInterval(clock)
          this.canClick = false
          this.buttonMessage = '获取验证码'
          this.totalTime = 60
          // this.loginFormPhone.canClick = true  //这里重新开启
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 35%;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
</style>
