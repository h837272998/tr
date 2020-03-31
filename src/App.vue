<template>
  <div>
    <div id="app">
      <router-view />
      <!-- 将上传组件全局注册 -->
    </div>

    <div><global-uploader/></div>
  </div>
</template>

<script>

  import GlobalUploader from "@/components/TrGlobalUploader"

  export default {
    name: 'App',
    components: {
      GlobalUploader,
    },
  }
</script>
