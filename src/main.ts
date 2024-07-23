import type { Directive } from 'vue'
import { createApp } from 'vue'
import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'
import { createPinia } from 'pinia'
import { Delete, Search } from '@element-plus/icons-vue'
import App from './App.vue'
import router from '@/router'
import '@unocss/reset/tailwind.css'
import '@/styles/index.scss'
import 'uno.css'
import 'element-plus/dist/index.css'
import '@/permission'
import 'virtual:svg-icons-register'
import * as directive from '@/directive'
import thirdLogin from '@/utils/thirdLogin'

let root: any

function render(props: QiankunProps) {
  const { container } = props
  root = createApp(App)
  const c = container
    ? container.querySelector('#app')
    : document.getElementById('app')

  Object.keys(directive).forEach((key) => {
    root.directive(key, (directive as { [key: string]: Directive })[key])
  })

  root
    .component('Search', Search)
    .component('Delete', Delete)
    .use(createPinia())
    .use(router)
    .mount(c)

  thirdLogin()
}

// qiankun
renderWithQiankun({
  mount(props) {
    console.log('vue3sub mount')
    render(props)
  },
  bootstrap() {
    console.log('bootstrap')
  },
  unmount() {
    console.log('vue3sub unmount')
    root.unmount()
  },
  update(props: QiankunProps) {
    console.log('vue3sub update')
    console.log(props)
  },
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('独立访问')
  render({})
}
