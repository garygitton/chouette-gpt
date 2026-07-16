import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandComparisonTable from '~/components/brand/BrandComparisonTable.vue'

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    Scale: { template: '<svg class="lucide-scale"></svg>' },
    CheckCircle2: { template: '<svg class="lucide-check-circle"></svg>' },
    AlertCircle: { template: '<svg class="lucide-alert-circle"></svg>' },
    XCircle: { template: '<svg class="lucide-x-circle"></svg>' },
  }
})

// Mock components
vi.mock('~/components/ui/card', () => ({
  Card: { template: '<div class="mock-card"><slot /></div>' }
}))

describe('BrandComparisonTable.vue', () => {
  it('renders French headers and content by default', () => {
    const wrapper = mount(BrandComparisonTable, {
      props: {
        selectedLang: 'fr'
      }
    })

    expect(wrapper.text()).toContain('Tableau Comparatif des Paradigmes IA')
    expect(wrapper.text()).toContain("Barrière à l'entrée (Friction)")
    expect(wrapper.text()).toContain('Ollama, LM Studio')
  })

  it('renders English headers and content when selectedLang is en', () => {
    const wrapper = mount(BrandComparisonTable, {
      props: {
        selectedLang: 'en'
      }
    })

    expect(wrapper.text()).toContain('AI Paradigms Comparison Table')
    expect(wrapper.text()).toContain("Barrier to entry (Friction)")
    expect(wrapper.text()).toContain('Ollama, LM Studio')
  })

  it('updates when selectedLang changes', async () => {
    const wrapper = mount(BrandComparisonTable, {
      props: {
        selectedLang: 'fr'
      }
    })

    expect(wrapper.text()).toContain('Tableau Comparatif des Paradigmes IA')
    
    await wrapper.setProps({ selectedLang: 'en' })

    expect(wrapper.text()).toContain('AI Paradigms Comparison Table')
  })
})
