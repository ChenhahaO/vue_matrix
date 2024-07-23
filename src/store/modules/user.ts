import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { UserState } from './types'
import { loginApi } from '@/api/auth'
import { getThirdUserInfo, getUserInfo } from '@/api/user'
import { resetRouter } from '@/router'
import type { LoginForm } from '@/api/auth/types'

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: useStorage('token', null, sessionStorage),
    user: useStorage('user', {}, sessionStorage),
    platforms: useStorage('platforms', [], sessionStorage),
    isThirdLogin: useStorage('isThirdLogin', false, sessionStorage),
    roles: [],
    perms: [],
    btnPerms: [],
  }),
  actions: {
    async RESET_STATE() {
      this.$reset()
    },
    /**
     * 登录
     */
    login(data: LoginForm) {
      const { account, password } = data
      return new Promise((resolve, reject) => {
        loginApi({
          account: account.trim(),
          password,
        })
          .then((resp) => {
            if (resp.status === 1) {
              const { session, user, sourceList } = resp.data
              this.token = session
              this.user = user
              this.platforms = sourceList
              resolve(session)
            }
            else {
              reject(new Error('登录失败'))
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
     *  获取用户信息
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        if (this.token && this.platforms.length !== 0) {
          const platformInfo = this.platforms.find(
            (e: any) => e.sourceKey === import.meta.env.VITE_APP_SOURCEKEY,
          )
          if (!platformInfo)
            return reject(new Error('没有匹配的平台信息'))
          const headers = { sourceId: platformInfo.id }
          getUserInfo(headers).then(({ data }) => {
            if (!data)
              return reject(new Error('获取用户信息失败。请重新登录'))

            if (data.rolePermissionList.length === 0)
              return reject(new Error('该平台没有可以访问的内容'))

            this.perms = data.rolePermissionList
            resolve(data)
          })
        }
        else if (this.isThirdLogin) {
          // 第三方登录
          getThirdUserInfo().then(({ data }) => {
            if (!data) {
              return reject(new Error('获取用户信息失败。请重新登录'))
            }
            if (data.rolePermissionList.length === 0) {
              return reject(new Error('该平台没有可以访问的内容'))
            }
            this.perms = data.rolePermissionList
            resolve(data)
          })
        }
        else {
          reject(new Error('获取用户信息失败。请重新登录'))
        }
      })
    },

    /**
     *  注销
     */
    logout() {
      return new Promise((resolve) => {
        this.RESET_STATE()
        this.token = null
        resetRouter()
        resolve(null)
      })
    },

    /**
     * 清除 Token
     */
    resetToken() {
      return new Promise((resolve) => {
        this.RESET_STATE()
        this.token = null
        resolve(null)
      })
    },
  },
})

export default useUserStore
