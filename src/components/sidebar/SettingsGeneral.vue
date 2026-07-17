<template>
<!-- Section 1: Prompt Système -->
      <div class="accordion-item">
        <button 
          class="accordion-trigger" 
          :class="{ 'active': activeSection === 'general' }"
          data-testid="accordion-general-trigger"
          @click="emit('toggle', 'general')"
        >
          <span class="accordion-title">
            <SlidersHorizontal class="icon-sliders" />
            {{ t('accordion_general') }}
          </span>
          <ChevronUp v-if="activeSection === 'general'" class="icon-chevron" />
          <ChevronDown v-else class="icon-chevron" />
        </button>

        <div v-show="activeSection === 'general'" class="accordion-content">
          <div class="system-prompt-header">
            <label>{{ t('system_prompt_label') || 'Prompt Système' }}</label>
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform translate-y-1 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
              leave-active-class="transition duration-500 ease-in"
              leave-from-class="transform translate-y-0 opacity-100"
              leave-to-class="transform translate-y-1 opacity-0"
            >
              <span v-if="showSavedFeedback" data-testid="system-prompt-saved-feedback" class="saved-feedback">
                <Check class="icon-check" /> {{ t('saved_label') || 'Enregistré' }}
              </span>
            </Transition>
          </div>
          <Textarea 
            v-model="settingsStore.systemPrompt"
            data-testid="system-prompt-textarea" 
            :placeholder="t('system_prompt_placeholder') || 'Comportement global de l\'assistant...'" 
            class="system-prompt-textarea mt-2"
            :class="{ 'saved-feedback-active': showSavedFeedback }"
            @blur="triggerSavedFeedback"
          />
        </div>
      </div>

      </template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '~/stores/settingsStore'
import { useI18n } from '~/composables/useI18n'
import { Textarea } from '~/components/ui/textarea'
import { ChevronDown, ChevronUp, SlidersHorizontal, Check } from 'lucide-vue-next'

const props = defineProps<{
  activeSection: string | null
}>()

const emit = defineEmits<{
  (e: 'toggle', section: string): void
}>()

const settingsStore = useSettingsStore()
const { t } = useI18n()

const showSavedFeedback = ref(false)
let feedbackTimeout: any = null

function triggerSavedFeedback() {
  showSavedFeedback.value = true
  if (feedbackTimeout) clearTimeout(feedbackTimeout)
  feedbackTimeout = setTimeout(() => {
    showSavedFeedback.value = false
  }, 2000)
}
</script>
