<template>
  <div v-if="cif">
    <h2 style="padding-left: 20px">
      Hi, {{username}}
    </h2>

    <div class="info-container border-tr">
      <pan-thumb :image="form.avatar" style="width: 100px;height: 100px"/>
      <el-button @click="imagecropperShow=true" type="primary" icon="el-icon-upload" style="bottom: 15px;margin-left:
      40px;" size="mini">
        更换头像
      </el-button>

      <el-button size="mini" type="primary" @click="openUrl">外部url</el-button>

      <el-form ref="form" :model="form" label-width="80px" v-loading="formLoading" style="padding-top: 30px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-link disabled>{{form.type | formatRole}}</el-link>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-switch v-model="form.male"></el-switch>
          <el-link>{{form.male?'男':'女'}}</el-link>
        </el-form-item>
        <el-form-item label="手机号">
          <el-col :span="16">
            <el-input disabled v-model="form.mobile"></el-input>
<!--            {{form.mobile | formatMobile}}-->
          </el-col>
          <el-col :offset="2" :span="6">
            <el-link type="primary" style="font-size: 12px" @click="dialogVisible=true">更换手机号?</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="form.age"></el-input-number>
        </el-form-item>

        <el-form-item label="归属:" prop="subValue">
          <span style="margin-right: 20px">{{subText}}</span>
          <el-link style="font-size: 12px" @click="changSub=!changSub" type="primary">更改？</el-link>
          <el-row v-if="changSub">
            <el-cascader v-model="form.sub" :options="subOptions" style="width: 50%" :props="subProps"
                         filterable
                         clearable />
          </el-row>
        </el-form-item>
        <el-form-item label="个性签名">
        <el-input v-model="form.signature"></el-input>
      </el-form-item>
        <el-form-item label="介绍">
          <el-input type="textarea" v-model="form.introduction"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-loading="buttonLoading" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="/api/f/files/upload-v1"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />

    <el-dialog title="更换手机号" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form label-width="80px" status-icon :model="dialogData" :rules="rules" ref="dialogForm">
        <el-form-item prop="mobile" label="手机号">
          <el-col :span="14">
            <el-input type="text" v-model="form.mobile"
                      auto-complete="off" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dialogData.next" prop="newMobile" label="新手机号">
          <el-col :span="14">
            <el-input type="text" v-model="dialogData.newMobile"
                      auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="validcode" label="验证码">
          <el-col :span="6">
            <el-input type="text" v-model="dialogData.validcode"
                      auto-complete="off" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button type="primary" @click="getCode" :disabled="dialogData.canClick">
              {{dialogData.buttonMessage}}
            </el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :offset="20">
            <el-button type="primary" @click="nextStep(dialogData.next)">{{dialogData.next?'提交':'下一步'}}</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb/index'
