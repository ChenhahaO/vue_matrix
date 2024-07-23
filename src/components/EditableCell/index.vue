<script setup lang="ts">
import type { InputInstance } from 'element-plus'

const props = defineProps<{ row: any }>()
const emits = defineEmits(['close'])
const inputRef = ref<InputInstance>()
const modelValue = defineModel<string | number>()
const editable = ref<boolean>(false)
const oldValue = ref<string>()
const newValue = ref<string>()

function handleEditClose() {
  newValue.value = String(modelValue.value)
  emits('close', oldValue.value, newValue.value, props.row)
  editable.value = false
}

function handleEditClick() {
  oldValue.value = String(modelValue.value)
  editable.value = true
  nextTick(() => {
    inputRef.value!.focus()
  })
}
</script>

<template>
  <div v-if="editable">
    <el-input ref="inputRef" v-model="modelValue" size="small" @blur="handleEditClose" />
  </div>
  <div v-else fc gap-10px>
    {{ modelValue }}
    <div i-carbon:edit shrink-0 icon-btn @click="handleEditClick" />
  </div>
</template>
