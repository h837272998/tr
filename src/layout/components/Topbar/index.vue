<template>
  <div>
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      :default-active="activeMenu"
      :background-color="variables.topBarBg"
      :text-color="variables.topBarText"
      :unique-opened="false"
      :collapse-transition="false"
      :active-text-color="variables.topBarActiveText">
      <topbar-item v-for="(route,index) in routes" :style="{'margin-left':route.path=='/'?'5em':''}" :key="route.path"
                   :item="route"
                   :base-path="route.path" />

    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopbarItem from './TopbarItem'
import variables from '@/styles/variables.scss'

export default {
  name: 'Topbar',
  components: { TopbarItem },
  computed: {
    ...mapGetters([
      'topbar'
    ]),
    routes() {
      // return this.$router.options.routes
      let menuRoutes =  this.$router.options.routes.filter(item => {
        if (item.component && item.component.name == 'Layout') {
          return item
        }
      });
      return menuRoutes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
  }
}
</script>

<style scoped>

</style>
