<template>
  <!-- 3. Mockup Showcase & Download -->
  <Card class="mockups-card">
    <div class="header-section">
      <h2 class="section-title">
        <ImageIcon class="title-icon" />
        Captures d'écran du Produit
      </h2>
      
      <!-- Tab Selector -->
      <div class="tab-selector">
        <button 
          :class="[
            'tab-btn',
            screenshotTab === 'desktop' ? 'active-tab' : 'inactive-tab'
          ]"
          @click="screenshotTab = 'desktop'"
        >
          Desktop
        </button>
        <button 
          :class="[
            'tab-btn',
            screenshotTab === 'mobile' ? 'active-tab' : 'inactive-tab'
          ]"
          @click="screenshotTab = 'mobile'"
        >
          Mobile
        </button>
      </div>
    </div>

    <div class="grid-layout">
      <!-- Preview Image Container -->
      <div 
        class="preview-container" 
        :class="screenshotTab === 'mobile' ? 'mobile-height' : 'desktop-ratio'"
      >
        <img 
          :src="screenshotTab === 'desktop' ? '/app_mockup.png' : '/app_mockup_mobile.png'" 
          :alt="screenshotTab === 'desktop' ? 'Desktop View' : 'Mobile View'" 
          :class="[
            'mockup-img',
            screenshotTab === 'desktop' ? 'desktop-img' : 'mobile-img'
          ]"
        >
      </div>

      <!-- Description and actions -->
      <div class="description-section">
        <h3 class="description-title">
          {{ screenshotTab === 'desktop' ? 'Interface Ordinateur' : 'Interface Mobile' }}
        </h3>
        <p class="description-text">
          {{ screenshotTab === 'desktop' 
            ? 'Aperçu de ChouetteGPT affichant une conversation active, la barre latérale des modèles et le panneau des paramètres dans sa configuration de bureau.' 
            : 'Aperçu optimisé et responsive pour smartphone, conservant la fluidité de navigation et le chat local.' 
          }}
        </p>
        <div class="download-container">
          <Button class="download-button" @click="downloadSelectedScreenshot">
            <Download class="button-icon" /> 
            Télécharger le PNG
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Download, Image as ImageIcon } from 'lucide-vue-next'

const screenshotTab = ref<'desktop' | 'mobile'>('desktop')

function downloadSelectedScreenshot() {
  const isDesktop = screenshotTab.value === 'desktop'
  const link = document.createElement('a')
  link.href = isDesktop ? '/app_mockup.png' : '/app_mockup_mobile.png'
  link.download = isDesktop ? 'chouettegpt_desktop_screenshot.png' : 'chouettegpt_mobile_screenshot.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.mockups-card {
  @apply p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl overflow-hidden;
}

.header-section {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6;
}

.section-title {
  @apply text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2;
}

.title-icon {
  @apply w-5 h-5 text-indigo-500;
}

.tab-selector {
  @apply flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-48 flex-shrink-0 self-start sm:self-center;
}

.tab-btn {
  @apply flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all;
}

.active-tab {
  @apply bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm;
}

.inactive-tab {
  @apply text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200;
}

.grid-layout {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6 items-center;
}

.preview-container {
  @apply md:col-span-2 relative rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/60 flex items-center justify-center bg-slate-50 dark:bg-slate-950/20;
}

.mobile-height {
  @apply h-[320px];
}

.desktop-ratio {
  @apply aspect-[16/10];
}

.mockup-img {
  @apply transition-all duration-300;
}

.desktop-img {
  @apply object-cover w-full h-full;
}

.mobile-img {
  @apply object-contain h-full;
}

.description-section {
  @apply space-y-4 flex flex-col justify-center h-full;
}

.description-title {
  @apply font-bold text-slate-800 dark:text-slate-200;
}

.description-text {
  @apply text-xs text-slate-500 dark:text-slate-400 leading-relaxed;
}

.download-container {
  @apply pt-2;
}

.download-button {
  @apply w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm text-xs h-9;
}

.button-icon {
  @apply w-4 h-4 mr-2;
}
</style>

