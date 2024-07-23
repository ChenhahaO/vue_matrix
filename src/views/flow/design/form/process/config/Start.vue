<script setup lang="ts">
import { computed } from 'vue'
import nodeMixin from '../NodeMixin'
import FormPermConf from '../../../admin/config/FormPermConf.vue'

const props = defineProps({
  ...nodeMixin.props,
})
const emit = defineEmits(nodeMixin.emits)
const _value = computed(nodeMixin.computed._value(props, emit))
</script>

<template>
  <el-tabs>
    <el-tab-pane lazy label="表单权限设置">
      <FormPermConf v-model="_value.props.formPerms" default-perm="E" :form-items="formItems" />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>
