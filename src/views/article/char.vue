<template>
  <div>
    <el-container style="margin-top: 30px">
      <el-aside width="160px">
        <div
          v-for="(hr,index) in hrs"
          :key="hr.id"
          class="friendListDiv"
          :class="{currentChatFriend:currentFriend.id==hr.id}"
          @click="toggleFriend(hr)"
        >
          <img :src="hr.avatar" class="userfaceImg">
          <el-badge
            :is-dot="isDotMap.get('isDot#'+currentUsername+'#'+hr.username)!=null"
          >
            {{ hr.username }}</el-badge>
        </div>
        <div style="background-color: #20a0ff;height: 1px;width: 160px;" />
      </el-aside>
      <el-main style="padding-top: 0px;padding-bottom: 0px;">
        <div id="chatDiv" ref="chatDiv" class="chatDiv" style="background-color: #F5F5F5;">
          <p v-show="currentFriend.username" style="text-align: center;">与
            <el-tag type="primary" size="small" style="margin-left: 5px;margin-right: 5px">{{ currentFriend.username }}
            </el-tag>
            聊天中
          </p>
          <template v-for="msg in msgList">
            <!--发送来的消息-->
            <div
              v-if="msg.from==currentFriend.username"
              style="display: flex;justify-content: flex-start;align-items: center ;box-sizing: border-box;
              flex-wrap: wrap;padding-bottom: 8px"
            >
              <img :src="currentFriend.avatar" class="userfaceImg" style="border-radius: 10px;">
              <div
                style="background-color: #FFFFFF;display: inline-flex;border-style: solid;border-width: 1px;
                border-color: #f1f1f1;border-radius: 4px;padding: 5px 8px 5px 8px;max-width: 400px;word-break:break-all"
              >
                {{ msg.msg }}
                <!--                <span v-html="msg.msg"></span>-->
              </div>
            </div>
            <!--发出去的消息-->
            <div
              v-if="msg.from!=currentFriend.username"
              style="display: flex;justify-content: flex-end;
              align-items: center;box-sizing: border-box;padding-bottom: 8px;"
            >
              <!--              display: inline-flex;-->
              <div
                style="display: inline-flex;border-style: solid;border-width: 1px;border-color: #f1f1f1;
                border-radius: 5px;padding: 5px 8px 5px 8px;margin-right: 3px;background-color: #9eea6a;
                max-width: 400px;word-break:break-all"
              >
                {{ msg.msg }}
                <!--                <span v-html="msg.msg"></span>-->
              </div>
              <img :src="currentAvatar" class="userfaceImg" style="border-radius: 10px;">
            </div>
          </template>
        </div>
        <div style="text-align: left;margin-top: 10px">
          <el-input
            v-model="msg"
            placeholder="请输入内容"
            size="mini"
            style="width: 600px;"
            type="textarea"
            autosize
          />
          <el-button :disabled="!currentFriend.id" size="small" type="primary" class="sendBtn" @click="sendMsg"><i
            class="fa fa-send"
            style="margin-right: 15px"
          />发送
          </el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getFriend, pullUnreadMessage } from '@/api/user'
