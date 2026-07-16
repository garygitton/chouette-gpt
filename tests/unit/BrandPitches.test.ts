import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandPitches from '~/components/brand/BrandPitches.vue'

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    Terminal: { template: '<svg class="lucide-terminal"></svg>' },
    Briefcase: { template: '<svg class="lucide-briefcase"></svg>' },
    Copy: { template: '<svg class="lucide-copy"></svg>' },
    Check: { template: '<svg class="lucide-check"></svg>' },
  }
})

// Mock components
vi.mock('~/components/ui/card', () => ({
  Card: { template: '<div class="mock-card"><slot /></div>' }
}))

describe('BrandPitches.vue', () => {
  it('renders French text by default', () => {
    const wrapper = mount(BrandPitches, {
      props: {
        selectedLang: 'fr'
      }
    })
    
    expect(wrapper.text()).toContain('Descriptions & Pitches')
    expect(wrapper.text()).toContain('Assistant IA 100% local, confidentiel et open-source.')
  })

  it('renders English text when selectedLang is en', () => {
    const wrapper = mount(BrandPitches, {
      props: {
        selectedLang: 'en'
      }
    })
    
    expect(wrapper.text()).toContain('Descriptions & Pitches')
    expect(wrapper.text()).toContain('100% local, private, and open-source AI assistant.')
  })

  it('updates when selectedLang prop changes', async () => {
    const wrapper = mount(BrandPitches, {
      props: {
        selectedLang: 'fr'
      }
    })
    
    expect(wrapper.text()).toContain('Assistant IA 100% local, confidentiel et open-source.')
    
    await wrapper.setProps({ selectedLang: 'en' })
    
    expect(wrapper.text()).toContain('100% local, private, and open-source AI assistant.')
  })
})
