<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#070a12] py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
    <div class="max-w-4xl mx-auto space-y-16">
      <BrandHeader :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />
      <BrandPitches :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />
      <BrandScenarios :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />
      <BrandMockups :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />
      <BrandLogos :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />
      <BrandComparisonTable :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />
      <BrandSovereignty :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />
      <BrandFaq :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />
      <BrandPressAngles :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />
      <BrandContact :selected-lang="selectedLang" @update:selected-lang="selectedLang = $event" />

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettings } from '~/contexts/settingsContext'

import BrandHeader from '~/components/brand/BrandHeader.vue'
import BrandPitches from '~/components/brand/BrandPitches.vue'
import BrandScenarios from '~/components/brand/BrandScenarios.vue'
import BrandMockups from '~/components/brand/BrandMockups.vue'
import BrandLogos from '~/components/brand/BrandLogos.vue'
import BrandComparisonTable from '~/components/brand/BrandComparisonTable.vue'
import BrandSovereignty from '~/components/brand/BrandSovereignty.vue'
import BrandFaq from '~/components/brand/BrandFaq.vue'
import BrandPressAngles from '~/components/brand/BrandPressAngles.vue'
import BrandContact from '~/components/brand/BrandContact.vue'

const settingsStore = useSettings()

const selectedLang = computed({
  get: () => settingsStore.language === 'en' ? 'en' : 'fr',
  set: (val: 'fr' | 'en') => {
    settingsStore.language = val
  }
})
</script>
