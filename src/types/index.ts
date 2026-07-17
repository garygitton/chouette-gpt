import type { DeviceScore } from '~/domain/device/DeviceScore'
import type { BrowserType } from '~/domain/device/BrowserType'
import type { OperatingSystem } from '~/domain/device/OperatingSystem'
import type { MessageRole } from '~/domain/chat/MessageRole'
import type { ModelStatus } from '~/domain/model/ModelStatus'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  tokens?: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  modelId: string
}

export interface ModelInfo {
  id: string
  name: string
  version: string
  parameters: string
  downloadedSize?: string
  totalSize: string
  quantization: string
  estimatedMemory: string
  installedAt?: number
  lastUsedAt?: number
  usageCount: number
  status: ModelStatus
  downloadProgress?: number
  speed?: string
  quality?: string
  ramRequired: number // MB
  performanceScore?: number // 0-100 score for scatter plot
  description: string
  domains: string[]
  supportsSampling?: boolean
}

export interface DeviceInfo {
  cpuCores: number
  ramGB: number
  hasWebGPU: boolean
  hasWasmSIMD: boolean
  hasThreads: boolean
  hasSharedArrayBuffer: boolean
  hasOPFS: boolean
  hasIndexedDB: boolean
  hasServiceWorker: boolean
  hasPWA: boolean
  storageAvailableGB: number
  browser: BrowserType
  os: OperatingSystem
  language: string
  score: DeviceScore
  numericScore: number
}
