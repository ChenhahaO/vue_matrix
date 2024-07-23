<script setup lang="ts">
import { deepCopy } from '@/utils/GlobalFunc'

const props = defineProps({
  title: {
    type: String,
    default: '请选择',
  },
  size: {
    default: 20,
  },
  parentId: { // 父级部门ID
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: 'org',
  },
  // 选中的
  selected: {
    type: Array,
    default: () => {
      return []
    },
  },
  multiple: Boolean, // 是否多选
})

const emit = defineEmits(['ok'])
const _value = defineModel()
defineExpose({ open, close })
const loading = ref(false)
const showDialog = ref(false)
// 选中的对象
const selected = ref([])
const orgData = ref([])
const search = ref(null)
const searchData = ref([])

// 组织架构路径
const orgPath = ref([{ id: props.parentId, name: '' }])

const showSearch = computed(() => (search.value || '').trim() !== '')

// 数据列表
const dataList = computed(() => showSearch.value ? searchData.value : orgData.value)

// 全选处理
const selectAll = computed({
  get() {
    return dataList.value.every(b => selected.value.some(a => isSame(a, b)))
  },
  set(val) {
    // 找出合适的类型的没有的元素
    const arr = dataList.value.filter((d) => {
      const has = !selected.value.some(s => isSame(s, d))
      switch (props.type) {
        case 'user': return has && d.type === 'user'
        case 'dept':
        case 'role': return has && props.type === d.type
      }
      return true
    })
    if (val) {
      selected.value.push(...arr)
    }
    else {
      // 找出没有的元素
      selected.value = arr
    }
  },
})

const indeterminate = computed(() => {
  return !selectAll.value && selected.value.some(b => dataList.value.some(a => isSame(a, b)))
})

function isSame(a, b) {
  return a.id === b.id && a.type === b.type
}

function open() {
  setTimeout(() => {
    orgPath.value.length = 1
    search.value = null
    getOrgList(props.parentId)
    selected.value = deepCopy(props.selected)
    showDialog.value = true
  }, 100)
}

function close() {
  showDialog.value = false
  // selected.value.length = 0
  orgPath.value.length = 1
}

function jumpDept(dept, i) {
  orgPath.value.length = i + 1
  getOrgList(dept.id)
}

function toSubDept(dept) {
  getOrgList(dept.id, (rsp) => {
    orgPath.value.push(dept)
  })
}

function toParentDept() {
  jumpDept(orgPath.value[orgPath.value.length - 2], orgPath.value.length - 2)
}

function doSearch() {
  if (showSearch.value) {
    // loading.value = true
    // orgApi.getUserByName({ userName: search.value }).then((rsp) => {
    //   searchData.value = rsp.data
    //   reloadStatus(searchData.value)
    // }).finally(() => {
    //   loading.value = false
    // })
  }
}

/**
 * 获取组织架构列表数据
 * @param deptId 父级部门ID
 * @param call 回调函数
 */
function getOrgList(deptId, call) {
  loading.value = true
  orgApi.getOrgTree({ deptId, type: props.type }).then((rsp) => {
    orgData.value = rsp.data
    // 加载选中对象，解决UI框架回显对象问题
    reloadStatus(orgData.value)
    if (call) {
      call(rsp.data)
    }
  }).finally(() => {
    loading.value = false
  })
}

async function reloadStatus(orgs) {
  if (selected.value.length > 0) {
    for (const i in orgs) {
      const index = selected.value.findIndex(a => isSame(a, orgs[i]))
      if (index > -1) {
        orgs[i] = selected.value[index]
      }
    }
  }
}

/**
 * 获取简短名称，只取末尾俩字符
 * @param name
 * @returns {*|string}
 */
function getShortName(name) {
  if ((name || '').length > 2) {
    return name.substring(name.length - 2, name.length)
  }
  return name
}

/**
 * 处理单选，强制单选
 * @param val 选中项集合
 */
function change(val) {
  if (!props.multiple) {
    selected.value = [val[val.length - 1]]
  }
}

function getValues() {
  return selected.value.map((v) => {
    return {
      id: v.id,
      name: v.name,
      type: v.type,
      avatar: v.avatar,
    }
  })
}
</script>

