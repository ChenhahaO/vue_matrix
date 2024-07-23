declare interface DialogType {
  title: string
  visible: boolean
}

declare interface OptionType {
  value: string
  label: string
  checked?: boolean
  children?: OptionType[]
}

declare type YHPromise<T = any> = Promise<YHResponse<T>>
