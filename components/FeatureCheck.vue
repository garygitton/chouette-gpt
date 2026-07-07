<template>
  <div class="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40">
    <div 
      class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      :class="checked ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
    >
      <Check v-if="checked" class="w-3.5 h-3.5" />
      <X v-else class="w-3.5 h-3.5" />
    </div>
    <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'

defineProps<{
  label: string
  checked: boolean
}>()
</script>