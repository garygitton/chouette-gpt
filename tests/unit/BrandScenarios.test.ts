import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandScenarios from '~/components/brand/BrandScenarios.vue'

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    ShieldCheck: { template: '<svg class="lucide-shield-check"></svg>' },
    WifiOff: { template: '<svg class="lucide-wifi-off"></svg>' },
    Activity: { template: '<svg class="lucide-activity"></svg>' },
  }
})

// Mock components
vi.mock('~/components/ui/card', () => ({
  Card: { template: '<div class="mock-card"><slot /></div>' }
}))

describe('BrandScenarios.vue', () => {
  it('renders French text by default', () => {
    const wrapper = mount(BrandScenarios, {
      props: {
        selectedLang: 'fr'
      }
    })
    
    expect(wrapper.text()).toContain("Cas pratiques & Scénarios d'usage")
    expect(wrapper.text()).toContain("Secret Professionnel")
    expect(wrapper.text()).toContain("Données de Santé & Diagnostic")
  })

  it('renders English text when selectedLang is en', () => {
    const wrapper = mount(BrandScenarios, {
      props: {
        selectedLang: 'en'
      }
    })
    
    expect(wrapper.text()).toContain("Real-World Scenarios & Use Cases")
    expect(wrapper.text()).toContain("Professional Secrecy")
    expect(wrapper.text()).toContain("Medical Data & Diagnostics")
  })

  it('updates when selectedLang prop changes', async () => {
    const wrapper = mount(BrandScenarios, {
      props: {
        selectedLang: 'fr'
      }
    })
    
    expect(wrapper.text()).toContain("Cas pratiques & Scénarios d'usage")
    
    await wrapper.setProps({ selectedLang: 'en' })
    
    expect(wrapper.text()).toContain("Real-World Scenarios & Use Cases")
  })
})
