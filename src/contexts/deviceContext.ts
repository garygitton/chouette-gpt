import { ref, inject, reactive, type InjectionKey } from 'vue'
import type { DeviceInfo } from '~/types'
import { detectDevice } from '~/services/DeviceDetector'

export function useProvideDevice() {
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

  return reactive({
    deviceInfo,
    isEvaluating,
    evaluateDevice
  })
}

export type DeviceContext = ReturnType<typeof useProvideDevice>
export const deviceKey: InjectionKey<DeviceContext> = Symbol('device')

export function useDevice() {
  const context = inject(deviceKey)
  if (!context) {
    throw new Error('useDevice must be used within a provider')
  }
  return context
}
