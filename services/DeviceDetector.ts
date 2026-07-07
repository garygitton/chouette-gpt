import type { DeviceInfo } from '~/types'

export async function detectDevice(): Promise<DeviceInfo> {
  const nav = navigator as any

  let hasWebGPU = false
  if ('gpu' in navigator) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter()
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
  const ramGB = nav.deviceMemory || 4

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

  let score: DeviceInfo['score'] = 'Très faible'
  if (scoreNumeric >= 80) score = 'Excellent'
  else if (scoreNumeric >= 60) score = 'Bon'
  else if (scoreNumeric >= 40) score = 'Moyen'
  else if (scoreNumeric >= 20) score = 'Faible'

  // Browser info
  const ua = navigator.userAgent
  let browser = 'Unknown'
  if (ua.includes('Chrome')) browser = 'Chrome'
  if (ua.includes('Firefox')) browser = 'Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  if (ua.includes('Edg')) browser = 'Edge'

  // OS info
  let os = 'Unknown'
  if (ua.includes('Win')) os = 'Windows'
  if (ua.includes('Mac')) os = 'macOS'
  if (ua.includes('Linux')) os = 'Linux'
  if (ua.includes('Android')) os = 'Android'
  if (ua.includes('like Mac')) os = 'iOS'

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
