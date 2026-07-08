export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
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
  status: 'available' | 'installed' | 'downloading' | 'error'
  downloadProgress?: number
  speed?: string
  quality?: string
  ramRequired: number // MB
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
  browser: string
  os: string
  language: string
  score: 'Très faible' | 'Faible' | 'Moyen' | 'Bon' | 'Excellent'
  numericScore: number
}
