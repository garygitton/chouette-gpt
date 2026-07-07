import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const isDarkMode = ref(true)
  const temperature = ref(0.7)
  const topP = ref(0.9)
  const maxTokens = ref(1024)
  const linkedin = ref('')
  const github = ref('')
  const website = ref('')
  const language = ref('fr')

  // Initialize theme and LLM params from localStorage or system preference
  function initSettings() {
    if (typeof window !== 'undefined') {
      // Theme
      const stored = localStorage.getItem('theme')
      if (stored) {
        isDarkMode.value = stored === 'dark'
      } else {
        isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme()

      // LLM Params
      const t = localStorage.getItem('llm_temperature')
      if (t) temperature.value = parseFloat(t)
      const p = localStorage.getItem('llm_top_p')
      if (p) topP.value = parseFloat(p)
      const m = localStorage.getItem('llm_max_tokens')
      if (m) maxTokens.value = parseInt(m)

      // Social networks
      linkedin.value = localStorage.getItem('social_linkedin') || ''
      github.value = localStorage.getItem('social_github') || ''
      website.value = localStorage.getItem('social_website') || ''

      // Language
      language.value = localStorage.getItem('app_language') || 'fr'
    }
  }

  // Watch and persist changes
  watch(temperature, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_temperature', val.toString())
  })
  watch(topP, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_top_p', val.toString())
  })
  watch(maxTokens, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_max_tokens', val.toString())
  })
  watch(linkedin, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('social_linkedin', val)
  })
  watch(github, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('social_github', val)
  })
  watch(website, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('social_website', val)
  })
  watch(language, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('app_language', val)
  })

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  function applyTheme() {
    if (typeof document !== 'undefined') {
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  return {
    isDarkMode,
    temperature,
    topP,
    maxTokens,
    linkedin,
    github,
    website,
    language,
    initSettings,
    toggleTheme
  }
})
