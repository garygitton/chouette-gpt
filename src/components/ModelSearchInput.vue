<template>
  <div class="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800/80 sticky top-0 bg-white dark:bg-[#0b0f19] z-10">
    <div class="relative flex items-center">
      <Search class="w-3.5 h-3.5 absolute left-2 text-slate-400" />
      <input 
        v-model="model" 
        :placeholder="currentLang === 'fr' ? 'Rechercher un modèle...' : 'Search a model...'" 
        class="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
        @click.stop
        @keydown.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useModelI18n } from '~/composables/useModelI18n'

const model = defineModel<string>()
const { currentLang } = useModelI18n()
</script>
