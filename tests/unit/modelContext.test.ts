import { describe, it, expect } from 'vitest'
import { ref, reactive } from 'vue'
import { useProvideModel } from '../../src/contexts/modelContext'

describe('ModelContext Capability Filtering', () => {
  it('should include q4f16 models when WebGPU is supported', () => {
    const mockDeviceContext = reactive({
      deviceInfo: {
        ramGB: 16,
        hasWebGPU: true,
        cpuCores: 8,
        hasWasmSIMD: true,
        hasThreads: true,
        hasSharedArrayBuffer: true,
        hasOPFS: true,
        storageAvailableGB: 100,
        os: 'Linux',
        browser: 'Chrome',
        score: 'Excellent',
        numericScore: 90
      },
      isEvaluating: false,
      evaluateDevice: async () => {}
    })

    const modelContext = useProvideModel(mockDeviceContext as any)

    // With WebGPU = true, MedGemma should be compatible and selected for medicine
    const hasMedGemma = modelContext.compatibleModels.some(m => m.id === 'vmanvs/medgemma-q4f16-chunked')
    expect(hasMedGemma).toBe(true)

    const bestModel = modelContext.compatibleDomains.find(d => d.id === 'medicine')?.resolvedModel
    expect(bestModel?.id).toBe('vmanvs/medgemma-q4f16-chunked')
  })

  it('should exclude q4f16 models when WebGPU is not supported', () => {
    const mockDeviceContext = reactive({
      deviceInfo: {
        ramGB: 16,
        hasWebGPU: false,
        cpuCores: 8,
        hasWasmSIMD: true,
        hasThreads: true,
        hasSharedArrayBuffer: true,
        hasOPFS: true,
        storageAvailableGB: 100,
        os: 'Linux',
        browser: 'Chrome',
        score: 'Good',
        numericScore: 50
      },
      isEvaluating: false,
      evaluateDevice: async () => {}
    })

    const modelContext = useProvideModel(mockDeviceContext as any)

    // With WebGPU = false, MedGemma (q4f16) should be filtered out
    const hasMedGemma = modelContext.compatibleModels.some(m => m.id === 'vmanvs/medgemma-q4f16-chunked')
    expect(hasMedGemma).toBe(false)

    // Fallback for medicine domain should not be MedGemma, but a compatible general model (e.g. Qwen or Llama)
    const bestModel = modelContext.compatibleDomains.find(d => d.id === 'medicine')?.resolvedModel
    expect(bestModel?.id).not.toBe('vmanvs/medgemma-q4f16-chunked')
    expect(bestModel?.quantization).not.toBe('q4f16')
  })
})
