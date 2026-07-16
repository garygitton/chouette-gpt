<template>
  <!-- 1. Pitch & Descriptions Card -->
  <Card class="pitches-card">
    <div class="header-section">
      <div class="title-container">
        <Sparkles class="title-icon" />
        <h2 class="title-text">Descriptions & Pitches</h2>
      </div>
      <!-- Language Tab Selector -->
      <div class="lang-selector">
        <button 
          @click="selectedLang = 'fr'"
          :class="[
            'lang-tab-btn',
            selectedLang === 'fr' ? 'active-tab' : 'inactive-tab'
          ]"
        >
          Français
        </button>
        <button 
          @click="selectedLang = 'en'"
          :class="[
            'lang-tab-btn',
            selectedLang === 'en' ? 'active-tab' : 'inactive-tab'
          ]"
        >
          English
        </button>
      </div>
    </div>

    <!-- Pitch Content -->
    <div class="content-container">
      <!-- Tagline -->
      <div class="pitch-item">
        <div class="pitch-header">
          <span class="pitch-label">Tagline</span>
          <Button variant="ghost" size="sm" class="copy-btn" @click="copyText(taglineText, 'tagline')">
            <component :is="copiedId === 'tagline' ? Check : Copy" class="button-icon" />
            {{ copiedId === 'tagline' ? 'Copié !' : 'Copier' }}
          </Button>
        </div>
        <blockquote class="tagline-quote">
          "{{ taglineText }}"
        </blockquote>
      </div>

      <!-- Short Pitch -->
      <div class="pitch-item">
        <div class="pitch-header">
          <span class="pitch-label">Pitch Court (1 phrase)</span>
          <Button variant="ghost" size="sm" class="copy-btn" @click="copyText(shortPitchText, 'short')">
            <component :is="copiedId === 'short' ? Check : Copy" class="button-icon" />
            {{ copiedId === 'short' ? 'Copié !' : 'Copier' }}
          </Button>
        </div>
        <p class="pitch-body">
          {{ shortPitchText }}
        </p>
      </div>

      <!-- Medium Pitch -->
      <div class="pitch-item">
        <div class="pitch-header">
          <span class="pitch-label">Description Moyenne</span>
          <Button variant="ghost" size="sm" class="copy-btn" @click="copyText(mediumPitchText, 'medium')">
            <component :is="copiedId === 'medium' ? Check : Copy" class="button-icon" />
            {{ copiedId === 'medium' ? 'Copié !' : 'Copier' }}
          </Button>
        </div>
        <p class="pitch-body">
          {{ mediumPitchText }}
        </p>
      </div>

      <!-- Long Story -->
      <div class="pitch-item">
        <div class="pitch-header">
          <span class="pitch-label">L'Histoire / Pitch Complet</span>
          <Button variant="ghost" size="sm" class="copy-btn" @click="copyText(longStoryText, 'long')">
            <component :is="copiedId === 'long' ? Check : Copy" class="button-icon" />
            {{ copiedId === 'long' ? 'Copié !' : 'Copier' }}
          </Button>
        </div>
        <p class="pitch-body long-story">
          {{ longStoryText }}
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Sparkles, Copy, Check } from 'lucide-vue-next'
import { taglines, shortPitches, mediumPitches, longStories } from '~/composables/useBrandAssetsData'

const props = defineProps<{ selectedLang: 'fr' | 'en' }>()
const emit = defineEmits<{ (e: 'update:selectedLang', val: 'fr' | 'en'): void }>()

const selectedLang = computed({
  get: () => props.selectedLang,
  set: (val) => emit('update:selectedLang', val)
})

const copiedId = ref<string | null>(null)

const taglineText = computed(() => taglines[selectedLang.value])
const shortPitchText = computed(() => shortPitches[selectedLang.value])
const mediumPitchText = computed(() => mediumPitches[selectedLang.value])
const longStoryText = computed(() => longStories[selectedLang.value])

function copyText(text: string, id: string) {
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id
    setTimeout(() => { if (copiedId.value === id) copiedId.value = null }, 2000)
  })
}
</script>

<style scoped>
.pitches-card {
  @apply p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl;
}

.header-section {
  @apply flex justify-between items-center mb-6;
}

.title-container {
  @apply flex items-center space-x-2;
}

.title-icon {
  @apply w-5 h-5 text-indigo-500;
}

.title-text {
  @apply text-xl font-bold text-slate-800 dark:text-slate-200;
}

.lang-selector {
  @apply flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl;
}

.lang-tab-btn {
  @apply px-3 py-1.5 text-xs font-semibold rounded-lg transition-all;
}

.active-tab {
  @apply bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm;
}

.inactive-tab {
  @apply text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200;
}

.content-container {
  @apply space-y-6;
}

.pitch-item {
  @apply space-y-2;
}

.pitch-header {
  @apply flex justify-between items-center;
}

.pitch-label {
  @apply text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider;
}

.copy-btn {
  @apply h-8 px-2 text-slate-400 hover:text-indigo-500;
}

.button-icon {
  @apply w-4 h-4 mr-1.5;
}

.tagline-quote {
  @apply pl-4 border-l-4 border-indigo-500 text-lg font-medium text-slate-700 dark:text-slate-300 italic;
}

.pitch-body {
  @apply text-sm text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40 leading-relaxed;
}

.long-story {
  @apply whitespace-pre-line;
}
</style>

