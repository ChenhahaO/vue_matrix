<script setup lang="ts">
import { AppMain, Navbar, TagsView } from './components/index'
import Sidebar from './components/Sidebar/index.vue'
import useStore from '@/store'
import { isQiankun } from '@/qiankun'

const { width } = useWindowSize()
const WIDTH = isQiankun ? 992 - 60 : 992

const { app, setting } = useStore()

const sidebar = computed(() => app.sidebar)
const device = computed(() => app.device)
const needTagsView = computed(() => setting.tagsView)
const fixedHeader = computed(() => setting.fixedHeader)

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile',
}))

const mobileAdaptationcss = computed(() => ({
  mobileleft: device.value === 'mobile' && !isQiankun && !sidebar.value.opened,
  qiankunmmobileleft:
    device.value === 'mobile' && isQiankun && !sidebar.value.opened,
}))

watchEffect(() => {
  if (width.value < WIDTH) {
    app.toggleDevice('mobile')
    app.closeSideBar(true)
  }
  else {
    app.toggleDevice('desktop')
  }
})

function handleClickOutside() {
  app.closeSideBar(false)
}
</script>

<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    /> -->
    <!-- <Sidebar
      class="sidebar-container"
      :class="mobileAdaptationcss"
      :style="{ left: isQiankun ? '60px' : '0px' }"
    /> -->
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <!-- <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar />
        <TagsView v-if="needTagsView" />
      </div> -->
      <AppMain />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.module.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
