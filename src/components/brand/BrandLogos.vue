<template>
  <!-- 4. Logos ChouetteGPT -->
  <div class="logos-container">
    <div class="header-section">
      <div class="title-container">
        <div class="flex items-center space-x-2">
          <Palette class="section-icon" />
          <h2 class="section-title">Logos ChouetteGPT</h2>
        </div>
        <p class="section-description">
          Chaque concept représente la chouette espiègle essayant de s'intégrer, d'interagir ou de se cacher en utilisant des palettes de couleurs pastel chaleureuses.
        </p>
      </div>
      <!-- Background Toggle for Logo Render preview -->
      <div class="bg-toggle-container">
        <button 
          :class="[
            'toggle-btn',
            logoBgMode === 'default' ? 'active-toggle' : 'inactive-toggle'
          ]"
          @click="logoBgMode = 'default'"
        >
          <Sparkles class="button-icon" /> Couleur
        </button>
        <button 
          :class="[
            'toggle-btn',
            logoBgMode === 'light' ? 'active-toggle' : 'inactive-toggle'
          ]"
          @click="logoBgMode = 'light'"
        >
          <Sun class="button-icon" /> Clair
        </button>
        <button 
          :class="[
            'toggle-btn',
            logoBgMode === 'dark' ? 'active-toggle' : 'inactive-toggle'
          ]"
          @click="logoBgMode = 'dark'"
        >
          <Moon class="button-icon" /> Sombre
        </button>
      </div>
    </div>

    <div class="logos-grid">
      <Card 
        v-for="logo in logos" 
        :key="logo.id" 
        class="logo-card"
      >
        <div class="logo-text-header">
          <h3 class="logo-title">{{ logo.name }}</h3>
          <p class="logo-description">{{ logo.description }}</p>
        </div>

        <!-- Dynamic SVG Container -->
        <div 
          :class="[
            'logo-preview-box',
            logoBgMode === 'default' ? logo.bgClass : (logoBgMode === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800')
          ]"
        >
          <div :id="logo.id" class="svg-container" v-html="logo.svgRaw"/>
        </div>

        <!-- Action buttons -->
        <div class="actions-grid">
          <Button variant="outline" size="sm" class="action-btn" :title="'Copier le code SVG de ' + logo.name" @click="copyLogoSVG(logo.id)">
            <component :is="copiedLogoId === logo.id ? Check : Copy" class="btn-icon" />
            Code
          </Button>
          <Button variant="outline" size="sm" class="action-btn" :title="'Télécharger ' + logo.name + ' au format SVG'" @click="downloadLogoSVG(logo.id, logo.filename)">
            <Download class="btn-icon" />
            .SVG
          </Button>
          <Button variant="outline" size="sm" class="action-btn" :title="'Télécharger ' + logo.name + ' au format PNG'" @click="downloadLogoPNG(logo.id, logo.filename)">
            <Download class="btn-icon" />
            .PNG
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Palette, Sparkles, Sun, Moon, Copy, Check, Download } from 'lucide-vue-next'
import { logos } from '~/composables/useBrandAssetsData'

defineProps<{ selectedLang: 'fr' | 'en' }>()
defineEmits<{ (e: 'update:selectedLang', val: 'fr' | 'en'): void }>()

const copiedLogoId = ref<string | null>(null)
const logoBgMode = ref<'default' | 'light' | 'dark'>('default')

function copyLogoSVG(id: string) {
  const logo = logos.find(l => l.id === id)
  if (!logo) return
  navigator.clipboard.writeText(logo.svgRaw).then(() => {
    copiedLogoId.value = id
    setTimeout(() => { if (copiedLogoId.value === id) copiedLogoId.value = null }, 2000)
  })
}

function downloadLogoSVG(id: string, filename: string) {
  const logo = logos.find(l => l.id === id)
  if (!logo) return
  const svgBlob = new Blob([logo.svgRaw], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = filename + ".svg"
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}

function downloadLogoPNG(id: string, filename: string) {
  const container = document.getElementById(id)
  if (!container) return
  const svgElement = container.querySelector('svg')
  if (!svgElement) return
  const svgString = new XMLSerializer().serializeToString(svgElement)
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const blobURL = URL.createObjectURL(svgBlob)
  const image = new Image()
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 800
    const context = canvas.getContext('2d')
    if (context) {
      context.clearRect(0, 0, 800, 800)
      context.drawImage(image, 0, 0, 800, 800)
      const png = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = png
      downloadLink.download = filename + ".png"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
    URL.revokeObjectURL(blobURL)
  }
  image.src = blobURL
}
</script>

<style scoped>
.logos-container {
  @apply space-y-6;
}

.header-section {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4;
}

.title-container {
  @apply space-y-1;
}

.section-icon {
  @apply w-5 h-5 text-indigo-500;
}

.section-title {
  @apply text-2xl font-black text-slate-900 dark:text-white;
}

.section-description {
  @apply text-sm text-slate-500 dark:text-slate-400;
}

.bg-toggle-container {
  @apply flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex-shrink-0 self-start sm:self-center;
}

.toggle-btn {
  @apply px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5;
}

.active-toggle {
  @apply bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm;
}

.inactive-toggle {
  @apply text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200;
}

.button-icon {
  @apply w-3.5 h-3.5;
}

.logos-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}

.logo-card {
  @apply p-6 flex flex-col items-center space-y-4 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl;
}

.logo-text-header {
  @apply text-center;
}

.logo-title {
  @apply font-bold text-lg text-slate-800 dark:text-slate-200;
}

.logo-description {
  @apply text-xs text-slate-400 dark:text-slate-500 mt-0.5;
}

.logo-preview-box {
  @apply p-5 rounded-2xl w-full flex justify-center overflow-hidden border transition-all duration-300 shadow-inner;
}

.svg-container {
  @apply w-[150px] h-[150px];
}

.actions-grid {
  @apply grid grid-cols-3 gap-2 w-full pt-2;
}

.action-btn {
  @apply rounded-xl text-[10px] px-1 h-9;
}

.btn-icon {
  @apply w-3.5 h-3.5 mr-1;
}

:deep(.peeking-owl) { animation: peek-up-down 4s infinite ease-in-out; }
@keyframes peek-up-down {
  0%, 100% { transform: translateY(22px); }
  40%, 60% { transform: translateY(0px); }
}
:deep(.shifty-pupil) { animation: look-left-right 4s infinite ease-in-out; }
@keyframes look-left-right {
  0%, 100% { transform: translateX(0); }
  35%, 65% { transform: translateX(-2.5px); }
  45%, 55% { transform: translateX(2px); }
}
</style>
