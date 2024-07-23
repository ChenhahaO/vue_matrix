// 节点复用逻辑
export default {
  props: {
    modelValue: Object,
    formItems: Object, // 表单字段列表
    readonly: Boolean,
    index: Number, // 处在当前支路位置的索引
    branch: Array, // 当前整个支路
  },
  computed: {
    _value(props: any, emit: any) {
      return {
        get() {
          return props.modelValue
        },
        set(val: any) {
          emit('update:modelValue', val)
        },
      }
    },
  },
  emits: ['update:modelValue', 'delete', 'insertNode', 'select'],
}
