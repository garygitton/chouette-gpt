import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore } from '~/stores/chatStore'
import { useModelStore } from '~/stores/modelStore'
import { useConversationStore } from '~/stores/conversationStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useDeviceStore } from '~/stores/deviceStore'
import { MessageRole } from '~/domain/chat/MessageRole'

import { isModelCached } from '~/utils/chatUtils'

// Mock the chatUtils
vi.mock('~/utils/chatUtils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/utils/chatUtils')>()
  return {
    ...actual,
    isModelCached: vi.fn(),
  }
})

// Mock Comlink entirely so tests bypass the worker RPC logic
vi.mock('comlink', () => {
  return {
    wrap: vi.fn(() => ({
      init: vi.fn().mockResolvedValue({ device: 'webgpu' }),
      generate: vi.fn(),
      interrupt: vi.fn()
    })),
    proxy: vi.fn((fn) => fn),
    expose: vi.fn()
  }
})

// Mock Worker globally
class MockWorker {
  terminate() {}
}
global.Worker = MockWorker as any;

describe('chatStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.mocked(isModelCached).mockResolvedValue(true)

    const modelStore = useModelStore()
    modelStore.models = [{ id: 'model-1', name: 'Model 1', status: 'available', domains: ['general'] }] as any
    modelStore.currentModelId = 'model-1'

    const convStore = useConversationStore()
    convStore.currentConversationId = 'conv-1'
    convStore.conversations = [
      {
        id: 'conv-1',
        title: 'Conv 1',
        messages: [
          { id: 'm1', role: MessageRole.User, content: 'Hello' },
          { id: 'm2', role: MessageRole.Assistant, content: 'Hi there' }
        ]
      }
    ] as any

    const settingsStore = useSettingsStore()
    settingsStore.systemPrompt = 'You are a helpful assistant.'

    const deviceStore = useDeviceStore()
    deviceStore.deviceInfo = { hasWebGPU: true } as any
  })

  it('should calculate conversationTokens accurately', () => {
    const chatStore = useChatStore()
    const settingsStore = useSettingsStore()
    const convStore = useConversationStore()
    
    const tokens = chatStore.conversationTokens
    expect(tokens).toBeGreaterThan(0)
    
    settingsStore.systemPrompt = ''
    const tokensWithoutSystem = chatStore.conversationTokens
    expect(tokensWithoutSystem).toBeLessThan(tokens)
    
    convStore.currentConversationId = null
    const tokensEmptyConv = chatStore.conversationTokens
    expect(tokensEmptyConv).toBe(0)
  })

  it('should trigger download confirmation if model is not cached', async () => {
    vi.mocked(isModelCached).mockResolvedValue(false)
    const chatStore = useChatStore()
    
    expect(chatStore.showDownloadConfirmation).toBe(false)
    await chatStore.downloadMultipleEngines(['model-1'])
    
    expect(chatStore.showDownloadConfirmation).toBe(true)
    expect(chatStore.pendingModelForConfirmation?.id).toBe('model-1')
  })

  it('should proceed to download after confirmation', async () => {
    vi.mocked(isModelCached).mockResolvedValue(false)
    const chatStore = useChatStore()
    
    await chatStore.downloadMultipleEngines(['model-1'])
    expect(chatStore.showDownloadConfirmation).toBe(true)
    
    chatStore.confirmDownload()
    
    await new Promise(resolve => setTimeout(resolve, 0))
    
    expect(chatStore.showDownloadConfirmation).toBe(false)
    expect(chatStore.pendingModelForConfirmation).toBeNull()
    expect(chatStore.isEngineLoading).toBe(true)
    
    chatStore.cancelDownload()
  })

  it('should auto-download if model is cached', async () => {
    vi.mocked(isModelCached).mockResolvedValue(true)
    const chatStore = useChatStore()
    
    await chatStore.downloadMultipleEngines(['model-1'])
    
    expect(chatStore.showDownloadConfirmation).toBe(false)
    expect(chatStore.isEngineLoading).toBe(true)
    
    chatStore.cancelDownload()
  })
})
