import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { estimateTokens, isModelCached } from '../../src/utils/chatUtils'

describe('chatUtils helper functions', () => {
  describe('estimateTokens', () => {
    it('should correctly estimate tokens from text length', () => {
      expect(estimateTokens('Hello')).toBe(2) // 5 chars -> Ceil(5/4) = 2
      expect(estimateTokens('')).toBe(0)      // 0 chars -> 0
      expect(estimateTokens('a'.repeat(100))).toBe(25) // 100 chars -> Ceil(100/4) = 25
    })

    it('should handle undefined/null text gracefully', () => {
      expect(estimateTokens(null as any)).toBe(0)
      expect(estimateTokens(undefined as any)).toBe(0)
    })
  })

  describe('isModelCached', () => {
    const originalCaches = typeof window !== 'undefined' ? window.caches : undefined

    beforeEach(() => {
      if (typeof window === 'undefined') {
        global.window = {} as any
      }
    })

    afterEach(() => {
      vi.restoreAllMocks()
      if (originalCaches) {
        global.window.caches = originalCaches
      } else {
        delete (global.window as any).caches
      }
    })

    it('should return false if window.caches is not available', async () => {
      delete (global.window as any).caches
      const cached = await isModelCached('Qwen2.5')
      expect(cached).toBe(false)
    })

    it('should return true if the modelId exists in cache request URLs', async () => {
      const mockKeys = vi.fn().mockResolvedValue(['transformers-models-cache', 'general-assets-cache'])
      const mockCacheKeys = vi.fn().mockResolvedValue([
        { url: 'https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct/resolve/main/model.onnx' }
      ])
      const mockOpen = vi.fn().mockResolvedValue({
        keys: mockCacheKeys
      })

      global.window.caches = {
        keys: mockKeys,
        open: mockOpen
      } as any

      const cached = await isModelCached('Qwen2.5-0.5B-Instruct')
      expect(cached).toBe(true)

      expect(mockKeys).toHaveBeenCalled()
      expect(mockOpen).toHaveBeenCalledWith('transformers-models-cache')
    })

    it('should return false if the modelId does not exist in cache request URLs', async () => {
      const mockKeys = vi.fn().mockResolvedValue(['transformers-models-cache'])
      const mockCacheKeys = vi.fn().mockResolvedValue([
        { url: 'https://huggingface.co/other-user/Llama-3-8B/resolve/main/model.onnx' }
      ])
      const mockOpen = vi.fn().mockResolvedValue({
        keys: mockCacheKeys
      })

      global.window.caches = {
        keys: mockKeys,
        open: mockOpen
      } as any

      const cached = await isModelCached('Qwen2.5-0.5B-Instruct')
      expect(cached).toBe(false)
    })

    it('should handle cache exceptions gracefully and return false', async () => {
      const mockKeys = vi.fn().mockRejectedValue(new Error('Cache Access Denied'))
      global.window.caches = {
        keys: mockKeys
      } as any

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const cached = await isModelCached('Qwen2.5-0.5B-Instruct')
      expect(cached).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})
