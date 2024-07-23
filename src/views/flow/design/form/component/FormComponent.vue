<script setup lang="ts">
import { computed } from 'vue'
import componentMixin from '../FormComponentMixin'
import { FormComponents } from '../FormComponents'
import { copyField, delField } from '@/utils/GlobalFunc'

const props = defineProps({
  ...componentMixin.props,
  type: String,
  modelValue: {
    // 组件值
    default: undefined,
  },
  parents: {
    // 本组件所在的组件列表
    default: () => {
      return []
    },
  },
  index: Number, // 本组件所在列表parents的索引位置
})

const emit = defineEmits([...componentMixin.emits])
const _value = computed(componentMixin.computed._value(props, emit))
const _active = computed(componentMixin.computed._active(props, emit))
const showActive = computed(() => {
  return _active.value?.id === props.config.id && props.mode === 'free'
})
</script>

<template>
  <div
    style="position: relative; width: 100%"
    :class="{
      'w-form-cp-active': showActive,
      'w-border-no': !config.props.isContainer,
    }"
  >
    <div v-if="mode === 'free'" class="w-form-component">
      <el-icon color="#ffffff" @click="copyField(parents, index)">
        <CopyDocument />
      </el-icon>
      <el-icon color="#ffffff" @click="delField(parents, index)">
        <Delete />
      </el-icon>
    </div>
    <component
      :is="FormComponents[type]"
      v-model="_value"
      v-model:active="_active"
      :config="config"
      :mode="mode"
    />
  </div>
</template>

<style scoped lang="scss">
.w-border-no {
  border: none !important;
}

.w-form-component {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 9;
  display: none;
  border-radius: 5px 0 0 0;
  overflow: hidden;

  i {
    width: 24px;
    height: 24px;
    padding: 5px;
    cursor: pointer;
    background: var(--el-color-primary);
    &:hover {
      background: var(--el-color-primary-light-3);
    }
  }
}
</style>
