export const estimateTokens = (text: string) => Math.ceil((text || '').length / 4)

export async function isModelCached(modelId: string): Promise<boolean> {
  if (typeof window === 'undefined' || !window.caches) return false
  try {
    const cacheNames = await window.caches.keys()
    const tfCacheNames = cacheNames.filter(name => name.includes('transformers') || name.includes('huggingface'))
    for (const cacheName of tfCacheNames) {
      const cache = await window.caches.open(cacheName)
      const keys = await cache.keys()
      const isCached = keys.some(request => request.url.includes(modelId))
      if (isCached) return true
    }
  } catch (e) {
    console.error('Error checking cache', e)
  }
  return false
}
