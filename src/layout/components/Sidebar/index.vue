<script setup lang="ts">
import SidebarItem from './SidebarItem.vue'
import Logo from './Logo.vue'
import useStore from '@/store'

const { permission, setting, app } = useStore()

const route = useRoute()
const routes = computed(() => permission.routes)
const showLogo = computed(() => setting.sidebarLogo)
const isCollapse = computed(() => !app.sidebar.opened)

const activeMenu = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu)
    return meta.activeMenu as string

  return path
})
</script>

<template>
  <div :class="{ 'has-logo': showLogo }">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarItem
          v-for="r in routes"
          :key="r.path"
          :item="r"
          :base-path="r.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
