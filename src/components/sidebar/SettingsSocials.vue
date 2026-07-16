<template>
<!-- Section 4: Réseaux Sociaux -->
      <div class="accordion-item">
        <button 
          @click="emit('toggle', 'socials')" 
          class="accordion-trigger"
          :class="{ 'active': activeSection === 'socials' }"
        >
          <span class="accordion-title">
            <Github class="icon-sliders text-slate-700 dark:text-slate-300" />
            {{ t('accordion_socials') }}
          </span>
          <ChevronUp v-if="activeSection === 'socials'" class="icon-chevron" />
          <ChevronDown v-else class="icon-chevron" />
        </button>

        <div v-show="activeSection === 'socials'" class="accordion-content">
          <div class="flex items-center justify-center gap-4 py-2">
            <a href="https://www.linkedin.com/in/garygitton" target="_blank" rel="noopener noreferrer" class="social-link" title="LinkedIn" aria-label="Profil LinkedIn de Gary Gitton" data-testid="sidebar-linkedin-link">
              <Linkedin class="icon-social w-5 h-5" />
            </a>
            <a href="https://github.com/garygitton/chouette-gpt" target="_blank" rel="noopener noreferrer" class="social-link" title="GitHub" aria-label="Dépôt GitHub du projet" data-testid="sidebar-github-link">
              <Github class="icon-social w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSettings } from '~/contexts/settingsContext'
import { useModel } from '~/contexts/modelContext'
import { useChat } from '~/contexts/chatContext'
import { useI18n } from '~/composables/useI18n'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Slider } from '~/components/ui/slider'
import { Textarea } from '~/components/ui/textarea'
import { X, ChevronDown, ChevronUp, SlidersHorizontal, Check, Linkedin, Github, Sparkles } from 'lucide-vue-next'

const props = defineProps<{
  activeSection: string | null
}>()

const emit = defineEmits<{
  (e: 'toggle', section: string): void
}>()

const settingsStore = useSettings()
const modelStore = useModel()
const chatStore = useChat()
const { t } = useI18n()

// Only include what's needed for the section






</script>
