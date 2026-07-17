<template>
  <!-- 9. Contact & Liens (Attribution) -->
  <Card class="contact-card">
    <div class="flex-layout">
      <div class="text-section">
        <h2 class="section-title">
          <Mail class="section-icon" />
          {{ selectedLang === 'fr' ? 'Contact & Contribution' : 'Contact & Contribution' }}
        </h2>
        <p class="section-desc">
          {{ selectedLang === 'fr' 
            ? 'ChouetteGPT est un projet open-source initié par Gary Gitton. Rejoignez la communauté pour suggérer des fonctionnalités, poser vos questions ou contribuer au code.'
            : 'ChouetteGPT is an open-source project initiated by Gary Gitton. Join our community to suggest new features, ask questions, or contribute code.'
          }}
        </p>
      </div>
      <div class="actions-wrapper">
        <a 
          href="https://github.com/garygitton/chouette-gpt" 
          target="_blank"
          class="github-link"
        >
          <Github class="link-icon" /> GitHub
        </a>
      </div>
      <div class="socials-wrapper">
        <a href="https://www.linkedin.com/in/garygitton" target="_blank" rel="noopener noreferrer" class="social-link" :title="selectedLang === 'fr' ? 'Suivre sur LinkedIn' : 'Follow on LinkedIn'" aria-label="LinkedIn">
          <Linkedin class="social-icon" />
        </a>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '~/components/ui/card'
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const props = defineProps<{ selectedLang: 'fr' | 'en' }>()
const emit = defineEmits<{ (e: 'update:selectedLang', val: 'fr' | 'en'): void }>()

const selectedLang = computed({
  get: () => props.selectedLang,
  set: (val) => emit('update:selectedLang', val)
})
</script>

<style scoped>
.contact-card {
  @apply p-8 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl;
}

.flex-layout {
  @apply flex flex-col md:flex-row items-start md:items-center justify-between gap-6;
}

.text-section {
  @apply space-y-2;
}

.section-title {
  @apply text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2;
}

.section-icon {
  @apply w-5 h-5 text-indigo-500;
}

.section-desc {
  @apply text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed;
}

.actions-wrapper {
  @apply flex flex-wrap gap-3 w-full md:w-auto;
}

.github-link {
  @apply inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm h-10;
}

.link-icon {
  @apply w-4 h-4;
}



.socials-wrapper {
  @apply flex items-center gap-3 mt-2 md:mt-0;
}

.social-link {
  @apply inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors;
}

.social-icon {
  @apply w-4 h-4;
}
</style>
