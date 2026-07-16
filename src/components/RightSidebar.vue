<template>
  <div class="right-sidebar">
    <div class="right-sidebar-header">
      <h2>{{ t('settings') }}</h2>
      <Button v-if="isMobile" variant="ghost" size="icon" @click="$emit('close-sidebar')">
        <X class="icon-x" />
      </Button>
    </div>

    <!-- Token Consumption -->
    <div class="right-sidebar-section">
      <div class="token-info">
        <span class="token-label">Tokens de conversation</span>
        <span class="token-count">{{ chatStore.conversationTokens }} / 8192</span>
      </div>
      <Progress :model-value="(chatStore.conversationTokens / 8192) * 100" class="progress-bar" />
    </div>

    <div class="accordion-container">
      <SettingsGeneral :active-section="activeSection" @toggle="toggleSection" />
      <SettingsSampling :active-section="activeSection" @toggle="toggleSection" />
      <SettingsAdvanced :active-section="activeSection" @toggle="toggleSection" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSettings } from '~/contexts/settingsContext'
import { useModel } from '~/contexts/modelContext'
import { useChat } from '~/contexts/chatContext'
import { useI18n } from '~/composables/useI18n'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { X } from 'lucide-vue-next'
import SettingsGeneral from '~/components/sidebar/SettingsGeneral.vue'
import SettingsSampling from '~/components/sidebar/SettingsSampling.vue'
import SettingsAdvanced from '~/components/sidebar/SettingsAdvanced.vue'

const activeSection = ref<'general' | 'sampling' | 'limits' | null>('general')

function toggleSection(sec: string) {
  activeSection.value = activeSection.value === sec ? null : sec as 'general' | 'sampling' | 'limits'
}

const props = defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  'close-sidebar': []
}>()

const settingsStore = useSettings()
const modelStore = useModel()
const chatStore = useChat()
const { t } = useI18n()

// Automatically turn off creative mode for models that do not support sampling
watch(() => modelStore.currentModelId, () => {
  if (modelStore.currentModel?.supportsSampling === false) {
    settingsStore.doSample = false
  }
}, { immediate: true })

</script>

<style scoped>
.right-sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  padding: 1rem;
  overflow-y: auto;
  box-sizing: border-box;
}

:global(.dark) .right-sidebar {
  background-color: #070a12;
}

.right-sidebar > * + * {
  margin-top: 1.5rem;
}

.right-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.right-sidebar-header h2 {
  font-weight: 600;
  color: #1e293b;
}

:global(.dark) .right-sidebar-header h2 {
  color: #e2e8f0;
}

.icon-x {
  width: 1.25rem;
  height: 1.25rem;
}

.right-sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.token-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.token-label {
  font-weight: 500;
  color: #334155;
}

:global(.dark) .token-label {
  color: #cbd5e1;
}

.token-count {
  font-size: 0.75rem;
  color: #64748b;
}

.progress-bar {
  height: 0.5rem;
}

/* Accordion Styles */
:deep(.accordion-container) {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

:deep(.accordion-item) {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #ffffff;
  overflow: hidden;
  transition: all 0.2s ease;
}

:global(.dark) :deep(.accordion-item) {
  border-color: #1e293b;
  background-color: #0b0f19;
}

:deep(.accordion-item:hover) {
  border-color: #cbd5e1;
}

:global(.dark) :deep(.accordion-item:hover) {
  border-color: #334155;
}

:deep(.accordion-trigger) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.875rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #334155;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

:global(.dark) :deep(.accordion-trigger) {
  color: #cbd5e1;
}

:deep(.accordion-trigger:hover) {
  background-color: #f8fafc;
}

:global(.dark) :deep(.accordion-trigger:hover) {
  background-color: #0f172a;
}

:deep(.accordion-trigger.active) {
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

:global(.dark) :deep(.accordion-trigger.active) {
  border-bottom-color: #1e293b;
  background-color: #0f172a;
}

:deep(.accordion-title) {
  display: flex;
  align-items: center;
}

:deep(.icon-sliders) {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  color: #6366f1;
}

:deep(.icon-chevron) {
  width: 1rem;
  height: 1rem;
  color: #64748b;
}

:deep(.accordion-content) {
  padding: 1rem;
  background-color: #ffffff;
}

:global(.dark) :deep(.accordion-content) {
  background-color: #0b0f19;
}

:deep(.reset-button) {
  height: 1.5rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

:deep(.reset-button:hover) {
  color: #475569;
}

:deep(.parameter-item) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

:deep(.parameter-info) {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

:deep(.parameter-value) {
  color: #64748b;
  font-family: monospace;
  font-weight: 600;
}

:deep(.system-prompt-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.system-prompt-header label) {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

:global(.dark) :deep(.system-prompt-header label) {
  color: #cbd5e1;
}

:deep(.saved-feedback) {
  font-size: 11px;
  font-weight: 500;
  color: #059669;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

:global(.dark) :deep(.saved-feedback) {
  color: #34d399;
}

:deep(.icon-check) {
  width: 0.875rem;
  height: 0.875rem;
}

:deep(.system-prompt-textarea) {
  height: 6rem;
  resize: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  width: 100%;
}

:deep(.saved-feedback-active) {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
}

</style>
