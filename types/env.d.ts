/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

// 环境变量 TypeScript的智能提示
interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_APP_BASE_API: string
  VITE_APP_SOURCEKEY: string
  VITE_APP_SOURCEID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
