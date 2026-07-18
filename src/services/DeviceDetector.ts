import type { DeviceInfo } from '~/types'
import { DeviceScore } from '~/domain/device/DeviceScore'
import { BrowserType } from '~/domain/device/BrowserType'
import { OperatingSystem } from '~/domain/device/OperatingSystem'

export async function detectDevice(): Promise<DeviceInfo> {
  const nav = navigator as any

  let hasWebGPU = false
  if ('gpu' in navigator) {
    try {
      // 2-second timeout to prevent requestAdapter from hanging on sandboxed/headless systems
      const adapter = await Promise.race([
        (navigator as any).gpu.requestAdapter(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ]).catch(() => null)

      if (adapter && adapter.features.has('shader-f16')) {
        const device = await adapter.requestDevice({
          requiredFeatures: ['shader-f16']
        })
        if (device) {
          hasWebGPU = true
          device.destroy()
        }
      }
    } catch (e) {
      hasWebGPU = false
    }
  }

  const cpuCores = navigator.hardwareConcurrency || 2
  let ramGB = nav.deviceMemory || 4
  if (typeof window !== 'undefined') {
    const match = window.location.href.match(/[?&]mockMemory=(\d+)/)
    if (match) {
      ramGB = parseInt(match[1], 10)
    }
  }

  // Check storage quota
  let storageAvailableGB = 0
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate()
      storageAvailableGB = (estimate.quota || 0) / (1024 * 1024 * 1024)
    } catch (e) {
      // Ignore
    }
  }

  // Wasm SIMD detection (basic heuristic)
  const hasWasmSIMD = WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]))

  const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined'
  
  let hasOPFS = false
  try {
    if (nav.storage && nav.storage.getDirectory) {
      hasOPFS = true
    }
  } catch (e) {}

  let scoreNumeric = 0
  if (hasWebGPU) scoreNumeric += 40
  scoreNumeric += Math.min(ramGB * 5, 30) // Up to 30 points for RAM
  scoreNumeric += Math.min(cpuCores * 2, 20) // Up to 20 points for CPU
  if (hasWasmSIMD) scoreNumeric += 10

  let score: DeviceInfo['score'] = DeviceScore.VeryPoor
  if (scoreNumeric >= 80) score = DeviceScore.Excellent
  else if (scoreNumeric >= 60) score = DeviceScore.Good
  else if (scoreNumeric >= 40) score = DeviceScore.Fair
  else if (scoreNumeric >= 20) score = DeviceScore.Poor

  // Browser info
  const ua = navigator.userAgent
  let browser: DeviceInfo['browser'] = BrowserType.Unknown
  if (ua.includes('Chrome')) browser = BrowserType.Chrome
  if (ua.includes('Firefox')) browser = BrowserType.Firefox
  if (ua.includes('Safari') && !ua.includes('Chrome')) browser = BrowserType.Safari
  if (ua.includes('Edg')) browser = BrowserType.Edge

  // OS info
  let os: DeviceInfo['os'] = OperatingSystem.Unknown
  if (ua.includes('Win')) os = OperatingSystem.Windows
  if (ua.includes('Mac')) os = OperatingSystem.MacOS
  if (ua.includes('Linux')) os = OperatingSystem.Linux
  if (ua.includes('Android')) os = OperatingSystem.Android
  if (ua.includes('like Mac')) os = OperatingSystem.IOS

  return {
    cpuCores,
    ramGB,
    hasWebGPU,
    hasWasmSIMD,
    hasThreads: typeof Worker !== 'undefined',
    hasSharedArrayBuffer,
    hasOPFS,
    hasIndexedDB: typeof indexedDB !== 'undefined',
    hasServiceWorker: 'serviceWorker' in navigator,
    hasPWA: matchMedia('(display-mode: standalone)').matches,
    storageAvailableGB,
    browser,
    os,
    language: navigator.language,
    score,
    numericScore: scoreNumeric
  }
}
