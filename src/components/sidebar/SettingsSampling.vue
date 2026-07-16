<template>
<!-- Section 2: Paramètres Créatifs (Sampling) -->
      <div class="accordion-item" data-testid="accordion-sampling">
        <button 
          @click="emit('toggle', 'sampling')" 
          class="accordion-trigger"
          :class="{ 'active': activeSection === 'sampling' }"
          data-testid="accordion-sampling-trigger"
        >
          <span class="accordion-title">
            <Sparkles class="icon-sliders text-pink-500" />
            {{ t('accordion_sampling') }}
          </span>
          <ChevronUp v-if="activeSection === 'sampling'" class="icon-chevron" />
          <ChevronDown v-else class="icon-chevron" />
        </button>

        <div v-show="activeSection === 'sampling'" class="accordion-content space-y-4">
          <!-- Alert if model doesn't support sampling -->
          <div v-if="!supportsSampling" class="p-3 text-[11px] rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30" data-testid="math-unsupported-alert">
            {{ t('not_supported_by_model') }} (décodage déterministe forcé)
          </div>

          <div class="parameter-item" :class="{ 'opacity-50 pointer-events-none': !supportsSampling }" data-testid="parameter-creative-mode">
            <div class="flex items-center justify-between">
              <div class="flex flex-col text-left">
                <span class="font-semibold text-sm">{{ t('do_sample_label') }}</span>
                <span class="text-[10px] text-slate-400 max-w-[200px]">{{ t('do_sample_desc') }}</span>
              </div>
              <button 
                type="button" 
                :disabled="!supportsSampling"
                @click="settingsStore.doSample = !settingsStore.doSample"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed"
                :class="[settingsStore.doSample ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800']"
                data-testid="creative-mode-toggle"
              >
                <span 
                  class="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out"
                  :class="[settingsStore.doSample ? 'translate-x-5' : 'translate-x-0']"
                />
              </button>
            </div>
          </div>

          <div class="parameter-item" :class="{ 'opacity-50 pointer-events-none': !supportsSampling || !settingsStore.doSample }" data-testid="parameter-temperature">
            <div class="parameter-info">
              <span>{{ t('temperature_label') }}</span>
              <span class="parameter-value">{{ settingsStore.temperature }}</span>
            </div>
            <Slider v-model="temperatureArray" :disabled="!supportsSampling || !settingsStore.doSample" :min="0.1" :max="2" :step="0.1" data-testid="temperature-slider" />
          </div>

          <div class="parameter-item" :class="{ 'opacity-50 pointer-events-none': !supportsSampling || !settingsStore.doSample }" data-testid="parameter-topp">
            <div class="parameter-info">
              <span>{{ t('topp_label') }}</span>
              <span class="parameter-value">{{ settingsStore.topP }}</span>
            </div>
            <Slider v-model="topPArray" :disabled="!supportsSampling || !settingsStore.doSample" :min="0.1" :max="1" :step="0.05" data-testid="topp-slider" />
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

const temperatureArray = computed({
  get: () => [settingsStore.temperature],
  set: (val) => { settingsStore.temperature = val[0] }
})
const topPArray = computed({
  get: () => [settingsStore.topP],
  set: (val) => { settingsStore.topP = val[0] }
})




</script>
