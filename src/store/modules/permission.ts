import { PermissionState } from './types'
import { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
import { routePrefix } from '@/qiankun'

const modules = import.meta.glob('../../views/**/**.vue')
export const Layout = () => import('@/layout/index.vue')

export const formatAsyncRoutes = (routes: any[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach(route => {
    const _route = {} as any
    const hasChildPage =
      route.children && route.children.some((child: any) => child.type === 1)

    if (route.parentId === 0 && !hasChildPage) {
      _route.path = ''
      _route.component = 'Layout'
      _route.children = [
        {
          path: routePrefix + route.routePath,
          component: route.componentPath,
          name: route.urlName,
          meta: {
            title: route.name,
            icon: route.icon,
            hidden: route.hidden,
            keepAlive: route.keepAlive,
          },
        },
      ]
      res.push(_route)
    } else {
      _route.path = routePrefix + route.routePath
      _route.component = route.parentId == 0 ? 'Layout' : route.componentPath
      _route.name = route.urlName
      _route.redirect = hasChildPage
        ? routePrefix +
          route.children.find((child: any) => child.type === 1).routePath
        : undefined
      _route.meta = {
        title: route.name,
        icon: route.icon,
        hidden: route.hidden,
        alwaysShow: hasChildPage ? true : false,
        keepAlive: route.keepAlive,
      }
      res.push(_route)
      if (hasChildPage) {
        _route.children = formatAsyncRoutes(route.children)
      }
    }
  })
  return res
}

export const filterAsyncRoutes = (routes: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach(route => {
    const tmp = { ...route } as any

    if (tmp.component == 'Layout') {
      tmp.component = Layout
    } else {
      const component = modules[`../../views/${tmp.component}.vue`] as any
      if (component) {
        tmp.component = modules[`../../views/${tmp.component}.vue`]
      } else {
        tmp.component = modules[`../../views/error-page/404.vue`]
      }
    }
    res.push(tmp)

    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children)
    }
  })
  return res
}

const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routes: [],
    addRoutes: [],
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    generateRoutes(perms: any) {
      return new Promise(resolve => {
        const accessedRoutes = filterAsyncRoutes(formatAsyncRoutes(perms))
        this.setRoutes(accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    generateButtons(perms: any[]) {
      const res: any[] = []
      function filterAsyncBtns(routes: any[]): any {
        routes.forEach(route => {
          const tmp = { ...route } as any
          if (tmp.type === 2) {
            res.push(tmp)
          }
          if (tmp.children) {
            tmp.children = filterAsyncBtns(tmp.children)
          }
        })
      }
      filterAsyncBtns(perms)
      return res
    },
  },
})

export default usePermissionStore
