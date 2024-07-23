<script setup lang="ts">
import { computed, ref } from 'vue'
import nodeMixin from '../NodeMixin'
import Node from './base/Node.vue'

const props = defineProps({
  ...nodeMixin.props,
})

const emit = defineEmits(nodeMixin.emits)
const _value = computed(nodeMixin.computed._value(props, emit))
const showErr = ref(false)
const errInfo = ref(null)

defineExpose({ validate })
function validate(err) {
console.log(err);
}
</script>

<template>
  <Node
    v-model="_value" :readonly="readonly" :show-close="false" :show-error="showErr"
    :error-info="errInfo" header-color="#80929C"
    header-icon="UserFilled"
    content="流程从本节点开始" @select="emit('select', modelValue)" @insert-node="type => emit('insertNode', branch, index, type)"
  />
</template>

<style scoped>

</style>
