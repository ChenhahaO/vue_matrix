<script setup>
import { computed } from 'vue'
import FormComponentMixin from '../FormComponentMixin.js'

const props = defineProps({
  ...FormComponentMixin.props,
})
const emit = defineEmits([...FormComponentMixin.emits])
const _value = computed(FormComponentMixin.computed._value(props, emit))
</script>

<template>
  <el-checkbox-group v-if="config.props.expanding" v-model="_value">
    <el-checkbox v-for="(op, i) in config.props.options" :key="i" :label="op" :value="op" />
  </el-checkbox-group>
  <el-select v-else v-model="_value" multiple>
    <el-option v-for="(op, i) in config.props.options" :key="i" :label="op" :value="op" />
  </el-select>
</template>

<style scoped>

</style>
