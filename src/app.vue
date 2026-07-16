<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ModelDownloadDialog
    v-model="chatContext.showDownloadConfirmation"
    :model="chatContext.pendingModelForConfirmation"
    @accept="chatContext.confirmDownload"
  />
</template>

<script setup lang="ts">
import { onErrorCaptured, onMounted, watch, provide } from 'vue'
import { deviceKey, useProvideDevice } from '~/contexts/deviceContext'
import { settingsKey, useProvideSettings } from '~/contexts/settingsContext'
import { modelKey, useProvideModel } from '~/contexts/modelContext'
import { conversationKey, useProvideConversation } from '~/contexts/conversationContext'
import { chatKey, useProvideChat } from '~/contexts/chatContext'

// Root-level Context Providers
const deviceContext = useProvideDevice()
provide(deviceKey, deviceContext)

const settingsContext = useProvideSettings()
provide(settingsKey, settingsContext)

const modelContext = useProvideModel(deviceContext)
provide(modelKey, modelContext)

const conversationContext = useProvideConversation(modelContext)
provide(conversationKey, conversationContext)

const chatContext = useProvideChat(modelContext, conversationContext, settingsContext, deviceContext)
provide(chatKey, chatContext)

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

  settingsContext.initSettings()

  // Detect best model and initialize
  modelContext.detectBestModel()
})
</script>