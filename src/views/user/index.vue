<script setup lang="ts">
import { listUserPages } from '@/api/user'

defineOptions({ name: 'User' })

const queryFormRef = ref<FormInstance>()
const { dynamicHeight } = useDynamicHeight()

const state = reactive({
  loading: false,
  queryParams: {
    account: '',
    status: undefined,
    pageNum: 1,
    pageSize: 20,
  },
  total: 0,
  tableData: [],
})

const { loading, queryParams, total, tableData } = toRefs(state)

function handleQuery() {
  state.loading = true
  listUserPages(state.queryParams)
    .then(({ data }) => {
      state.total = data.total
      state.tableData = data.list
    })
    .finally(() => {
      state.loading = false
    })
}

function resetQuery() {
  queryFormRef.value?.resetFields()
  handleQuery()
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <div class="app-container-header">
      <el-form ref="queryFormRef" :model="queryParams" inline>
        <el-form-item label="账号" prop="account">
          <el-input v-model="queryParams.account" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="状态" prop="status" w-30>
          <el-select v-model="queryParams.status" placeholder="全部" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button circle icon="Search" @click="handleQuery" />
          <el-button circle icon="Delete" @click="resetQuery" />
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="loading" :data="tableData" :max-height="dynamicHeight">
      <el-table-column prop="account" label="账号" align="center" />
      <el-table-column prop="roleName" label="角色" align="center" />
      <el-table-column prop="companyName" label="所属客户" align="center" />
      <el-table-column prop="organizeName" label="所属部门" align="center" />
      <el-table-column prop="status" label="状态" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.status" type="success">
            启用
          </el-tag>
          <el-tag v-else type="danger">
            禁用
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-if="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total"
      @pagination="handleQuery"
    />
  </div>
</template>
