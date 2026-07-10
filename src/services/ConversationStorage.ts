import type { Conversation } from '~/types'

export class ConversationStorage {
  private readonly DB_NAME = 'chouette-gpt-db'
  private readonly STORE_NAME = 'conversations'
  private readonly DB_VERSION = 1

  private async getDB(): Promise<IDBDatabase> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.reject(new Error('IndexedDB is not available on the server'));
    }
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' })
        }
      }
    })
  }

  async getAll(): Promise<Conversation[]> {
    if (typeof window === 'undefined') return [];
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readonly')
      const store = tx.objectStore(this.STORE_NAME)
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async save(conversation: Conversation): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    const db = await this.getDB()
    // Strip Vue proxies to prevent DOMException: DataCloneError
    const rawConv = JSON.parse(JSON.stringify(conversation))
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite')
      const store = tx.objectStore(this.STORE_NAME)
      const request = store.put(rawConv)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async delete(id: string): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite')
      const store = tx.objectStore(this.STORE_NAME)
      const request = store.delete(id)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

export const storage = new ConversationStorage()
