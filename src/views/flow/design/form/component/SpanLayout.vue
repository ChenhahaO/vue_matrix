<script setup>
import { VueDraggable } from 'vue-draggable-plus'
import { computed, onBeforeMount, ref, watch } from 'vue'
import FormComponentMixin from '../FormComponentMixin'
import FormComponent from './FormComponent.vue'

const props = defineProps({
  ...FormComponentMixin.props,
  modelValue: {
    default: () => {
      return {}
    },
  },
})

const emit = defineEmits([...FormComponentMixin.emits])
const _active = computed(FormComponentMixin.computed._active(props, emit))
const _value = computed(FormComponentMixin.computed._value(props, emit))

const freeMode = computed(() => props.mode === 'free')

function reloadSpan() {
  // 初始化分栏数据值
  const spanProps = props.config.props
  if (spanProps.number > spanProps.columns.length) {
    for (let i = 0; i < spanProps.number; i++) {
      console.log(i, spanProps.columns[i])
      if (!spanProps.columns[i]) {
        spanProps.columns.push([])
      }
    }
  }
  else {
    spanProps.columns.length = spanProps.number
  }
}

onBeforeMount(reloadSpan)
watch(() => props.config.props.number, reloadSpan)
</script>

<template>
  <el-row :gutter="config.props.gutter">
    <el-col v-for="(cols, i) in config.props.columns" :key="`col_${i}`" :span="config.props.span / config.props.number">
      <VueDraggable
        v-model="config.props.columns[i]" :animation="150" group="FormDesign" :disabled="!freeMode"
        :ghost-class="freeMode ? 'w-f-cp-select' : ''" :class="{ 'w-f-cp-ct': freeMode }"
      >
        <template v-for="(item, idx) in cols" :key="item.id">
          <el-form-item
            v-if="!item.props.isContainer" :label="item.name" :required="item.props.required" :prop="item.key" :class="{ 'w-form-d-item': freeMode,
                                                                                                                         'w-form-cp-active': _active?.id === item.id && freeMode,
                                                                                                                         'w-form-cp-nlb': item.props.hideLabel }"
            @click.stop="_active = item"
          >
            <FormComponent
              v-model:active="_active" v-model="_value[item.key]" :index="idx"
              :parents="cols" :config="item" :mode="mode" :type="item.type"
            />
          </el-form-item>
          <FormComponent
            v-else v-model:active="_active" v-model="_value" :config="item" :mode="mode"
            :type="item.type" :index="idx" :parents="cols" :class="{ 'w-form-d-item': freeMode, 'w-form-cp-active': _active?.id === item.id && freeMode }"
            @click.stop="_active = item"
          />
        </template>
      </VueDraggable>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
:deep(.w-f-cp-ct) {
  width: 100%;
  min-height: 50px;
  background-color: $main-bgc;
}

.w-f-cp-select {
  border-radius: 2px;
  border: 1px dashed var(--el-color-primary) !important;
}
</style>
