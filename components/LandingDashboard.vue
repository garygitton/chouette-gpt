<!-- @ds-ignore-file -->
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
          <circle cx="39" cy="44" r="11" stroke="url(#owl-grad)" stroke-width="1.5" />
          <circle cx="39" cy="44" r="5.5" fill="currentColor" class="animate-pulse" style="animation-duration: 4s;" />
          <circle cx="40.5" cy="42.5" r="1.5" fill="white" />
          
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

      <div class="space-y-4">
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Chouette<span class="ui-title-gradient">GPT</span>
        </h1>
        <p v-if="chatStore.isEngineReady" class="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
          {{ t('empty_chat_subtitle') }}
        </p>
        <p v-else class="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
          Votre assistant IA local, 100% privé et hors-ligne.
        </p>
        
        <!-- Trust Badges -->
        <div v-if="!chatStore.isEngineReady" class="flex flex-wrap justify-center gap-3 pt-2 pb-2">
          <Badge variant="outline" class="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 py-1.5 px-3">
            <Shield class="w-3.5 h-3.5 mr-1.5" /> 100% Privé
          </Badge>
          <Badge variant="outline" class="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 py-1.5 px-3">
            <WifiOff class="w-3.5 h-3.5 mr-1.5" /> Hors-ligne
          </Badge>
          <Badge variant="outline" class="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50 py-1.5 px-3">
            <EyeOff class="w-3.5 h-3.5 mr-1.5" /> Zéro Pistage
          </Badge>
        </div>
      </div>
    </div>

    <!-- Minimalist Call To Action for Onboarding -->
    <div v-if="!chatStore.isEngineReady" class="flex flex-col items-center justify-center max-w-md mx-auto py-8">
      <!-- Desktop CTA -->
      <div class="hidden md:flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        <div class="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
          <ArrowLeft class="w-5 h-5 animate-pulse text-indigo-500" />
          <span class="text-sm font-medium">Sélectionnez un modèle dans la barre latérale pour commencer</span>
        </div>
      </div>
      
      <!-- Mobile CTA -->
      <div class="md:hidden flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        <div class="flex flex-col items-center text-center space-y-2 text-slate-500 dark:text-slate-400 px-4">
          <Menu class="w-6 h-6 text-indigo-500 mb-1" />
          <span class="text-sm font-medium">Ouvrez le menu pour télécharger et activer votre IA</span>
        </div>
      </div>
    </div>
    
    <!-- Suggested Prompts Grid -->
    <div v-if="chatStore.isEngineReady" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full px-4">
      <Card
        v-for="prompt in suggestedPrompts" 
        :key="prompt.text" 
        @click="$emit('send-prompt', prompt.text)" 
        :data-testid="'suggested-prompt-' + prompt.title.toLowerCase().replace(/\s+/g, '-')"
        class="group relative cursor-pointer text-left p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl transition-all duration-500 flex items-start space-x-4 overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/50 dark:hover:border-indigo-500/50"
      >
        <!-- Animated border gradient -->
        <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style="padding: 1px; background: linear-gradient(to bottom right, #6366f1, #ec4899); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude;"></div>
        
        <!-- Ambient Glow -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div class="relative z-10 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300 flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:shadow-indigo-500/10">
          <component :is="prompt.icon" class="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" :class="prompt.iconClass" />
        </div>
        
        <div class="relative z-10 flex-1 min-w-0 pt-0.5">
          <div class="font-bold text-slate-800 dark:text-slate-100 text-sm transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {{ prompt.title }}
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed truncate group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">
            {{ prompt.description }}
          </div>
        </div>
        
        <div class="relative z-10 flex items-center justify-center self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <div class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all">
            <ArrowRight class="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDeviceStore } from '~/stores/deviceStore'
import { useModelStore } from '~/stores/modelStore'
import { useChatStore } from '~/stores/chatStore'
import { Globe, Code, Sparkles, Mail, ArrowRight, ArrowLeft, Menu, Shield, WifiOff, EyeOff } from 'lucide-vue-next'
import { Card } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

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
