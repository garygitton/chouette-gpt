<template>
  <Transition
    enter-active-class="transition duration-500 flex ease-out"
    enter-from-class="opacity-0 translate-y-10 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-10 scale-95"
  >
    <div
      v-if="chatStore.isEngineLoading || chatStore.isEnginePaused"
      class="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none p-4"
    >
      <div class="pointer-events-auto w-[360px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-5 flex flex-col space-y-4">
        
        <div class="flex items-start justify-between">
          <div class="flex flex-col flex-1 min-w-0 pr-4">
            <span class="text-[15px] font-bold text-slate-800 dark:text-slate-100 flex items-center mb-0.5">
              <Download class="w-4 h-4 mr-2" :class="chatStore.isEnginePaused ? 'text-slate-400' : 'text-indigo-500 animate-bounce'" />
              {{ chatStore.isEnginePaused ? 'Téléchargement en pause' : 'Téléchargement en cours' }}
            </span>
            <span class="text-xs font-medium text-slate-500 dark:text-slate-400 truncate" :title="modelStore.currentModelName">
              {{ modelStore.currentModelName }}
            </span>
          </div>
          
          <Button v-if="chatStore.isEngineLoading" variant="outline" size="icon" class="h-8 w-8 text-slate-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex-shrink-0" title="Mettre en pause" @click="chatStore.pauseDownload">
            <Pause class="w-4 h-4" />
          </Button>
          <Button v-if="chatStore.isEnginePaused" variant="outline" size="icon" class="h-8 w-8 text-slate-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 flex-shrink-0" title="Reprendre le téléchargement" @click="resumeDownload">
            <Play class="w-4 h-4" />
          </Button>
        </div>

        <div v-if="pendingModel" class="p-3 bg-slate-50/80 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-slate-700 dark:text-slate-300">Moteur:</span>
            <span class="font-mono text-indigo-600 dark:text-indigo-400">{{ deviceStore.deviceInfo?.hasWebGPU ? 'WebGPU' : 'WASM (CPU)' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-slate-700 dark:text-slate-300">Taille du modèle:</span>
            <span class="font-mono">{{ pendingModel.totalSize }}</span>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span class="truncate pr-2 italic">{{ chatStore.isEnginePaused ? 'En attente de reprise...' : (chatStore.engineProgress.text || 'Chargement...') }}</span>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">{{ Math.round(chatStore.engineProgress.progress * 100) }}%</span>
          </div>
          <Progress :model-value="chatStore.engineProgress.progress * 100" class="h-2" :indicator-class="chatStore.isEnginePaused ? 'bg-slate-400 dark:bg-slate-500' : 'bg-indigo-500'" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chatStore'
import { useModelStore } from '~/stores/modelStore'
import { useDeviceStore } from '~/stores/deviceStore'
import { Progress } from '~/components/ui/progress'
import { Button } from '~/components/ui/button'
import { Download, Pause, Play } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted } from 'vue'

const chatStore = useChatStore()
const modelStore = useModelStore()
const deviceStore = useDeviceStore()

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
