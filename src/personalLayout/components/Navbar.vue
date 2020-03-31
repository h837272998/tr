<template>
  <div class="navbar">
    <hamburger :is-active="personalSidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <lock-and-unlock :is-active="personalNavbar.opened" class="hamburger-container"
                     @toggleClick="toggleLockTop"></lock-and-unlock>
    <mallki class-name="mallki-text" text="个 人 空 间" style="line-height: 45px;padding-left: 10px"></mallki>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <navbar-url/>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">注销登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="right-menu">
      <el-dropdown trigger="hover">
        <div>
          <el-badge :value="notifyNumber[0]+notifyNumber[1]+($store.state.char.nfDot?1:0)" type="primary"
                    style="margin-right: 30px" >
            <i class="el-icon-message-solid notify-class" style="margin: -10px 2px -10px -10px"></i>
          </el-badge>
        </div>
        <el-dropdown-menu slot="dropdown" >
          <router-link to="/personal/common/discussion">
            <el-dropdown-item v-if="notifyNumber[0]">
             我的评论有未读通知：{{notifyNumber[0]}}
            </el-dropdown-item>
          </router-link>
          <router-link to="/personal/common/participation">
            <el-dropdown-item v-if="notifyNumber[1]">
              我的参与有未读通知：{{notifyNumber[1]}}
            </el-dropdown-item>
          </router-link>
          <router-link to="/personal/operate/char">
              <el-dropdown-item v-if="$store.state.char.nfDot||notifyNumber[2]" >
                有未读私信
              </el-dropdown-item>
          </router-link>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
<!--    <i class="el-icon-message-solid notify-class"></i>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Mallki from "@/components/TextHoverEffect/Mallki"
import TagsView from "./TagsView"
import LockAndUnlock from '@/components/LockAndUnlock'
import NavbarUrl from "../../components/NavbarUrl/index";
import {notify} from '@/api/article'

export default {
  components: {
    NavbarUrl,
    Breadcrumb,
    Hamburger,
    Mallki,
    TagsView,
    LockAndUnlock
  },
  computed: {
    ...mapGetters([
      'personalSidebar',
      'personalNavbar',
      'avatar'
    ])
  },
  data() {
    return {
      isLock: false,
      notifyNumber: []
    }
  },
  created() {
    this.getNotifyNumber()
    var interval = setInterval(this.getNotifyNumber, 60*1000);
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/togglePersonalSideBar')
    },
    toggleLockTop() {
      // this.isLock = !this.isLock
      this.$store.dispatch('app/togglePersonalNavbar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    getNotifyNumber() {
      notify().then(resp => {
        this.notifyNumber = resp.data
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -15px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .notify-class {
    line-height: 50px;
    height: 100%;
    float: right;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    /*margin-right: 20px;*/
    color: #55C6BD;
  }
}
</style>
