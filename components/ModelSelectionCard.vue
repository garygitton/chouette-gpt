<template>
  <Card class="ui-glass-premium bg-white/70 dark:bg-[#0d1222]/40 border-none shadow-none">
    <CardHeader class="pb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2.5 text-slate-800 dark:text-slate-200">
          <Box class="w-5 h-5 text-indigo-500" />
          <CardTitle class="text-base tracking-tight">{{ t('available_models') }}</CardTitle>
        </div>
        <Button
          data-testid="auto-select-model-btn"
          size="sm"
          variant="secondary"
          class="rounded-xl shadow-sm hover:scale-[0.98] transition-transform text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300"
          @click="autoSelectModel"
        >
          <Sparkles class="w-4 h-4 mr-2" />
          {{ t('auto_choice') }}
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <div class="space-y-3">
        <div 
          v-for="model in modelStore.models" 
          :key="model.id"
          :data-testid="'model-card-' + model.id"
          class="group p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col space-y-3.5 hover:shadow-md"
          :class="[
            modelStore.currentModelId === model.id 
              ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-sm shadow-indigo-500/5' 
              : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-900/10'
          ]"
          @click="modelStore.currentModelId = model.id"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <h3 class="font-bold text-sm text-slate-800 dark:text-slate-200 flex flex-wrap items-center gap-2">
                <span>{{ model.name }}</span>
                <span 
                  v-if="modelStore.currentModelId === model.id" 
                  class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                >
                  {{ t('model_loaded').replace(' !', '') }}
                </span>
                <span 
                  v-if="model.backend === 'transformers'" 
                  class="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                >
                  CPU / WASM
                </span>
              </h3>
              <div class="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <span>Param: <strong class="text-slate-600 dark:text-slate-400">{{ model.parameters }}</strong></span>
                <span>•</span>
                <span>Quant: <strong class="text-slate-600 dark:text-slate-400">{{ model.quantization }}</strong></span>
                <span>•</span>
                <span>Size: <strong class="text-slate-600 dark:text-slate-400">{{ model.totalSize }}</strong></span>
              </div>
            </div>
            <div 
              class="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
              :class="modelStore.currentModelId === model.id ? 'bg-indigo-500 text-white scale-110 shadow-md shadow-indigo-500/20' : 'border border-slate-300 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-600'"
            >
              <Check v-if="modelStore.currentModelId === model.id" class="w-3.5 h-3.5" />
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] border-t border-slate-100 dark:border-slate-800/60 pt-3">
            <div class="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-semibold">
              <Cpu class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ t('ram_recommended') }}: {{ model.estimatedMemory }}</span>
            </div>
            <div 
              v-if="deviceStore.deviceInfo && deviceStore.deviceInfo.ramGB * 1024 < model.ramRequired"
              class="flex items-center space-x-1 px-2 py-0.5 rounded-md border border-red-200/40 bg-red-50/15 dark:bg-red-950/10 text-red-500 font-bold"
            >
              <TriangleAlert class="w-3.5 h-3.5" />
              <span>{{ t('insufficient_ram') }}</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useDeviceStore } from '~/stores/deviceStore'
import { useModelStore } from '~/stores/modelStore'
import { useI18n } from '~/composables/useI18n'

import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Box, Sparkles, Check, Cpu, TriangleAlert } from 'lucide-vue-next'

const deviceStore = useDeviceStore()
const modelStore = useModelStore()
const { t } = useI18n()

async function autoSelectModel() {
  await modelStore.detectBestModel()
}
</script>
