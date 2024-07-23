<template>
  <div class="home_bg"></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.home_bg {
  // background: url('@/assets/images/login-bg.jpg') no-repeat center center;
  background-size: cover;
  height: calc(100vh - 50px);
  border: 30px solid #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .logo {
    width: 40%;
  }
  .logo2 {
    margin-top: 20px;
    width: 25%;
  }
}
</style>
