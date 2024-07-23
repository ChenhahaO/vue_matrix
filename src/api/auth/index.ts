import type { AxiosPromise } from 'axios'
import type { LoginForm } from './types'
import request from '@/utils/request'

export function loginApi(data: LoginForm): AxiosPromise<any> {
  return request({
    url: '/uc/webUserV2/singleLogin',
    method: 'post',
    data,
  })
}
