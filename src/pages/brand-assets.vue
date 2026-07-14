<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#070a12] py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
    <div class="max-w-5xl mx-auto space-y-12">
      
      <!-- Header -->
      <div class="text-center space-y-4">
        <div class="inline-flex p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner animate-pulse">
          <Briefcase class="w-8 h-8" />
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Brand Assets & ressources
        </h1>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          Tout le nécessaire pour parler de ChouetteGPT. Retrouvez nos logos officiels animés, nos textes de présentation prêts à l'emploi et nos captures d'écran.
        </p>
        <div class="flex justify-center gap-3">
          <Button @click="$router.push('/')" variant="outline" class="rounded-xl shadow-sm">
            <ArrowLeft class="w-4 h-4 mr-2" /> Retour à l'accueil
          </Button>
        </div>
      </div>

      <!-- Main Grid Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Column Left: Copywriting and Text pitches (2/3 width on large screens) -->
        <div class="lg:col-span-2 space-y-8">
          <Card class="p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center space-x-2">
                <Sparkles class="w-5 h-5 text-indigo-500" />
                <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200">Descriptions & Pitches</h2>
              </div>
              <!-- Language Tab Selector -->
              <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                <button 
                  @click="selectedLang = 'fr'"
                  :class="[
                    'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                    selectedLang === 'fr' 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  ]"
                >
                  Français
                </button>
                <button 
                  @click="selectedLang = 'en'"
                  :class="[
                    'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                    selectedLang === 'en' 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  ]"
                >
                  English
                </button>
              </div>
            </div>

            <!-- Pitch Content -->
            <div class="space-y-6">
              <!-- Tagline -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Tagline</span>
                  <Button variant="ghost" size="sm" class="h-8 px-2 text-slate-400 hover:text-indigo-500" @click="copyText(taglineText, 'tagline')">
                    <component :is="copiedId === 'tagline' ? Check : Copy" class="w-4 h-4 mr-1.5" />
                    {{ copiedId === 'tagline' ? 'Copié !' : 'Copier' }}
                  </Button>
                </div>
                <blockquote class="pl-4 border-l-4 border-indigo-500 text-lg font-medium text-slate-700 dark:text-slate-300 italic">
                  "{{ taglineText }}"
                </blockquote>
              </div>

              <!-- Short Pitch -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Pitch Court (1 phrase)</span>
                  <Button variant="ghost" size="sm" class="h-8 px-2 text-slate-400 hover:text-indigo-500" @click="copyText(shortPitchText, 'short')">
                    <component :is="copiedId === 'short' ? Check : Copy" class="w-4 h-4 mr-1.5" />
                    {{ copiedId === 'short' ? 'Copié !' : 'Copier' }}
                  </Button>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40 leading-relaxed">
                  {{ shortPitchText }}
                </p>
              </div>

              <!-- Medium Pitch -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Description Moyenne</span>
                  <Button variant="ghost" size="sm" class="h-8 px-2 text-slate-400 hover:text-indigo-500" @click="copyText(mediumPitchText, 'medium')">
                    <component :is="copiedId === 'medium' ? Check : Copy" class="w-4 h-4 mr-1.5" />
                    {{ copiedId === 'medium' ? 'Copié !' : 'Copier' }}
                  </Button>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40 leading-relaxed">
                  {{ mediumPitchText }}
                </p>
              </div>

              <!-- Long Story -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">L'Histoire / Pitch Complet</span>
                  <Button variant="ghost" size="sm" class="h-8 px-2 text-slate-400 hover:text-indigo-500" @click="copyText(longStoryText, 'long')">
                    <component :is="copiedId === 'long' ? Check : Copy" class="w-4 h-4 mr-1.5" />
                    {{ copiedId === 'long' ? 'Copié !' : 'Copier' }}
                  </Button>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40 leading-relaxed whitespace-pre-line">
                  {{ longStoryText }}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <!-- Column Right: Technical Specs & App Mockup -->
        <div class="space-y-8">
          <!-- Technical Specs -->
          <Card class="p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl">
            <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Terminal class="w-5 h-5 text-indigo-500" />
              Fiche Technique
            </h2>
            <div class="space-y-4 text-xs md:text-sm">
              <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                <span class="text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <User class="w-3.5 h-3.5" /> Créateur
                </span>
                <span class="font-semibold text-slate-700 dark:text-slate-300">Gary Gitton</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                <span class="text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Calendar class="w-3.5 h-3.5" /> Lancement
                </span>
                <span class="font-semibold text-slate-700 dark:text-slate-300">Juillet 2026</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                <span class="text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Shield class="w-3.5 h-3.5" /> Licence
                </span>
                <span class="font-semibold text-slate-700 dark:text-slate-300">MIT (Open-Source)</span>
              </div>
              <div class="space-y-1.5 pt-2">
                <span class="text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Globe class="w-3.5 h-3.5" /> Technologies Core
                </span>
                <div class="flex flex-wrap gap-1.5 mt-1">
                  <span class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">WebGPU</span>
                  <span class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">WebAssembly</span>
                  <span class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">Nuxt 3</span>
                  <span class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">Tailwind CSS</span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Mockup Showcase & Download -->
          <Card class="p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl overflow-hidden">
            <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <ImageIcon class="w-5 h-5 text-indigo-500" />
              Captures d'écran
            </h2>
            
            <!-- Tab Selector -->
            <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-4">
              <button 
                @click="screenshotTab = 'desktop'"
                :class="[
                  'flex-1 py-1 text-[10px] md:text-xs font-semibold rounded-lg transition-all',
                  screenshotTab === 'desktop' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                ]"
              >
                Desktop
              </button>
              <button 
                @click="screenshotTab = 'mobile'"
                :class="[
                  'flex-1 py-1 text-[10px] md:text-xs font-semibold rounded-lg transition-all',
                  screenshotTab === 'mobile' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                ]"
              >
                Mobile
              </button>
            </div>

            <!-- Preview Image -->
            <div class="relative rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/60 mb-4 flex items-center justify-center bg-slate-50 dark:bg-slate-950/20" :style="screenshotTab === 'mobile' ? 'height: 220px;' : 'aspect-ratio: 16/10;'">
              <img 
                :src="screenshotTab === 'desktop' ? '/app_mockup.png' : '/app_mockup_mobile.png'" 
                :alt="screenshotTab === 'desktop' ? 'Desktop View' : 'Mobile View'" 
                :class="[
                  'transition-all duration-300',
                  screenshotTab === 'desktop' ? 'object-cover w-full h-full' : 'object-contain h-full'
                ]"
              />
            </div>
            
            <p class="text-xs text-slate-500 mb-4">
              {{ screenshotTab === 'desktop' ? 'Aperçu haute résolution de l\'interface ordinateur.' : 'Aperçu de l\'interface responsive pour téléphones.' }}
            </p>
            
            <Button class="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm text-xs h-9" @click="downloadSelectedScreenshot">
              <Download class="w-4 h-4 mr-2" /> 
              Télécharger ({{ screenshotTab === 'desktop' ? 'Desktop' : 'Mobile' }} PNG)
            </Button>
          </Card>
        </div>

      </div>

      <!-- Logos Section (Full Width below) -->
      <div class="space-y-6">
        <div class="flex items-center space-x-2">
          <Palette class="w-5 h-5 text-indigo-500" />
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">Logos ChouetteGPT</h2>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Chaque concept représente la chouette espiègle essayant de s'intégrer, d'interagir ou de se cacher en utilisant des palettes de couleurs pastel chaleureuses.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Logo Card Template Loop -->
          <Card 
            v-for="logo in logos" 
            :key="logo.id" 
            class="p-6 flex flex-col items-center space-y-4 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl"
          >
            <div class="text-center">
              <h3 class="font-bold text-lg text-slate-800 dark:text-slate-200">{{ logo.name }}</h3>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{{ logo.description }}</p>
            </div>

            <!-- Dynamic SVG Container -->
            <div 
              :class="[
                'p-5 rounded-2xl w-full flex justify-center overflow-hidden border border-slate-100 dark:border-slate-900/60 shadow-inner',
                logo.bgClass
              ]"
            >
              <div v-html="logo.svgRaw" :id="logo.id" class="w-[150px] h-[150px]"></div>
            </div>

            <!-- Action buttons -->
            <div class="grid grid-cols-3 gap-2 w-full pt-2">
              <Button variant="outline" size="sm" class="rounded-xl text-[10px] px-1 h-9" :title="'Copier le code SVG de ' + logo.name" @click="copyLogoSVG(logo.id)">
                <component :is="copiedLogoId === logo.id ? Check : Copy" class="w-3.5 h-3.5 mr-1" />
                Code
              </Button>
              <Button variant="outline" size="sm" class="rounded-xl text-[10px] px-1 h-9" :title="'Télécharger ' + logo.name + ' au format SVG'" @click="downloadLogoSVG(logo.id, logo.filename)">
                <Download class="w-3.5 h-3.5 mr-1" />
                .SVG
              </Button>
              <Button variant="outline" size="sm" class="rounded-xl text-[10px] px-1 h-9" :title="'Télécharger ' + logo.name + ' au format PNG'" @click="downloadLogoPNG(logo.id, logo.filename)">
                <Download class="w-3.5 h-3.5 mr-1" />
                .PNG
              </Button>
            </div>
          </Card>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { 
  ArrowLeft, Copy, Check, Download, Briefcase, Palette, 
  Terminal, User, Calendar, Shield, Globe, Sparkles, Image as ImageIcon 
} from 'lucide-vue-next'

