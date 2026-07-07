<template>
  <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Téléchargement du modèle</DialogTitle>
        <DialogDescription>
          Le modèle sélectionné n'est pas encore présent dans le cache de votre navigateur.
        </DialogDescription>
      </DialogHeader>
      
      <div class="py-4 space-y-4">
        <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-start space-x-3">
          <Download class="w-5 h-5 text-indigo-500 mt-0.5" />
          <div class="text-sm">
            <p class="font-medium text-slate-900 dark:text-slate-100 mb-1">
              {{ model?.name }}
            </p>
            <p class="text-slate-600 dark:text-slate-400">
              Taille estimée : <span class="font-semibold">{{ model?.totalSize || 'Inconnue' }}</span>
            </p>
          </div>
        </div>
        
        <p class="text-sm text-slate-500 dark:text-slate-400">
          En continuant, vous acceptez de télécharger ce volume de données. Il est recommandé d'utiliser une connexion Wi-Fi.
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:modelValue', false)">
          Annuler
        </Button>
        <Button @click="handleAccept" class="bg-indigo-600 hover:bg-indigo-700 text-white">
          Télécharger et Charger
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Download } from 'lucide-vue-next'
import type { ModelInfo } from '~/types'

const props = defineProps<{
  modelValue: boolean
  model: ModelInfo | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'accept': []
}>()

function handleAccept() {
  emit('accept')
  emit('update:modelValue', false)
}
</script>
