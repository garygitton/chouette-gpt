import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Conversation, Message } from '~/types'
import { storage } from '~/services/ConversationStorage'
import { useModelStore } from './modelStore'

export const useConversationStore = defineStore('conversation', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<string | null>(null)
  
  async function loadConversations() {
    const all = await storage.getAll()
    for (const conv of all) {
      if (!conv.messages || conv.messages.length === 0) {
        await storage.delete(conv.id)
      }
    }
    conversations.value = all.filter(c => c.messages && c.messages.length > 0)
  }

  async function createNewConversation() {
    const modelStore = useModelStore()
    const id = Date.now().toString()
    const newConv: Conversation = {
      id,
      title: 'Nouvelle conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: modelStore.currentModelId
    }
    await storage.save(newConv)
    conversations.value.unshift(newConv)
    currentConversationId.value = id
    return id
  }

  async function addMessage(convId: string, message: Message) {
    const conv = conversations.value.find(c => c.id === convId)
    if (conv) {
      const exists = conv.messages.some(m => m.id === message.id)
      if (!exists) {
        conv.messages.push(message)
      } else {
        const idx = conv.messages.findIndex(m => m.id === message.id)
        conv.messages[idx] = message
      }
      conv.updatedAt = Date.now()
      
      // Auto-generate title if it's the first user message
      if (conv.messages.length === 1 && message.role === 'user') {
        conv.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
      }
      
      await storage.save(conv)
    }
  }

  async function persistConversation(id: string) {
    const conv = conversations.value.find(c => c.id === id)
    if (conv) {
      conv.updatedAt = Date.now()
      await storage.save(conv)
    }
  }

  async function deleteConversation(id: string) {
    await storage.delete(id)
    conversations.value = conversations.value.filter(c => c.id !== id)
    if (currentConversationId.value === id) {
      currentConversationId.value = conversations.value.length > 0 ? conversations.value[0].id : null
    }
  }

  async function renameConversation(id: string, newTitle: string) {
    const conv = conversations.value.find(c => c.id === id)
    if (conv) {
      conv.title = newTitle
      conv.updatedAt = Date.now()
      await storage.save(conv)
    }
  }

  return {
    conversations,
    currentConversationId,
    loadConversations,
    createNewConversation,
    addMessage,
    persistConversation,
    deleteConversation,
    renameConversation
  }
})
