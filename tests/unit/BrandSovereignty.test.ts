import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandSovereignty from '~/components/brand/BrandSovereignty.vue'

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    ShieldAlert: { template: '<svg class="lucide-shield-alert"></svg>' },
    Shield: { template: '<svg class="lucide-shield"></svg>' },
    Terminal: { template: '<svg class="lucide-terminal"></svg>' },
    User: { template: '<svg class="lucide-user"></svg>' },
    Calendar: { template: '<svg class="lucide-calendar"></svg>' },
    Globe: { template: '<svg class="lucide-globe"></svg>' },
  }
})

// Mock components
vi.mock('~/components/ui/card', () => ({
  Card: { template: '<div class="mock-card"><slot /></div>' }
}))

describe('BrandSovereignty.vue', () => {
  it('renders French text by default', () => {
    const wrapper = mount(BrandSovereignty, {
      props: {
        selectedLang: 'fr'
      }
    })

    expect(wrapper.text()).toContain('Souveraineté & Conformité de fait')
    expect(wrapper.text()).toContain('Fiche Technique')
    expect(wrapper.text()).toContain('Gary Gitton')
    expect(wrapper.text()).toContain('Modèles Spécialisés par Métier')
  })

  it('renders English text when selectedLang is en', () => {
    const wrapper = mount(BrandSovereignty, {
      props: {
        selectedLang: 'en'
      }
    })

    expect(wrapper.text()).toContain('Souveraineté & Conformité de fait')
    expect(wrapper.text()).toContain('Domain-Specific Models')
  })

  it('updates when selectedLang prop changes', async () => {
    const wrapper = mount(BrandSovereignty, {
      props: {
        selectedLang: 'fr'
      }
    })

    expect(wrapper.text()).toContain('Modèles Spécialisés par Métier')
    
    await wrapper.setProps({ selectedLang: 'en' })

    expect(wrapper.text()).toContain('Domain-Specific Models')
  })
})
