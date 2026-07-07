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
        <span class="font-medium text-slate-700 dark:text-slate-300">Tokens de session</span>
        <span class="text-xs text-slate-500">{{ chatStore.sessionTokens }} / 8192</span>
      </div>
      <Progress :model-value="(chatStore.sessionTokens / 8192) * 100" class="h-2" />
    </div>

    <!-- Model Selection -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Modèle</label>
      <Select :model-value="modelStore.currentModelId" @update:model-value="handleModelChange">
        <SelectTrigger>
          <SelectValue placeholder="Choisir un modèle" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="model in modelStore.compatibleModels" :key="model.id" :value="model.id">
              {{ model.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <!-- System Prompt -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Prompt Système</label>
      <Textarea 
        v-model="settingsStore.systemPrompt" 
        placeholder="Comportement global de l'assistant..." 
        class="h-24 resize-none text-sm"
      />
    </div>

    <!-- Basic Parameters -->
    <div class="space-y-6 pt-2 border-t border-slate-200 dark:border-slate-800">
      <h3 class="text-xs uppercase font-bold text-slate-500 tracking-wider">Base</h3>
      
      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span>Temperature</span>
          <span class="text-slate-500">{{ settingsStore.temperature }}</span>
        </div>
        <Slider v-model="temperatureArray" :min="0" :max="2" :step="0.1" />
      </div>

      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span>Top P</span>
          <span class="text-slate-500">{{ settingsStore.topP }}</span>
        </div>
        <Slider v-model="topPArray" :min="0" :max="1" :step="0.05" />
      </div>

      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span>Max Tokens</span>
          <span class="text-slate-500">{{ settingsStore.maxTokens }}</span>
        </div>
        <Slider v-model="maxTokensArray" :min="256" :max="4096" :step="256" />
      </div>
    </div>

    <!-- Advanced Parameters -->
    <div class="space-y-6 pt-2 border-t border-slate-200 dark:border-slate-800 pb-8">
      <h3 class="text-xs uppercase font-bold text-slate-500 tracking-wider">Avancé</h3>
      
      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span>Top K</span>
          <span class="text-slate-500">{{ settingsStore.topK }}</span>
        </div>
        <Slider v-model="topKArray" :min="0" :max="100" :step="1" />
      </div>

      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span>Frequency Penalty</span>
          <span class="text-slate-500">{{ settingsStore.frequencyPenalty }}</span>
        </div>
        <Slider v-model="frequencyPenaltyArray" :min="0" :max="2" :step="0.1" />
      </div>

      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span>Presence Penalty</span>
          <span class="text-slate-500">{{ settingsStore.presencePenalty }}</span>
        </div>
        <Slider v-model="presencePenaltyArray" :min="0" :max="2" :step="0.1" />
      </div>
    </div>

    <ModelDownloadDialog 
      v-model="showDownloadDialog" 
      :model="pendingModel" 
      @accept="confirmModelChange" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '~/stores/settingsStore'
import { useModelStore } from '~/stores/modelStore'
import { useChatStore } from '~/stores/chatStore'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Slider } from '~/components/ui/slider'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { X } from 'lucide-vue-next'
import ModelDownloadDialog from './ModelDownloadDialog.vue'
import type { ModelInfo } from '~/types'

const props = defineProps<{
  isMobile?: boolean
}>()

const emit = defineEmits<{
  'close-sidebar': []
}>()

const settingsStore = useSettingsStore()
const modelStore = useModelStore()
const chatStore = useChatStore()

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
const frequencyPenaltyArray = computed({
  get: () => [settingsStore.frequencyPenalty],
  set: (val) => { settingsStore.frequencyPenalty = val[0] }
})
const presencePenaltyArray = computed({
  get: () => [settingsStore.presencePenalty],
  set: (val) => { settingsStore.presencePenalty = val[0] }
})

// Model Change Flow
const showDownloadDialog = ref(false)
const pendingModel = ref<ModelInfo | null>(null)

function handleModelChange(modelId: string) {
  if (modelId === modelStore.currentModelId) return
  
  const selectedModel = modelStore.models.find(m => m.id === modelId)
  if (!selectedModel) return

  // Check if model is already cached/downloaded. We can verify if status is available
  // Web-LLM caches it, if it's the first time, it might need large download.
  // We'll show the popup for ANY new model change unless we have a specific 'downloaded' flag.
  // Since we don't track 'downloaded' easily without checking CacheAPI, we'll show it for any switch.
  // Actually, WebLLM has `hasModelInCache`. For now we assume a change triggers confirmation.
  pendingModel.value = selectedModel
  showDownloadDialog.value = true
}

function confirmModelChange() {
  if (pendingModel.value) {
    modelStore.currentModelId = pendingModel.value.id
    // Trigger engine init with the new model
    chatStore.initEngine(pendingModel.value.id)
  }
}
</script>
