<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ share_zone===userType?((userType==='teacher'?'教师':'学生')+'共享区'):'选修课共享区' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="share_zone" style="padding: 10px;">
<!--          <el-radio :label="true" />-->

          <el-radio v-if="userType=='teacher'" label="teacher" >
            教师共享区
          </el-radio>
          <el-radio v-else label="student">
            学生共享区
          </el-radio>
          <el-radio label="option">
            选修课共享区
          </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: String,
      default: 'student'
    }
  },
  computed: {
    ...mapGetters([
      'userType'
    ]),
    share_zone: {
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
