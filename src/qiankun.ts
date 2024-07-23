import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

export const isQiankun = qiankunWindow.__POWERED_BY_QIANKUN__
export const platformPrefix = '/autoMobile'
export const routerBase = isQiankun ? '/autoMobile/' : '/'
export const routePrefix = isQiankun ? platformPrefix : ''
export const refreshUrl = isQiankun ? '/' : '/yunhe/'
