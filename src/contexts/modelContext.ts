import { ref, computed, inject, reactive, type InjectionKey } from 'vue'
import type { ModelInfo } from '~/types'
import { ModelStatus } from '~/domain/model/ModelStatus'
import type { DeviceContext } from './deviceContext'

export function useProvideModel(deviceContext: DeviceContext) {
  const models = ref<ModelInfo[]>([
    {
      id: 'Xenova/Qwen1.5-0.5B-Chat',
      name: 'Qwen1.5-0.5B-Chat',
      version: '1.5',
      parameters: '0.5B',
      totalSize: '482 MB',
      quantization: 'q4',
      estimatedMemory: '600 MB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 2048
    },
    {
      id: 'Xenova/TinyLlama-1.1B-Chat-v1.0',
      name: 'TinyLlama-1.1B-Chat',
      version: '1.0',
      parameters: '1.1B',
      totalSize: '650 MB',
      quantization: 'q4',
      estimatedMemory: '1 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 2048
    },
    {
      id: 'onnx-community/Llama-3.2-1B-Instruct',
      name: 'Llama-3.2-1B-Instruct',
      version: '3.2',
      parameters: '1B',
      totalSize: '800 MB',
      quantization: 'q4',
      estimatedMemory: '1.5 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 3072
    },
    {
      id: 'HuggingFaceTB/SmolLM-135M-Instruct',
      name: 'SmolLM-135M-Instruct',
      version: '1.0',
      parameters: '135M',
      totalSize: '150 MB',
      quantization: 'q4',
      estimatedMemory: '250 MB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 1024
    },
    {
      id: 'Xenova/Phi-3-mini-4k-instruct',
      name: 'Phi-3-mini-4k-instruct',
      version: '3.0',
      parameters: '3.8B',
      totalSize: '2.2 GB',
      quantization: 'q4',
      estimatedMemory: '3 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 4096
    }
  ])


  const currentModelId = ref<string>('Xenova/Qwen1.5-0.5B-Chat')
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
