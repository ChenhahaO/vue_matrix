<script setup>
import FormComponentMixin from '../FormComponentMixin'

defineProps({
  ...FormComponentMixin.props,
})
</script>

<template>
  <div class="chenhaha">
    <el-input placeholder="config.props.placeholder" />
  </div>
</template>
