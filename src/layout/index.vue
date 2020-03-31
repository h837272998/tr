<template>
  <div :class="classObj" class="app-wrapper">
<!--    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />-->
<!--    <sidebar class="sidebar-container" />-->
    <div class="main-container">
      <div >
        <navbar :class="{'fixed-header':true}"/>
        <div v-show="gene" class="image-header-container">
          <el-image src="/image/zhku_header.png"></el-image>
        </div>
        <topbar></topbar>
        <breadcrumb  class="breadcrumb-container"></breadcrumb>
      </div >

      <app-main/>

    </div>
    <el-tooltip placement="top" content="顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="5"
                   transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import { Navbar, Topbar, AppMain } from './components'
import Breadcrumb from '@/components/Breadcrumb'
import ResizeMixin from './mixin/ResizeHandler'
import BackToTop from '@/components/BackToTop'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Topbar,
    Breadcrumb,
    AppMain,
    BackToTop
  },
  mixins: [ResizeMixin],
  data() {
    return {
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1',// 按钮的背景颜色 The background color of the button
      }
    }
  },
  computed: {
    topbar() {
      return this.$store.state.app.topbar
    },
    gene() {
      console.info(this.$route.meta.top)
      return this.$route.meta.top?false: true
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        withoutAnimation: this.topbar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    // handleClickOutside() {
    //   this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    // }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: relative;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100%);
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .image-header-container {
    height: 65px;
    /*line-height: 65px;*/
    /*overflow: hidden;*/
    position: static;
    background: #fff;
    margin: 20px 0 10px 8em;
    /*box-shadow: 0 1px 4px rgba(0,21,41,.08);*/
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .breadcrumb-container {
    float: left;
    width: 100%;
    height: 2em;
    /*height: 20px;*/
    /*line-height: 20px;*/
    padding-left: 1em;
  }
</style>
