<template>
  <!-- 8. Cadrages Thématiques & Analyses -->
  <div class="section-container">
    <div class="section-header">
      <Newspaper class="section-icon" />
      <h2 class="section-title">
        {{ selectedLang === 'fr' ? 'Cadrages Thématiques & Analyses' : 'Thematic Frameworks & Analysis' }}
      </h2>
    </div>
    <p class="section-description">
      {{ selectedLang === 'fr' 
        ? 'Ces fiches d\'analyse fournissent des éléments de contexte technique et réglementaire pour appuyer les études de cas, documentations et analyses indépendantes du projet.'
        : 'These analysis summaries provide technical and regulatory context to support independent case studies, documentation, and research reports.'
      }}
    </p>

    <div class="cards-grid">
      <Card 
        v-for="angle in pressAngles" 
        :key="angle.id" 
        class="press-card"
      >
        <div class="card-content">
          <div class="icon-wrapper">
            <component :is="angle.icon" class="icon-element" />
          </div>
          <h3 class="card-title">
            {{ selectedLang === 'fr' ? angle.titleFr : angle.titleEn }}
          </h3>
          <p class="card-hook">
            « {{ selectedLang === 'fr' ? angle.hookFr : angle.hookEn }} »
          </p>
          <div class="card-body">
            {{ selectedLang === 'fr' ? angle.bodyFr : angle.bodyEn }}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          class="copy-button" 
          @click="copyText(selectedLang === 'fr' ? angle.bodyFr : angle.bodyEn, angle.id)"
        >
          <component :is="copiedId === angle.id ? Check : Copy" class="button-icon" />
          {{ copiedId === angle.id ? t.copied : t.copyArticle }}
        </Button>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Newspaper, Copy, Check } from 'lucide-vue-next'
import { pressAngles, staticTranslations } from '~/composables/useBrandAssetsData'

const props = defineProps<{ selectedLang: 'fr' | 'en' }>()
const emit = defineEmits<{ (e: 'update:selectedLang', val: 'fr' | 'en'): void }>()

const selectedLang = computed({
  get: () => props.selectedLang,
  set: (val) => emit('update:selectedLang', val)
})

const copiedId = ref<string | null>(null)
const t = computed(() => staticTranslations[selectedLang.value])

function copyText(text: string, id: string) {
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id
    setTimeout(() => { if (copiedId.value === id) copiedId.value = null }, 2000)
  })
}
</script>

<style scoped>
.section-container {
  @apply space-y-6 pt-4;
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

.section-description {
  @apply text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed;
}

.cards-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.press-card {
  @apply p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80;
  @apply shadow-sm rounded-2xl flex flex-col justify-between space-y-4;
  @apply hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-colors;
}

.card-content {
  @apply space-y-3;
}

.icon-wrapper {
  @apply inline-flex p-2 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl;
  @apply transition-transform;
}

.press-card:hover .icon-wrapper {
  @apply scale-105;
}

.icon-element {
  @apply w-5 h-5;
}

.card-title {
  @apply font-bold text-slate-800 dark:text-slate-100 text-base leading-snug;
}

.card-hook {
  @apply text-xs text-indigo-600 dark:text-indigo-400 italic;
}

.card-body {
  @apply text-xs text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-900/60;
  @apply p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/50;
  @apply leading-relaxed max-h-56 overflow-y-auto;
}

.copy-button {
  @apply w-full rounded-xl text-xs h-8 font-medium;
}

.button-icon {
  @apply w-3.5 h-3.5 mr-1.5;
}
</style>

