import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useConversationStore } from '~/stores/conversationStore'
import { useModelStore } from '~/stores/modelStore'
import { storage } from '~/services/ConversationStorage'
import { MessageRole } from '~/domain/chat/MessageRole'

vi.mock('~/services/ConversationStorage', () => ({
  storage: {
    getAll: vi.fn(),
    save: vi.fn(),
    delete: vi.fn()
  }
}))

describe('conversationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    const modelStore = useModelStore()
    modelStore.currentModelId = 'mock-model-1'
  })

  it('should load conversations and filter empty ones', async () => {
    vi.mocked(storage.getAll).mockResolvedValue([
      { id: '1', title: 'Empty', messages: [], createdAt: 0, updatedAt: 0, modelId: '' },
      { id: '2', title: 'Valid', messages: [{ id: 'm1', role: MessageRole.User, content: 'Hi', timestamp: 0 }], createdAt: 0, updatedAt: 0, modelId: '' }
    ])

    const store = useConversationStore()
    await store.loadConversations()

    expect(storage.delete).toHaveBeenCalledWith('1')
    expect(store.conversations).toHaveLength(1)
    expect(store.conversations[0].id).toBe('2')
    expect(store.currentConversationId).toBe('2')
  })

  it('should create new conversation', async () => {
    const store = useConversationStore()
    
    const id = await store.createNewConversation()
    
    expect(id).toBeTruthy()
    expect(store.conversations).toHaveLength(1)
    expect(store.conversations[0].id).toBe(id)
    expect(store.currentConversationId).toBe(id)
    expect(store.conversations[0].modelId).toBe('mock-model-1')
    expect(storage.save).toHaveBeenCalled()
  })

  it('should add message to existing conversation and update title if first user msg', async () => {
    const store = useConversationStore()
    store.conversations = [
      { id: 'c1', title: 'Old Title', messages: [], createdAt: 0, updatedAt: 0, modelId: '' }
    ]

    await store.addMessage('c1', {
      id: 'm1', role: MessageRole.User, content: 'This is a long user message that should be truncated', timestamp: 0
    })

    expect(store.conversations[0].messages).toHaveLength(1)
    expect(store.conversations[0].title).toBe('This is a long user message th...')
    expect(storage.save).toHaveBeenCalled()
  })
})
