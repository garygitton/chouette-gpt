import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandMockups from '~/components/brand/BrandMockups.vue'

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    Image: { template: '<svg class="lucide-image"></svg>' },
    Download: { template: '<svg class="lucide-download"></svg>' },
  }
})

// Mock components
vi.mock('~/components/ui/card', () => ({
  Card: { template: '<div class="mock-card"><slot /></div>' }
}))

vi.mock('~/components/ui/button', () => ({
  Button: { template: '<button class="mock-button"><slot /></button>' }
}))

describe('BrandMockups.vue', () => {
  it('renders default desktop view and updates to mobile tab on click', async () => {
    const wrapper = mount(BrandMockups)
    
    // Verify default active tab is desktop
    expect(wrapper.text()).toContain('Interface Ordinateur')
    expect(wrapper.text()).toContain('Aperçu de ChouetteGPT affichant une conversation active')
    
    // Toggle tab to Mobile
    const buttons = wrapper.findAll('.tab-btn')
    const mobileBtn = buttons.find(b => b.text().includes('Mobile'))
    expect(mobileBtn).toBeDefined()
    
    await mobileBtn!.trigger('click')
    
    // Verify mobile layout displays
    expect(wrapper.text()).toContain('Interface Mobile')
    expect(wrapper.text()).toContain('Aperçu optimisé et responsive pour smartphone')
  })

  it('triggers download when download button is clicked', async () => {
    const clickMock = vi.fn()
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => ({} as any))
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => ({} as any))
    
    const fakeAnchor = {
      click: clickMock,
      href: '',
      download: ''
    }
    
    const originalCreateElement = document.createElement
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return fakeAnchor as any
      return originalCreateElement.call(document, tagName)
    })

    const wrapper = mount(BrandMockups)
    const downloadBtn = wrapper.find('.download-button')
    expect(downloadBtn.exists()).toBe(true)
    
    await downloadBtn.trigger('click')
    
    expect(appendChildSpy).toHaveBeenCalled()
    expect(clickMock).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalled()

    // Restore mocks
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
    createElementSpy.mockRestore()
  })
})
