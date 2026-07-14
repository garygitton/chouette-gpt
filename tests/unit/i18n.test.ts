import { describe, it, expect } from 'vitest'
import { translations, languages } from '../../src/composables/useI18n'

describe('I18n Translations', () => {
  it('should have a translation dictionary for all defined languages', () => {
    for (const lang of languages) {
      expect(translations[lang.code]).toBeDefined()
    }
  })

  it('should have matching keys in all languages compared to english', () => {
    const englishKeys = Object.keys(translations['en']).sort()
    
    for (const lang of languages) {
      if (lang.code === 'en') continue
      
      const langKeys = Object.keys(translations[lang.code]).sort()
      
      // Find missing keys
      const missingKeys = englishKeys.filter(k => !langKeys.includes(k))
      const extraKeys = langKeys.filter(k => !englishKeys.includes(k))
      
      expect(missingKeys, `Language ${lang.code} is missing keys`).toEqual([])
      expect(extraKeys, `Language ${lang.code} has extra unused keys`).toEqual([])
      expect(langKeys).toEqual(englishKeys)
    }
  })
})
