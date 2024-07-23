<script setup>
import FormComponentMixin from '../FormComponentMixin'

const props = defineProps({
  ...FormComponentMixin.props,
})
const emit = defineEmits([...FormComponentMixin.emits])
const _value = computed(FormComponentMixin.computed._value(props, emit))
const orgPicker = ref()

function selectOk(users) {
  _value.value = users
  orgPicker.value.close()
}
</script>

<template>
  <div flex items-center>
    <el-button icon="plus" round @click="orgPicker.open()" />
    <WOrgTags v-if="(_value || []).length > 0" v-model="_value" inline />
    <el-text class="w-placeholder">
      {{ config.props.placeholder }}
    </el-text>
    <WOrgPicker ref="orgPicker" :multiple="config.props.multiple" type="dept" :selected="_value" @ok="selectOk" />
  </div>
</template>

<style scoped>
.w-placeholder {
  margin-left: 10px;
  color: var(--el-text-color-placeholder);
}
</style>
