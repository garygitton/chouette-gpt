import { MessageRole } from '~/domain/chat/MessageRole'
import type { ModelContext } from '~/contexts/modelContext'
import { estimateTokens } from './chatUtils'

export async function executeBenchmark(
  modelId: string, 
  device: 'webgpu' | 'wasm',
  modelContext: ModelContext,
  onProgress: (info: { text: string, tokens: number, elapsedMs: number, warmupMs: number }) => void,
  onEngineEvent: (type: 'progress' | 'init_done' | 'init_error', payload: any) => void
): Promise<{ warmupMs: number, tokensPerSec: number, totalTokens: number, text: string }> {
  
  const t0 = performance.now()
  let localWorker = new Worker(new URL('../workers/transformers.worker.ts', import.meta.url), { type: 'module' })
  
  await new Promise<void>((resolve, reject) => {
    localWorker.onmessage = (event) => {
      const { type, payload } = event.data
      onEngineEvent(type, payload)
      if (type === 'init_done') {
        resolve()
      } else if (type === 'init_error') {
        reject(new Error(payload))
      }
    }
    const model = modelContext.models.find((m: any) => m.id === modelId)
    const dtype = model?.quantization || 'q4'
    localWorker.postMessage({ type: 'init', payload: { modelId, forceDevice: device, dtype } })
  })

  const t1 = performance.now()
  const warmupMs = t1 - t0

  onProgress({ text: '', tokens: 0, elapsedMs: 0, warmupMs })

  const prompt = [{ role: MessageRole.User, content: 'Raconte moi une histoire.' }]
  const t2 = performance.now()
  let text = ''
  
  const genId = Date.now()

  await new Promise<void>((resolve, reject) => {
    localWorker.onmessage = (event) => {
      const { type, payload, generationId } = event.data
      if (generationId !== genId) return
      
      if (type === 'generate_chunk') {
        text += payload
        const currentElapsed = performance.now() - t2
        onProgress({ 
          text, 
          tokens: estimateTokens(text), 
          elapsedMs: currentElapsed,
          warmupMs 
        })
      } else if (type === 'generate_done') {
        resolve()
      } else if (type === 'generate_error') {
        reject(new Error(payload))
      }
    }
    localWorker.postMessage({ 
      type: 'generate', 
      payload: { 
        messages: prompt, 
        generationId: genId,
        temperature: 0.7,
        maxTokens: 50
      } 
    })
  })

  const t3 = performance.now()
  const genMs = t3 - t2
  const totalTokens = estimateTokens(text)
  const tokensPerSec = totalTokens / (genMs / 1000)

  localWorker.terminate()

  return { warmupMs, tokensPerSec, totalTokens, text }
}
