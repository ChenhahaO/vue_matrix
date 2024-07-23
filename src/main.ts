import { createApp, Directive } from 'vue';
import App from './App.vue';
import router from '@/router';

import { createPinia } from 'pinia';

import thirdLogin from '@/utils/thirdLogin'

import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import Pagination from '@/components/Pagination/index.vue';
import '@/permission';

import 'default-passive-events';

// 引入svg注册脚本
import 'virtual:svg-icons-register';

// 自定义样式
import '@/styles/index.scss';

// qiankun
import {
  renderWithQiankun,
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper';

// const app = createApp(App);

// 自定义指令
import * as directive from '@/directive';

let root: any;

function render(props: any) {
  const { container } = props;
  root = createApp(App);
  const c = container
    ? container.querySelector('#app')
    : document.getElementById('app');

  Object.keys(directive).forEach(key => {
    root.directive(key, (directive as { [key: string]: Directive })[key]);
  });

  root
    .component('Pagination', Pagination)
    .use(createPinia())
    .use(router)
    .use(ElementPlus)
    .mount(c);

  thirdLogin()
}

// qiankun
renderWithQiankun({
  mount(props) {
    console.log('vue3sub mount');
    render(props);
  },
  bootstrap() {
    console.log('bootstrap');
  },
  unmount(props: any) {
    console.log('vue3sub unmount');
    root.unmount();
  },
  update(props: any) {
    console.log('vue3sub update');
    console.log(props);
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('独立访问');
  render({});
}