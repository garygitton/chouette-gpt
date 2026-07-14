<template>
  <div class="bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-3 space-y-3 mb-4 border border-slate-200/60 dark:border-slate-800/60">
    <div class="flex items-center justify-between mb-2">
      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
        <Cpu class="w-3 h-3 mr-1.5" />
        Modèle IA Local
      </span>
      <Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" @click="isChartModalOpen = true" title="Comparer les performances">
        <BarChart class="w-3.5 h-3.5" />
      </Button>
    </div>
    
    <Select :model-value="modelStore.currentModelId" @update:model-value="handleModelChange" :disabled="chatStore.isEngineLoading">
      <SelectTrigger data-testid="model-select-trigger" class="h-9 w-full bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-xs shadow-sm">
        <SelectValue placeholder="Choisir un modèle" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="model in modelStore.compatibleModels" :key="model.id" :value="model.id" :data-testid="'model-option-' + model.id" class="cursor-pointer py-1.5">
            <div class="flex flex-col items-start gap-0.5 w-full">
              <div class="flex items-center justify-between w-full gap-2">
                <span class="font-semibold text-xs text-slate-900 dark:text-slate-100">{{ model.name }}</span>
                <Badge variant="secondary" class="text-[9px] px-1 py-0 h-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal border-none flex-shrink-0">{{ model.totalSize }}</Badge>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 font-normal leading-normal">
                {{ model.description }}
              </span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    
    <!-- Model Actions -->
    <div v-if="!chatStore.isEngineReady && !chatStore.isEngineLoading && !chatStore.isEnginePaused" class="mt-3">
      <Button @click="downloadEngine" class="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm" :disabled="chatStore.isEngineLoading">
        <Download class="w-3.5 h-3.5 mr-1.5" />
        Télécharger et activer
      </Button>
    </div>

    <!-- State when engine is loading -->
    <div v-if="chatStore.isEngineLoading" class="mt-3 space-y-2">
      <div class="flex justify-between text-[10px] text-slate-500 font-medium">
        <span class="truncate pr-2">{{ chatStore.engineProgress.text || 'Initialisation...' }}</span>
        <span>{{ Math.round(chatStore.engineProgress.progress * 100) }}%</span>
      </div>
      <Progress :model-value="chatStore.engineProgress.progress * 100" class="h-1.5 bg-slate-200 dark:bg-slate-800" indicator-class="bg-blue-600" />
      <div class="flex justify-end pt-1">
        <Button variant="ghost" size="sm" class="h-6 text-[10px] px-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" @click="chatStore.pauseDownload()">
          <Pause class="w-3 h-3 mr-1" /> Pause
        </Button>
      </div>
    </div>
    
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
    <div v-if="chatStore.isEngineReady" class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800" data-testid="model-status-badge">
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

    <Dialog :open="isChartModalOpen" @update:open="isChartModalOpen = $event">
      <DialogContent class="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Comparateur de Modèles (Poids vs Intelligence)</DialogTitle>
        </DialogHeader>
        <div class="mt-4">
          <ModelScatterChart :models="modelStore.models" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useModel } from '~/contexts/modelContext'
import { useChat } from '~/contexts/chatContext'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import ModelScatterChart from '~/components/ModelScatterChart.vue'
import { Progress } from '~/components/ui/progress'
import { BarChart, Loader2, CheckCircle2, Cpu, Pause, Play, Download } from 'lucide-vue-next'
import { useDevice } from '~/contexts/deviceContext'

const modelStore = useModel()
const chatStore = useChat()
const deviceStore = useDevice()

const isChartModalOpen = ref(false)

const pendingModel = computed(() => {
  return modelStore.models.find(m => m.id === modelStore.currentModelId)
})

function handleModelChange(modelId: any) {
  if (typeof modelId !== 'string' || modelId === modelStore.currentModelId) return
  modelStore.currentModelId = modelId
}

function resumeDownload() {
  console.log('[SIDEBAR] resumeDownload clicked, model:', modelStore.currentModelId)
  chatStore.downloadMultipleEngines([modelStore.currentModelId], true)
}

function downloadEngine() {
  chatStore.downloadMultipleEngines([modelStore.currentModelId])
}
</script>
