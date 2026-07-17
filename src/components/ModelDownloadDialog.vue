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
      
      <ModelReassuranceInfo 
        :model-name="model?.name || 'Modèle'" 
        :model-size="model?.totalSize || 'Inconnue'"
        model-label="Modèle sélectionné"
        size-label="Taille de l'IA"
        :performance-title="t('download_warning_title')"
        :performance-desc="t('download_warning_desc')"
      />

      <DialogFooter class="grid grid-cols-2 gap-3 sm:space-x-0 pt-2">
        <Button variant="outline" class="rounded-xl border-slate-200 dark:border-slate-800 h-11 text-xs font-semibold" @click="$emit('update:modelValue', false)">
          Plus tard
        </Button>
        <Button class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 text-xs font-bold shadow-lg shadow-indigo-500/20" @click="handleAccept">
          Accepter et Télécharger
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Download } from 'lucide-vue-next'
import ModelReassuranceInfo from '~/components/ModelReassuranceInfo.vue'
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
