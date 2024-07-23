import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import useStore from '@/store'
import { isQiankun, platformPrefix, routerBase } from '@/qiankun'

export const Layout = () => import('@/layout/index.vue')

// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/matrix_agent/vue',
    children: [
      // {
      //   path: 'dashboard',
      //   component: () => import('@/views/dashboard/index.vue'),
      //   name: 'Dashboard',
      //   meta: { title: '首页', icon: 'homepage', affix: true },
      // },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: { hidden: true },
      },
    ],
  },
]

if (isQiankun)
  addPrefix(constantRoutes, platformPrefix)

function addPrefix(routes: any, prefix: any) {
  routes.forEach((e: any) => {
    e.path = prefix + e.path
    if (e.redirect)
      e.redirect = prefix + e.redirect

    if (e.children)
      addPrefix(e.children, prefix)
  })
}

// 创建路由
const router = createRouter({
  history: createWebHashHistory(routerBase),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 重置路由
export function resetRouter() {
  const { permission } = useStore()
  permission.routes.forEach((route) => {
    const name = route.name
    if (name && router.hasRoute(name))
      router.removeRoute(name)
  })
}

export default router
