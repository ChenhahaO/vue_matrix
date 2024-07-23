<script setup>
import FormComponentMixin from '../FormComponentMixin'

defineProps({
  ...FormComponentMixin.props,
})
</script>

<template>
  <el-input
    type="number" :max="config.props.max" :min="config.props.min"
    :placeholder="config.props.placeholder"
  />
</template>

<style scoped>

</style>
