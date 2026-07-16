<template>
  <div class="bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-3 space-y-3 mb-4 border border-slate-200/60 dark:border-slate-800/60">
    <div class="flex items-center justify-between mb-2">
      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
        <Cpu class="w-3.5 h-3.5 mr-1.5" />
        {{ tUI('local_ai_model') }}
      </span>
      <Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" @click="isChartModalOpen = true" :title="tUI('compare_performance')">
        <BarChart class="w-3.5 h-3.5" />
      </Button>
    </div>
    
    <!-- Standard Domain-based dropdown -->
    <Select v-if="!modelStore.isShowAllModels" :model-value="modelStore.currentDomain" @update:model-value="handleDomainChange" @update:open="onOpenChange" :disabled="chatStore.isEngineLoading">
      <SelectTrigger data-testid="model-select-trigger" class="h-9 w-full bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-xs shadow-sm flex items-center justify-between px-3">
        <div v-if="selectedDomain" class="flex items-center gap-2 truncate">
          <component :is="getIcon(selectedDomain.icon)" class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{ tDomain(selectedDomain.id, 'name') }}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 truncate">({{ selectedDomain.resolvedModel.name }})</span>
        </div>
        <SelectValue v-else placeholder="Choisir un domaine" />
      </SelectTrigger>
      <SelectContent class="!max-h-[85vh] w-[300px] md:w-[320px] overflow-y-auto">
        <ModelSearchInput v-model="searchQuery" />
        <SelectGroup>
          <SelectItem v-for="domain in filteredDomains" :key="domain.id" :value="domain.id" :data-testid="'domain-option-' + domain.id" class="cursor-pointer py-1.5">
            <div class="flex items-center justify-between w-full gap-2 overflow-hidden">
              <span class="font-medium text-[11px] text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate min-w-0">
                <component :is="getIcon(domain.icon)" class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                <span class="truncate">{{ tDomain(domain.id, 'name') }}</span>
              </span>
              <div class="flex items-center gap-1 flex-shrink-0">
                <Badge v-if="domain.isFallback" variant="outline" class="text-[8px] px-1 py-0 h-3 bg-orange-50/50 dark:bg-orange-950/10 text-orange-600 dark:text-orange-400 font-normal border-orange-200 dark:border-orange-900">Fallback</Badge>
                <Badge variant="secondary" class="text-[8px] px-1 py-0 h-3 bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal border-none whitespace-nowrap">{{ domain.resolvedModel.name }} ({{ domain.resolvedModel.totalSize }})</Badge>
              </div>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <!-- Developer/Test mode showing all models -->
    <Select v-else :model-value="modelStore.currentModelId" @update:model-value="handleModelChange" @update:open="onOpenChange" :disabled="chatStore.isEngineLoading">
      <SelectTrigger data-testid="model-select-trigger" class="h-9 w-full bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-xs shadow-sm flex items-center justify-between px-3">
        <div v-if="selectedModel" class="flex items-center gap-2 truncate">
          <Cpu class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{ selectedModel.name }}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500">({{ selectedModel.totalSize }})</span>
        </div>
        <SelectValue v-else placeholder="Choisir un modèle" />
      </SelectTrigger>
      <SelectContent class="!max-h-[85vh] w-[300px] md:w-[320px] overflow-y-auto">
        <ModelSearchInput v-model="searchQuery" />
        <SelectGroup>
          <SelectItem v-for="model in filteredModels" :key="model.id" :value="model.id" :data-testid="'model-option-' + model.id" class="cursor-pointer py-1.5">
            <div class="flex items-center justify-between w-full gap-2 overflow-hidden">
              <span class="font-medium text-[11px] text-slate-900 dark:text-slate-100 truncate min-w-0">{{ model.name }}</span>
              <Badge variant="secondary" class="text-[8px] px-1 py-0 h-3 bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal border-none flex-shrink-0 whitespace-nowrap">{{ model.totalSize }}</Badge>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    
    <!-- Model Actions -->
    <div v-if="!chatStore.isEngineReady && !chatStore.isEngineLoading && !chatStore.isEnginePaused" class="mt-3">
      <Button @click="downloadEngine" class="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm" :disabled="chatStore.isEngineLoading">
        <Download class="w-3.5 h-3.5 mr-1.5" />
        {{ tUI('download_activate') }}
      </Button>
    </div>

    <!-- State when engine is loading -->
    <div v-if="chatStore.isEngineLoading" class="mt-3 space-y-2">
      <div class="flex justify-between text-[10px] text-slate-500 font-medium">
        <span class="truncate pr-2">{{ chatStore.engineProgress.text || tUI('initializing') }}</span>
        <span>{{ Math.round(chatStore.engineProgress.progress * 100) }}%</span>
      </div>
      <Progress :model-value="chatStore.engineProgress.progress * 100" class="h-1.5 bg-slate-200 dark:bg-slate-800" indicator-class="bg-blue-600" />
      <div class="flex justify-end pt-1">
        <Button variant="ghost" size="sm" class="h-6 text-[10px] px-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" @click="chatStore.pauseDownload()">
          <Pause class="w-3.5 h-3.5 mr-1" /> {{ tUI('pause') }}
        </Button>
      </div>
    </div>
    
    <!-- Model Details Card -->
    <div v-if="pendingModel" class="mt-2 p-2.5 bg-white dark:bg-[#0b0f19] rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 space-y-1.5 shadow-sm">
      <div class="flex justify-between items-center">
        <span class="font-semibold text-slate-600 dark:text-slate-300">{{ tUI('engine') }}:</span>
        <span class="font-mono text-indigo-600 dark:text-indigo-400">{{ deviceStore.deviceInfo?.hasWebGPU ? 'GPU (WebGPU)' : 'CPU (WASM)' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold text-slate-600 dark:text-slate-300">{{ tUI('ram_required') }}:</span>
        <span class="font-mono">{{ pendingModel.ramRequired >= 1024 ? (pendingModel.ramRequired / 1024).toFixed(1) + ' GB' : pendingModel.ramRequired + ' MB' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold text-slate-600 dark:text-slate-300">{{ tUI('size') }}:</span>
        <span class="font-mono">{{ pendingModel.totalSize }}</span>
      </div>
    </div>

    <!-- State when engine is ready -->
    <div v-if="chatStore.isEngineReady" class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800" data-testid="model-status-badge">
      <span class="flex items-center text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 class="w-3.5 h-3.5 mr-1.5" /> {{ tUI('ready_for_use') }}
      </span>
    </div>

    <!-- State when engine is paused -->
    <div v-if="chatStore.isEnginePaused" class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
      <span class="flex items-center text-[10px] font-medium text-orange-600 dark:text-orange-400">
        <Pause class="w-3.5 h-3.5 mr-1.5" /> {{ tUI('paused') }}
      </span>
      <Button variant="ghost" size="sm" class="h-6 text-[10px] px-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300" @click="resumeDownload">
        <Play class="w-3 h-3 mr-1" /> {{ tUI('resume') }}
      </Button>
    </div>

    <Dialog :open="isChartModalOpen" @update:open="isChartModalOpen = $event">
      <DialogContent class="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{{ tUI('model_comparator_title') }}</DialogTitle>
        </DialogHeader>
        <div class="mt-4">
          <ModelScatterChart :models="modelStore.models" @select-model="handleModelSelectedFromChart" />
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
import ModelSearchInput from '~/components/ModelSearchInput.vue'
import { Progress } from '~/components/ui/progress'
import { BarChart, Loader2, CheckCircle2, Cpu, Pause, Play, Download, Calculator, Code2, Stethoscope, Scale, PenTool, Languages, GraduationCap, TrendingUp, Coins, Search } from 'lucide-vue-next'
import { useDevice } from '~/contexts/deviceContext'
import { useModelI18n } from '~/composables/useModelI18n'

const modelStore = useModel()
const chatStore = useChat()
const deviceStore = useDevice()
const { tUI, tDomain, currentLang } = useModelI18n()

const isChartModalOpen = ref(false)
const searchQuery = ref('')

const filteredDomains = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return modelStore.compatibleDomains
  return modelStore.compatibleDomains.filter(domain => {
    const name = tDomain(domain.id, 'name').toLowerCase()
    const modelName = domain.resolvedModel.name.toLowerCase()
    return name.includes(query) || modelName.includes(query)
  })
})

const filteredModels = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return modelStore.compatibleModels
  return modelStore.compatibleModels.filter(model => {
    return model.name.toLowerCase().includes(query)
  })
})

