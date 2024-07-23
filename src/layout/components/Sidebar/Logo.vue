<script setup lang="ts">
defineProps<{ collapse: boolean }>()

const logo = new URL('/src/assets/logo.png', import.meta.url).href
const full_logo = new URL('/src/assets/full_logo.png', import.meta.url).href
const title = ref(import.meta.env.VITE_APP_TITLE)
</script>

<template>
  <transition>
    <router-link v-if="collapse" key="collapse" to="/">
      <div class="h-[50px] flex items-center justify-center">
        <img v-if="logo" :src="logo" class="h-8 w-8">
        <h1 v-else>
          {{ title }}
        </h1>
      </div>
    </router-link>

    <router-link v-else key="expand" to="/">
      <div class="h-[50px] flex items-center justify-center">
        <img v-if="full_logo" :src="full_logo">
        <span v-else class="ml-3 text-base font-bold">{{ title }}</span>
      </div>
    </router-link>
  </transition>
</template>
