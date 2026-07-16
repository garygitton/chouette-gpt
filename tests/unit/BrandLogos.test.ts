import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandLogos from '~/components/brand/BrandLogos.vue'

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    Palette: { template: '<svg class="lucide-palette"></svg>' },
    Sparkles: { template: '<svg class="lucide-sparkles"></svg>' },
    Sun: { template: '<svg class="lucide-sun"></svg>' },
    Moon: { template: '<svg class="lucide-moon"></svg>' },
    Copy: { template: '<svg class="lucide-copy"></svg>' },
    Check: { template: '<svg class="lucide-check"></svg>' },
    Download: { template: '<svg class="lucide-download"></svg>' },
  }
})

// Mock components
vi.mock('~/components/ui/card', () => ({
  Card: { template: '<div class="mock-card"><slot /></div>' }
}))

vi.mock('~/components/ui/button', () => ({
  Button: { template: '<button class="mock-button" @click="$emit(\'click\')"><slot /></button>' }
}))

describe('BrandLogos.vue', () => {
  it('renders logos correctly and handles background mode changes', async () => {
    const wrapper = mount(BrandLogos, {
      props: {
        selectedLang: 'fr'
      }
    })

    expect(wrapper.text()).toContain('Logos ChouetteGPT')
    expect(wrapper.text()).toContain('Logo Principal (Original)')
    expect(wrapper.text()).toContain('Favicon & Badge Icon')

    // Find dynamic preview boxes
    const boxes = wrapper.findAll('.logo-preview-box')
    expect(boxes.length).toBe(2)

    // Change background toggle mode to Clair
    const btns = wrapper.findAll('.toggle-btn')
    const lightBtn = btns.find(b => b.text().includes('Clair'))
    expect(lightBtn).toBeDefined()
    
    await lightBtn!.trigger('click')

    // Verify background classes update
    expect(wrapper.find('.logo-preview-box').classes()).toContain('bg-white')
  })

  it('triggers copy SVG code when action button clicked', async () => {
    const writeTextMock = vi.fn().mockImplementation(() => Promise.resolve())
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    })

    const wrapper = mount(BrandLogos, {
      props: {
        selectedLang: 'fr'
      }
    })

    const copyBtn = wrapper.findAll('.action-btn').find(b => b.text().includes('Code'))
    expect(copyBtn).toBeDefined()
    await copyBtn!.trigger('click')
    expect(writeTextMock).toHaveBeenCalled()
  })
})
