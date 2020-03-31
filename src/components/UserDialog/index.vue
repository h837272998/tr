<template>
  <div style="background-color: #f4f7fe">
      <pan-thumb width="100px" height="100px" style="float: left"
        :image="avatar"></pan-thumb>
      <el-button size="mini" type="primary" style="float:right" @click="handleCommunicate">私信</el-button>
      <div style="float: left;padding-left: 10px">
        <el-link type="primary" style="font-weight: bold" target="_blank"
                 :href="`/resourceRegion/show-info/${username}`">
          {{username}}</el-link>
        <svg-icon icon-class="girl" style="color: pink;font-weight: bold" v-if="male===0"></svg-icon>
        <svg-icon icon-class="boy" style="color: blue" v-else></svg-icon>
        <el-tag size="mini" type="warning">{{type==='teacher'?'教师':'学生'}}</el-tag>
        </br>
        </br>
        <span>{{sub}}</span></br></br>
      </div>
      <span style="float: right;width: 60%;">—— {{signature}}</span>
  </div>
</template>
<script>
import PanThumb from "../PanThumb/index";
import SvgIcon from "../SvgIcon/index";
import {summaryInfo, putFriend} from "@/api/user";
import { getInfoCollege } from "@/api/college";

export default {
  components: {PanThumb,SvgIcon},
  props: {
    username: {
      type: String,
      default: '',
      require: true
    }
  },
  data() {
    return {
      cif: true,
      id: '',
      avatar: '',
      male: '',
      type: '',
      sub: '',
      signature: ''
    }
  },
  created() {
    // console.info('userDialog',this.username)
    if (this.username) {
      summaryInfo(this.username).then(resp => {
        this.id = resp.data.id
        this.avatar = resp.data.avatar
        this.username = resp.data.username
        this.male = resp.data.male
        this.type = resp.data.type
        this.signature = resp.data.signature
        getInfoCollege(this.username).then(resp1 => {
          this.sub = resp1.data
          this.cif = false
        });

      });
    }
  },
  methods: {
    handleCommunicate() {
      if (this.username === this.$store.getters.username) {
        return
      }
      putFriend(this.username).then(resp => {
        if (resp) {
          const avatar =encodeURIComponent(this.avatar)
          console.info(avatar)
          const routeUrl = this.$router.resolve({
            path: `/personal/operate/char?username=${this.username}&avatar=${avatar}&id=${this.id}`,
          })
          window.open(routeUrl .href, '_blank')
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
