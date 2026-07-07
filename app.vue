<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settingsStore'
import { useModelStore } from '~/stores/modelStore'
import { onErrorCaptured, onMounted } from 'vue'

onErrorCaptured((err) => {
  console.error('[VUE ERROR CAPTURED]', err.stack || err.message || err)
})

// Initialize app-level settings (like dark mode)
onMounted(() => {
  window.addEventListener('error', (event) => {
    console.error('[WINDOW UNHANDLED ERROR]', event.error?.stack || event.error?.message || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[WINDOW UNHANDLED REJECTION]', event.reason?.stack || event.reason?.message || event.reason);
  });

  const settingsStore = useSettingsStore()
  settingsStore.initSettings()

  const modelStore = useModelStore()
  modelStore.detectBestModel()
})
</script>