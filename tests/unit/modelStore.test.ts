import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useModelStore } from '~/stores/modelStore'
import { useDeviceStore } from '~/stores/deviceStore'
import { useRoute } from '#imports'

vi.mock('#imports', () => ({
  useRoute: vi.fn(() => ({ query: {} }))
}))

describe('modelStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    const deviceStore = useDeviceStore()
    deviceStore.deviceInfo = { hasWebGPU: true, ramGB: 8 } as any
  })

  it('should initialize with general domain and fallback to the best model for 8GB RAM', () => {
    const store = useModelStore()
    expect(store.currentDomain).toBe('general')
    expect(store.currentModelId).toBe('onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX')
  })

  it('should compute compatible models based on device RAM', () => {
    const store = useModelStore()
    const deviceStore = useDeviceStore()
    
    deviceStore.deviceInfo = { hasWebGPU: true, ramGB: 3 } as any
    
    // Default mode displays the best model per domain
    const models = store.compatibleModels
    // Any model requiring > 3072MB should NOT be in here. (e.g. ramRequired=4096 is out)
    const hasHeavyModel = models.some(m => m.ramRequired > 3072)
    expect(hasHeavyModel).toBe(false)
  })



})
