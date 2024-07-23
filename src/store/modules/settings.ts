import { defineStore } from 'pinia'
import defaultSettings from '../../settings'
import type { SettingState } from './types'
import { localStorage } from '@/utils/storage'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings
const el = document.documentElement

export const useSettingStore = defineStore({
  id: 'setting',
  state: (): SettingState => ({
    theme:
      localStorage.get('theme')
      || getComputedStyle(el).getPropertyValue(`--el-color-primary`),
    showSettings,
    tagsView:
      localStorage.get('tagsView') != null
        ? localStorage.get('tagsView')
        : tagsView,
    fixedHeader,
    sidebarLogo,
  }),
  actions: {
    async changeSetting(payload: { key: string, value: any }) {
      const { key, value } = payload
      switch (key) {
        case 'theme':
          this.theme = value
          break
        case 'fixedHeader':
          this.fixedHeader = value
          break
        case 'tagsView':
          this.tagsView = value
          localStorage.set('tagsView', value)
          break
        case 'sidebarLogo':
          this.sidebarLogo = value
          break
        default:
          break
      }
    },
  },
})

export default useSettingStore
