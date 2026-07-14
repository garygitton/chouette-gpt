<template>
  <div class="flex flex-col h-full bg-slate-50 dark:bg-[#070a12] p-4 space-y-6 overflow-y-auto">
    <div class="flex items-center justify-between mb-2">
      <h2 class="font-semibold text-slate-800 dark:text-slate-200">Paramètres</h2>
      <Button v-if="isMobile" variant="ghost" size="icon" @click="$emit('close-sidebar')">
        <X class="w-5 h-5" />
      </Button>
    </div>

    <!-- Token Consumption -->
    <div class="space-y-2">
      <div class="flex justify-between items-center text-sm">
        <span class="font-medium text-slate-700 dark:text-slate-300">Tokens de conversation</span>
        <span class="text-xs text-slate-500">{{ chatStore.conversationTokens }} / 8192</span>
      </div>
      <Progress :model-value="(chatStore.conversationTokens / 8192) * 100" class="h-2" />
    </div>



    <!-- System Prompt -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Prompt Système</label>
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform translate-y-1 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-500 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform translate-y-1 opacity-0"
        >
          <span v-if="showSavedFeedback" data-testid="system-prompt-saved-feedback" class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check class="w-3.5 h-3.5" /> Enregistré
          </span>
        </Transition>
      </div>
      <Textarea 
        data-testid="system-prompt-textarea"
        v-model="settingsStore.systemPrompt" 
        placeholder="Comportement global de l'assistant..." 
        class="h-24 resize-none text-sm transition-all duration-300"
        :class="{
          'border-emerald-500 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 ring-2 ring-emerald-500/20': showSavedFeedback
        }"
        @blur="triggerSavedFeedback"
      />
    </div>

    <!-- Collapsible Advanced Parameters -->
    <Collapsible v-slot="{ open }" v-model:open="isAdvancedOpen" class="w-full pt-4 border-t border-slate-200 dark:border-slate-800">
      <CollapsibleTrigger class="flex items-center justify-between w-full font-semibold text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors py-2">
        <span class="flex items-center">
          <SlidersHorizontal class="w-4 h-4 mr-2 text-indigo-500" />
          Paramètres avancés
        </span>
        <ChevronUp v-if="open" class="w-4 h-4 text-slate-500" />
        <ChevronDown v-else class="w-4 h-4 text-slate-500" />
      </CollapsibleTrigger>

      <CollapsibleContent class="space-y-6 pt-4">
        <!-- Basic Parameters -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xs uppercase font-bold text-slate-500 tracking-wider">Configuration base</h3>
            <Button variant="ghost" size="sm" class="h-6 px-2 text-xs text-slate-400 hover:text-slate-600" @click="settingsStore.resetSettings()">
              Réinitialiser
            </Button>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span>Temperature</span>
              <span class="text-slate-500 font-mono font-semibold">{{ settingsStore.temperature }}</span>
            </div>
            <Slider v-model="temperatureArray" :min="0" :max="2" :step="0.1" />
          </div>

          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span>Top P</span>
              <span class="text-slate-500 font-mono font-semibold">{{ settingsStore.topP }}</span>
            </div>
            <Slider v-model="topPArray" :min="0" :max="1" :step="0.05" />
          </div>

          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span>Max Tokens</span>
              <span class="text-slate-500 font-mono font-semibold">{{ settingsStore.maxTokens }}</span>
            </div>
            <Slider v-model="maxTokensArray" :min="256" :max="4096" :step="256" />
          </div>
        </div>

        <!-- Advanced Parameters -->
        <div class="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800 pb-8">
          <h3 class="text-xs uppercase font-bold text-slate-500 tracking-wider">Ajustements fins</h3>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span>Top K</span>
              <span class="text-slate-500 font-mono font-semibold">{{ settingsStore.topK }}</span>
            </div>
            <Slider v-model="topKArray" :min="0" :max="100" :step="1" />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>

    <!-- Socials Section -->
    <div class="mt-auto pt-6 flex flex-col items-center justify-center space-y-2.5 border-t border-slate-200 dark:border-slate-800">
      <div class="flex items-center space-x-4">
        <a href="https://www.linkedin.com/in/garygitton" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-indigo-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded" title="LinkedIn" aria-label="Profil LinkedIn de Gary Gitton" data-testid="sidebar-linkedin-link">
          <Linkedin class="w-4 h-4" />
        </a>
        <a href="https://github.com/garygitton/chouette-gpt" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-indigo-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded" title="GitHub" aria-label="Dépôt GitHub du projet" data-testid="sidebar-github-link">
          <Github class="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettings } from '~/contexts/settingsContext'
import { useModel } from '~/contexts/modelContext'
import { useChat } from '~/contexts/chatContext'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Slider } from '~/components/ui/slider'
import { Textarea } from '~/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import { X, ChevronDown, ChevronUp, SlidersHorizontal, Check, Linkedin, Github } from 'lucide-vue-next'

const showSavedFeedback = ref(false)
let feedbackTimeout: any = null

function triggerSavedFeedback() {
  showSavedFeedback.value = true
  if (feedbackTimeout) clearTimeout(feedbackTimeout)
  feedbackTimeout = setTimeout(() => {
    showSavedFeedback.value = false
  }, 2000)
}

const isAdvancedOpen = ref(false)

const props = defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  'close-sidebar': []
}>()

const settingsStore = useSettings()
const modelStore = useModel()
const chatStore = useChat()

// Sliders require arrays
const temperatureArray = computed({
  get: () => [settingsStore.temperature],
  set: (val) => { settingsStore.temperature = val[0] }
})
const topPArray = computed({
  get: () => [settingsStore.topP],
  set: (val) => { settingsStore.topP = val[0] }
})
const maxTokensArray = computed({
  get: () => [settingsStore.maxTokens],
  set: (val) => { settingsStore.maxTokens = val[0] }
})
const topKArray = computed({
  get: () => [settingsStore.topK],
  set: (val) => { settingsStore.topK = val[0] }
})

</script>
