<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&personalSidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <navbar :class="{'fixed-header':personalNavbar.opened}" />
    <div :class="{hasTagsView:true}" class="main-container-personal" style="padding-left: 10px">
      <div>
        <tags-view :style="{ 'margin-top': (personalNavbar.opened?'55px':'5px')}" />
      </div>
      <personal-sidebar class="sidebar-container-personal" style="margin-top:80px" />
      <app-main />
<!--      <el- -->
      <el-tooltip placement="top" content="顶部">
        <back-to-top
          :custom-style="myBackToTopStyle"
          :visibility-height="300"
          :back-position="5"
          transition-name="fade"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, PersonalSidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import BackToTop from '@/components/BackToTop'

export default {
  name: 'PersonalLayout',
  components: {
    AppMain,
    Navbar,
    PersonalSidebar,
    TagsView,
    BackToTop
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      personalSidebar: state => state.app.personalSidebar,
      device: state => state.app.device,
      personalNavbar: state => state.app.personalNavbar
    }),
    classObj() {
      return {
        hideSidebar: !this.personalSidebar.opened,
        openSidebar: this.personalSidebar.opened,
        withoutAnimation: this.personalSidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  data() {
    return {
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closePersonalSideBar', { withoutAnimation: false })
    }
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

    &.mobile.openSidebar {
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
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 0px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
