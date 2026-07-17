<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ModelDownloadDialog
    v-model="chatStore.showDownloadConfirmation"
    :model="chatStore.pendingModelForConfirmation"
    @accept="chatStore.confirmDownload"
  />
</template>

<script setup lang="ts">
import { onErrorCaptured, onMounted } from 'vue'
import { useDeviceStore } from '~/stores/deviceStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useModelStore } from '~/stores/modelStore'
import { useChatStore } from '~/stores/chatStore'

const deviceStore = useDeviceStore()
const settingsStore = useSettingsStore()
const modelStore = useModelStore()
const chatStore = useChatStore()

onErrorCaptured((err) => {
  console.error('[VUE ERROR CAPTURED]', err.stack || err.message || err)
})

onMounted(() => {
  window.addEventListener('error', (event) => {
    console.error('[WINDOW UNHANDLED ERROR]', event.error?.stack || event.error?.message || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[WINDOW UNHANDLED REJECTION]', event.reason?.stack || event.reason?.message || event.reason);
  });

  settingsStore.initSettings()
  modelStore.detectBestModel()
})
</script>