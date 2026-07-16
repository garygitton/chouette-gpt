import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandFaq from '~/components/brand/BrandFaq.vue'

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    HelpCircle: { template: '<svg class="lucide-help-circle"></svg>' },
    ChevronDown: { template: '<svg class="lucide-chevron-down"></svg>' },
  }
})

describe('BrandFaq.vue', () => {
  it('renders French FAQ items by default and toggles answers on click', async () => {
    const wrapper = mount(BrandFaq, {
      props: {
        selectedLang: 'fr'
      }
    })

    expect(wrapper.text()).toContain('Questions Fréquentes')
    expect(wrapper.text()).toContain('Est-ce vraiment gratuit ?')
    expect(wrapper.text()).toContain('Où vont mes données et mes prompts ?')

    // Answer is hidden by default
    const answers = wrapper.findAll('.faq-answer')
    expect(answers.at(0)!.element.getAttribute('style')).toContain('display: none')

    // Click trigger to toggle
    const trigger = wrapper.find('.faq-trigger')
    await trigger.trigger('click')

    // Answer should be visible now
    expect(answers.at(0)!.element.getAttribute('style')).not.toContain('display: none')
  })

  it('renders English FAQ items when selectedLang is en', () => {
    const wrapper = mount(BrandFaq, {
      props: {
        selectedLang: 'en'
      }
    })

    expect(wrapper.text()).toContain('Frequently Asked Questions')
    expect(wrapper.text()).toContain('Is it really free?')
  })

  it('updates items when selectedLang changes', async () => {
    const wrapper = mount(BrandFaq, {
      props: {
        selectedLang: 'fr'
      }
    })

    expect(wrapper.text()).toContain('Questions Fréquentes')
    
    await wrapper.setProps({ selectedLang: 'en' })

    expect(wrapper.text()).toContain('Frequently Asked Questions')
  })
})
