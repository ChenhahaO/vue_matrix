<script setup>
import { FormComponents } from '../form/FormComponents.js'
import componentMixin from '../form/FormComponentMixin.js'

const props = defineProps({
  ...componentMixin.props,
  modelValue: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const emit = defineEmits([...componentMixin.emits])
const _value = computed(componentMixin.computed._value(props, emit))
</script>

<template>
  <el-form
    :label-width="config.conf.labelWidth" :size="config.conf.size"
    :label-position="config.conf.labelPosition" class="w-form-render"
  >
    <template v-for="(cp, i) in config.components" :key="cp.type + i">
      <el-form-item
        v-if="!cp.props.isContainer" :label="cp.name" :required="cp.props.required"
        :class="{ 'w-form-cp-nlb': cp.props.hideLabel }" :prop="cp.key"
      >
        <component :is="FormComponents[cp.type]" v-model="_value[cp.key]" :mode="mode" :config="cp" />
      </el-form-item>
      <component :is="FormComponents[cp.type]" v-else v-model="_value" :mode="mode" :config="cp" />
    </template>
  </el-form>
</template>