const selectedLang = ref<'fr' | 'en'>('fr')
const copiedId = ref<string | null>(null)
const copiedLogoId = ref<string | null>(null)

// Pitch texts definitions
const taglines = {
  fr: "La chouette locale qui garde vos secrets.",
  en: "The local owl keeping your secrets."
}

const shortPitches = {
  fr: "ChouetteGPT est un assistant IA 100% local fonctionnant directement dans votre navigateur grâce à WebGPU. Pas de serveurs, pas de fuites, juste du calcul privé.",
  en: "ChouetteGPT is a 100% local AI assistant running directly in your browser using WebGPU. No servers, no leaks, just private compute."
}

const mediumPitches = {
  fr: "Qui a dit que l'IA devait forcément envoyer vos données dans le cloud ? ChouetteGPT s'exécute entièrement sur votre appareil. En combinant WebGPU et WebAssembly, cet assistant malicieux mais redoutable d'efficacité offre une inférence ultra-rapide en local. C'est l'IA privée par excellence, toujours prête à vous aider tout en protégeant jalousement vos données.",
  en: "Who said AI has to send your data to the cloud? ChouetteGPT runs entirely on your device. Powered by WebGPU and WebAssembly, this mischievous yet highly efficient assistant offers blazing-fast local inference. It's the ultimate private AI, always ready to help while jealousy guarding your data."
}

