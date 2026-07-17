<!-- @ds-ignore-file -->
<template>
  <div class="my-auto py-12 space-y-10 ui-message-slide-in relative" aria-labelledby="dashboard-title">
    
    <!-- Ambient Background Glow -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full"/>
    </div>

    <!-- Main Glowing Logo Emblem -->
    <div class="text-center space-y-6">
      <div class="relative w-28 h-28 mx-auto flex items-center justify-center group animate-slide-up-fade [animation-delay:50ms] [animation-fill-mode:both]">
        <!-- Breathing Aura -->
        <div class="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700 animate-pulse"/>
        <!-- Animated SVG Logo -->
        <img src="~/assets/logo.svg" alt="Logo" class="relative z-10 w-24 h-24 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" >
      </div>

      <div class="space-y-4">
        <h1 id="dashboard-title" class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3 animate-slide-up-fade [animation-delay:100ms] [animation-fill-mode:both]">
          <span>Chouette<span class="ui-title-gradient">GPT</span></span>
          <Badge variant="outline" class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50 py-1 px-2 text-xs font-bold uppercase tracking-widest mt-2 align-middle">
            Expérimental
          </Badge>
        </h1>
        <p v-if="chatStore.isEngineReady" class="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed animate-slide-up-fade [animation-delay:150ms] [animation-fill-mode:both]">
          {{ t('empty_chat_subtitle') }}
        </p>
        <p v-else class="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed animate-slide-up-fade [animation-delay:150ms] [animation-fill-mode:both]">
          Votre assistant IA local, 100% privé et hors-ligne.
        </p>
        <div class="max-w-xl mx-auto text-xs text-left text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-950/40 backdrop-blur-md p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 shadow-sm animate-slide-up-fade [animation-delay:200ms] [animation-fill-mode:both]">
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
        <div v-if="!chatStore.isEngineReady" class="flex flex-wrap justify-center gap-3 pt-2 pb-2 animate-slide-up-fade [animation-delay:250ms] [animation-fill-mode:both]">
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
    <div v-if="!chatStore.isEngineReady" class="flex flex-col items-center justify-center max-w-md mx-auto py-6 space-y-4 animate-slide-up-fade [animation-delay:300ms] [animation-fill-mode:both]">
      <div class="flex flex-col items-center space-y-3 relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"/>
        <Button 
          :disabled="chatStore.isEngineLoading || chatStore.isEnginePaused" 
          aria-label="Télécharger et activer l'IA"
          class="relative h-12 px-8 rounded-xl bg-gradient-to-r transition-all duration-300 font-bold flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900"
          :class="chatStore.isEngineLoading || chatStore.isEnginePaused 
            ? 'from-slate-400 to-slate-500 text-slate-100 cursor-not-allowed opacity-90' 
            : 'from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 hover:scale-105'"
          @click="chatStore.downloadMultipleEngines([modelStore.currentModelId])"
        >
          <Loader2 v-if="chatStore.isEngineLoading" class="w-5 h-5 animate-spin" />
          <Pause v-else-if="chatStore.isEnginePaused" class="w-5 h-5" />
          <Download v-else class="w-5 h-5" />
          
          {{ 
            chatStore.isEngineLoading ? 'Téléchargement en cours...' : 
            chatStore.isEnginePaused ? 'Téléchargement en pause' : 
            'Télécharger et activer l\'IA' 
          }}
        </Button>
        <p class="text-xs text-slate-400 dark:text-slate-500 text-center max-w-xs leading-relaxed">
          Modèle par défaut : <strong>{{ modelStore.currentModelName }}</strong> ({{ modelStore.currentModel?.totalSize }}).
        </p>
      </div>
      
      <!-- Desktop & Mobile Hint -->
      <p class="text-[11px] text-slate-400 dark:text-slate-500 text-center pt-2">
        Vous pouvez également changer de modèle dans le menu latéral.
      </p>
    </div>
    
    <!-- Model Active Intro Card -->
    <div v-if="chatStore.isEngineReady" class="max-w-xl mx-auto p-5 rounded-3xl bg-indigo-50/10 dark:bg-indigo-950/5 border border-slate-200/50 dark:border-slate-800/50 text-left space-y-4 shadow-sm backdrop-blur-xl">
      <div class="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
        <div class="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
          <Bot class="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 class="font-bold text-slate-850 dark:text-slate-100 text-base leading-snug">
            {{ modelStore.currentModel?.name }}
          </h2>
          <p class="text-[10px] text-slate-400 dark:text-slate-500">
            {{ modelStore.currentModel?.totalSize }} • {{ modelStore.currentModel?.quantization }} • {{ modelStore.currentModel?.estimatedMemory }} RAM est.
          </p>
        </div>
      </div>
      
      <div class="text-xs space-y-2.5 text-slate-600 dark:text-slate-350 leading-relaxed">
        <div class="flex items-start gap-2">
          <span class="font-bold text-slate-700 dark:text-slate-200 flex-shrink-0 w-24">{{ tUI('who_i_am') }}</span>
          <span>{{ tModel(modelStore.currentModelId, 'desc') }}</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="font-bold text-slate-700 dark:text-slate-200 flex-shrink-0 w-24">{{ tUI('supported_languages') }}</span>
          <span>{{ tModel(modelStore.currentModelId, 'lang') }}</span>
        </div>
        <div class="flex items-start gap-2 text-amber-600 dark:text-amber-400 font-medium">
          <span class="font-bold flex-shrink-0 w-24 flex items-center gap-1">
            <AlertTriangle class="w-3.5 h-3.5" />
            {{ tUI('warning') }}
          </span>
          <span>{{ tModel(modelStore.currentModelId, 'warn') }}</span>
        </div>
      </div>
    </div>

    <!-- Suggested Prompts Grid -->
    <div v-if="chatStore.isEngineReady" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full px-4">
      <Card
        v-for="(prompt, index) in suggestedPrompts" 
        :key="prompt.text" 
        tabindex="0" 
        role="button"
        :aria-label="'Essayer le prompt : ' + prompt.title"
        :data-testid="'suggested-prompt-' + prompt.title.toLowerCase().replace(/\s+/g, '-')"
        class="group relative cursor-pointer text-left p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl transition-all duration-500 flex items-start space-x-4 overflow-hidden hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_12px_40px_-10px_rgb(0,0,0,0.1)] dark:hover:shadow-[0_12px_40px_-10px_rgba(99,102,241,0.2)] hover:border-indigo-500/50 dark:hover:border-indigo-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 animate-slide-up-fade"
        :style="`animation-delay: ${300 + index * 100}ms; animation-fill-mode: both;`"
        @click="$emit('send-prompt', prompt.text)"
        @keydown.enter="$emit('send-prompt', prompt.text)"
      >
        <!-- Animated border gradient -->
        <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none gradient-border-mask"/>
        
        <!-- Ambient Glow -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"/>

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
import { Globe, Code, Sparkles, Mail, ArrowRight, ArrowLeft, Menu, Shield, WifiOff, EyeOff, Download, Loader2, Bot, AlertTriangle, Pause } from 'lucide-vue-next'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { useModelI18n } from '~/composables/useModelI18n'

defineEmits(['send-prompt'])

const { t } = useI18n()
const deviceStore = useDeviceStore()
const modelStore = useModelStore()
const chatStore = useChatStore()
const { tModel, tUI } = useModelI18n()

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

<style scoped>
@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up-fade {
  animation: slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.gradient-border-mask {
  padding: 1px;
  background: linear-gradient(to bottom right, #6366f1, #ec4899);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
</style>
