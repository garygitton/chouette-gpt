<template>
  <div class="h-full overflow-y-auto bg-slate-50 dark:bg-[#0b0f19] relative p-4 md:p-8">
    <div class="max-w-6xl mx-auto relative z-10 space-y-8">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <Button data-testid="back-button" variant="ghost" size="icon" @click="router.push('/')" class="rounded-xl">
          <ArrowLeft class="w-5 h-5 text-slate-500" />
        </Button>
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Paramètres & <span class="ui-title-gradient">Modèles</span>
        </h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column: Device Info & General Settings -->
        <div class="space-y-6">
          <DeviceInfoCard />

          <!-- General Settings Card -->
          <Card class="rounded-2xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-lg mt-6">
            <CardHeader class="flex flex-row items-center space-x-2 pb-2">
              <Globe class="w-6 h-6 text-indigo-500" />
              <CardTitle data-testid="language-card-title" class="text-lg">{{ t('language_label') }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <LanguageSelector />
            </CardContent>
          </Card>

          <!-- LLM Parameters Settings Card -->
          <Card class="rounded-2xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-lg mt-6">
            <CardHeader class="flex flex-row items-center space-x-2 pb-2">
              <SlidersHorizontal class="w-6 h-6 text-indigo-500" />
              <CardTitle class="text-lg">{{ t('gen_config') }}</CardTitle>
            </CardHeader>

            <CardContent class="space-y-6">
              <!-- Temperature slider -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ t('temperature_label') }}</label>
                  <span class="text-xs font-mono font-bold text-indigo-500">{{ settingsStore.temperature.toFixed(2) }}</span>
                </div>
                <Slider 
                  data-testid="temperature-slider"
                  :model-value="[settingsStore.temperature]"
                  @update:model-value="(val) => settingsStore.temperature = val[0]"
                  :min="0" 
                  :max="2" 
                  :step="0.05" 
                />
                <p class="text-[10px] text-slate-400 dark:text-slate-500">
                  {{ t('temp_desc') }}
                </p>
              </div>

              <!-- Top P slider -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ t('topp_label') }}</label>
                  <span class="text-xs font-mono font-bold text-indigo-500">{{ settingsStore.topP.toFixed(2) }}</span>
                </div>
                <Slider 
                  data-testid="topp-slider"
                  :model-value="[settingsStore.topP]"
                  @update:model-value="(val) => settingsStore.topP = val[0]"
                  :min="0.1" 
                  :max="1" 
                  :step="0.05" 
                />
                <p class="text-[10px] text-slate-400 dark:text-slate-500">
                  {{ t('topp_desc') }}
                </p>
              </div>

              <!-- Max Tokens slider -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ t('max_tokens_label') }}</label>
                  <span class="text-xs font-mono font-bold text-indigo-500">{{ settingsStore.maxTokens }}</span>
                </div>
                <Slider 
                  data-testid="maxtokens-slider"
                  :model-value="[settingsStore.maxTokens]"
                  @update:model-value="(val) => settingsStore.maxTokens = val[0]"
                  :min="128" 
                  :max="4096" 
                  :step="128" 
                />
                <p class="text-[10px] text-slate-400 dark:text-slate-500">
                  {{ t('max_tokens_desc') }}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right Column: Available Models & Social Settings -->
        <div class="space-y-6">

          <!-- Social Networks Card -->
          <Card class="rounded-2xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-lg mt-6">
            <CardHeader class="flex flex-row items-center space-x-2 pb-2">
              <Share2 class="w-6 h-6 text-indigo-500" />
              <CardTitle class="text-lg">{{ t('social_title') }}</CardTitle>
            </CardHeader>

            <CardContent class="space-y-4">
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal mb-2">
                {{ t('social_desc') }}
              </p>
              
              <!-- LinkedIn input -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <Linkedin class="w-4 h-4 text-[#0077b5]" />
                  <span>{{ t('linkedin_label') }}</span>
                </label>
                <Input
                  data-testid="linkedin-input"
                  v-model="settingsStore.linkedin"
                  placeholder="https://linkedin.com/in/username"
                  class="rounded-xl h-8 text-sm"
                />
              </div>

              <!-- GitHub input -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <Github class="w-4 h-4 text-[#24292e] dark:text-white" />
                  <span>{{ t('github_label') }}</span>
                </label>
                <Input
                  data-testid="github-input"
                  v-model="settingsStore.github"
                  placeholder="https://github.com/username"
                  class="rounded-xl h-8 text-sm"
                />
              </div>

              <!-- Website input -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <Globe class="w-4 h-4 text-indigo-500" />
                  <span>{{ t('website_label') }}</span>
                </label>
                <Input
                  data-testid="website-input"
                  v-model="settingsStore.website"
                  placeholder="https://mywebsite.com"
                  class="rounded-xl h-8 text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceStore } from '~/stores/deviceStore'
import { useSettingsStore } from '~/stores/settingsStore'
import DeviceInfoCard from '~/components/DeviceInfoCard.vue'
import { useI18n } from '~/composables/useI18n'

import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Slider } from '~/components/ui/slider'
import { Input } from '~/components/ui/input'
import { ArrowLeft, Globe, SlidersHorizontal, Share2, Linkedin, Github } from 'lucide-vue-next'

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