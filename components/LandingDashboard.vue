<template>
  <div class="my-auto py-12 space-y-10 ui-message-slide-in">
    <!-- Main Glowing Logo Emblem -->
    <div class="text-center space-y-6">
      <div class="relative w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center shadow-2xl backdrop-blur-xl group hover:border-indigo-500/30 transition-all duration-500">
        <!-- SVG Geometric Owl Logo -->
        <svg class="w-14 h-14 text-indigo-500 dark:text-indigo-400 transform group-hover:scale-110 transition-transform duration-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer glowing rings -->
          <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 5" class="animate-spin" style="animation-duration: 25s; opacity: 0.25;" />
          <circle cx="50" cy="50" r="40" stroke="url(#owl-grad)" stroke-width="1" style="opacity: 0.1;" />
          
          <!-- Owl Face Shield -->
          <path d="M50 16 C66 16, 75 27, 74 49 C73 68, 62 78, 50 82 C38 78, 27 68, 26 49 C25 27, 34 16, 50 16 Z" fill="url(#owl-grad)" fill-opacity="0.06" stroke="url(#owl-grad)" stroke-width="2.5" stroke-linejoin="round" />
          
          <!-- Owl Ears / Horns -->
          <path d="M33 19 L21 27 L28 33" stroke="url(#owl-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M67 19 L79 27 L72 33" stroke="url(#owl-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          
          <!-- Owl Eyes -->
          <!-- Left Eye -->
          <circle cx="39" cy="44" r="11" stroke="url(#owl-grad)" stroke-width="1.5" />
          <circle cx="39" cy="44" r="5.5" fill="currentColor" class="animate-pulse" style="animation-duration: 4s;" />
          <circle cx="40.5" cy="42.5" r="1.5" fill="white" />
          
          <!-- Right Eye -->
          <circle cx="61" cy="44" r="11" stroke="url(#owl-grad)" stroke-width="1.5" />
          <circle cx="61" cy="44" r="5.5" fill="currentColor" class="animate-pulse" style="animation-duration: 4s;" />
          <circle cx="62.5" cy="42.5" r="1.5" fill="white" />
          
          <!-- Beak -->
          <path d="M50 48 L46 56 L50 60 L54 56 Z" fill="url(#owl-grad-secondary)" stroke="url(#owl-grad)" stroke-width="1.5" stroke-linejoin="round" />
          
          <!-- Owl Chest Feathers / Digital Lines -->
          <path d="M43 65 L50 71 L57 65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="opacity: 0.4;" />
          <path d="M46 70 L50 74 L54 70" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="opacity: 0.25;" />
          
          <defs>
            <linearGradient id="owl-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6366f1" />
              <stop offset="100%" stop-color="#ec4899" />
            </linearGradient>
            <linearGradient id="owl-grad-secondary" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#f472b6" />
              <stop offset="100%" stop-color="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        <!-- Dynamic Ambient Light -->
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 to-pink-500 blur-2xl opacity-15 group-hover:opacity-25 -z-10 transition-opacity duration-500"></div>
      </div>

      <div class="space-y-3">
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Chouette<span class="ui-title-gradient">GPT</span>
        </h1>
        <p v-if="chatStore.isEngineReady" class="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
          {{ t('empty_chat_subtitle') }}
        </p>
        <p v-else class="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
          Pour garantir la confidentialité de vos échanges, l'intelligence artificielle doit être téléchargée localement sur votre appareil.
        </p>
      </div>
    </div>

    <!-- Dynamic Local Hardware capability badge -->
    <div v-if="deviceStore.deviceInfo" class="max-w-md mx-auto p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/30 backdrop-blur-xl flex flex-col space-y-4 shadow-sm">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center space-x-3.5">
          <div class="flex items-center">
            <span class="ui-ring-ping" :class="[deviceStore.deviceInfo.hasWebGPU ? 'ui-ring-ping-secure' : 'ui-ring-ping-warning']">
              <span class="ui-ring-ping-wave"></span>
              <span class="ui-ring-ping-core"></span>
            </span>
          </div>
          <div class="text-left space-y-0.5">
            <div class="font-bold text-slate-800 dark:text-slate-200">
              {{ deviceStore.deviceInfo.hasWebGPU ? 'WebGPU Acceleré' : 'Mode Processeur (CPU)' }}
            </div>
            <div class="text-[10px] text-slate-400 dark:text-slate-500">
              {{ deviceStore.deviceInfo.ramGB }} GB RAM • {{ deviceStore.deviceInfo.cpuCores }} Cores CPU • {{ deviceStore.deviceInfo.browser }}
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Score</div>
          <div class="font-extrabold text-xs" :class="scoreColor">
            {{ deviceStore.deviceInfo.score }}
          </div>
        </div>
      </div>
      
      <!-- Model Onboarding Download UI -->
      <div v-if="!chatStore.isEngineReady" class="pt-4 border-t border-slate-200 dark:border-slate-800/50 flex flex-col space-y-4">
        
        <div v-if="!chatStore.isEngineLoading" class="flex flex-col space-y-3">
          <Select v-model="modelStore.currentModelId">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Choisir un modèle compatible" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="model in modelStore.compatibleModels" :key="model.id" :value="model.id">
                  {{ model.name }} ({{ model.totalSize }})
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button @click="startDownload" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download class="w-4 h-4 mr-2" />
            Télécharger & Démarrer
          </Button>
        </div>

        <div v-else class="flex flex-col space-y-3">
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{{ chatStore.engineProgress.text || 'Chargement...' }}</span>
            <span>{{ Math.round(chatStore.engineProgress.progress * 100) }}%</span>
          </div>
          <Progress :model-value="chatStore.engineProgress.progress * 100" class="h-2" />
          <Button variant="outline" @click="chatStore.cancelDownload()" class="w-full text-slate-600 dark:text-slate-400">
            Annuler
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Suggested Prompts Grid -->
    <div v-if="chatStore.isEngineReady" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full px-4">
      <button 
        v-for="prompt in suggestedPrompts" 
        :key="prompt.text" 
        @click="$emit('send-prompt', prompt.text)" 
        :data-testid="'suggested-prompt-' + prompt.title.toLowerCase().replace(/\s+/g, '-')"
        class="group text-left p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30 backdrop-blur-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-start space-x-4"
      >
        <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 transition-colors flex-shrink-0">
          <component :is="prompt.icon" class="w-5 h-5" :class="prompt.iconClass" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {{ prompt.title }}
          </div>
          <div class="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
            {{ prompt.description }}
          </div>
        </div>
        <ArrowRight class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1.5 transition-all self-center flex-shrink-0" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDeviceStore } from '~/stores/deviceStore'
