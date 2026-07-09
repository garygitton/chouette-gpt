import { ref, watch, inject, reactive, type InjectionKey } from 'vue'

export function useProvideSettings() {
  const isDarkMode = ref(true)
  const temperature = ref(0.7)
  const topP = ref(0.9)
  const maxTokens = ref(1024)
  const linkedin = ref('')
  const github = ref('')
  const website = ref('')
  const language = ref('fr')

  const systemPrompt = ref('')
  const topK = ref(50)

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
  watch(topK, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_top_k', val.toString())
  })
  watch(systemPrompt, (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('llm_system_prompt', val)
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

  function resetSettings() {
    temperature.value = 0.7
    topP.value = 0.9
    maxTokens.value = 1024
    topK.value = 50
    if (typeof window !== 'undefined') {
      localStorage.removeItem('llm_temperature')
      localStorage.removeItem('llm_top_p')
      localStorage.removeItem('llm_max_tokens')
      localStorage.removeItem('llm_top_k')
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

  return reactive({
    isDarkMode,
    temperature,
    topP,
    maxTokens,
    topK,
    systemPrompt,
    linkedin,
    github,
    website,
    language,
    initSettings,
    resetSettings,
    toggleTheme
  })
}

export type SettingsContext = ReturnType<typeof useProvideSettings>
export const settingsKey: InjectionKey<SettingsContext> = Symbol('settings')

export function useSettings() {
  const context = inject(settingsKey)
  if (!context) throw new Error('useSettings must be used within a provider')
  return context
}
