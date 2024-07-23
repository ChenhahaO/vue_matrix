<script setup>
import ProcessRender from '../design/process/ProcessRender.vue'
import nodeType, { NodeComponentConfigs } from '../design/process/ProcessNodes'

const props = defineProps({
  active: {
    default: false,
  },
  // 表单字段列表
  formItems: {
    type: Array,
    default: () => {
      return []
    },
  },
  // 流程json
  modelValue: {
    type: Array,
    default: () => {
      return []
    },
  },
})

const processData = defineModel()

// 加载的时候判断，赋默认值
onBeforeMount(() => {
  if (processData.value.length === 0) {
    processData.value = [nodeType.Start.create()]
  }
})

defineExpose({ validate })
// 缩放比例
const zoom = ref(100)
// 选中的节点
const activeNode = ref({})
const showInput = ref(false)
const nodeConfVisible = ref(false)
// 流程图ref
const processRender = ref()
// 是否按下ctrl
let ctrlPressed = false

// 配置面板宽度
const configWidth = computed(() => {
  return activeNode.value.type === 'Exclusive' ? 600 : 500
})

function selectNode(node) {
  activeNode.value = node
  if (NodeComponentConfigs[activeNode.value.type]) {
    nodeConfVisible.value = true
  }
  else {
    ElMessage.warning('本节点无配置项')
  }
  console.log('选中', node)
}

function doZoom(sc) {
  if ((zoom.value > 30 && zoom.value < 150)
    || (zoom.value <= 30 && sc > 0)
    || (zoom.value >= 150 && sc < 0)) {
    zoom.value += sc
  }
  else {
    ElMessage.warning('缩放已经到极限了😥')
  }
}

function keyDown(event) {
  if (event.ctrlKey) {
    ctrlPressed = true
    document.addEventListener('wheel', mouseWheel, { passive: false })
  }
}

function keyUp(event) {
  if (event.key === 'Control') {
    ctrlPressed = false
    document.removeEventListener('wheel', mouseWheel)
  }
}

function mouseWheel(event) {
  if (ctrlPressed && props.active) {
    // 阻止默认的缩放行为
    event.preventDefault()
    // 获取滚动方向，向上为正，向下为负
    const delta = Math.sign(event.deltaY)
    doZoom(delta * -5)
  }
}

onMounted(() => {
  document.addEventListener('keydown', keyDown)
  document.addEventListener('keyup', keyUp)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', keyDown)
  document.removeEventListener('keyup', keyUp)
  document.removeEventListener('wheel', mouseWheel)
})

function validate() {
  return processRender.value.validate()
}
</script>

<template>
  <div class="w-process-designer">
    <div class="w-p-d-operation">
      <div class="w-p-d-operation-zoom">
        <el-button icon="Minus" circle @click="doZoom(-5)" />
        <span>{{ zoom }}%</span>
        <el-button icon="Plus" circle @click="doZoom(5)" />
      </div>
    </div>
    <ProcessRender ref="processRender" v-model="processData" :style="`transform: scale(${zoom / 100})`" :readonly="false" @select="selectNode" />
    <el-drawer v-model="nodeConfVisible" class="w-drawer" :size="configWidth" :title="activeNode.name" @close="validate">
      <template #header>
        <div>
          <el-input v-show="showInput" v-model="activeNode.name" autofocus style="width: 300px" @blur="showInput = false" />
          <el-link v-show="!showInput" style="font-size: medium;" @click="showInput = true">
            <el-icon style="margin-right: 10px">
              <edit />
            </el-icon>
            {{ activeNode.name }}
          </el-link>
        </div>
      </template>
      <component :is="NodeComponentConfigs[activeNode.type]" v-model="activeNode" :form-items="formItems" />
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.w-process-designer {
  display: inline-block;
  min-width: 100%;

  .w-p-d-operation {
    position: fixed;
    top: 90px;
    right: 40px;
    z-index: 99;

    .w-p-d-operation-zoom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        padding: 0 5px;
        font-size: medium;
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
