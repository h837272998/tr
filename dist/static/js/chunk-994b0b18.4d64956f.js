(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-994b0b18"],{"121b":function(e,t,o){"use strict";var a=o("96cfc"),s=o.n(a);s.a},"20c1":function(e,t,o){"use strict";o.r(t);var a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"login-container"},[o("el-row",[o("el-col",{attrs:{offset:1}},[o("Mallki",{staticStyle:{"font-size":"18px"},attrs:{text:"忘记密码"}})],1)],1),e._v(" "),o("br"),e._v(" "),o("br"),e._v(" "),o("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"rform",staticClass:"container",attrs:{model:e.rform,"status-icon":"",rules:e.rules,"label-position":"right","label-width":"70px"}},[o("el-form-item",{attrs:{prop:"password",label:"新密码"}},[o("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"请输入密码","show-password":""},model:{value:e.rform.password,callback:function(t){e.$set(e.rform,"password",t)},expression:"rform.password"}})],1),e._v(" "),o("el-form-item",{attrs:{prop:"mobile",label:"手机号"}},[o("el-input",{attrs:{type:"text","auto-complete":"off",placeholder:"请输入手机号"},model:{value:e.rform.mobile,callback:function(t){e.$set(e.rform,"mobile",t)},expression:"rform.mobile"}})],1),e._v(" "),o("el-form-item",{attrs:{prop:"validcode",label:"验证码"}},[o("el-col",{attrs:{span:11}},[o("el-input",{attrs:{type:"text","auto-complete":"off",placeholder:"请输入验证码"},model:{value:e.rform.validcode,callback:function(t){e.$set(e.rform,"validcode",t)},expression:"rform.validcode"}})],1),e._v(" "),o("el-col",{attrs:{span:6,offset:4}},[o("el-button",{attrs:{type:"primary",disabled:e.canClick},on:{click:e.getCode}},[e._v("\n          "+e._s(e.buttonMessage)+"\n        ")])],1)],1),e._v(" "),o("el-form-item",{staticStyle:{"margin-top":"20px"}},[o("el-button",{attrs:{type:"success"},on:{click:e.submit}},[e._v("提交")])],1)],1)],1)},s=[],r=o("137c"),i=o("c24f"),l={name:"Index",components:{Mallki:r["a"]},data:function(){return{rform:{password:"",mobile:"",validcode:""},canClick:!1,totalTime:60,buttonMessage:"获取验证码",rules:{password:[{required:!0,message:"密码不能为空！",trigger:"blur"},{pattern:/^[a-zA-Z]([-_a-zA-Z0-9]{5,17})$/,message:"以字母开头，长度在6-18之间， 只能包含字符、数字和下划线",trigger:"blur"}],mobile:[{required:!0,message:"手机号不能为空！",trigger:"blur"},{pattern:/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,message:"请输入正确的手机号码!",trigger:["blur","change"]}],validcode:[{required:!0,message:"验证码不能为空！",trigger:"blur"}]},loading:!1}},created:function(){var e=this.$store.getters.smsTime;if(e){var t=((new Date).getTime()-e)/1e3;t<60&&(this.canClick=!0,this.totalTime=Math.floor(60-t),this.countDown())}},methods:{getCode:function(){var e=this,t=this;t.$refs.rform.validateField("mobile",(function(o){""==o&&Object(i["j"])(e.rform.mobile).then((function(e){t.buttonMessage="获取成功",t.$store.dispatch("settings/changeSetting",{key:"smsTime",value:(new Date).getTime()}),t.canClick=!0,t.countDown()}))}))},submit:function(){var e=this;this.$refs.rform.validate((function(t){t&&(e.loading=!0,Object(i["d"])(e.rform).then((function(t){t&&t.data>=1&&(e.$message({type:"success",message:"修改密码成功！"}),e.loading=!1);var o=e;setTimeout((function(){o.$router.push({path:"/login"})}),2e3)})).catch((function(t){e.$message({type:"success",message:"修改失败，请重试！"}),e.loading=!1})))}))},countDown:function(){var e=this;if(this.canClick){this.buttonMessage=this.totalTime+"s后重新发送";var t=window.setInterval((function(){e.totalTime--,e.buttonMessage=e.totalTime+"s后重新发送",e.totalTime<0&&(window.clearInterval(t),e.canClick=!1,e.buttonMessage="获取验证码",e.totalTime=60)}),1e3)}}}},n=l,c=(o("121b"),o("2877")),m=Object(c["a"])(n,a,s,!1,null,"1ec0405f",null);t["default"]=m.exports},"96cfc":function(e,t,o){}}]);