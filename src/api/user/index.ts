import request from '@/utils/request';
import { AxiosPromise } from 'axios';

/**
 * 登录成功后获取用户信息
 */
export function getUserInfo(headers: any, data = {}): AxiosPromise<any> {
  return request({
    url: '/uc/webUserV3/info',
    method: 'post',
    headers,
    data,
  });
}

/**
 * 第三方登录信息
 */
export function getThirdUserInfo(): AxiosPromise<any> {
  return request({
    url: '/third/info',
    method: 'post',
  });
}