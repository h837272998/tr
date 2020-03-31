<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      编辑器: {{ ConnentType==='markdown'?'Markdown':'富文本' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="ConnentType" style="padding: 10px;">
          <el-radio label="markdown">
          </el-radio>
          <el-radio label="富文本" >
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
        type: String,
        default: '富文本'
      }
    },
    computed: {
      ConnentType: {
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
