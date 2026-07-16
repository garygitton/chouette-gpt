<template>
  <!-- Header -->
  <div class="header-container">
    <div class="icon-wrapper">
      <Briefcase class="header-icon" />
    </div>
    <h1 class="header-title">
      Brand Assets & ressources
    </h1>
    <p class="header-description">
      Tout le nécessaire pour parler de ChouetteGPT. Retrouvez nos logos officiels, nos fiches techniques, nos angles de rédaction et nos ressources prêtes à l'emploi.
    </p>
    <div class="actions-container">
      <Button @click="$router.push('/')" variant="outline" class="back-button">
        <ArrowLeft class="button-icon" /> Retour à l'accueil
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { ArrowLeft, Briefcase } from 'lucide-vue-next'

defineProps<{ selectedLang: 'fr' | 'en' }>()
defineEmits<{ (e: 'update:selectedLang', val: 'fr' | 'en'): void }>()
</script>

<style scoped>
.header-container {
  @apply text-center space-y-4;
}

.icon-wrapper {
  @apply inline-flex p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner animate-pulse;
}

.header-icon {
  @apply w-8 h-8;
}

.header-title {
  @apply text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight;
}

.header-description {
  @apply text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base;
}

.actions-container {
  @apply flex justify-center gap-3;
}

.back-button {
  @apply rounded-xl shadow-sm;
}

.button-icon {
  @apply w-4 h-4 mr-2;
}
</style>

