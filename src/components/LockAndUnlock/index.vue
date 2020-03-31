<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <span v-if="isActive" class="el-icon-lock lockAndUnlock"></span>
    <span v-else class="el-icon-unlock lockAndUnlock"></span>
  </div>
</template>

<script>
  export default {
    name: 'LockAndUnlock',
    props: {
      isActive: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toggleClick() {
        this.$emit('toggleClick')
      }
    }
  }
</script>

<style scoped>
  .lockAndUnlock {
    display: inline-block;
    vertical-align: middle;
    color: #212121;
    font-weight: bold;
    width: 20px;
    height: 20px;
  }

</style>
