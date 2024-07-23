<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-banner"></div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <h3 class="title">vue矩阵</h3>
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            placeholder="用户名"
            auto-complete="on"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            auto-complete="on"
            show-password
            :prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-top: 30px"
          @click.prevent="handleLogin"
          >登录
        </el-button>
      </el-form>
    </div>
    <div v-if="showCopyright == true" class="copyright">
      <Copyright />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, watch } from 'vue';
import { ElForm } from 'element-plus';
import Copyright from '@/components/Copyright/index.vue';
import { User, Lock } from '@element-plus/icons-vue';
import router from '@/router';
import useStore from '@/store';
import { useRoute } from 'vue-router';
import { LoginForm } from '@/api/auth/types';

const { user } = useStore();
const route = useRoute();

const loginFormRef = ref(ElForm);

const state = reactive({
  redirect: '',
  loginForm: {
    account: '',
    password: ''
  } as LoginForm,
  loginRules: {
    account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  },
  loading: false,
  otherQuery: {},
  showCopyright: true
});

const { loginForm, loginRules, loading, showCopyright } = toRefs(state);

function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      user
        .login(state.loginForm)
        .then(() => {
          router.push({ path: state.redirect || '/', query: state.otherQuery });
          state.loading = false;
        })
        .catch(() => {
          state.loading = false;
        });
    } else {
      return false;
    }
  });
}

watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  { immediate: true }
);

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-image: url('@/assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center center;
  overflow: hidden;

  .login-box {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 5px #999;

    .login-banner {
      width: 300px;
      background-image: url('@/assets/images/login-banner.jpg');
      background-size: cover;
      background-position: center center;
    }

    .login-form {
      width: 450px;
      padding: 50px 35px 30px;
      overflow: hidden;
    }

    .title {
      font-size: 22px;
      color: #666;
      margin: 0 auto 30px;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
