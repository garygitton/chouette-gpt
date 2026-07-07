<template>
  <div class="flex items-center">
    <Select :model-value="modelStore.currentModelId" @update:model-value="handleModelChange">
      <SelectTrigger data-testid="top-model-selector" class="h-8 md:h-9 w-[220px] md:w-[280px] bg-slate-100/50 dark:bg-[#070a12]/80 border-slate-200 dark:border-slate-800 text-xs md:text-sm shadow-sm backdrop-blur-sm transition-all focus:ring-1 focus:ring-indigo-500/50">
        <SelectValue placeholder="Choisir un modèle" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="model in modelStore.compatibleModels" :key="model.id" :value="model.id" class="text-xs md:text-sm">
            <div class="flex items-center space-x-2">
              <span class="font-medium text-slate-700 dark:text-slate-200">{{ model.name }}</span>
              <span v-if="model.backend === 'mlc'" class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">GPU</span>
              <span v-else class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">CPU</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <ModelDownloadDialog 
      v-model="showDownloadDialog" 
      :model="pendingModel" 
      @accept="confirmModelChange" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { useModelStore } from '~/stores/modelStore'
import { useChatStore } from '~/stores/chatStore'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { ModelInfo } from '~/types'

const ModelDownloadDialog = defineAsyncComponent(() => import('./ModelDownloadDialog.vue'))

const modelStore = useModelStore()
const chatStore = useChatStore()

const showDownloadDialog = ref(false)
const pendingModel = ref<ModelInfo | null>(null)

function handleModelChange(modelId: string) {
  if (modelId === modelStore.currentModelId) return
  
  const selectedModel = modelStore.models.find(m => m.id === modelId)
  if (!selectedModel) return

  pendingModel.value = selectedModel
  showDownloadDialog.value = true
}

function confirmModelChange() {
  if (pendingModel.value) {
    modelStore.currentModelId = pendingModel.value.id
    chatStore.initEngine(pendingModel.value.id)
  }
}
</script>