function onOpenChange(open: boolean) {
  if (!open) {
    searchQuery.value = ''
  }
}

const pendingModel = computed(() => {
  return modelStore.models.find(m => m.id === modelStore.currentModelId)
})

const selectedDomain = computed(() => {
  return modelStore.compatibleDomains.find(d => d.id === modelStore.currentDomain)
})

const selectedModel = computed(() => {
  return modelStore.compatibleModels.find(m => m.id === modelStore.currentModelId)
})

function handleModelChange(modelId: any) {
  if (typeof modelId !== 'string') return
  if (modelId === modelStore.currentModelId) {
    if (!chatStore.isEngineReady && !chatStore.isEngineLoading && !chatStore.isEnginePaused) {
      chatStore.downloadMultipleEngines([modelId])
    }
    return
  }
  modelStore.currentModelId = modelId
}

function handleDomainChange(domainId: any) {
  if (typeof domainId !== 'string') return
  if (domainId === modelStore.currentDomain) {
    const domainObj = modelStore.compatibleDomains.find(d => d.id === domainId)
    if (domainObj && domainObj.resolvedModel) {
      if (!chatStore.isEngineReady && !chatStore.isEngineLoading && !chatStore.isEnginePaused) {
        chatStore.downloadMultipleEngines([domainObj.resolvedModel.id])
      }
    }
    return
  }
  modelStore.currentDomain = domainId
}

function handleModelSelectedFromChart(modelId: string) {
  isChartModalOpen.value = false
  if (modelId === modelStore.currentModelId) {
    if (!chatStore.isEngineReady && !chatStore.isEngineLoading && !chatStore.isEnginePaused) {
      chatStore.downloadMultipleEngines([modelId])
    }
    return
  }
  modelStore.currentModelId = modelId
}

function getIcon(iconName: string) {
  switch (iconName) {
    case 'Cpu': return Cpu
    case 'Calculator': return Calculator
    case 'Code2': return Code2
    case 'Stethoscope': return Stethoscope
    case 'Scale': return Scale
    case 'PenTool': return PenTool
    case 'Languages': return Languages
    case 'GraduationCap': return GraduationCap
    case 'TrendingUp': return TrendingUp
    case 'Coins': return Coins
    default: return Cpu
  }
}

function resumeDownload() {
  console.log('[SIDEBAR] resumeDownload clicked, model:', modelStore.currentModelId)
  chatStore.downloadMultipleEngines([modelStore.currentModelId], true)
}

function downloadEngine() {
  chatStore.downloadMultipleEngines([modelStore.currentModelId])
}
</script>
