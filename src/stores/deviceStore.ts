import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DeviceInfo } from '~/types'
import { detectDevice } from '~/services/DeviceDetector'

export const useDeviceStore = defineStore('device', () => {
  const deviceInfo = ref<DeviceInfo | null>(null)
  const isEvaluating = ref(false)

  async function evaluateDevice() {
    isEvaluating.value = true
    try {
      deviceInfo.value = await detectDevice()
    } catch (e) {
      console.error('Failed to evaluate device', e)
    } finally {
      isEvaluating.value = false
    }
  }

  return {
    deviceInfo,
    isEvaluating,
    evaluateDevice
  }
})