const longStories = {
  fr: "Né de l'idée de faire tourner des modèles de langue avancés directement dans un simple onglet de navigateur, ChouetteGPT repousse les limites du possible.\n\nNotre mascotte – une chouette curieuse, un tantinet espiègle mais farouchement protectrice de votre vie privée – symbolise notre vision : une technologie accessible, souveraine et amusante.\n\nQue vous soyez hors-ligne en plein vol ou soucieux de la confidentialité de vos codes sources, ChouetteGPT est votre compagnon idéal : local, autonome et open-source.",
  en: "Born from the idea of running advanced LLMs directly inside a simple browser tab, ChouetteGPT pushes the boundaries of what's possible.\n\nOur mascot – a curious, slightly mischievous owl who is fiercely protective of your privacy – symbolizes our vision: accessible, sovereign, and fun technology.\n\nWhether you're offline mid-flight or concerned about source code confidentiality, ChouetteGPT is your perfect companion: local, autonomous, and open-source."
}

const taglineText = computed(() => taglines[selectedLang.value])
const shortPitchText = computed(() => shortPitches[selectedLang.value])
const mediumPitchText = computed(() => mediumPitches[selectedLang.value])
const longStoryText = computed(() => longStories[selectedLang.value])

// Interactive Logos raw definitions (Extracted from old logos concepts)
const logos = [
  {
    id: 'logo-peek-a-boo-coral',
    name: 'Peek-a-boo Coral',
    filename: 'chouettegpt_peek_a_boo_coral',
    description: 'La chouette malicieuse cachée derrière son mur menthe.',
    bgClass: 'bg-[#f0fdf4]',
    svgRaw: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display: block;">
  <rect x="0" y="60" width="100" height="40" fill="#a7f3d0" rx="8" />
  <g class="peeking-owl" transform-origin="50 70">
    <path d="M 30,50 Q 50,38 70,50 L 70,75 L 30,75 Z" fill="#fca5a5" />
    <polygon points="30,50 25,35 42,46" fill="#f87171" />
    <polygon points="70,50 75,35 58,46" fill="#f87171" />
    <circle cx="42" cy="54" r="7" fill="white" stroke="#991b1b" stroke-width="1.5" />
    <circle cx="40" cy="54" r="3" fill="#991b1b" class="shifty-pupil" />
    <circle cx="58" cy="54" r="7" fill="white" stroke="#991b1b" stroke-width="1.5" />
    <circle cx="56" cy="54" r="3" fill="#991b1b" class="shifty-pupil" />
    <polygon points="48,58 52,58 50,63" fill="#fef08a" />
  </g>
  <rect x="0" y="60" width="100" height="40" fill="#a7f3d0" opacity="0.95" />
  <line x1="0" y1="60" x2="100" y2="60" stroke="#059669" stroke-width="2" />
</svg>`
  },
  {
    id: 'logo-cardboard-box-spy',
    name: 'Cardboard Box Spy',
    filename: 'chouettegpt_cardboard_box_spy',
    description: 'Une chouette dorée qui espionne sous sa boîte bleue.',
    bgClass: 'bg-[#fff1f2]',
    svgRaw: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display: block;">
  <g class="box-owl-under">
    <rect x="35" y="45" width="30" height="35" rx="15" fill="#fef08a" />
    <circle cx="43" cy="54" r="5" fill="white" />
    <circle cx="57" cy="54" r="5" fill="white" />
    <circle cx="44" cy="54" r="2" fill="#ca8a04" class="eye-look-up" />
    <circle cx="56" cy="54" r="2" fill="#ca8a04" class="eye-look-up" />
    <polygon points="48,59 52,59 50,63" fill="#f97316" />
  </g>
  <g class="spy-box" transform-origin="50 75">
    <rect x="25" y="40" width="50" height="42" rx="4" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />
    <rect x="42" y="40" width="16" height="42" fill="#38bdf8" opacity="0.4" />
    <circle cx="42" cy="60" r="5" fill="#0284c7" />
    <circle cx="58" cy="60" r="5" fill="#0284c7" />
    <circle cx="42" cy="60" r="2" fill="#fbbf24" class="box-eyes" />
    <circle cx="58" cy="60" r="2" fill="#fbbf24" class="box-eyes" />
  </g>
</svg>`
  },
  {
    id: 'logo-shy-leaf-mint',
    name: 'Shy Leaf Mint',
    filename: 'chouettegpt_shy_leaf_mint',
    description: 'Regard en biais depuis une feuille de menthe géante.',
    bgClass: 'bg-[#faf5ff]',
    svgRaw: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display: block;">
  <g class="leaf-owl" transform-origin="50 50">
    <circle cx="50" cy="50" r="24" fill="#e9d5ff" stroke="#a855f7" stroke-width="2" />
    <polygon points="32,34 22,18 42,28" fill="#d8b4fe" />
    <polygon points="68,34 78,18 58,28" fill="#d8b4fe" />
    <path d="M 33,45 Q 40,40 43,48" fill="none" stroke="#7e22ce" stroke-width="2.5" stroke-linecap="round" />
    <path d="M 67,45 Q 60,40 57,48" fill="none" stroke="#7e22ce" stroke-width="2.5" stroke-linecap="round" />
    <polygon points="47,52 53,52 50,58" fill="#f97316" />
  </g>
  <g class="front-leaf" transform-origin="50 75">
    <path d="M 50,30 C 20,45 25,80 50,85 C 75,80 80,45 50,30 Z" fill="#ccfbf1" stroke="#0d9488" stroke-width="2" />
    <line x1="50" y1="30" x2="50" y2="85" stroke="#0d9488" stroke-width="1.5" />
    <path d="M 50,45 Q 35,40 32,48" fill="none" stroke="#0d9488" stroke-width="1" />
    <path d="M 50,55 Q 65,52 68,60" fill="none" stroke="#0d9488" stroke-width="1" />
  </g>
</svg>`
  },
  {
    id: 'logo-pink-curtain-peeker',
    name: 'Pink Curtain Peeker',
    filename: 'chouettegpt_pink_curtain_peeker',
    description: 'Une chouette turquoise soulevant un rideau rose pastel.',
    bgClass: 'bg-[#f0f9ff]',
    svgRaw: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display: block;">
  <g class="curtain-owl" transform-origin="40 50">
    <rect x="20" y="30" width="40" height="50" rx="20" fill="#99f6e4" stroke="#0d9488" stroke-width="2" />
    <circle cx="35" cy="48" r="7" fill="white" />
    <circle cx="37" cy="48" r="3" fill="#0d9488" class="look-right" />
    <polygon points="46,52 50,52 48,56" fill="#f59e0b" />
    <path d="M 30,40 Q 35,36 40,41" fill="none" stroke="#0d9488" stroke-width="2" />
  </g>
  <g class="curtain" transform-origin="80 0">
    <path d="M 50,0 Q 65,40 55,100 L 100,100 L 100,0 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="2" class="curtain-swing" />
    <path d="M 58,50 C 65,52 75,52 82,50" fill="none" stroke="#db2777" stroke-width="2.5" stroke-dasharray="3,3" />
  </g>
</svg>`
  },
  {
    id: 'logo-sunglasses-ghost',
    name: 'Sunglasses Ghost',
    filename: 'chouettegpt_sunglasses_ghost',
    description: 'Chouette verte déguisée en fantôme avec lunettes rétro.',
    bgClass: 'bg-[#fdf2f8]',
    svgRaw: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display: block;">
  <g class="ghost-sheet">
    <path d="M 30,25 C 40,20 60,20 70,25 C 75,35 80,68 75,80 C 70,75 65,85 60,80 C 55,85 50,80 45,80 C 40,85 35,75 30,80 C 25,68 25,35 30,25 Z" fill="#fff" stroke="#f43f5e" stroke-width="2" class="float-sheet" />
    <circle cx="42" cy="40" r="7" fill="#bbf7d0" />
    <circle cx="58" cy="40" r="7" fill="#bbf7d0" />
    <polygon points="48,48 52,48 50,52" fill="#fbbf24" />
    <g class="sunglasses" transform-origin="50 40">
      <circle cx="42" cy="40" r="9" fill="none" stroke="#475569" stroke-width="2.5" />
      <circle cx="42" cy="40" r="7.5" fill="#0f172a" opacity="0.85" />
      <circle cx="58" cy="40" r="9" fill="none" stroke="#475569" stroke-width="2.5" />
      <circle cx="58" cy="40" r="7.5" fill="#0f172a" opacity="0.85" />
      <line x1="51" y1="40" x2="49" y2="40" stroke="#475569" stroke-width="2.5" />
      <path d="M 37,36 L 43,42" stroke="white" stroke-width="1.5" stroke-linecap="round" />
      <path d="M 53,36 L 59,42" stroke="white" stroke-width="1.5" stroke-linecap="round" />
    </g>
  </g>
</svg>`
  }
]

// Copying text utilities
function copyText(text: string, id: string) {
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id
    setTimeout(() => {
      if (copiedId.value === id) copiedId.value = null
    }, 2000)
  })
}

// Copying SVG code to clipboard
function copyLogoSVG(id: string) {
  const logo = logos.find(l => l.id === id)
  if (!logo) return
  navigator.clipboard.writeText(logo.svgRaw).then(() => {
    copiedLogoId.value = id
    setTimeout(() => {
      if (copiedLogoId.value === id) copiedLogoId.value = null
    }, 2000)
  })
}

// Download raw SVG file
function downloadLogoSVG(id: string, filename: string) {
  const logo = logos.find(l => l.id === id)
  if (!logo) return
  const svgBlob = new Blob([logo.svgRaw], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = `${filename}.svg`
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}

// Download PNG using client-side HTML5 canvas rendering
function downloadLogoPNG(id: string, filename: string) {
  const container = document.getElementById(id)
  if (!container) return
  const svgElement = container.querySelector('svg')
  if (!svgElement) return

  // Serialize the SVG to a string
  const svgString = new XMLSerializer().serializeToString(svgElement)
  
  // Create an image and a blob URL
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const blobURL = URL.createObjectURL(svgBlob)
  const image = new Image()

  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 800  // High Resolution PNG
    canvas.height = 800
    const context = canvas.getContext('2d')
    if (context) {
      context.clearRect(0, 0, 800, 800)
      context.drawImage(image, 0, 0, 800, 800)
      
      const png = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = png
      downloadLink.download = `${filename}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
    URL.revokeObjectURL(blobURL)
  }
  
  image.src = blobURL
}

