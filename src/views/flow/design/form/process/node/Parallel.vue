<script setup lang="ts">
import { computed, ref } from 'vue'
import nodeMixin from '../NodeMixin'
import BranchNode from './base/BranchNode.vue'

const props = defineProps({
  ...nodeMixin.props,
  moveLn: Boolean,
  moveRn: Boolean,
})
const emit = defineEmits([...nodeMixin.emits, 'moveL', 'moveR'])
const _value = computed(nodeMixin.computed._value(props, emit))

defineExpose({ validate })

function validate(err:any) {
  console.error("Error occurred:", err);
  return true
}
</script>

<template>
  <BranchNode
    v-model="_value" :readonly="readonly" desc="并行执行"
    color="#718dff" header-icon="Operation"
    content="并行流程分支" :move-rn="moveRn" :move-ln="moveLn"
    @insert-node="type => emit('insertNode', type)"
    @move-l="emit('moveL')" @move-r="emit('moveR')"
    @delete="emit('delete')" @select="emit('select', modelValue)"
  />
</template>

<style scoped>

</style>
