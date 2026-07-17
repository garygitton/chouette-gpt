import { ref, inject, reactive, type InjectionKey } from 'vue'
import type { DeviceInfo } from '~/types'
import { detectDevice } from '~/services/DeviceDetector'

export function useProvideDevice() {
  const deviceInfo = ref<DeviceInfo | null>(null)
  const isEvaluating = ref(false)

  async function evaluateDevice() {
    isEvaluating.value = true
    try {
      // NOTE: During detectDevice() call on some platforms (like Linux Chrome with incomplete Vulkan support),
      // Dawn/Chromium internally prints "Failed to create WebGPU Context Provider" directly to the console.
      // This is a browser-internal log from the GPU capability query. It is caught here, and we safely
      // fall back to WASM/CPU without interrupting execution.
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