const screenshotTab = ref<'desktop' | 'mobile'>('desktop')

// Download application screenshot mockup
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
/* Concept 1: Peek-a-boo Coral */
:deep(.peeking-owl) {
  animation: peek-up-down 4s infinite ease-in-out;
}
@keyframes peek-up-down {
  0%, 100% { transform: translateY(22px); }
  40%, 60% { transform: translateY(0px); }
}
:deep(.shifty-pupil) {
  animation: look-left-right 4s infinite ease-in-out;
}
@keyframes look-left-right {
  0%, 100% { transform: translateX(0); }
  35%, 65% { transform: translateX(-2.5px); }
  45%, 55% { transform: translateX(2px); }
}

/* Concept 2: Cardboard Box Spy */
:deep(.spy-box) {
  animation: lift-box 5s infinite ease-in-out;
}
@keyframes lift-box {
  0%, 20%, 80%, 100% { transform: translateY(0) rotate(0deg); }
  40% { transform: translateY(-16px) rotate(-6deg); }
  60% { transform: translateY(-14px) rotate(4deg); }
}
:deep(.box-eyes) {
  animation: shifty-box-eyes 5s infinite;
}
@keyframes shifty-box-eyes {
  0%, 100% { transform: translate(0, 0); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-2px, 1px); }
}
:deep(.eye-look-up) {
  animation: follow-box 5s infinite;
}
@keyframes follow-box {
  0%, 20%, 80%, 100% { transform: translateY(0); }
  40%, 60% { transform: translateY(-2px); }
}

