import dayjs from 'dayjs'

export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path)
  return isExternal
}

export function isEnglish(str: string) {
  return /^[A-Za-z]+$/g.test(str)
}

// el-date-picker禁止选择未来时间范围限制
export function disableFutureDate(time: Date) {
  return dayjs(time).isAfter(dayjs(), 'day')
}

// el-date-picker禁止选择历史时间范围限制
export function disabledHistoryDate(time: Date) {
  return dayjs(time).isBefore(dayjs(), 'day')
}