import { useModelStore } from '~/stores/modelStore'
import { useChatStore } from '~/stores/chatStore'
import { Globe, Code, Sparkles, Mail, ArrowRight, Download } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

defineEmits(['send-prompt'])

const { t } = useI18n()
const deviceStore = useDeviceStore()
const modelStore = useModelStore()
const chatStore = useChatStore()

onMounted(async () => {
  if (!deviceStore.deviceInfo) {
    await deviceStore.evaluateDevice()
    // Select best model automatically if not already
    modelStore.detectBestModel()
  }
})

function startDownload() {
  if (modelStore.currentModelId) {
    chatStore.initEngine(modelStore.currentModelId)
  }
}

const scoreColor = computed(() => {
  const score = deviceStore.deviceInfo?.score
  switch(score) {
    case 'Excellent': return 'text-emerald-500'
    case 'Bon': return 'text-green-500'
    case 'Moyen': return 'text-amber-500'
    case 'Faible': return 'text-orange-500'
    case 'Très faible': return 'text-red-500'
    default: return 'text-slate-500'
  }
})

const suggestedPrompts = computed(() => [
  { 
    title: t('prompt_quant_title'), 
    description: t('prompt_quant_desc'), 
    text: t('prompt_quant_text'),
    icon: Globe,
    iconClass: "text-indigo-500"
  },
  { 
    title: t('prompt_json_title'), 
    description: t('prompt_json_desc'), 
    text: t('prompt_json_text'),
    icon: Code,
    iconClass: "text-pink-500"
  },
  { 
    title: t('prompt_vue_title'), 
    description: t('prompt_vue_desc'), 
    text: t('prompt_vue_text'),
    icon: Sparkles,
    iconClass: "text-violet-500"
  },
  { 
    title: t('prompt_email_title'), 
    description: t('prompt_email_desc'), 
    text: t('prompt_email_text'),
    icon: Mail,
    iconClass: "text-cyan-500"
  }
])
</script>
