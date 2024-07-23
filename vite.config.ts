import path from 'node:path'
import process from 'node:process'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import qiankun from 'vite-plugin-qiankun'
import Unocss from 'unocss/vite'
import { webUpdateNotice } from '@plugin-web-update-notification/vite'

const pathSrc = path.resolve(__dirname, 'src')

export default ({ mode }: ConfigEnv): UserConfig => {
  // 获取 .env 环境配置文件
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_APP_BASE,
    plugins: [
      vue(),
      qiankun('autoMobile', { useDevMode: true }),
      webUpdateNotice({
        logVersion: true,
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      AutoImport({
        imports: ['vue', '@vueuse/core', 'vue-router'],
        dirs: [path.resolve(pathSrc, 'composables')],
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({ prefix: 'Icon' }),
        ],
        vueTemplate: true,
        dts: path.resolve('types', 'auto-imports.d.ts'),
      }),
      Components({
        resolvers: [
          IconsResolver({ enabledCollections: ['ep'] }),
          ElementPlusResolver(),
        ],
        dts: path.resolve('types', 'components.d.ts'),
      }),
      Unocss(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/globalVariables.scss";',
        },
      },
    },
    // 本地反向代理解决浏览器跨域限制
    server: {
      host: '0.0.0.0',
      open: true, // 运行自动打开浏览器
      proxy: {
        '/api': {
          target: 'http://192.168.3.155:8084/',
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp('^' + '/api'), ''),
        },
      },
    },
    resolve: {
      // Vite路径别名配置
      alias: {
        '@': path.resolve('./src'), // @代替src
      },
    },
  }
}
