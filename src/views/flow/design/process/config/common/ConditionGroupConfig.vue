<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { _formFields } from '../../../FormInterface'
import ConditionItemConfig from './ConditionItemConfig.vue'
import { ProcessCondition } from '@/utils/ConditionCompare'

const props = defineProps({
  name: String,
  modelValue: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const emit = defineEmits(['update:modelValue', 'delete'])

const _value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

// 构建总选项
const cdOptions = computed(() => {
  // 提取表单字段，过滤不支持的选项
  return _formFields.value.filter((v: any) => ProcessCondition.FORM[v.type])
})

const addCdVisible = ref(false)
const baseCd = ref({} as any)

function addCondition() {
  addCdVisible.value = true
  baseCd.value = {
    group: null,
    type: null,
    symbol: null,
    name: [],
    valueType: null,
  }
}

function addConditionConfirm() {
  if (baseCd.value.type && baseCd.value.symbol) {
    addCdVisible.value = false
    _value.value.conditions.push({
      ...baseCd.value,
      compare: null, // 比较关系
      compareVal: [], // 比较值集合
    })
  }
  else {
    ElMessage.warning('请选择条件类别')
  }
}
</script>

<template>
  <div class="w-condition-group">
    <div>
      <el-text>{{ name }}</el-text>
      <div>
        <el-text style="margin-right: 10px">
          组内条件关系:
        </el-text>
        <el-switch v-model="_value.logic" active-text="且" inactive-text="或" />
      </div>
      <div>
        <el-button link icon="Plus" type="primary" @click="addCondition">
          添加条件
        </el-button>
        <el-button link icon="Delete" type="danger" @click="$emit('delete')">
          删除
        </el-button>
      </div>
    </div>
    <div>
      <div v-if="_value.conditions.length === 0" class="w-cd-group-tip">
        <el-text>请点击上方 + 添加条件选项</el-text>
      </div>
      <el-form label-position="top" label-width="100" class="w-cd-group-item">
        <el-form-item v-for="(cd, i) in _value.conditions" :key="cd.id">
          <template #label>
            <el-text truncated>
              {{ (cd.name || []).join("-") }}
            </el-text>
          </template>
          <ConditionItemConfig
            v-model="_value.conditions[i]"
            :type="ProcessCondition[cd.group][cd.type]?.type"
            style="display: inline-block; width: calc(100% - 20px)"
          />
          <el-icon class="w-cd-del" @click="_value.conditions.splice(i, 1)">
            <Delete />
          </el-icon>
        </el-form-item>
      </el-form>
    </div>
    <WDialog
      v-model="addCdVisible"
      :border="false"
      title="选择条件类别"
      width="500"
      @ok="addConditionConfirm"
    >
      <el-select
        v-model="baseCd.group"
        style="width: 45%"
        @change="baseCd.symbol = null"
      >
        <el-option
          label="发起人"
          value="INITIATOR"
          @click="baseCd.name[0] = '发起人'"
        />
        <el-option label="表单" value="FORM" @click="baseCd.name[0] = '表单'" />
      </el-select>
      <el-text style="margin: 0 10px">
        的
      </el-text>
      <el-select
        v-if="baseCd.group === 'INITIATOR'"
        v-model="baseCd.type"
        style="width: 45%"
        @change="(v: any) => (baseCd.symbol = v)"
      >
        <el-option
          label="本人/部门"
          value="Org"
          @click="baseCd.name[1] = '本人/部门'"
        />
        <el-option label="角色" value="Role" @click="baseCd.name[1] = '角色'" />
      </el-select>
      <el-select
        v-else-if="baseCd.group === 'FORM'"
        v-model="baseCd.type"
        style="width: 45%"
      >
        <el-option
          v-for="item in cdOptions"
          :key="item.key"
          :label="item.name"
          :value="item.type"
          @click="
            baseCd.symbol = item.key;
            baseCd.name[1] = item.name;
          "
        />
      </el-select>
      <el-text v-else type="warning">
        👀请选择左侧类别
      </el-text>
    </WDialog>
  </div>
</template>

<style scoped lang="scss">
.w-condition-group {
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  margin-bottom: 20px;

  .w-cd-group-tip {
    text-align: center;
    padding: 10px 0;
  }

  & > :first-child {
    padding: 0 5px;
    display: flex;
    align-items: center;
    background-color: var(--el-border-color);

    & > :first-child {
      flex: 1;
    }

    & > :nth-child(2) {
      display: flex;
      align-items: center;
      margin-right: 100px;
    }
  }

  & > :nth-child(2) {
    padding: 10px;
  }
}

:deep(.w-cd-group-item) {
  .w-cd-del {
    color: var(--el-color-danger);
    padding: 3px;
    cursor: pointer;
  }

  .el-form-item__label {
    margin-bottom: 0 !important;
  }
}
</style>
