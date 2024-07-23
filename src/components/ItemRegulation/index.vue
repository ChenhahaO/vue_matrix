<script setup lang="ts">
defineProps<{ index: number }>()
defineEmits(['add', 'remove'])
</script>

<template>
  <div flex gap-10px text-3xl>
    <div
      i-carbon:add-filled
      hover:text-teal-600d
      text-teal-600
      icon-btn
      hover:opacity-50
      @click="$emit('add', index)"
    />
    <div
      v-if="index !== 0"
      i-carbon:close-filled
      text-rose-600
      icon-btn
      hover:text-rose-600
      hover:opacity-50
      @click="$emit('remove', index)"
    />
  </div>
</template>
