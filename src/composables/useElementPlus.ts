import dayjs from 'dayjs'
import type { TableColumnCtx } from 'element-plus'

export default function useElementPlus() {
  function formatTime(row: any, column: TableColumnCtx<any>, cellValue: number) {
    return cellValue ? dayjs.unix(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
  }

  return { formatTime }
}
