<template>
  <div class="py-4 space-y-4">
    <!-- Model Info Card -->
    <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{{ modelLabel || 'Modèle' }}</p>
        <p class="text-sm font-bold text-slate-800 dark:text-slate-200">
          {{ modelName }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{{ sizeLabel || 'Taille' }}</p>
        <Badge class="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 font-mono font-bold mt-0.5">
          {{ modelSize || 'Inconnue' }}
        </Badge>
      </div>
    </div>
    
    <!-- Reassurance Bullet Points -->
    <div class="space-y-3.5 pt-2">
      <!-- 1. Confidentiality -->
      <div class="flex items-start space-x-3 text-xs">
        <div class="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
          <ShieldCheck class="w-4 h-4" />
        </div>
        <div>
          <p class="font-bold text-slate-800 dark:text-slate-200">{{ secureTitle || 'Confidentialité 100% Privée' }}</p>
          <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
            {{ secureDesc || 'Le modèle s\'exécute exclusivement sur votre machine. Aucune de vos données ou conversations ne quitte votre ordinateur.' }}
          </p>
        </div>
      </div>

      <!-- 2. Offline Mode (Optional, mainly for chat) -->
      <div v-if="!hideOffline" class="flex items-start space-x-3 text-xs">
        <div class="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
          <HardDrive class="w-4 h-4" />
        </div>
        <div>
          <p class="font-bold text-slate-800 dark:text-slate-200">Sauvegarde & Mode Hors-ligne</p>
          <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
            Le fichier sera sauvegardé en toute sécurité dans le cache de votre navigateur. Une fois téléchargé, il fonctionnera instantanément et sans connexion internet.
          </p>
        </div>
      </div>

      <!-- 3. WiFi Warning -->
      <div class="flex items-start space-x-3 text-xs">
        <div class="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
          <Wifi class="w-4 h-4" />
        </div>
        <div>
          <p class="font-bold text-slate-800 dark:text-slate-200">{{ wifiTitle || 'Connexion Wi-Fi conseillée' }}</p>
          <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
            {{ wifiDesc || `Le téléchargement fait environ ${modelSize}. Utilisez de préférence une connexion Wi-Fi pour préserver votre forfait mobile.` }}
          </p>
        </div>
      </div>

      <!-- 4. Performance Warning (Optional, mainly for chat) -->
      <div v-if="!hidePerformance" class="flex items-start space-x-3 text-xs">
        <div class="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5">
          <AlertTriangle class="w-4 h-4" />
        </div>
        <div>
          <p class="font-bold text-slate-800 dark:text-slate-200">{{ performanceTitle || 'Performance' }}</p>
          <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
            {{ performanceDesc || 'Attention, l\'utilisation de modèles lourds peut décharger votre batterie plus rapidement et chauffer votre appareil.' }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import { ShieldCheck, HardDrive, Wifi, AlertTriangle } from 'lucide-vue-next'

defineProps<{
  modelName: string
  modelSize: string
  modelLabel?: string
  sizeLabel?: string
  secureTitle?: string
  secureDesc?: string
  hideOffline?: boolean
  wifiTitle?: string
  wifiDesc?: string
  hidePerformance?: boolean
  performanceTitle?: string
  performanceDesc?: string
}>()
</script>
