<template>
  <Card class="ui-glass-premium bg-white/70 dark:bg-[#0d1222]/40 border-none shadow-none">
    <CardHeader class="pb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2.5 text-slate-800 dark:text-slate-200">
          <Monitor class="w-5 h-5 text-indigo-500" />
          <CardTitle class="text-base tracking-tight">{{ t('device_capabilities') }}</CardTitle>
        </div>
        <Button
          size="sm"
          variant="default"
          class="rounded-xl shadow-sm hover:scale-[0.98] transition-transform"
          :disabled="deviceStore.isEvaluating"
          @click="deviceStore.evaluateDevice()"
        >
          <Loader2 v-if="deviceStore.isEvaluating" class="w-4 h-4 mr-2 animate-spin" />
          {{ deviceStore.isEvaluating ? t('analyzing') : t('analyze') }}
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <div v-if="deviceStore.deviceInfo" class="space-y-6">
        <!-- Performance Meter Ring & Info -->
        <div class="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100/60 dark:border-slate-800/50">
          <!-- SVG Gauge Ring -->
          <div class="relative w-20 h-20 flex items-center justify-center flex-shrink-0 select-none">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <!-- Track -->
              <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="5" class="text-slate-200/50 dark:text-slate-800/40" fill="transparent" />
              <!-- Indicator -->
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="url(#compatibility-grad)" 
                stroke-width="5.5" 
                fill="transparent"
                stroke-dasharray="251.2"
                :stroke-dashoffset="251.2 - (251.2 * deviceStore.deviceInfo.numericScore) / 100"
                stroke-linecap="round"
                class="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="compatibility-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#6366f1" />
                  <stop offset="100%" stop-color="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute text-center">
              <span class="text-lg font-black text-slate-800 dark:text-white">{{ deviceStore.deviceInfo.numericScore }}</span>
              <span class="text-[8px] block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-[-3px]">%</span>
            </div>
          </div>
          
          <div class="space-y-1 text-center sm:text-left">
            <div class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{{ t('compatibility_score') }}</div>
            <div class="text-base font-extrabold" :class="scoreColor">{{ deviceStore.deviceInfo.score }}</div>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-sm">
              {{ t('score_desc') }}
            </p>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100/50 dark:border-slate-800/40 hover:border-slate-200 dark:hover:border-slate-800 transition-colors">
            <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ t('cpu_cores') }}</div>
            <div class="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1">{{ deviceStore.deviceInfo.cpuCores }}</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100/50 dark:border-slate-800/40 hover:border-slate-200 dark:hover:border-slate-800 transition-colors">
            <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ t('estimated_ram') }}</div>
            <div class="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1">{{ deviceStore.deviceInfo.ramGB }} GB</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100/50 dark:border-slate-800/40 hover:border-slate-200 dark:hover:border-slate-800 transition-colors">
            <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ t('available_storage') }}</div>
            <div class="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1">{{ deviceStore.deviceInfo.storageAvailableGB.toFixed(1) }} GB</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100/50 dark:border-slate-800/40 hover:border-slate-200 dark:hover:border-slate-800 transition-colors">
            <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ t('system') }}</div>
            <div class="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 truncate">{{ deviceStore.deviceInfo.os }}</div>
          </div>
        </div>

        <!-- Feature Flags Checks -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ t('active_support') }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FeatureCheck label="WebGPU Inference" :checked="deviceStore.deviceInfo.hasWebGPU" />
            <FeatureCheck label="WebAssembly SIMD" :checked="deviceStore.deviceInfo.hasWasmSIMD" />
            <FeatureCheck label="Multi-threading" :checked="deviceStore.deviceInfo.hasThreads" />
            <FeatureCheck label="SharedArrayBuffer" :checked="deviceStore.deviceInfo.hasSharedArrayBuffer" />
            <FeatureCheck label="Stockage OPFS" :checked="deviceStore.deviceInfo.hasOPFS" />
          </div>
        </div>

      </div>
      <div v-else class="text-center py-12 space-y-3">
        <Monitor class="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse mx-auto" />
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('click_analyze') }}</p>
      </div>
    </CardContent>
  </Card>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDeviceStore } from '~/stores/deviceStore'
import { DeviceScore } from '~/domain/device/DeviceScore'
import FeatureCheck from '~/components/FeatureCheck.vue'
import { useI18n } from '~/composables/useI18n'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Monitor, Loader2 } from 'lucide-vue-next'

const deviceStore = useDeviceStore()
const { t } = useI18n()

const scoreColor = computed(() => {
  const score = deviceStore.deviceInfo?.score
  switch(score) {
    case DeviceScore.Excellent: return 'text-emerald-500'
    case DeviceScore.Good: return 'text-green-500'
    case DeviceScore.Fair: return 'text-amber-500'
    case DeviceScore.Poor: return 'text-orange-500'
    case DeviceScore.VeryPoor: return 'text-red-500'
    default: return 'text-slate-500'
  }
})
</script>
