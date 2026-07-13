<template>
  <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-[450px] bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6">
      <DialogHeader class="space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Download class="w-6 h-6" />
        </div>
        <div>
          <DialogTitle class="text-xl font-bold text-slate-900 dark:text-white">
            Autoriser le téléchargement ?
          </DialogTitle>
          <DialogDescription class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ce modèle d'IA doit être chargé dans votre navigateur pour fonctionner.
          </DialogDescription>
        </div>
      </DialogHeader>
      
      <div class="py-4 space-y-4">
        <!-- Model Info Card -->
        <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Modèle sélectionné</p>
            <p class="text-sm font-bold text-slate-800 dark:text-slate-200">
              {{ model?.name }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Taille de l'IA</p>
            <Badge class="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 font-mono font-bold mt-0.5">
              {{ model?.totalSize || 'Inconnue' }}
            </Badge>
          </div>
        </div>
        
        <!-- Reassurance Bullet Points -->
        <div class="space-y-3.5 pt-2">
          <div class="flex items-start space-x-3 text-xs">
            <div class="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
              <ShieldCheck class="w-4 h-4" />
            </div>
            <div>
              <p class="font-bold text-slate-800 dark:text-slate-200">Confidentialité 100% Privée</p>
              <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                Le modèle s'exécute exclusivement sur votre machine. Aucune de vos données ou conversations ne quitte votre ordinateur.
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3 text-xs">
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

          <div class="flex items-start space-x-3 text-xs">
            <div class="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
              <Wifi class="w-4 h-4" />
            </div>
            <div>
              <p class="font-bold text-slate-800 dark:text-slate-200">Connexion Wi-Fi conseillée</p>
              <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                Le téléchargement fait environ {{ model?.totalSize }}. Utilisez de préférence une connexion Wi-Fi pour préserver votre forfait mobile.
              </p>
            </div>
          </div>

          <!-- Performance & Battery warning -->
          <div class="flex items-start space-x-3 text-xs">
            <div class="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5">
              <AlertTriangle class="w-4 h-4" />
            </div>
            <div>
              <p class="font-bold text-slate-800 dark:text-slate-200">{{ t('download_warning_title') }}</p>
              <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                {{ t('download_warning_desc') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="grid grid-cols-2 gap-3 sm:space-x-0 pt-2">
        <Button variant="outline" @click="$emit('update:modelValue', false)" class="rounded-xl border-slate-200 dark:border-slate-800 h-11 text-xs font-semibold">
          Plus tard
        </Button>
        <Button @click="handleAccept" class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 text-xs font-bold shadow-lg shadow-indigo-500/20">
          Accepter et Télécharger
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Download, ShieldCheck, HardDrive, Wifi, AlertTriangle } from 'lucide-vue-next'
import type { ModelInfo } from '~/types'

import { useI18n } from '~/composables/useI18n'

defineProps<{
  modelValue: boolean
  model: ModelInfo | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'accept': []
}>()

const { t } = useI18n()

function handleAccept() {
  emit('accept')
  emit('update:modelValue', false)
}
</script>
