<template>
  <!-- 2. Scénarios d'usage (Cas Pratiques) -->
  <div class="scenarios-container">
    <div class="section-header">
      <ShieldCheck class="section-icon" />
      <h2 class="section-title">
        {{ selectedLang === 'fr' ? "Cas pratiques & Scénarios d'usage" : "Real-World Scenarios & Use Cases" }}
      </h2>
    </div>
    <div class="cards-grid">
      <Card 
        v-for="(scenario, idx) in usageScenarios" 
        :key="idx" 
        class="scenario-card"
      >
        <div class="icon-wrapper">
          <component :is="scenario.icon" class="icon-element" />
        </div>
        <div class="text-content">
          <h3 class="card-title">
            {{ selectedLang === 'fr' ? scenario.titleFr : scenario.titleEn }}
          </h3>
          <p class="card-description">
            {{ selectedLang === 'fr' ? scenario.descFr : scenario.descEn }}
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '~/components/ui/card'
import { ShieldCheck } from 'lucide-vue-next'
import { usageScenarios } from '~/composables/useBrandAssetsData'

const props = defineProps<{ selectedLang: 'fr' | 'en' }>()
const emit = defineEmits<{ (e: 'update:selectedLang', val: 'fr' | 'en'): void }>()

const selectedLang = computed({
  get: () => props.selectedLang,
  set: (val) => emit('update:selectedLang', val)
})
</script>

<style scoped>
.scenarios-container {
  @apply space-y-6;
}

.section-header {
  @apply flex items-center space-x-2;
}

.section-icon {
  @apply w-6 h-6 text-indigo-500;
}

.section-title {
  @apply text-2xl font-black text-slate-900 dark:text-white;
}

.cards-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.scenario-card {
  @apply p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80;
  @apply shadow-sm rounded-2xl flex flex-col space-y-4;
  @apply hover:border-indigo-500/40 transition-colors;
}

.icon-wrapper {
  @apply inline-flex p-3 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl w-11 h-11 items-center justify-center;
  @apply transition-transform;
}

.scenario-card:hover .icon-wrapper {
  @apply scale-105;
}

.icon-element {
  @apply w-5 h-5;
}

.text-content {
  @apply space-y-2;
}

.card-title {
  @apply font-bold text-slate-800 dark:text-slate-100 text-base leading-snug;
}

.card-description {
  @apply text-xs text-slate-500 dark:text-slate-400 leading-relaxed;
}
</style>
