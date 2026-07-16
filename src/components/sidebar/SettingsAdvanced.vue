<template>
<!-- Section 3: Limites & Ajustements -->
      <div class="accordion-item" data-testid="accordion-limits">
        <button 
          @click="emit('toggle', 'limits')" 
          class="accordion-trigger"
          :class="{ 'active': activeSection === 'limits' }"
          data-testid="accordion-limits-trigger"
        >
          <span class="accordion-title">
            <SlidersHorizontal class="icon-sliders text-indigo-500" />
            {{ t('accordion_advanced') }}
          </span>
          <ChevronUp v-if="activeSection === 'limits'" class="icon-chevron" />
          <ChevronDown v-else class="icon-chevron" />
        </button>

        <div v-show="activeSection === 'limits'" class="accordion-content space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span class="text-[10px] text-slate-400">Ajustements fins du modèle</span>
            <Button variant="ghost" size="sm" class="reset-button h-7 text-[10px]" @click="settingsStore.resetSettings()" data-testid="reset-settings-button">
              {{ t('reset_btn') || 'Réinitialiser' }}
            </Button>
          </div>

          <div class="parameter-item" data-testid="parameter-max-tokens">
            <div class="parameter-info">
              <span>{{ t('max_tokens_label') }}</span>
              <span class="parameter-value">{{ settingsStore.maxTokens }}</span>
            </div>
            <Slider v-model="maxTokensArray" :min="256" :max="4096" :step="256" data-testid="max-tokens-slider" />
          </div>

          <div class="parameter-item" :class="{ 'opacity-50 pointer-events-none': !supportsSampling || !settingsStore.doSample }" data-testid="parameter-topk">
            <div class="parameter-info">
              <span>Top K</span>
              <span class="parameter-value">{{ settingsStore.topK }}</span>
            </div>
            <Slider v-model="topKArray" :disabled="!supportsSampling || !settingsStore.doSample" :min="0" :max="100" :step="1" data-testid="topk-slider" />
          </div>

          <div class="parameter-item" :class="{ 'opacity-50 pointer-events-none': !supportsSampling }" data-testid="parameter-repetition-penalty">
            <div class="parameter-info">
              <span>{{ t('repetition_penalty_label') }}</span>
              <span class="parameter-value">{{ settingsStore.repetitionPenalty }}</span>
            </div>
            <Slider v-model="repetitionPenaltyArray" :disabled="!supportsSampling" :min="1.0" :max="2.0" :step="0.05" data-testid="repetition-penalty-slider" />
          </div>
        </div>
      </div>

      </template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSettings } from '~/contexts/settingsContext'
import { useModel } from '~/contexts/modelContext'
import { useChat } from '~/contexts/chatContext'
import { useI18n } from '~/composables/useI18n'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Slider } from '~/components/ui/slider'
import { Textarea } from '~/components/ui/textarea'
import { X, ChevronDown, ChevronUp, SlidersHorizontal, Check, Linkedin, Github, Sparkles } from 'lucide-vue-next'

const props = defineProps<{
  activeSection: string | null
}>()

const emit = defineEmits<{
  (e: 'toggle', section: string): void
}>()

const settingsStore = useSettings()
const modelStore = useModel()
const chatStore = useChat()
const { t } = useI18n()

// Only include what's needed for the section





const supportsSampling = computed(() => {
  return modelStore.currentModel?.supportsSampling !== false
})

const maxTokensArray = computed({
  get: () => [settingsStore.maxTokens],
  set: (val) => { settingsStore.maxTokens = val[0] }
})
const topKArray = computed({
  get: () => [settingsStore.topK],
  set: (val) => { settingsStore.topK = val[0] }
})
const repetitionPenaltyArray = computed({
  get: () => [settingsStore.repetitionPenalty],
  set: (val) => { settingsStore.repetitionPenalty = val[0] }
})


</script>
