<template>
  <div class="bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-3 space-y-3 mb-4 border border-slate-200/60 dark:border-slate-800/60">
    <div class="flex items-center justify-between">
      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
        <Cpu class="w-3 h-3 mr-1.5" />
        Modèle IA Local
      </span>
    </div>
    
    <Select :model-value="modelStore.currentModelId" @update:model-value="handleModelChange" :disabled="chatStore.isEngineLoading">
      <SelectTrigger class="h-9 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-xs shadow-sm">
        <SelectValue placeholder="Choisir un modèle" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="model in modelStore.compatibleModels" :key="model.id" :value="model.id" class="text-xs cursor-pointer">
            <div class="flex items-center justify-between w-full gap-2">
              <span class="font-medium">{{ model.name }}</span>
              <Badge variant="secondary" class="text-[9px] px-1 py-0 h-4 bg-slate-100 dark:bg-slate-800 text-slate-500">{{ model.totalSize }}</Badge>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <!-- State when loading -->
    <div v-if="chatStore.isEngineLoading" class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
      <div class="flex justify-between text-[10px] font-medium text-slate-600 dark:text-slate-400">
        <span class="flex items-center overflow-hidden whitespace-nowrap text-ellipsis pr-2">
          <Loader2 class="w-3 h-3 mr-1.5 flex-shrink-0 animate-spin text-indigo-500" />
          <span class="truncate">{{ chatStore.engineProgress.text || 'Chargement...' }}</span>
        </span>
        <span class="text-indigo-600 dark:text-indigo-400 flex-shrink-0">{{ Math.round(chatStore.engineProgress.progress * 100) }}%</span>
      </div>
      <Progress :model-value="chatStore.engineProgress.progress * 100" class="h-1.5" indicator-class="bg-indigo-500" />
      <Button variant="ghost" size="sm" @click="chatStore.cancelDownload" class="w-full h-7 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
        Annuler
      </Button>
    </div>

    <!-- State when a new model is selected but not ready -->
    <div v-else-if="!chatStore.isEngineReady && pendingModel" class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
      <p class="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Ce modèle doit être téléchargé et chargé en mémoire.</p>
      <Button @click="startDownload" size="sm" class="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs shadow-sm">
        <Download class="w-3.5 h-3.5 mr-1.5" />
        Télécharger et activer
      </Button>
    </div>
    
    <!-- State when engine is ready -->
    <div v-else-if="chatStore.isEngineReady" class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
      <span class="flex items-center text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 class="w-3.5 h-3.5 mr-1.5" /> Prêt à l'emploi
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModelStore } from '~/stores/modelStore'
import { useChatStore } from '~/stores/chatStore'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Loader2, Download, CheckCircle2, Cpu } from 'lucide-vue-next'

const modelStore = useModelStore()
const chatStore = useChatStore()

const pendingModel = computed(() => {
  return modelStore.models.find(m => m.id === modelStore.currentModelId)
})

function handleModelChange(modelId: string) {
  if (modelId === modelStore.currentModelId) return
  modelStore.currentModelId = modelId
  chatStore.isEngineReady = false
}

function startDownload() {
  if (modelStore.currentModelId) {
    chatStore.downloadMultipleEngines([modelStore.currentModelId])
  }
}
</script>
