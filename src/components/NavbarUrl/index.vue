<template>
  <div>
    <router-link to="/dashboard">
      <el-dropdown-item>
        主页
      </el-dropdown-item>
    </router-link>
    <router-link to="/personal/common/p-share">
      <el-dropdown-item>
        个人空间
      </el-dropdown-item>
    </router-link>
    <router-link to="/personal/common/info">
      <el-dropdown-item>
        账号设置
      </el-dropdown-item>
    </router-link>
  </div>
</template>

<script>
    export default {
        name: "NavbarUrl"
    }
</script>

<style scoped>

</style>
