<script setup lang="ts">
const state = reactive({
  copyrightDates: new Date().getFullYear(),
  copyrightCompany: '云和互动',
  copyrightWebsite: 'https://www.yunheit.com/index.html',
})

const { copyrightDates, copyrightCompany, copyrightWebsite } = toRefs(state)
</script>

<template>
  <div class="copyright">
    Copyright © {{ copyrightDates }}
    <el-link :href="copyrightWebsite" :underline="false" target="_blank">
      {{ copyrightCompany }}
    </el-link>
  </div>
</template>

<style lang="scss" scoped>
.copyright {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 15px;
  color: #808695;
  font-size: 14px;
}
</style>
