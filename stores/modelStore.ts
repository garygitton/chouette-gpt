import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ModelInfo } from '~/types'
import { useDeviceStore } from './deviceStore'

export const useModelStore = defineStore('model', () => {
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
      status: 'available',
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
      status: 'available',
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
      status: 'available',
      ramRequired: 3072
    }
  ])

  const deviceStore = useDeviceStore()
  const currentModelId = ref<string>('Xenova/Qwen1.5-0.5B-Chat')
  const isDownloading = ref(false)
  const deviceMemory = computed(() => deviceStore.deviceInfo ? deviceStore.deviceInfo.ramGB * 1024 : null)

  const currentModel = computed(() => {
    return models.value.find(m => m.id === currentModelId.value)
  })
  const currentModelName = computed(() => {
    return currentModel.value ? currentModel.value.name : 'Unknown'
  })

  const compatibleModels = computed(() => {
    return models.value.filter(model => {
      // If device memory is known and model requires more RAM than available
      if (deviceMemory.value && deviceMemory.value < model.ramRequired) {
        return false
      }
      return true
    })
  })

  async function detectBestModel() {
    if (typeof window === 'undefined') return;

    if (!deviceStore.deviceInfo) {
      await deviceStore.evaluateDevice()
    }

    const ram = deviceMemory.value || 2048

    // Find the largest CPU model that fits in RAM
    let bestModel = models.value[0];
    for (const model of models.value) {
      if (ram >= model.ramRequired) {
        bestModel = model;
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

  return {
    models,
    currentModelId,
    currentModel,
    currentModelName,
    isDownloading,
    deviceMemory,
    compatibleModels,
    updateModelStatus,
    detectBestModel
  }
})
