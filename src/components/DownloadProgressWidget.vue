<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="chatStore.isEngineLoading"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      @click.self="chatStore.pauseDownload"
    >
      <div class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-6 flex flex-col space-y-6">
        <div class="flex items-start justify-between">
          <div class="flex flex-col flex-1 min-w-0 pr-4">
            <span class="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center mb-1">
              <Download class="w-5 h-5 mr-2 text-indigo-500 animate-pulse" />
              Téléchargement en cours
            </span>
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400 truncate" :title="modelStore.currentModelName">
              {{ modelStore.currentModelName }}
            </span>
          </div>
          <Button v-if="chatStore.isEngineLoading" variant="outline" size="icon" class="h-8 w-8 text-slate-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex-shrink-0" @click="chatStore.pauseDownload" title="Mettre en pause">
            <Pause class="w-4 h-4" />
          </Button>
          <Button v-if="chatStore.isEnginePaused" variant="outline" size="icon" class="h-8 w-8 text-slate-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 flex-shrink-0" @click="resumeDownload" title="Reprendre le téléchargement">
            <Play class="w-4 h-4" />
          </Button>
        </div>

        <div v-if="pendingModel" class="p-4 bg-slate-50 dark:bg-[#0b0f19] rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-slate-700 dark:text-slate-300">Moteur:</span>
            <span class="font-mono text-indigo-600 dark:text-indigo-400">{{ deviceStore.deviceInfo?.hasWebGPU ? 'GPU (WebGPU)' : 'CPU (WASM)' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-slate-700 dark:text-slate-300">RAM Requise:</span>
            <span class="font-mono">{{ pendingModel.ramRequired >= 1024 ? (pendingModel.ramRequired / 1024).toFixed(1) + ' GB' : pendingModel.ramRequired + ' MB' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-slate-700 dark:text-slate-300">Taille:</span>
            <span class="font-mono">{{ pendingModel.totalSize }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span class="truncate pr-2">{{ chatStore.engineProgress.text || 'Chargement...' }}</span>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">{{ Math.round(chatStore.engineProgress.progress * 100) }}%</span>
          </div>
          <Progress :model-value="chatStore.engineProgress.progress * 100" class="h-2.5" indicator-class="bg-indigo-500" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useChat } from '~/contexts/chatContext'
import { useModel } from '~/contexts/modelContext'
import { useDevice } from '~/contexts/deviceContext'
import { Progress } from '~/components/ui/progress'
import { Button } from '~/components/ui/button'
import { Download, Pause, Play } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted } from 'vue'

const chatStore = useChat()
const modelStore = useModel()
const deviceStore = useDevice()

const pendingModel = computed(() => {
  return modelStore.models.find(m => m.id === modelStore.currentModelId)
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && chatStore.isEngineLoading) {
    chatStore.pauseDownload()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function resumeDownload() {
  chatStore.downloadMultipleEngines([modelStore.currentModelId])
}
</script>
