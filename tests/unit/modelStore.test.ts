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

  it('should initialize with small domain and default to small model', async () => {
    const store = useModelStore()
    await store.detectBestModel()
    expect(store.currentDomain).toBe('small')
    expect(store.currentModelId).toBe('onnx-community/Qwen2.5-0.5B-Instruct')
  })

  it('should compute compatible models based on device RAM', () => {
    const store = useModelStore()
    const deviceStore = useDeviceStore()
    
    deviceStore.deviceInfo = { hasWebGPU: true, ramGB: 3 } as any
    
    // Default mode displays the best model per domain
    const models = store.compatibleModels
    // Any model requiring > 3072MB should NOT be in here.
    const hasHeavyModel = models.some(m => m.ramRequired > 3072)
    expect(hasHeavyModel).toBe(false)
  })

  it('should only contain models that are <= 1 GB', () => {
    const store = useModelStore()
    expect(store.models.length).toBeGreaterThan(0)
    for (const model of store.models) {
      expect(model.ramRequired).toBeLessThanOrEqual(1024)
      const sizeMB = model.totalSize.includes('GB') 
        ? parseFloat(model.totalSize) * 1024 
        : parseFloat(model.totalSize)
      expect(sizeMB).toBeLessThanOrEqual(1024)
    }
  })

  it('should filter compatibleDomains to only display domains with explicit models available', () => {
    const store = useModelStore()
    const domainIds = store.compatibleDomains.map(d => d.id)
    
    // Available domains for current <=1GB models (small, general, code)
    expect(domainIds).toContain('small')
    expect(domainIds).toContain('general')
    expect(domainIds).toContain('code')
    
    // Domains without an explicit <=1GB model (e.g. maths, medicine, legal) should not be displayed
    expect(domainIds).not.toContain('maths')
    expect(domainIds).not.toContain('medicine')
    expect(domainIds).not.toContain('legal')
  })

  it('should ensure each model ID appears uniquely in the catalog', () => {
    const store = useModelStore()
    const modelIds = store.models.map(m => m.id)
    const uniqueIds = new Set(modelIds)
    expect(uniqueIds.size).toBe(modelIds.length)
  })
})
