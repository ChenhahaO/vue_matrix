<script lang="ts" setup>
import { computed, ref } from 'vue'
import { CompareOptions } from '@/utils/ConditionCompare'

const props = defineProps({
  type: {
    type: String,
  },
  modelValue: {
    type: {} as any,
  },
})

const emit = defineEmits(['update:modelValue'])

const _value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const orgPicker = ref()
const pickerType = ref('org')

function addOrg(type: any) {
  pickerType.value = type
  orgPicker.value.open()
}

function selectOk(orgs: any) {
  _value.value.compareVal = orgs
  orgPicker.value.close()
}
</script>

<template>
  <div>
    <!-- 基础条件选项 -->
    <el-select v-model="_value.compare" style="width: 30%">
      <el-option
        v-for="op in CompareOptions[type]"
        :key="op.symbol"
        :label="op.name"
        :value="op.symbol"
      />
    </el-select>
    <el-divider direction="vertical" />
    <!-- 每类条件选项 -->
    <template v-if="type === 'org'">
      <el-button
        icon="Plus"
        size="small"
        type="primary"
        round
        @click="addOrg('org')"
      >
        选择人员/部门
      </el-button>
      <WOrgTags v-model="_value.compareVal" style="margin-top: 5px" />
    </template>
    <template v-else-if="type === 'role'">
      <el-button
        icon="Plus"
        size="small"
        type="primary"
        round
        @click="addOrg('role')"
      >
        选择角色
      </el-button>
      <WOrgTags v-model="_value.compareVal" style="margin-top: 5px" />
    </template>
    <template v-if="type === 'user'" />
    <template v-else-if="type === 'dept'" />
    <template v-else-if="type === 'number'">
      <template v-if="_value.compare === 'BT'">
        <el-input
          v-model="_value.compareVal[0]"
          style="width: 30%"
          type="number"
          placeholder="左比较值"
        />
        ~
        <el-input
          v-model="_value.compareVal[1]"
          style="width: 30%"
          type="number"
          placeholder="右比较值"
        />
      </template>
      <el-select
        v-else-if="_value.compare === 'IN'"
        v-model="_value.compareVal"
        multiple
        filterable
        style="width: 65%"
        placeholder="请输入选项"
      >
        <el-option
          v-for="op in _value.compareVal"
          :key="op.symbol"
          :label="op.name"
          :value="op.name"
        />
      </el-select>
      <el-input
        v-else
        v-model="_value.compareVal[0]"
        type="number"
        style="width: 65%"
        placeholder="比较值"
      />
    </template>
    <template v-else-if="type === 'string'">
      <el-select
        v-if="_value.compare === 'IN'"
        v-model="_value.compareVal"
        multiple
        filterable
        allow-create
        style="width: 65%"
        placeholder="请输入选项"
      >
        <el-option
          v-for="op in _value.compareVal"
          :key="op.symbol"
          :label="op.name"
          :value="op.name"
        />
      </el-select>
      <el-input
        v-else
        v-model="_value.compareVal[0]"
        style="width: 65%"
        placeholder="输入比较值"
      />
    </template>
    <template v-else-if="type === 'array'" />
    <template v-else-if="type === 'date'" />
    <template v-else-if="type === 'dateRange'" />
    <WOrgPicker
      ref="orgPicker"
      :type="pickerType"
      multiple
      :selected="_value.compareVal"
      @ok="selectOk"
    />
  </div>
</template>

<style scoped lang="scss"></style>
