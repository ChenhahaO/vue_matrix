<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<!-- <script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import FormProcessDesigner from '@/views/flow/admin/FormProcessDesigner.vue'
</script>

<template>
  <div class="app">
    <el-config-provider :locale="zhCn">
      <FormProcessDesigner />
    </el-config-provider>
  </div>
</template> -->