import { isEmpty,formatMobile} from "@/utils";
import { mapGetters } from 'vuex'
import {updateAvatar, getInfoV1, updateSysUser,getSms,changeMobileFirst,changeMobileNext,checkUsernameOrPhone} from '@/api/user';
import {getMajorByCollege,college} from '@/api/college'
import SmsButton from '@/components/SmsButton'
export default {
  name: 'Info',
  components: { PanThumb, ImageCropper },
  computed: {
    ...mapGetters([
      'avatar',
      'username'
    ])
  },
  filters: {
    formatMobile,
    formatRole(role) {
      const map = {
        student: '学生',
        teacher: '教师'
      }
      return map[role]
    }
  },
  data(){
    var validatePhone = (rule, value, callback) => {
      checkUsernameOrPhone('mobile', value).then(resp => {
        if (resp.data === false) {
          callback(new Error("手机号已被使用！"))
        } else if (resp.data === true) {
          callback();
        } else {
          callback(new Error('服务器错误！'))
        }
      });
    };
    var _this = this
    return {
      cif: false,
      image: this.$store.getters.avatar,
      imagecropperShow: false,
      imagecropperKey: 0,
      changSub: false,
      form: {
        id: '',
        username: '',
        realName: '',
        avatar: '',
        type: false,
        mobile: '' | formatMobile,
        male: '',
        signature: '',
        introduction: '',
        age: '',
        sub: [],
      },
      subText: '',
      subOptions: [],
      subProps: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const {level, data} = node
          if (level === 1) {
            getMajorByCollege(data.value).then(resp => {
              if (resp.data) {
                const list = resp.data.map(row => {
                  return {label: row.majorName, value: row.id, leaf: level >= 1}
                })
                resolve(list)
              } else {
                resolve(false)
              }
            });
          }
        }
      },
      buttonLoading: false,
      formLoading: false,
      dialogVisible: false,
      dialogData: {
        validcode: '',
        canClick: false,
        buttonMessage: '获得验证码',
        next: false,
        newMobile: '',
        totalTime: 60
      },
      rules: {
        newMobile: [
          {required: true, message: '手机号不能为空！', trigger: 'blur'},
          {
            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: '请输入正确的手机号码!', trigger: ['blur', 'change']
          },
          {validator: validatePhone, trigger: 'blur'}
        ],
        validcode: [
          {required: true, message: '验证码不能为空！', trigger: 'blur'},
        ]
      },
    }
  },
  created() {
    var _this = this
    var data = ''
    new Promise((resolve, reject) => {
      getInfoV1().then(resp => {
        this.form = resp.data
        this.form.sub = []
        this.form.male = (!isEmpty(this.form.male) && this.form.male === 1) ? true : false
        data = resp.data;
      }).then(() => {
        college().then(resp => {
          if (resp.data) {
            this.subOptions = resp.data.map(row => {
              return {value: row.id, label: row.collegeName}
            })
            this.form.sub.push(data.sub1)
            this.subOptions.map(item =>{
              if (item.value === data.sub1) {
                this.subText = item.label;
              }
            })
          }
        })
      }).then(resp => {
        if (!isEmpty(data.sub2)) {
          this.form.sub.push(data.sub2);
          getMajorByCollege(data.sub1).then(resp1 => {
            resp1.data.map(row => {
              if (row.id === data.sub2) {
                this.subText += '/' + row.majorName
              }
            })
            resolve(true);
          });
        } else {
          resolve(true);
        }
      });
    }).then(result => {
      this.cif = true;
      if (result) {
      }
    });
  },
  methods: {
    cropSuccess(resData) {
      console.info('上传头像响应结果： ',resData)
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      if (!isEmpty(resData.url)) {
        this.form.avatar = '/api/f/files/image/'+resData.url;
      }else if (!isEmpty(resData.data.url)) {
        this.form.avatar = '/api/f/files/image/'+resData.data.url;
      }
      if (!isEmpty(this.form.avatar)) {
        updateAvatar(this.form.avatar).then(resp=>{
          if (resp.data) {
            this.$notify({
              type: 'success',
              title: '更新头像成功！'
            })
          }
        })
      }
    },
    generateOptions() {
      college().then(resp => {
        if (resp.data) {
          this.subOptions = resp.data.map(row => {
            return { value: row.id, label: row.collegeName }
          })
        }
      })
    },
    close() {
      this.imagecropperShow = false
    },
    openUrl() {
      this.$prompt('输入外部url','输入内容！',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,
        inputErrorMessage: 'URL格式不正确'
      }).then(({value}) => {
        if (!isEmpty(value)) {
          updateAvatar(value).then(resp=>{
            if (resp.data) {
              this.$notify({
                type: 'success',
                title: '更新头像成功！'
              })
              this.image = value
            }
          })
        }
      });
    },
    onSubmit() {
      this.buttonLoading = true
      var query = this.form
      query.male = this.form.male?1:0
      query.sub1 = this.form.sub[0]
      query.sub2 = this.form.sub[1]
      updateSysUser(query).then(resp => {
        if (resp.data) {
          this.$notify({
            type: 'success',
            title: '操作成功！'
          });
        } else {
          this.$nofigy({
            type: 'success',
            title: '操作失败！'
          });
        }
        this.buttonLoading = false
      });
    },
    nextStep(submit) {
      if (submit) {
        this.$refs.dialogForm.validate((msg) => {
          if (msg) {
            changeMobileNext(this.dialogData.newMobile, this.form.mobile, this.dialogData.validcode).then(resp => {
              if (resp.code===200) {
                this.$notify({
                  type: 'success',
                  title: '修改成功！请重新登录！'
                });
                var _this = this;
                setTimeout(() => {
                  _this.$store.dispatch('user/logout')
                  _this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                }, 2000);
              } else {
                this.$notify({
                  type: 'error',
                  title: resp.msg
                });
              }
            }).catch(err=>{
              this.$notify({
                type: 'error',
                title: err
              })
            });
          }
        });
      } else {
        this.$refs.dialogForm.validateField('validcode', (vmsg) => {
          if (vmsg === '') {
            changeMobileFirst(this.form.mobile, this.dialogData.validcode).then(resp => {
              if (resp.data) {
                this.dialogData.next = true
                this.$store.dispatch('settings/changeSetting', {key: 'smsTime', value: 0})
                this.dialogData.totalTime = -1
                this.dialogData.validcode = ''
              } else {
                this.notify({
                  type: 'error',
                  message: '手机号不匹配，系统异常！'
                })
              }
            });
          }
        })
      }
    },
    getCode() {
      var _this = this
      getSms(this.form.mobile).then(resp=>{
        _this.dialogData.buttonMessage = '获取成功'
        _this.$store.dispatch('settings/changeSetting',{key:'smsTime',value:new Date().getTime()})
        _this.dialogData.canClick = true
        _this.countDown()
      })
    },
    countDown() {
      if(!this.dialogData.canClick) return
      this.dialogData.buttonMessage = this.dialogData.totalTime + 's后重新发送'
      let clock = window.setInterval(() => {
        this.dialogData.totalTime--
        this.dialogData.buttonMessage = this.dialogData.totalTime + 's后重新发送'
        if (this.dialogData.totalTime < 0) {
          window.clearInterval(clock)
          this.dialogData.canClick = false
          this.dialogData.buttonMessage = '获取验证码'
          this.dialogData.totalTime = 60
        }
      },1000)
    },
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
