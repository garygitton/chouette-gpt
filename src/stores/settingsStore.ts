import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const isDarkMode = ref(true)
  const temperature = ref(0.7)
  const forceWasm = ref(false)
  const topP = ref(0.9)
  const maxTokens = ref(1024)
  const linkedin = ref('')
  const github = ref('')
  const website = ref('')
  const language = ref('fr')

  const systemPrompt = ref('')
  const topK = ref(50)
  const doSample = ref(true)
  const repetitionPenalty = ref(1.0)

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
      const tk = localStorage.getItem('llm_top_k')
      if (tk) topK.value = parseInt(tk)
      const sp = localStorage.getItem('llm_system_prompt')
      if (sp) systemPrompt.value = sp
      const ds = localStorage.getItem('llm_do_sample')
      if (ds) doSample.value = ds === 'true'
      const rp = localStorage.getItem('llm_repetition_penalty')
      if (rp) repetitionPenalty.value = parseFloat(rp)

      // Social networks
      linkedin.value = localStorage.getItem('social_linkedin') || ''
      github.value = localStorage.getItem('social_github') || ''
      website.value = localStorage.getItem('social_website') || ''

      // Language
      language.value = localStorage.getItem('app_language') || 'fr'

      // Force WASM
      const fw = localStorage.getItem('llm_force_wasm')
      if (fw) forceWasm.value = fw === 'true'
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
  watch(topK, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_top_k', val.toString())
  })
  watch(systemPrompt, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_system_prompt', val)
  })
  watch(doSample, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_do_sample', val.toString())
  })
  watch(repetitionPenalty, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_repetition_penalty', val.toString())
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
  watch(forceWasm, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_force_wasm', val.toString())
  })

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  function resetSettings() {
    temperature.value = 0.7
    topP.value = 0.9
    maxTokens.value = 1024
    topK.value = 50
    doSample.value = true
    repetitionPenalty.value = 1.0
    forceWasm.value = false
    if (typeof window !== 'undefined') {
      localStorage.removeItem('llm_temperature')
      localStorage.removeItem('llm_top_p')
      localStorage.removeItem('llm_max_tokens')
      localStorage.removeItem('llm_top_k')
      localStorage.removeItem('llm_do_sample')
      localStorage.removeItem('llm_repetition_penalty')
      localStorage.removeItem('llm_force_wasm')
    }
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
    topK,
    doSample,
    repetitionPenalty,
    systemPrompt,
    linkedin,
    github,
    website,
    language,
    forceWasm,
    initSettings,
    resetSettings,
    toggleTheme
  }
})
