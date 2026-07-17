import { computed } from 'vue'

import { useSettingsStore } from '~/stores/settingsStore'
import fr from '~/locales/messages/fr'
import en from '~/locales/messages/en'
import es from '~/locales/messages/es'
import zh from '~/locales/messages/zh'
import hi from '~/locales/messages/hi'
import ar from '~/locales/messages/ar'
import pt from '~/locales/messages/pt'
import ru from '~/locales/messages/ru'
import bn from '~/locales/messages/bn'
import ur from '~/locales/messages/ur'

export const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ur', name: 'اردو (Urdu)' }
]

export const translations: Record<string, Record<string, string>> = {
  fr,
  en,
  es,
  zh,
  hi,
  ar,
  pt,
  ru,
  bn,
  ur
}

export function useI18n() {
  const settingsStore = useSettingsStore()

  const currentLang = computed(() => settingsStore.language || 'fr')

  function t(key: string): string {
    const lang = currentLang.value
    const translation = translations[lang]?.[key] || translations['fr']?.[key] || key
    return translation
  }

  return {
    t,
    currentLang,
    languages
  }
}
