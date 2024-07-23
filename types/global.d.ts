declare global {
  interface PageQuery {
    pageNum: number
    pageSize: number
  }

  interface PageResult<T> {
    list: T
    total: number
  }

  interface SelectList {
    label: string
    value: string | number
  }

  interface YHResponse<T = any> {
    data: T
    status: number
    msg: string
  }
}

export {}
