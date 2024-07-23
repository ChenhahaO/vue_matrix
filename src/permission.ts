import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import router from '@/router'
import useStore from '@/store'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false }) // 进度环显示/隐藏

// 白名单路由
const whiteList = ['/login', '/auth-redirect', '/thirdLogin']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const { user, permission } = useStore()
  const hasToken = user.token

  if (hasToken) {
    // 登录成功，跳转到首页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    }
    else {
      const hasGetUserInfo = user.perms.length > 0
      if (hasGetUserInfo) {
        if (to.matched.length === 0)
          from.name ? next({ name: from.name as any }) : next('/401')

        else
          next()
      }
      else {
        try {
          await user.getUserInfo()
          const perms = user.perms
          const accessRoutes: any = await permission.generateRoutes(perms)
          user.btnPerms = permission.generateButtons(perms)
          accessRoutes.forEach((route: any) => {
            router.addRoute(route)
          })
          next({ ...to, replace: true })
        }
        catch (error) {
          console.log(error)
          // 移除 token 并跳转登录页
          await user.resetToken()
          ElMessage.error((error as any) || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  }
  else {
    // 未登录可以访问白名单页面(登录页面)
    if (whiteList.includes(to.path)) {
      next()
    }
    else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