<template>
  <WDialog
    v-model="showDialog" :border="false" width="550" :title="title"
    @ok="$emit('ok', getValues())"
  >
    <el-row>
      <el-col v-loading="loading" :span="12" class="w-org-picker-span">
        <el-input
          v-model="search" class="w-org-picker-s-input" clearable :disabled="type !== 'user' && type !== 'org'"
          placeholder="搜索人员，支持拼音、姓名" prefix-icon="search" @input="doSearch"
        />
        <div class="w-org-picker-nav">
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <el-scrollbar>
            <div v-if="type !== 'role'" class="w-org-list-path">
              <template v-for="(org, i) in orgPath">
                <span v-if="i > 1"> > </span>
                <el-text
                  size="small" style="cursor: pointer" :type="i === orgPath.length - 1 ? 'primary' : 'info'"
                  @click="jumpDept(org, i)"
                >
                  {{ org.name }}
                </el-text>
              </template>
            </div>
          </el-scrollbar>
        </div>
        <div class="w-org-list">
          <div>
            <el-checkbox
              v-model="selectAll" :indeterminate="indeterminate" style="padding: 0 5px"
              :disabled="!multiple && type !== 'user'"
            >
              全选
            </el-checkbox>
            <el-button link type="primary" :disabled="orgPath.length <= 1 || showSearch" @click="toParentDept">
              <el-icon><TopLeft /></el-icon>上级
            </el-button>
          </div>

          <el-scrollbar v-if="dataList.length > 0">
            <el-checkbox-group v-model="selected" class="w-org-list-org" @change="change">
              <el-checkbox
                v-for="org in dataList" :key="org.type + org.id"
                :disabled="type === 'user' && org.type === 'dept'" :label="org.name" :value="org"
              >
                <el-avatar v-if="org.type === 'user'" :size="35" :src="org.avatar">
                  {{ getShortName(org.name) }}
                </el-avatar>
                <el-image
                  v-else-if="org.type !== 'user'" class="w-org-dept-img" fit="fill"
                  :src="`/image/${org.type}.png`"
                />
                <el-text style="margin-left: 5px; flex: 1">
                  {{ org.name }}
                </el-text>
                <el-button
                  v-if="org.type === 'dept'" type="primary" link class="w-org-child" :underline="false"
                  @click="toSubDept(org)"
                >
                  下级
                  <el-icon>
                    <BottomRight />
                  </el-icon>
                </el-button>
              </el-checkbox>
            </el-checkbox-group>
          </el-scrollbar>
          <el-empty v-else :image-size="100" description="未找到对应组织数据" />
        </div>
      </el-col>
      <el-col :span="12" class="w-org-picker-span">
        <div>
          <span>已选 {{ selected.length }} 项</span>
          <el-button link type="danger" :disabled="selected.length === 0" @click="selected.length = 0">
            清空
          </el-button>
        </div>
        <el-scrollbar v-if="selected.length > 0">
          <div v-for="(org, i) in selected" class="w-org-picker-select">
            <el-avatar v-if="org.type === 'user'" :size="35" :src="org.avatar">
              {{ getShortName(org.name) }}
            </el-avatar>
            <el-image v-else-if="org.type !== 'user'" class="w-org-dept-img" fit="fill" :src="`/image/${org.type}.png`" />
            <el-text style="margin-left: 5px; flex: 1">
              {{ org.name }}
            </el-text>
            <el-icon @click="selected.splice(i, 1)">
              <Close />
            </el-icon>
          </div>
        </el-scrollbar>
        <el-empty v-else :image-size="100" description="未选中任何数据" />
      </el-col>
    </el-row>
  </WDialog>
</template>

<style scoped lang="scss">
.w-org-picker-span {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid var(--el-border-color);

  &:first-child {
    border-right: none;

    .w-org-picker-s-input {
      padding: 5px;
    }
  }

  &:last-child {
    & > :first-child {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 10px;
      justify-content: space-between;
      border-bottom: 1px solid var(--el-border-color);
    }
  }

}

.w-org-picker-nav {
  padding: 0 5px;
  display: flex;
  align-items: center;

  i {
    margin-right: 5px;
  }
}

.w-org-dept-img {
  width: 20px;
  height: 20px;
  padding: 8px 0;
}

.w-org-picker-select {
  display: flex;
  align-items: center;
  padding: 3px 5px;

  .el-avatar {
    background-color: var(--el-color-primary);
  }

  i {
    cursor: pointer;
    padding: 5px;
  }

  &:hover {
    background-color: $theme-aside-bgc;
  }
}

:deep(.w-org-list-org) {
  display: flex;
  flex-direction: column;
  height: 275px;

  & > .el-checkbox {
    height: auto;
    padding: 3px 5px;
    margin-right: 0;

    &:hover {
      background-color: $theme-aside-bgc;
    }
  }

  .w-org-child {
    color: var(--el-color-primary);
  }

  .el-checkbox__label {
    display: flex;
    position: relative;
    flex: 1;
  }

  .el-avatar {
    background-color: var(--el-color-primary);
  }
}

.w-org-list {

  & > div:first-child {
    display: flex;
    align-items: center;
    position: relative;

    & > :first-child {
      flex: 1;
    }

    & > :last-child {
      margin-right: 5px;
    }
  }

  .w-org-list-path {
    display: flex;
  }
}
</style>
