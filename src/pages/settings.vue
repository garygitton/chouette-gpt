<template>
  <div class="h-full overflow-y-auto bg-slate-50 dark:bg-[#0b0f19] relative p-4 md:p-8">
    <div class="max-w-6xl mx-auto relative z-10 space-y-8">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <Button data-testid="back-button" variant="ghost" size="icon" class="rounded-xl" @click="router.push('/')">
          <ArrowLeft class="w-5 h-5 text-slate-500" />
        </Button>
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ t('settings_and_models') }}
        </h1>
      </div>

      <div class="max-w-2xl mx-auto space-y-6">
        <DeviceInfoCard />

        <!-- Engine Preferences Card -->
        <Card class="rounded-2xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-lg mt-6">
          <CardHeader class="flex flex-row items-center space-x-2 pb-2">
            <Cpu class="w-6 h-6 text-indigo-500" />
            <CardTitle class="text-lg">{{ t('gen_config') }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-850/50">
              <div class="space-y-1">
                <p class="text-sm font-bold text-slate-900 dark:text-white">{{ t('force_wasm_label') }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-md">
                  {{ t('force_wasm_desc') }}
                </p>
              </div>
              <div class="flex items-center pt-1">
                <button 
                  type="button" 
                  data-testid="force-wasm-toggle"
                  :class="[settingsStore.forceWasm ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']"
                  @click="settingsStore.forceWasm = !settingsStore.forceWasm"
                >
                  <span 
                    :class="[settingsStore.forceWasm ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']"
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- About & License Card -->
        <Card class="rounded-2xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-lg mt-6">
          <CardHeader class="flex flex-row items-center space-x-2 pb-2">
            <Info class="w-6 h-6 text-indigo-500" />
            <CardTitle class="text-lg">{{ t('about_project') }}</CardTitle>
          </CardHeader>

          <CardContent class="space-y-6">
            <!-- Author section -->
            <div class="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-850/50">
              <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{{ t('author') }}</h3>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white">Gary Gitton</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('author_desc') }}</p>
                </div>
                <a href="https://www.linkedin.com/in/garygitton" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 transition-all duration-200" title="LinkedIn" data-testid="author-linkedin-link">
                  <Linkedin class="w-4 h-4" />
                </a>
              </div>
            </div>

            <!-- Project section -->
            <div class="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-850/50">
              <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">ChouetteGPT</h3>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white">ChouetteGPT</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('project_desc') }}</p>
                </div>
                <a href="https://github.com/garygitton/chouette-gpt" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/10 text-slate-800 dark:bg-slate-200/10 dark:text-slate-200 hover:bg-slate-800/20 dark:hover:bg-slate-200/20 transition-all duration-200" title="GitHub" data-testid="project-github-link">
                  <Github class="w-4 h-4" />
                </a>
              </div>
            </div>

            <!-- License section -->
            <div class="flex items-center justify-between px-2">
              <div class="flex items-center space-x-2">
                <Scale class="w-4 h-4 text-indigo-500" />
                <span class="text-xs font-medium text-slate-600 dark:text-slate-400">{{ t('project_license') }}</span>
              </div>
              <span class="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20" data-testid="project-license-badge">
                Apache 2.0
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '#imports'
import { onMounted } from 'vue'

import { useDeviceStore } from '~/stores/deviceStore'
import { useSettingsStore } from '~/stores/settingsStore'
import DeviceInfoCard from '~/components/DeviceInfoCard.vue'

import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { ArrowLeft, Linkedin, Github, Info, Scale, Cpu } from 'lucide-vue-next'
import { useI18n } from '~/composables/useI18n'

const router = useRouter()
const deviceStore = useDeviceStore()
const settingsStore = useSettingsStore()
const { t } = useI18n()

onMounted(() => {
  if (!deviceStore.deviceInfo) {
    deviceStore.evaluateDevice()
  }
})
</script>