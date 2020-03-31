<template>
  <el-tabs
    v-model="activeName"
    v-loading="loading"
    class="login-container"
    label-position="left"
    label-width="0px"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane label="账号登录" name="first">
      <el-row>
        <el-col>&nbsp;</el-col>
      </el-row>
      <el-form ref="loginForm" :model="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item prop="imageCode">
          <el-row>
            <el-col :span="11">
              <el-input
                v-model="loginForm.imageCode"
                type="imageCode"
                auto-complete="off"
                placeholder="验证码"
              />
            </el-col>
            <el-col class="line" :span="2">&nbsp;</el-col>
            <el-col :span="11">
              <div>
                <img :src="imageUrl" style="width: 100px" @click="changeImageCode"></img>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-checkbox
          v-model="loginForm.checked"
          class="login_remember"
          label-position="left"
        >记住密码
        </el-checkbox>
        <el-form-item style="width: 100%">
          <el-button type="primary" style="width: 100%" @click="submitClickUser">登录</el-button>
        </el-form-item>

      </el-form>
    </el-tab-pane>

    <el-tab-pane label="手机登录" name="second">
      <el-form ref="loginFormPhone" :model="loginFormPhone" :rules="rules">
        <el-row>
          <el-col>&nbsp;</el-col>
        </el-row>
        <el-form-item prop="mobile">
          <el-input
            v-model="loginFormPhone.mobile"
            type="text"
            auto-complete="off"
            placeholder="手机号"
          />
        </el-form-item>
        <el-form-item prop="smsCode">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-input
                v-model="loginFormPhone.smsCode"
                type="text"
                auto-complete="off"
                placeholder="验证码"
              />
            </el-col>
            <el-col :span="8">
              <el-button :disabled="loginFormPhone.canClick" @click="changeSmsCode">{{ loginFormPhone.buttonMessage }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-checkbox
          v-model="loginFormPhone.checked"
          class="login_remember"
          label-position="left"
        >记住密码
        </el-checkbox>
        <el-form-item style="width: 100%">
          <el-button type="primary" style="width: 100%" @click="submitClickPhone">登录</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-link href="/register">
      没有账号？
    </el-link>
    <el-link href="/forget" style="float: right">
      忘记密码？
    </el-link>
  </el-tabs>
</template>
<script>
import { imageUrl, getSms } from '@/api/user'
import { createUniqueString, parseTime } from '@/utils'
export default {
  name: 'Login',
  data() {
    var hidden = createUniqueString()
    return {
      rules: {
        username: [{ required: true, message: '请输入用户名！', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码！', trigger: 'blur' }],
        imageCode: [{ required: true, message: '请输入验证码！', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号！', trigger: 'blur' }, {
          pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
          message: '请输入正确的手机号码',
          trigger: ['blur', 'change']
        }],
        smsCode: [{ required: true, message: '请输入验证码！', trigger: 'blur' }]
      },
      checked: true,
      loginForm: {
        username: 'admin',
        password: '123456',
        checked: false,
        key: hidden,
        imageCode: '9999'
      },
      loginFormPhone: {
        mobile: 15815817806,
        smsCode: '',
        checked: false,
        buttonMessage: '获取验证码',
        canClick: false,
        totalTime: 60
      },
      imageUrl: '/api/auth/code/image',
      loading: false,
      activeName: 'first'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.changeImageCode()
    const pre = this.$store.getters.smsTime
    if (pre) {
      const inteval = (new Date().getTime() - pre)/1000
      if (inteval < 60) {
        this.loginFormPhone.canClick = true
        this.loginFormPhone.totalTime = Math.floor(60-inteval)
        this.countDown();
      }
    }
  },
  methods: {
    submitClickUser: function() {
      var _this = this
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          _this.loading = true;
          _this.$store.dispatch('user/login', this.loginForm).then(() => {
            _this.$message({
              message: '登录成功！',
              type: 'success'
            })
            _this.$router.push({path: this.redirect || '/'})
            _this.loading = false
          }).catch(() => {
            _this.loading = false
          })
        } else {
          return false
        }
      })
    },
    submitClickPhone: function() {
      var _this = this
      this.$refs.loginFormPhone.validate((valid) => {
        if (valid) {
          _this.loading = true;
          _this.$store.dispatch('user/login', this.loginFormPhone).then(() => {
            _this.$message({
              message: '登录成功！',
              type: 'success'
            })
            _this.$router.push({path: this.redirect || '/'})
            _this.loading = false
          }).catch(() => {
            _this.loading = false
          })
        } else {
          return false
        }
      })
    },
    changeSmsCode: function() {
      var _this = this
      this.$refs.loginFormPhone.validateField('mobile', (validMessage) => {
        if (validMessage == '') {
          getSms(this.loginFormPhone.mobile).then(resp=>{
            _this.loginFormPhone.buttonMessage = '获取成功'
            _this.$store.dispatch('settings/changeSetting',{key:'smsTime',value:new Date().getTime()})
            _this.loginFormPhone.canClick = true
            _this.countDown()
          })
        }
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    changeImageCode() {
      this.imageUrl = this.getImageCodeUrl()
    },
    getImageCodeUrl() {
      return imageUrl(this.loginForm.key, createUniqueString())
    },
    countDown() {
      if(!this.loginFormPhone.canClick) return
      this.loginFormPhone.buttonMessage = this.loginFormPhone.totalTime + 's后重新发送'
      let clock = window.setInterval(() => {
        this.loginFormPhone.totalTime--
        this.loginFormPhone.buttonMessage = this.loginFormPhone.totalTime + 's后重新发送'
        if (this.loginFormPhone.totalTime < 0) {
          window.clearInterval(clock)
          this.loginFormPhone.canClick = false
          this.loginFormPhone.buttonMessage = '重新发送验证码'
          this.loginFormPhone.totalTime = 60
          // this.loginFormPhone.canClick = true  //这里重新开启
        }
      },1000)
    }
  }
}
</script>

<!-- scoped : limit CSS to this componet only -->
<style scoped="scoped">
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

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
