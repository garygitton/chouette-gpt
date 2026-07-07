<template>
  <Dialog :open="chatStore.isEngineLoading">
    <DialogContent 
      class="sm:max-w-md p-8 border-slate-100 dark:border-slate-800"
      @interact-outside="(e) => e.preventDefault()"
      @escape-key-down="(e) => e.preventDefault()"
    >
      <div class="space-y-5 text-center">
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mx-auto text-indigo-500">
          <Cpu class="w-10 h-10 animate-pulse" />
        </div>
        <div class="space-y-2">
          <DialogTitle data-testid="engine-loading-title" class="text-xl font-bold text-slate-900 dark:text-white text-center">Chargement du modèle IA</DialogTitle>
          <DialogDescription class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-center">
            Le modèle est téléchargé et initialisé localement dans votre navigateur. Cela peut prendre quelques minutes lors de la première utilisation.
          </DialogDescription>
        </div>
        
        <div v-if="chatStore.engineProgress.text" class="text-xs font-mono py-1.5 px-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 truncate max-w-md mx-auto">
          {{ chatStore.engineProgress.text }}
        </div>
        
        <div v-if="chatStore.engineProgress.progress > 0" class="space-y-2">
          <Progress :model-value="chatStore.engineProgress.progress * 100" class="h-2" />
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ Math.round(chatStore.engineProgress.progress * 100) }}% complété</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chatStore'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { Progress } from '~/components/ui/progress'
import { Cpu } from 'lucide-vue-next'

const chatStore = useChatStore()
</script>
