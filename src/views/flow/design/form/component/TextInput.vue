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
  <el-input v-model="_value" :placeholder="config.props.placeholder" />
</template>

<style scoped>

</style>
