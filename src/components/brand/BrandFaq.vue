<template>
  <!-- 7. Questions Fréquentes (Q&A) -->
  <div class="faq-container">
    <div class="section-header">
      <HelpCircle class="section-icon" />
      <h2 class="section-title">
        {{ selectedLang === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions' }}
      </h2>
    </div>
    <div class="faq-list">
      <div 
        v-for="(item, idx) in faqItems[selectedLang]" 
        :key="idx" 
        class="faq-item"
      >
        <button 
          @click="toggleFaq(idx)" 
          class="faq-trigger"
        >
          <span>{{ item.q }}</span>
          <span 
            class="arrow-container" 
            :class="{ 'rotated': activeFaqIdx === idx }"
          >
            <ChevronDown class="arrow-icon" />
          </span>
        </button>
        <div 
          v-show="activeFaqIdx === idx" 
          class="faq-answer"
        >
          {{ item.a }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { HelpCircle, ChevronDown } from 'lucide-vue-next'
import { faqItems } from '~/composables/useBrandAssetsData'

const props = defineProps<{ selectedLang: 'fr' | 'en' }>()
const emit = defineEmits<{ (e: 'update:selectedLang', val: 'fr' | 'en'): void }>()

const selectedLang = computed({
  get: () => props.selectedLang,
  set: (val) => emit('update:selectedLang', val)
})

const activeFaqIdx = ref<number | null>(null)

function toggleFaq(idx: number) {
  activeFaqIdx.value = activeFaqIdx.value === idx ? null : idx
}
</script>

<style scoped>
.faq-container {
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

.faq-list {
  @apply space-y-3;
}

.faq-item {
  @apply border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-[#0b0f19] overflow-hidden transition-all duration-200 shadow-sm;
}

.faq-trigger {
  @apply w-full py-4 px-6 text-left flex justify-between items-center font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors text-sm md:text-base gap-4;
}

.arrow-container {
  @apply text-indigo-500 transform transition-transform duration-200;
}

.rotated {
  @apply rotate-180;
}

.arrow-icon {
  @apply w-5 h-5;
}

.faq-answer {
  @apply px-6 pb-5 text-xs md:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-900/50 pt-4 leading-relaxed whitespace-pre-line;
}
</style>
