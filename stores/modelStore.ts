import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ModelInfo } from '~/types'
import { useDeviceStore } from './deviceStore'

export const useModelStore = defineStore('model', () => {
  const models = ref<ModelInfo[]>([
    {
      id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
      name: 'SmolLM2-360M-Instruct',
      version: '2',
      parameters: '360M',
      totalSize: '400 MB',
      quantization: 'q4f16_1',
      estimatedMemory: '600 MB',
      usageCount: 0,
      status: 'available',
      ramRequired: 1024,
      backend: 'mlc'
    },
    {
      id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
      name: 'Qwen2.5-0.5B-Instruct',
      version: '2.5',
      parameters: '0.5B',
      totalSize: '500 MB',
      quantization: 'q4f16_1',
      estimatedMemory: '800 MB',
      usageCount: 0,
      status: 'available',
      ramRequired: 2048,
      backend: 'mlc'
    },
    {
      id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
      name: 'Qwen2.5-1.5B-Instruct',
      version: '2.5',
      parameters: '1.5B',
      totalSize: '1.2 GB',
      quantization: 'q4f16_1',
      estimatedMemory: '2 GB',
      usageCount: 0,
      status: 'available',
      ramRequired: 4096,
      backend: 'mlc'
    },
    {
      id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC',
      name: 'Qwen2.5-3B-Instruct',
      version: '2.5',
      parameters: '3B',
      totalSize: '2.4 GB',
      quantization: 'q4f16_1',
      estimatedMemory: '3.5 GB',
      usageCount: 0,
      status: 'available',
      ramRequired: 8192,
      backend: 'mlc'
    },
    {
      id: 'gemma-2-2b-it-q4f16_1-MLC',
      name: 'Gemma-2-2b-it',
      version: '2',
      parameters: '2.6B',
      totalSize: '1.6 GB',
      quantization: 'q4f16_1',
      estimatedMemory: '2.5 GB',
      usageCount: 0,
      status: 'available',
      ramRequired: 4096,
      backend: 'mlc'
    },
    {
      id: 'Llama-3-8B-Instruct-q4f16_1-MLC',
      name: 'Llama-3-8B-Instruct',
      version: '3',
      parameters: '8B',
      totalSize: '4.6 GB',
      quantization: 'q4f16_1',
      estimatedMemory: '6.5 GB',
      usageCount: 0,
      status: 'available',
      ramRequired: 8192,
      backend: 'mlc'
    },
    {
      id: 'Phi-3-mini-4k-instruct-q4f16_1-MLC',
      name: 'Phi-3-mini-4k-instruct',
      version: '3',
      parameters: '3.8B',
      totalSize: '2.2 GB',
      quantization: 'q4f16_1',
      estimatedMemory: '3.5 GB',
      usageCount: 0,
      status: 'available',
      ramRequired: 4096,
      backend: 'mlc'
    },
    {
      id: 'Xenova/Qwen1.5-0.5B-Chat',
      name: 'Qwen1.5-0.5B-Chat (CPU)',
      version: '1.5',
      parameters: '0.5B',
      totalSize: '482 MB',
      quantization: 'q4',
      estimatedMemory: '600 MB',
      usageCount: 0,
      status: 'available',
      ramRequired: 2048,
      backend: 'transformers'
    },
    {
      id: 'Xenova/TinyLlama-1.1B-Chat-v1.0',
      name: 'TinyLlama-1.1B-Chat (CPU)',
      version: '1.0',
      parameters: '1.1B',
      totalSize: '650 MB',
      quantization: 'q4',
      estimatedMemory: '1 GB',
      usageCount: 0,
      status: 'available',
      ramRequired: 2048,
      backend: 'transformers'
    },
    {
      id: 'onnx-community/Llama-3.2-1B-Instruct',
      name: 'Llama-3.2-1B-Instruct (CPU)',
      version: '3.2',
      parameters: '1B',
      totalSize: '800 MB',
      quantization: 'q4',
      estimatedMemory: '1.5 GB',
      usageCount: 0,
      status: 'available',
      ramRequired: 3072,
      backend: 'transformers'
    }
  ])

  const deviceStore = useDeviceStore()
  const currentModelId = ref<string>('Qwen2.5-0.5B-Instruct-q4f16_1-MLC')
  const isDownloading = ref(false)
  const hasWebGPU = computed(() => deviceStore.deviceInfo?.hasWebGPU ?? false)
  const deviceMemory = computed(() => deviceStore.deviceInfo ? deviceStore.deviceInfo.ramGB * 1024 : null)

  const currentModel = computed(() => {
    return models.value.find(m => m.id === currentModelId.value)
  })
  const currentModelName = computed(() => {
    return currentModel.value ? currentModel.value.name : 'Unknown'
  })

  const compatibleModels = computed(() => {
    return models.value.filter(model => {
      // If model requires WebGPU (mlc backend) but browser doesn't have WebGPU, it's incompatible
      if (model.backend === 'mlc' && !hasWebGPU.value) {
        return false
      }
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
    const hasGPU = hasWebGPU.value

    if (!hasGPU) {
      // Fallback to the smallest CPU model if no GPU
      currentModelId.value = 'Xenova/Qwen1.5-0.5B-Chat';
      return;
    }

    // Find the largest MLC model that fits in RAM
    let bestModel = models.value[0];
    for (const model of models.value) {
      if (model.backend === 'mlc' && ram >= model.ramRequired) {
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
    hasWebGPU,
    deviceMemory,
    compatibleModels,
    updateModelStatus,
    detectBestModel
  }
})
