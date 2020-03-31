<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      权限：{{ !logged?'公开':'登录可看' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="logged" style="padding: 10px;">
          <el-radio :label="true">
            登录可看
          </el-radio>
          <el-radio :label="false">
            公开
          </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      logged: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>
