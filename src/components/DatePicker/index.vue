<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const dateValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})
const dateOption = computed({
  get: () => {
    const diff1 = dayjs(props.modelValue[0]).diff(dayjs(), 'day')
    const diff2 = dayjs(props.modelValue[1]).diff(dayjs(), 'day')
    return `${diff1}|${diff2}`
  },
  set: (value) => {
    emit('update:modelValue', [
      dayjs().add(Number(value.split('|')[0]), 'day'),
      dayjs().add(Number(value.split('|')[1]), 'day'),
    ])
  },
})
const targetMonth = ref()

function handleCalendarChange(val: [Date, Date]) {
  targetMonth.value = val[0].getMonth()
}

// 不能跨月筛选
// function disabledDate(data: Date): Boolean {
//   if (targetMonth.value) {
//     return (
//       data.getMonth() < targetMonth.value || data.getMonth() > targetMonth.value
//     );
//   } else {
//     return false;
//   }
// }

function handleVisibleChange(visibility: boolean) {
  if (!visibility)
    targetMonth.value = null
}
</script>

<template>
  <div flex>
    <el-date-picker
      v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期"
      end-placeholder="结束日期" style="width: 250px" :clearable="false"
      @calendar-change="handleCalendarChange" @visible-change="handleVisibleChange"
    />

    <el-radio-group v-model="dateOption" style="margin-left: 10px">
      <el-radio-button value="0|0">
        今天
      </el-radio-button>
      <el-radio-button value="-1|-1">
        昨天
      </el-radio-button>
      <el-radio-button value="-6|0">
        七天内
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped></style>
