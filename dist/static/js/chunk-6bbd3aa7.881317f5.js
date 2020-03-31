(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6bbd3aa7"],{9536:function(e,o,t){"use strict";var i=t("f0f7"),n=t.n(i);n.a},"9ed6":function(e,o,t){"use strict";t.r(o);var i=function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("el-tabs",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"login-container",attrs:{"label-position":"left","label-width":"0px",type:"card"},on:{"tab-click":e.handleClick},model:{value:e.activeName,callback:function(o){e.activeName=o},expression:"activeName"}},[t("el-tab-pane",{attrs:{label:"账号登录",name:"first"}},[t("el-row",[t("el-col",[e._v(" ")])],1),e._v(" "),t("el-form",{ref:"loginForm",attrs:{model:e.loginForm,rules:e.rules}},[t("el-form-item",{attrs:{prop:"username"}},[t("el-input",{attrs:{type:"text","auto-complete":"off",placeholder:"账号"},model:{value:e.loginForm.username,callback:function(o){e.$set(e.loginForm,"username",o)},expression:"loginForm.username"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"password"}},[t("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"密码"},model:{value:e.loginForm.password,callback:function(o){e.$set(e.loginForm,"password",o)},expression:"loginForm.password"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"imageCode"}},[t("el-row",[t("el-col",{attrs:{span:11}},[t("el-input",{attrs:{type:"imageCode","auto-complete":"off",placeholder:"验证码"},model:{value:e.loginForm.imageCode,callback:function(o){e.$set(e.loginForm,"imageCode",o)},expression:"loginForm.imageCode"}})],1),e._v(" "),t("el-col",{staticClass:"line",attrs:{span:2}},[e._v(" ")]),e._v(" "),t("el-col",{attrs:{span:11}},[t("div",[t("img",{staticStyle:{width:"100px"},attrs:{src:e.imageUrl},on:{click:e.changeImageCode}})])])],1)],1),e._v(" "),t("el-checkbox",{staticClass:"login_remember",attrs:{"label-position":"left"},model:{value:e.loginForm.checked,callback:function(o){e.$set(e.loginForm,"checked",o)},expression:"loginForm.checked"}},[e._v("记住密码\n      ")]),e._v(" "),t("el-form-item",{staticStyle:{width:"100%"}},[t("el-button",{staticStyle:{width:"100%"},attrs:{type:"primary"},on:{click:e.submitClickUser}},[e._v("登录")])],1)],1)],1),e._v(" "),t("el-tab-pane",{attrs:{label:"手机登录",name:"second"}},[t("el-form",{ref:"loginFormPhone",attrs:{model:e.loginFormPhone,rules:e.rules}},[t("el-row",[t("el-col",[e._v(" ")])],1),e._v(" "),t("el-form-item",{attrs:{prop:"mobile"}},[t("el-input",{attrs:{type:"text","auto-complete":"off",placeholder:"手机号"},model:{value:e.loginFormPhone.mobile,callback:function(o){e.$set(e.loginFormPhone,"mobile",o)},expression:"loginFormPhone.mobile"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"smsCode"}},[t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:14}},[t("el-input",{attrs:{type:"text","auto-complete":"off",placeholder:"验证码"},model:{value:e.loginFormPhone.smsCode,callback:function(o){e.$set(e.loginFormPhone,"smsCode",o)},expression:"loginFormPhone.smsCode"}})],1),e._v(" "),t("el-col",{attrs:{span:8}},[t("el-button",{attrs:{disabled:e.loginFormPhone.canClick},on:{click:e.changeSmsCode}},[e._v(e._s(e.loginFormPhone.buttonMessage))])],1)],1)],1),e._v(" "),t("el-checkbox",{staticClass:"login_remember",attrs:{"label-position":"left"},model:{value:e.loginFormPhone.checked,callback:function(o){e.$set(e.loginFormPhone,"checked",o)},expression:"loginFormPhone.checked"}},[e._v("记住密码\n      ")]),e._v(" "),t("el-form-item",{staticStyle:{width:"100%"}},[t("el-button",{staticStyle:{width:"100%"},attrs:{type:"primary"},on:{click:e.submitClickPhone}},[e._v("登录")])],1)],1)],1),e._v(" "),t("el-link",{attrs:{href:"/register"}},[e._v("\n    没有账号？\n  ")]),e._v(" "),t("el-link",{staticStyle:{float:"right"},attrs:{href:"/forget"}},[e._v("\n    忘记密码？\n  ")])],1)},n=[],l=t("c24f"),r=t("ed08"),a={name:"Login",data:function(){var e=Object(r["a"])();return{rules:{username:[{required:!0,message:"请输入用户名！",trigger:"blur"}],password:[{required:!0,message:"请输入密码！",trigger:"blur"}],imageCode:[{required:!0,message:"请输入验证码！",trigger:"blur"}],mobile:[{required:!0,message:"请输入手机号！",trigger:"blur"},{pattern:/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,message:"请输入正确的手机号码",trigger:["blur","change"]}],smsCode:[{required:!0,message:"请输入验证码！",trigger:"blur"}]},checked:!0,loginForm:{username:"admin",password:"123456",checked:!1,key:e,imageCode:"9999"},loginFormPhone:{mobile:15815817806,smsCode:"",checked:!1,buttonMessage:"获取验证码",canClick:!1,totalTime:60},imageUrl:"/api/auth/code/image",loading:!1,activeName:"first"}},watch:{$route:{handler:function(e){this.redirect=e.query&&e.query.redirect},immediate:!0}},created:function(){this.changeImageCode();var e=this.$store.getters.smsTime;if(e){var o=((new Date).getTime()-e)/1e3;o<60&&(this.loginFormPhone.canClick=!0,this.loginFormPhone.totalTime=Math.floor(60-o),this.countDown())}},methods:{submitClickUser:function(){var e=this,o=this;this.$refs.loginForm.validate((function(t){if(!t)return!1;o.loading=!0,o.$store.dispatch("user/login",e.loginForm).then((function(){o.$message({message:"登录成功！",type:"success"}),o.$router.push({path:e.redirect||"/"}),o.loading=!1})).catch((function(){o.loading=!1}))}))},submitClickPhone:function(){var e=this,o=this;this.$refs.loginFormPhone.validate((function(t){if(!t)return!1;o.loading=!0,o.$store.dispatch("user/login",e.loginFormPhone).then((function(){o.$message({message:"登录成功！",type:"success"}),o.$router.push({path:e.redirect||"/"}),o.loading=!1})).catch((function(){o.loading=!1}))}))},changeSmsCode:function(){var e=this,o=this;this.$refs.loginFormPhone.validateField("mobile",(function(t){""==t&&Object(l["j"])(e.loginFormPhone.mobile).then((function(e){o.loginFormPhone.buttonMessage="获取成功",o.$store.dispatch("settings/changeSetting",{key:"smsTime",value:(new Date).getTime()}),o.loginFormPhone.canClick=!0,o.countDown()}))}))},handleClick:function(e,o){},changeImageCode:function(){this.imageUrl=this.getImageCodeUrl()},getImageCodeUrl:function(){return Object(l["l"])(this.loginForm.key,Object(r["a"])())},countDown:function(){var e=this;if(this.loginFormPhone.canClick){this.loginFormPhone.buttonMessage=this.loginFormPhone.totalTime+"s后重新发送";var o=window.setInterval((function(){e.loginFormPhone.totalTime--,e.loginFormPhone.buttonMessage=e.loginFormPhone.totalTime+"s后重新发送",e.loginFormPhone.totalTime<0&&(window.clearInterval(o),e.loginFormPhone.canClick=!1,e.loginFormPhone.buttonMessage="重新发送验证码",e.loginFormPhone.totalTime=60)}),1e3)}}}},s=a,c=(t("9536"),t("2877")),m=Object(c["a"])(s,i,n,!1,null,"e96f2768",null);o["default"]=m.exports},f0f7:function(e,o,t){}}]);