import { defineStore } from 'pinia';
import { UserState } from './types';
import { loginApi } from '@/api/auth';
import { resetRouter } from '@/router';
import { LoginForm } from '@/api/auth/types';
import { useStorage } from '@vueuse/core';
import { getUserInfo, getThirdUserInfo } from '@/api/user';

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: useStorage('token', null, sessionStorage),
    user: useStorage('user', {}, sessionStorage),
    platforms: useStorage('platforms', [], sessionStorage),
    roles: [],
    perms: [],
    btnPerms: [],
    isThirdLogin: useStorage('isThirdLogin', false, sessionStorage),
  }),
  actions: {
    async RESET_STATE() {
      this.$reset();
    },
    /**
     * 登录
     */
    login(data: LoginForm) {
      const { account, password } = data;
      return new Promise((resolve, reject) => {
        loginApi({
          account: account.trim(),
          password: password,
        })
          .then(resp => {
            if (resp.status === 1) {
              const { session, user, sourceList } = resp.data;
              this.token = session;
              this.user = user;
              this.platforms = sourceList;
              resolve(session);
            } else {
              reject('登录失败');
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
     *  获取用户信息
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        if (this.token && this.platforms && this.platforms?.length !== 0) {
          const platformInfo = this.platforms.find(
            (e: any) => e.sourceKey === import.meta.env.VITE_APP_SOURCEKEY
          );
          if (!platformInfo) return reject('没有匹配的平台信息');
          const headers = { sourceId: platformInfo.id };
          getUserInfo(headers).then(({ data }) => {
            if (!data) {
              return reject('获取用户信息失败。请重新登录');
            }
            if (data.rolePermissionList.length == 0) {
              return reject('该平台没有可以访问的内容');
            }
            this.perms = data.rolePermissionList;
            resolve(data);
          });
        } else if (this.isThirdLogin) {
          // 第三方登录
          getThirdUserInfo().then(({ data }) => {
            if (!data) {
              return reject('获取用户信息失败。请重新登录');
            }
            if (data.rolePermissionList.length == 0) {
              return reject('该平台没有可以访问的内容');
            }
            this.perms = data.rolePermissionList;
            resolve(data);
          });
        }
        else {
          reject('获取用户信息失败。请重新登录');
        }
      });
    },

    /**
     *  注销
     */
    logout() {
      return new Promise(resolve => {
        this.RESET_STATE();
        this.token = null;
        resetRouter();
        resolve(null);
      });
    },

    /**
     * 清除 Token
     */
    resetToken() {
      return new Promise(resolve => {
        this.RESET_STATE();
        this.token = null;
        resolve(null);
      });
    },
  },
});

export default useUserStore;
