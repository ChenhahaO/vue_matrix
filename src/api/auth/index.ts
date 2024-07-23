import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginForm } from './types';

/**
 *
 * @param data {LoginForm}
 * @returns
 */
export function loginApi(data: LoginForm): AxiosPromise<any> {
  return request({
    url: '/uc/webUserV2/singleLogin',
    method: 'post',
    data,
  });
}
