<template>
  <Dialog :open="chatStore.isEngineLoading">
    <DialogContent 
      class="sm:max-w-md p-8 border-slate-100 dark:border-slate-800"
      @interact-outside="(e) => e.preventDefault()"
      @escape-key-down="(e) => e.preventDefault()"
    >
      <div class="space-y-5 text-center">
        <!-- Dancing Owl Loading Animation -->
        <div class="owl-stage mx-auto">
          <div class="logo-pulse"></div>
          <div class="owl-character">
            <svg class="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <!-- Ears -->
              <polygon points="10,50 0,20 34,42" fill="#f87171" />
              <polygon points="90,50 100,20 66,42" fill="#f87171" />
              
              <!-- Main head base -->
              <path d="M 10,50 Q 50,26 90,50 Q 90,95 50,95 Q 10,95 10,50 Z" fill="#fca5a5" />
              
              <!-- Eye circles and pupils -->
              <circle cx="34" cy="58" r="14" fill="white" stroke="#991b1b" stroke-width="3" />
              <circle cx="30" cy="58" r="6" fill="#991b1b" />
              <circle cx="28" cy="55.5" r="2" fill="white" />
              
              <circle cx="67" cy="58" r="14" fill="white" stroke="#991b1b" stroke-width="3" />
              <circle cx="62" cy="58" r="6" fill="#991b1b" />
              <circle cx="60" cy="55.5" r="2" fill="white" />
              
              <!-- Beak -->
              <polygon points="46,66 54,66 50,76" fill="#fef08a" />
            </svg>
          </div>
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
import { useChat } from '~/contexts/chatContext'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { Progress } from '~/components/ui/progress'

const chatStore = useChat()
</script>

<style scoped>
.owl-stage {
  position: relative;
  width: 100%;
  max-width: 320px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.logo-pulse {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(99, 102, 241, 0.15);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  z-index: 1;
}

.owl-character {
  width: 56px;
  height: 56px;
  position: absolute;
  transform-origin: bottom center;
  animation: owl-dance-routine 8s infinite linear;
  z-index: 10;
}

.logo-svg {
  width: 100%;
  height: 100%;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.1); }
}

@keyframes owl-dance-routine {
  0% {
    transform: translateX(-110px) translateY(0) rotate(0deg) scaleX(1);
  }
  5% {
    transform: translateX(-80px) translateY(-6px) rotate(6deg) scaleX(1);
  }
  10% {
    transform: translateX(-50px) translateY(0) rotate(-6deg) scaleX(1);
  }
  15% {
    transform: translateX(-20px) translateY(-6px) rotate(6deg) scaleX(1);
  }
  20% {
    transform: translateX(20px) translateY(0) rotate(-6deg) scaleX(1);
  }
  25% {
    transform: translateX(50px) translateY(-6px) rotate(6deg) scaleX(1);
  }
  30% {
    transform: translateX(80px) translateY(0) rotate(-6deg) scaleX(1);
  }
  33% {
    transform: translateX(95px) translateY(0) rotate(0deg) scaleX(1);
  }
  
  37% {
    transform: translateX(95px) translateY(-10px) rotate(180deg) scale(1.1);
  }
  40% {
    transform: translateX(95px) translateY(0) rotate(360deg) scale(1);
  }
  
  44% {
    transform: translateX(70px) translateY(-2px) skewX(8deg) rotate(-3deg);
  }
  48% {
    transform: translateX(45px) translateY(0) skewX(-8deg) rotate(3deg);
  }
  52% {
    transform: translateX(20px) translateY(-2px) skewX(8deg) rotate(-3deg);
  }
  56% {
    transform: translateX(0px) translateY(0) skewX(-8deg) rotate(3deg);
  }
  60% {
    transform: translateX(-20px) translateY(-2px) skewX(8deg) rotate(-3deg);
  }
  64% {
    transform: translateX(-45px) translateY(0) skewX(-8deg) rotate(3deg);
  }
  68% {
    transform: translateX(-80px) translateY(-2px) skewX(8deg) rotate(-3deg);
  }
  
  72% {
    transform: translateX(-95px) translateY(-10px) rotate(180deg) scale(1.1);
  }
  75% {
    transform: translateX(-95px) translateY(0) rotate(0deg) scale(1);
  }
  
  78% {
    transform: translateX(0) translateY(-20px) scale(1.25);
  }
  81% {
    transform: translateX(0) translateY(0) scale(1);
  }
  83% {
    transform: translateX(-10px) translateY(0) rotate(-12deg);
  }
  85% {
    transform: translateX(10px) translateY(0) rotate(12deg);
  }
  87% {
    transform: translateX(-6px) translateY(-6px) rotate(-6deg);
  }
  89% {
    transform: translateX(6px) translateY(-6px) rotate(6deg);
  }
  92% {
    transform: translateX(0) translateY(0) scale(1);
  }
  
  100% {
    transform: translateX(-110px) translateY(0) scale(1);
  }
}
</style>
