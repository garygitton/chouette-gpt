<template>
  <!-- 6. Souveraineté & Fiche Technique Grid -->
  <div class="sovereignty-grid">
    <!-- Souveraineté & Conformité (2/3 width) -->
    <Card class="sovereignty-card">
      <div>
        <div class="section-header">
          <ShieldAlert class="section-icon" />
          <h2 class="section-title">Souveraineté & Conformité de fait</h2>
        </div>
        
        <div class="content-container">
          <div class="columns-grid">
            <!-- Specialized models column -->
            <div class="specialized-column">
              <h3 class="column-title">
                <span class="bullet-accent"/>
                {{ t.specializedTitle }}
              </h3>
              <p class="column-desc">
                {{ t.specializedDesc }}
              </p>
            </div>

            <!-- Sovereignty / No cloud column -->
            <div class="specialized-column">
              <h3 class="column-title">
                <span class="bullet-accent"/>
                {{ t.sovereigntyTitle }}
              </h3>
              <p class="column-desc">
                {{ t.sovereigntyDesc }}
              </p>
            </div>
          </div>

          <!-- Compliance Framework Alert Box -->
          <div class="compliance-box">
            <div class="compliance-header">
              <Shield class="compliance-icon" />
              {{ t.complianceTitle }}
            </div>
            <p class="compliance-desc">
              {{ t.complianceDesc }}
            </p>
            <div class="standards-row">
              <div class="standard-item">
                <span class="bullet-standard"/>
                <span>RGPD / GDPR Compatible</span>
              </div>
              <div class="standard-item">
                <span class="bullet-standard"/>
                <span>HIPAA Compliant (de-facto)</span>
              </div>
              <div class="standard-item">
                <span class="bullet-standard"/>
                <span>SecNumCloud (host-aligned)</span>
              </div>
            </div>
            <div class="compliance-note">
              {{ t.complianceNote }}
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Fiche Technique (1/3 width) -->
    <Card class="technical-card">
      <div>
        <h2 class="technical-title">
          <Terminal class="tech-header-icon" />
          Fiche Technique
        </h2>
        <div class="tech-details-list">
          <div class="tech-row">
            <span class="tech-label">
              <User class="row-icon" /> Creator
            </span>
            <span class="tech-val">Gary Gitton</span>
          </div>
          <div class="tech-row">
            <span class="tech-label">
              <Calendar class="row-icon" /> Launch
            </span>
            <span class="tech-val">Juillet 2026</span>
          </div>
          <div class="tech-row">
            <span class="tech-label">
              <Shield class="row-icon" /> License
            </span>
            <span class="tech-val">MIT (Open-Source)</span>
          </div>
          <div class="tech-tech-section">
            <span class="tech-label">
              <Globe class="row-icon" /> Technologies Core
            </span>
            <div class="badge-row">
              <span class="tech-badge">WebGPU</span>
              <span class="tech-badge">WebAssembly</span>
              <span class="tech-badge">Nuxt 3</span>
              <span class="tech-badge">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '~/components/ui/card'
import { ShieldAlert, Shield, Terminal, User, Calendar, Globe } from 'lucide-vue-next'
import { staticTranslations } from '~/composables/useBrandAssetsData'

const props = defineProps<{ selectedLang: 'fr' | 'en' }>()
const emit = defineEmits<{ (e: 'update:selectedLang', val: 'fr' | 'en'): void }>()

const selectedLang = computed({
  get: () => props.selectedLang,
  set: (val) => emit('update:selectedLang', val)
})

const t = computed(() => staticTranslations[selectedLang.value])
</script>

<style scoped>
.sovereignty-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-8;
}

.sovereignty-card {
  @apply md:col-span-2 p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl flex flex-col justify-between;
}

.section-header {
  @apply flex items-center space-x-2 mb-6;
}

.section-icon {
  @apply w-5 h-5 text-emerald-500;
}

.section-title {
  @apply text-xl font-bold text-slate-800 dark:text-slate-200;
}

.content-container {
  @apply space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed;
}

.columns-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-6;
}

.specialized-column {
  @apply space-y-3;
}

.column-title {
  @apply font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2;
}

.bullet-accent {
  @apply w-1.5 h-3 bg-indigo-500 rounded;
}

.column-desc {
  @apply text-xs text-slate-500 dark:text-slate-400 leading-relaxed;
}

.compliance-box {
  @apply p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-3 mt-4;
}

.compliance-header {
  @apply flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider;
}

.compliance-icon {
  @apply w-4 h-4;
}

.compliance-desc {
  @apply text-xs text-slate-500 dark:text-slate-400 leading-relaxed;
}

.standards-row {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-medium text-slate-700 dark:text-slate-300;
}

.standard-item {
  @apply flex items-center gap-1.5;
}

.bullet-standard {
  @apply w-1.5 h-1.5 bg-emerald-500 rounded-full;
}

.compliance-note {
  @apply text-[10px] text-slate-400 dark:text-slate-500 italic mt-2;
}

.technical-card {
  @apply p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl flex flex-col justify-between;
}

.technical-title {
  @apply text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2;
}

.tech-header-icon {
  @apply w-5 h-5 text-indigo-500;
}

.tech-details-list {
  @apply space-y-4 text-xs md:text-sm;
}

.tech-row {
  @apply flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/60;
}

.tech-label {
  @apply text-slate-400 dark:text-slate-500 flex items-center gap-1.5;
}

.row-icon {
  @apply w-3.5 h-3.5;
}

.tech-val {
  @apply font-semibold text-slate-700 dark:text-slate-300;
}

.tech-tech-section {
  @apply space-y-1.5 pt-2;
}

.badge-row {
  @apply flex flex-wrap gap-1.5 mt-1;
}

.tech-badge {
  @apply px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400;
}
</style>
