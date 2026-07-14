<!-- @ds-ignore-file -->
<template>
  <main class="my-auto py-12 space-y-10 ui-message-slide-in" aria-labelledby="dashboard-title">
    <!-- Main Glowing Logo Emblem -->
    <div class="text-center space-y-6">
      <div class="relative w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center shadow-2xl backdrop-blur-xl group hover:border-indigo-500/30 transition-all duration-500">
        <!-- Animated SVG Logo -->
        <img src="/logo.svg" alt="Logo" class="w-20 h-20 transform group-hover:scale-110 transition-transform duration-500" />

        <!-- Dynamic Ambient Light -->
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 to-pink-500 blur-2xl opacity-15 group-hover:opacity-25 -z-10 transition-opacity duration-500"></div>
      </div>

      <div class="space-y-4">
        <h1 id="dashboard-title" class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <span>Chouette<span class="ui-title-gradient">GPT</span></span>
          <Badge variant="outline" class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50 py-1 px-2 text-xs font-bold uppercase tracking-widest mt-2 align-middle">
            Expérimental
          </Badge>
        </h1>
        <p v-if="chatStore.isEngineReady" class="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
          {{ t('empty_chat_subtitle') }}
        </p>
        <p v-else class="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
          Votre assistant IA local, 100% privé et hors-ligne.
        </p>
        <div class="max-w-xl mx-auto text-xs text-left text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 shadow-sm">
          <p class="leading-relaxed">
            <strong class="text-slate-800 dark:text-slate-200">{{ t('landing_objective_title') }}</strong> {{ t('landing_objective_desc') }}
          </p>
          <div class="flex items-start space-x-2.5 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100/50 dark:border-amber-900/30">
            <p class="leading-relaxed font-medium">
              {{ t('performance_notice') }}
            </p>
          </div>
        </div>
        
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
    <!-- Minimalist Call To Action for Onboarding -->
    <div v-if="!chatStore.isEngineReady" class="flex flex-col items-center justify-center max-w-md mx-auto py-6 space-y-4">
      <div v-if="!chatStore.isEngineLoading" class="flex flex-col items-center space-y-3">
        <Button 
          @click="chatStore.downloadMultipleEngines([modelStore.currentModelId])" 
          aria-label="Télécharger et activer l'IA"
          class="h-12 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 font-bold flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900"
        >
          <Download class="w-5 h-5" />
          Télécharger et activer l'IA
        </Button>
        <p class="text-xs text-slate-400 dark:text-slate-500 text-center max-w-xs leading-relaxed">
          Modèle par défaut : <strong>{{ modelStore.currentModelName }}</strong> ({{ modelStore.currentModel?.totalSize }}).
        </p>
      </div>

      <div v-else class="flex flex-col items-center space-y-3">
        <div class="flex items-center space-x-2 text-indigo-500 dark:text-indigo-400 text-sm font-semibold">
          <Loader2 class="w-5 h-5 animate-spin" />
          <span>Téléchargement et configuration en cours...</span>
        </div>
      </div>
      
      <!-- Desktop & Mobile Hint -->
      <p class="text-[11px] text-slate-400 dark:text-slate-500 text-center pt-2">
        Vous pouvez également changer de modèle dans le menu latéral.
      </p>
    </div>
    
    <!-- Suggested Prompts Grid -->
    <div v-if="chatStore.isEngineReady" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full px-4">
      <Card
        v-for="prompt in suggestedPrompts" 
        :key="prompt.text" 
        @click="$emit('send-prompt', prompt.text)" 
        @keydown.enter="$emit('send-prompt', prompt.text)"
        tabindex="0"
        role="button"
        :aria-label="'Essayer le prompt : ' + prompt.title"
        :data-testid="'suggested-prompt-' + prompt.title.toLowerCase().replace(/\s+/g, '-')"
        class="group relative cursor-pointer text-left p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl transition-all duration-500 flex items-start space-x-4 overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/50 dark:hover:border-indigo-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useDevice } from '~/contexts/deviceContext'
import { useModel } from '~/contexts/modelContext'
import { useChat } from '~/contexts/chatContext'
import { Globe, Code, Sparkles, Mail, ArrowRight, ArrowLeft, Menu, Shield, WifiOff, EyeOff, Download, Loader2 } from 'lucide-vue-next'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

defineEmits(['send-prompt'])

const { t } = useI18n()
const deviceStore = useDevice()
const modelStore = useModel()
const chatStore = useChat()

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
