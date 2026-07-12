import { ref, computed, inject, reactive, type InjectionKey } from 'vue'
import type { ModelInfo } from '~/types'
import { ModelStatus } from '~/domain/model/ModelStatus'
import type { DeviceContext } from './deviceContext'

export function useProvideModel(deviceContext: DeviceContext) {
  const models = ref<ModelInfo[]>([
    {
      id: 'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA',
      name: 'SmolLM2-135M-Instruct',
      version: '2.0',
      parameters: '135M',
      totalSize: '150 MB',
      quantization: 'q4',
      estimatedMemory: '250 MB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 1024,
      performanceScore: 30
    },
    {
      id: 'onnx-community/Qwen2.5-0.5B-Instruct',
      name: 'Qwen2.5-0.5B-Instruct',
      
      version: '2.5',
      parameters: '0.5B',
      totalSize: '350 MB',
      quantization: 'q4',
      estimatedMemory: '600 MB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 2048,
      performanceScore: 45
    },
    {
      id: 'onnx-community/Llama-3.2-1B-Instruct-ONNX',
      name: 'Llama-3.2-1B-Instruct',
      version: '3.2',
      parameters: '1B',
      totalSize: '1.7 GB',
      quantization: 'q4',
      estimatedMemory: '1.5 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 3072,
      performanceScore: 55
    },
    {
      id: 'onnx-community/Qwen2.5-1.5B-Instruct',
      name: 'Qwen2.5-1.5B-Instruct',
      version: '2.5',
      parameters: '1.5B',
      totalSize: '1.8 GB',
      quantization: 'q4',
      estimatedMemory: '2 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 4096,
      performanceScore: 60
    },
    {
      id: 'onnx-community/Llama-3.2-3B-Instruct-ONNX',
      name: 'Llama-3.2-3B-Instruct',
      version: '3.2',
      parameters: '3B',
      totalSize: '3.2 GB',
      quantization: 'q4',
      estimatedMemory: '3 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 8192,
      performanceScore: 70
    },
    {
      id: 'onnx-community/Phi-3.5-mini-instruct-onnx-web',
      name: 'Phi-3.5-mini-instruct',
      version: '3.5',
      parameters: '3.8B',
      totalSize: '2.2 GB',
      quantization: 'q4',
      estimatedMemory: '4 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 8192,
      performanceScore: 75
    }
  ])


  const currentModelId = ref<string>('onnx-community/SmolLM2-135M-Instruct-ONNX-MHA')
  const isDownloading = ref(false)
  const deviceMemory = computed(() => deviceContext.deviceInfo ? deviceContext.deviceInfo.ramGB * 1024 : null)

  const currentModel = computed(() => {
    return models.value.find(m => m.id === currentModelId.value)
  })
  const currentModelName = computed(() => {
    return currentModel.value ? currentModel.value.name : 'Unknown'
  })

  const compatibleModels = computed(() => {
    return models.value.filter(model => {
      if (deviceMemory.value && deviceMemory.value < model.ramRequired) {
        return false
      }
      return true
    })
  })

  async function detectBestModel() {
    if (typeof window === 'undefined') return;

    if (!deviceContext.deviceInfo) {
      await deviceContext.evaluateDevice()
    }

    const ram = deviceMemory.value || 2048

    let bestModel = models.value[0];
    let minRam = Infinity;
    for (const model of models.value) {
      if (ram >= model.ramRequired && model.ramRequired < minRam) {
        bestModel = model;
        minRam = model.ramRequired;
      }
    }
    
    currentModelId.value = bestModel.id;
  }

  function updateModelStatus(id: string, updates: Partial<ModelInfo>) {
    const model = models.value.find(m => m.id === id)
    if (model) {
      Object.assign(model, updates)
    }
  }

  return reactive({
    models,
    currentModelId,
    currentModel,
    currentModelName,
    isDownloading,
    deviceMemory,
    compatibleModels,
    updateModelStatus,
    detectBestModel
  })
}

export type ModelContext = ReturnType<typeof useProvideModel>
export const modelKey: InjectionKey<ModelContext> = Symbol('model')

export function useModel() {
  const context = inject(modelKey)
  if (!context) throw new Error('useModel must be used within a provider')
  return context
}
