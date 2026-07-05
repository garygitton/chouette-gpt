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
    
    <!-- Model Details Card -->
    <div v-if="pendingModel" class="mt-2 p-2.5 bg-white dark:bg-[#0b0f19] rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 space-y-1.5 shadow-sm">
      <div class="flex justify-between items-center">
        <span class="font-semibold text-slate-600 dark:text-slate-300">Moteur:</span>
        <span class="font-mono text-indigo-600 dark:text-indigo-400">{{ deviceStore.deviceInfo?.hasWebGPU ? 'GPU (WebGPU)' : 'CPU (WASM)' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold text-slate-600 dark:text-slate-300">RAM Requise:</span>
        <span class="font-mono">{{ pendingModel.ramRequired >= 1024 ? (pendingModel.ramRequired / 1024).toFixed(1) + ' GB' : pendingModel.ramRequired + ' MB' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold text-slate-600 dark:text-slate-300">Taille:</span>
        <span class="font-mono">{{ pendingModel.totalSize }}</span>
      </div>
    </div>

    <!-- State when engine is ready -->
    <div v-if="chatStore.isEngineReady" class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
      <span class="flex items-center text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 class="w-3.5 h-3.5 mr-1.5" /> Prêt à l'emploi
      </span>
    </div>

    <!-- State when engine is paused -->
    <div v-if="chatStore.isEnginePaused" class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
      <span class="flex items-center text-[10px] font-medium text-orange-600 dark:text-orange-400">
        <Pause class="w-3.5 h-3.5 mr-1.5" /> En pause
      </span>
      <Button variant="ghost" size="sm" class="h-6 text-[10px] px-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300" @click="resumeDownload">
        <Play class="w-3 h-3 mr-1" /> Reprendre
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModel } from '~/contexts/modelContext'
import { useChat } from '~/contexts/chatContext'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Loader2, CheckCircle2, Cpu, Pause, Play } from 'lucide-vue-next'
import { useDevice } from '~/contexts/deviceContext'

const modelStore = useModel()
const chatStore = useChat()
const deviceStore = useDevice()

const pendingModel = computed(() => {
  return modelStore.models.find(m => m.id === modelStore.currentModelId)
})

function handleModelChange(modelId: any) {
  if (typeof modelId !== 'string' || modelId === modelStore.currentModelId) return
  modelStore.currentModelId = modelId
}

function resumeDownload() {
  console.log('[SIDEBAR] resumeDownload clicked, model:', modelStore.currentModelId)
  chatStore.downloadMultipleEngines([modelStore.currentModelId])
}
</script>