/* Concept 3: Shy Leaf Mint */
:deep(.leaf-owl) {
  animation: shy-move 6s infinite ease-in-out;
}
@keyframes shy-move {
  0%, 100% { transform: translateX(0) scale(1); }
  25% { transform: translateX(-8px) scale(0.98); }
  75% { transform: translateX(8px) scale(0.98); }
}
:deep(.front-leaf) {
  animation: leaf-sway 3s infinite ease-in-out alternate;
}
@keyframes leaf-sway {
  0% { transform: rotate(-3deg); }
  100% { transform: rotate(3deg); }
}

/* Concept 4: Pink Curtain Peeker */
:deep(.curtain-swing) {
  animation: pull-curtain 5s infinite ease-in-out alternate;
}
@keyframes pull-curtain {
  0% { transform: scaleX(1); }
  100% { transform: scaleX(0.7) skewY(2deg); }
}
:deep(.curtain-owl) {
  animation: owl-lean 5s infinite ease-in-out alternate;
}
@keyframes owl-lean {
  0% { transform: translateX(10px) rotate(5deg); }
  100% { transform: translateX(0) rotate(0deg); }
}
:deep(.look-right) {
  animation: look-at-user 5s infinite alternate;
}
@keyframes look-at-user {
  0% { transform: translateX(-2px); }
  100% { transform: translateX(2px); }
}

/* Concept 5: Sunglasses Ghost */
:deep(.float-sheet) {
  animation: ghost-float 3s infinite ease-in-out alternate;
}
:deep(.sunglasses) {
  animation: ghost-float 3s infinite ease-in-out alternate;
}
@keyframes ghost-float {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(-5px) rotate(1.5deg); }
}
</style>
