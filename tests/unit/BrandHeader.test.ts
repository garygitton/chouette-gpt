import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandHeader from '~/components/brand/BrandHeader.vue'

// Mock router
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

// Mock icons
vi.mock('lucide-vue-next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-vue-next')>()
  return {
    ...actual,
    Briefcase: { template: '<svg class="lucide-briefcase"></svg>' },
    ArrowLeft: { template: '<svg class="lucide-arrow-left"></svg>' },
  }
})

// Mock components
vi.mock('~/components/ui/button', () => ({
  Button: { template: '<button class="mock-button" @click="$emit(\'click\')"><slot /></button>' }
}))

describe('BrandHeader.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(BrandHeader, {
      props: {
        selectedLang: 'fr'
      },
      global: {
        mocks: {
          $router: {
            push: pushMock
          }
        }
      }
    })
    
    expect(wrapper.text()).toContain('Brand Assets & ressources')
    expect(wrapper.text()).toContain("Tout le nécessaire pour parler de ChouetteGPT")
  })

  it('triggers router push when back button is clicked', async () => {
    const wrapper = mount(BrandHeader, {
      props: {
        selectedLang: 'fr'
      },
      global: {
        mocks: {
          $router: {
            push: pushMock
          }
        }
      }
    })

    const button = wrapper.find('.back-button')
    expect(button.exists()).toBe(true)
    await button.trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/')
  })
})
