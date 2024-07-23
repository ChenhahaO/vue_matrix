<script setup lang="ts">
import useStore from '@/store'
import { isQiankun } from '@/qiankun'

const { app, user, tagsView } = useStore()

const route = useRoute()
const router = useRouter()

const sidebar = computed(() => app.sidebar)

function toggleSideBar() {
  app.toggleSidebar()
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    user
      .logout()
      .then(() => {
        tagsView.delAllViews()
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`)
      })
  })
}
</script>

<template>
  <div class="navbar">
    <Hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />

    <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown
        v-if="!isQiankun"
        class="right-menu-item hover-effect mr-3"
        trigger="click"
      >
        <div class="h-[50px] flex items-center justify-center">
          <SvgIcon icon-class="user" class="!h-[30px] !w-[30px]" />
          <span> {{ user.user.account }}</span>
          <div i-carbon:caret-down />
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>

            <el-dropdown-item divided @click="logout">
              注销
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
  }
}
</style>
