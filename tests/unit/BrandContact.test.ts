import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandContact from '~/components/brand/BrandContact.vue'

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    Github: { template: '<svg class="lucide-github"></svg>' },
    Linkedin: { template: '<svg class="lucide-linkedin"></svg>' },
  }
})

// Mock components
vi.mock('~/components/ui/card', () => ({
  Card: { template: '<div class="mock-card"><slot /></div>' }
}))

describe('BrandContact.vue', () => {
  it('renders French contact details by default', () => {
    const wrapper = mount(BrandContact, {
      props: {
        selectedLang: 'fr'
      }
    })

    expect(wrapper.text()).toContain('Contact & Contribution')
    expect(wrapper.text()).toContain('ChouetteGPT est un projet open-source initié par Gary Gitton')
    
    // Check links exist
    const linkedinLink = wrapper.find('a[href="https://www.linkedin.com/in/garygitton"]')
    expect(linkedinLink.exists()).toBe(true)

    const ghLink = wrapper.find('a[href="https://github.com/garygitton/chouette-gpt"]')
    expect(ghLink.exists()).toBe(true)
  })

  it('renders English contact details when selectedLang is en', () => {
    const wrapper = mount(BrandContact, {
      props: {
        selectedLang: 'en'
      }
    })

    expect(wrapper.text()).toContain('Contact & Contribution')
    expect(wrapper.text()).toContain('ChouetteGPT is an open-source project initiated by Gary Gitton')
  })

  it('updates when selectedLang changes', async () => {
    const wrapper = mount(BrandContact, {
      props: {
        selectedLang: 'fr'
      }
    })

    expect(wrapper.text()).toContain('ChouetteGPT est un projet open-source initié par Gary Gitton')
    
    await wrapper.setProps({ selectedLang: 'en' })

    expect(wrapper.text()).toContain('ChouetteGPT is an open-source project initiated by Gary Gitton')
  })
})

