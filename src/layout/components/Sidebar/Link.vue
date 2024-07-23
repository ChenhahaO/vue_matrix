<script setup  lang="ts">
import { isExternal } from '@/utils/validate'
import useStore from '@/store'

const props = defineProps<{ to: string }>()

const { app } = useStore()
const sidebar = computed(() => app.sidebar)
const device = computed(() => app.device)
const router = useRouter()

function push() {
  if (device.value === 'mobile' && sidebar.value.opened === true)
    app.closeSideBar(false)

  router.push(props.to).catch((err) => {
    console.log(err)
  })
}
</script>

<template>
  <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
    <slot />
  </a>
  <div v-else @click="push">
    <slot />
  </div>
</template>
