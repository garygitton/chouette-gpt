<template>
  <!-- 5. Tableau Comparatif des Paradigmes IA -->
  <Card class="comparison-card">
    <div class="header-section">
      <Scale class="section-icon" />
      <h2 class="section-title">{{ comparisonTable[selectedLang].title }}</h2>
    </div>
    
    <div class="table-wrapper">
      <table class="comparison-table-el">
        <thead>
          <tr class="header-row">
            <th class="header-cell">{{ comparisonTable[selectedLang].headers[0] }}</th>
            <th class="header-cell local-header">{{ comparisonTable[selectedLang].headers[1] }}</th>
            <th class="header-cell web-local-header">{{ comparisonTable[selectedLang].headers[2] }}</th>
            <th class="header-cell web-cloud-header">{{ comparisonTable[selectedLang].headers[3] }}</th>
          </tr>
        </thead>
        <tbody class="body-container">
          <tr v-for="(row, idx) in comparisonTable[selectedLang].rows" :key="idx" class="body-row">
            <td class="criterion-cell">{{ row.criterion }}</td>
            
            <!-- Local Column -->
            <td class="value-cell">
              <div class="flex-align">
                <component :is="getCellIcon(row.local.status)" class="status-icon" :class="getIconColorClass(row.local.status)" />
                <span class="text-wrap">{{ row.local.text }}</span>
              </div>
            </td>

            <!-- Web Local (ChouetteGPT) Column -->
            <td class="value-cell highlighted-cell">
              <div class="flex-align">
                <component :is="getCellIcon(row.webLocal.status)" class="status-icon" :class="getIconColorClass(row.webLocal.status)" />
                <span class="text-wrap">{{ row.webLocal.text }}</span>
              </div>
            </td>

            <!-- Web Cloud Column -->
            <td class="value-cell">
              <div class="flex-align">
                <component :is="getCellIcon(row.cloud.status)" class="status-icon" :class="getIconColorClass(row.cloud.status)" />
                <span class="text-wrap">{{ row.cloud.text }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '~/components/ui/card'
import { Scale, CheckCircle2, AlertCircle, XCircle } from 'lucide-vue-next'
import { comparisonTable } from '~/composables/useBrandAssetsData'

const props = defineProps<{ selectedLang: 'fr' | 'en' }>()
const emit = defineEmits<{ (e: 'update:selectedLang', val: 'fr' | 'en'): void }>()

const selectedLang = computed({
  get: () => props.selectedLang,
  set: (val) => emit('update:selectedLang', val)
})

function getIconColorClass(status: 'best' | 'neutral' | 'worst') {
  if (status === 'best') return 'text-emerald-600 dark:text-emerald-400'
  if (status === 'neutral') return 'text-amber-500 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

function getCellIcon(status: 'best' | 'neutral' | 'worst') {
  if (status === 'best') return CheckCircle2
  if (status === 'neutral') return AlertCircle
  return XCircle
}
</script>

<style scoped>
.comparison-card {
  @apply p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl;
}

.header-section {
  @apply flex items-center space-x-2 mb-6;
}

.section-icon {
  @apply w-5 h-5 text-indigo-500;
}

.section-title {
  @apply text-xl font-bold text-slate-800 dark:text-slate-200;
}

.table-wrapper {
  @apply overflow-x-auto;
}

.comparison-table-el {
  @apply w-full text-left text-xs border-collapse min-w-[650px];
}

.header-row {
  @apply border-b border-slate-200 dark:border-slate-800 text-slate-400;
}

.header-cell {
  @apply py-3 px-4 font-bold uppercase tracking-wider;
}

.local-header {
  @apply text-slate-600 dark:text-slate-300;
}

.web-local-header {
  @apply text-indigo-600 dark:text-indigo-400;
}

.web-cloud-header {
  @apply text-pink-600 dark:text-pink-400;
}

.body-container {
  @apply divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300;
}

.body-row {
  @apply hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors duration-150;
}

.criterion-cell {
  @apply py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200;
}

.value-cell {
  @apply py-3.5 px-4 text-slate-600 dark:text-slate-300;
}

.highlighted-cell {
  @apply font-semibold text-slate-900 dark:text-slate-100;
}

.flex-align {
  @apply flex items-start gap-2;
}

.status-icon {
  @apply w-4 h-4 mt-0.5 flex-shrink-0;
}

.text-wrap {
  @apply leading-relaxed;
}
</style>

