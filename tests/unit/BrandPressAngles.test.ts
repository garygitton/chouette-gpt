import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandPressAngles from '~/components/brand/BrandPressAngles.vue'

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    Newspaper: { template: '<svg class="lucide-newspaper"></svg>' },
    Copy: { template: '<svg class="lucide-copy"></svg>' },
    Check: { template: '<svg class="lucide-check"></svg>' },
  }
})

// Mock components
vi.mock('~/components/ui/card', () => ({
  Card: { template: '<div class="mock-card"><slot /></div>' }
}))

vi.mock('~/components/ui/button', () => ({
  Button: { template: '<button class="mock-button"><slot /></button>' }
}))

describe('BrandPressAngles.vue', () => {
  it('renders French text by default', () => {
    const wrapper = mount(BrandPressAngles, {
      props: {
        selectedLang: 'fr'
      }
    })
    
    expect(wrapper.text()).toContain('Cadrages Thématiques & Analyses')
    expect(wrapper.text()).toContain('Souveraineté numérique et inférence décentralisée')
  })

  it('renders English text when selectedLang is en', () => {
    const wrapper = mount(BrandPressAngles, {
      props: {
        selectedLang: 'en'
      }
    })
    
    expect(wrapper.text()).toContain('Thematic Frameworks & Analysis')
    expect(wrapper.text()).toContain('Digital Sovereignty & Decentralized Inference')
  })

  it('updates when selectedLang prop changes', async () => {
    const wrapper = mount(BrandPressAngles, {
      props: {
        selectedLang: 'fr'
      }
    })
    
    expect(wrapper.text()).toContain('Cadrages Thématiques & Analyses')
    
    await wrapper.setProps({ selectedLang: 'en' })
    
    expect(wrapper.text()).toContain('Thematic Frameworks & Analysis')
  })

  it('calls clipboard copy when copy button is clicked', async () => {
    // Mock navigator.clipboard
    const writeTextMock = vi.fn().mockImplementation(() => Promise.resolve())
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    })

    const wrapper = mount(BrandPressAngles, {
      props: {
        selectedLang: 'fr'
      }
    })

    const copyBtn = wrapper.find('.copy-button')
    expect(copyBtn.exists()).toBe(true)
    
    await copyBtn.trigger('click')
    expect(writeTextMock).toHaveBeenCalled()
  })
})