import FaceInput from '@/components/FaceInput1/Comment'
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { FaceInput },
  data() {
    return {
      hrs: [],
      msg: '',
      // msgList: [],
      currentUsername: this.$store.getters.username,
      currentAvatar: this.$store.getters.avatar,
      currentFriend: {
        id: '',
        username: '',
        avatar: ''
      }
    }
  },
  computed: {
    msgList: {
      get: function() {
        return this.$store.state.char.msgList
      }
    },
    isDotMap: {
      get: function() {
        return this.$store.state.char.isDotMap
      }
    }
  },
  watch: {
    msgList() {
      document.getElementById('chatDiv').scrollTop = document.getElementById('chatDiv').scrollHeight
    }
  },
  mounted: function() {
    this.currentFriend.id = this.$route.query && this.$route.query.id
    this.currentFriend.username = this.$route.query && this.$route.query.username
    this.currentFriend.avatar = this.$route.query && this.$route.query.avatar
    this.loadHrs()
    this.updateChatDiv()
  },
  methods: {
    sendMsg() {
      var key = this.$store.getters.username + '#' + this.currentFriend.username
      console.info('当前key', key)
      var oldMsg = window.localStorage.getItem(key)
      console.info({ msg: this.msg, from: this.$store.state.user.username })
      if (oldMsg == null) {
        oldMsg = []
        oldMsg.push({ msg: this.msg, from: this.$store.state.user.username })
        window.localStorage.setItem(key, JSON.stringify(oldMsg))
      } else {
        var oldMsgJson = JSON.parse(oldMsg)
        oldMsgJson.push({ msg: this.msg, from: this.$store.getters.username })
        window.localStorage.setItem(key, JSON.stringify(oldMsgJson))
      }
      // console.info(this.$store.getters)?access_token=${token}
      this.$store.state.char.stomp.send(`/ws/chat`, {}, this.msg + ';' + this.currentFriend.username)
      this.msg = ''
      this.updateChatDiv()
    },
    updateChatDiv() {
      var oldMsg = window.localStorage.getItem(this.$store.getters.username + '#' + this.currentFriend.username)
      if (oldMsg == null) {
        this.$store.commit('char/updateMsgList', [])
      } else {
        this.$store.commit('char/updateMsgList', JSON.parse(oldMsg))
      }
    },
    toggleFriend(hr) {
      if (hr === this.currentFriend) {
        return
      }
      this.currentFriend = hr
      this.$store.commit('char/updateCurrentFriend', hr)
      this.updateChatDiv()
      this.$store.commit('char/removeValueDotMap', 'isDot#' + this.currentUsername + '#' + hr.username)
      this.$refs.chatDiv.scrollTop = this.$refs.chatDiv.scrollHeight
    },
    loadHrs() {
      var _this = this
      _this.hrs = []
      getFriend().then(resp => {
        this.hrs = resp.data
      })
      this.$store.dispatch('char/content')
      pullUnreadMessage().then(resp => {
        if (resp.data != null) {
          resp.data.map(row => {
            console.info(row)
            var key = this.$store.getters.username + '#' + row.from
            var oldMsg = window.localStorage.getItem(key)
            if (oldMsg == null) {
              oldMsg = []
              oldMsg.push(row)
              window.localStorage.setItem(key, JSON.stringify(oldMsg))
            } else {
              var oldMsgJson = JSON.parse(oldMsg)
              oldMsgJson.push(row)
              window.localStorage.setItem(key, JSON.stringify(oldMsgJson))
            }
            if (row.from != this.currentFriend.username) {
              this.$store.commit('char/addValue2DotMap', 'isDot#' + this.currentUsername + '#' + row.from)
            }
          })
          this.updateChatDiv()
        }
      })
      this.$store.commit('char/toggleNFDot', false)
    }
  }
}
</script>
<style lang="scss" >
  .userfaceImg {
    width: 37px;
    height: 37px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .friendListDiv {
    display: flex;
    justify-content: flex-start;
    padding-left: 20px;
    box-sizing: border-box;
    align-items: center;
    width: 160px;
    height: 40px;
    /*border-color: #86b0ed;*/
    /*border-left-style: solid;*/
    /*border-top-style: solid;*/
    /*border-right-style: solid;*/
    /*border-width: 1px;*/
    /*cursor: pointer;*/
    /*border-radius: 4px;*/
  }

  .chatDiv {
    /*border-color: #20a0ff;*/
    border-style: solid;
    border-radius: 5px;
    border-width: 1px;
    box-sizing: border-box;
    width: 700px;
    height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
    /*overflow-wrap: break-word;*/
    word-wrap: break-word;
    padding-bottom: 50px;
  }

  .sendBtn {
    padding-left: 25px;
    padding-right: 25px
  }

  .currentChatFriend {
    background-color: #dcdfe6;
  }
</style>
