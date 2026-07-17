import * as Comlink from 'comlink'
import { MessageRole } from '~/domain/chat/MessageRole'
import { estimateTokens } from './chatUtils'
import type { TransformersWorkerAPI } from '~/workers/transformers.worker'

export async function executeBenchmark(
  modelId: string, 
  device: 'webgpu' | 'wasm',
  modelStore: any,
  onProgress: (info: { text: string, tokens: number, elapsedMs: number, warmupMs: number }) => void,
  onEngineEvent: (type: 'progress' | 'init_done' | 'init_error', payload: any) => void
): Promise<{ warmupMs: number, tokensPerSec: number, totalTokens: number, text: string }> {
  
  const t0 = performance.now()
  const localWorker = new Worker(new URL('../workers/transformers.worker.ts', import.meta.url), { type: 'module' })
  const workerApi = Comlink.wrap<TransformersWorkerAPI>(localWorker)
  
  const onWorkerProgress = Comlink.proxy((payload: any) => {
    onEngineEvent('progress', payload)
  })

  try {
    const model = modelStore.models.find((m: any) => m.id === modelId)
    const dtype = model?.quantization || 'q4'
    const result = await workerApi.init(modelId, dtype, device, onWorkerProgress)
    onEngineEvent('init_done', { device: result.device })
  } catch (err: any) {
    onEngineEvent('init_error', err.message || 'Worker error')
    localWorker.terminate()
    throw err
  }

  const t1 = performance.now()
  const warmupMs = t1 - t0

  onProgress({ text: '', tokens: 0, elapsedMs: 0, warmupMs })

  const prompt = [{ role: MessageRole.User, content: 'Raconte moi une histoire.' }]
  const t2 = performance.now()
  let text = ''
  
  const genId = Date.now()

  const onChunk = Comlink.proxy((payloadText: string) => {
    text += payloadText
    const currentElapsed = performance.now() - t2
    onProgress({ 
      text, 
      tokens: estimateTokens(text), 
      elapsedMs: currentElapsed,
      warmupMs 
    })
  })

  await workerApi.generate(
    prompt,
    genId,
    { temperature: 0.7, maxTokens: 50 },
    onChunk
  )

  const t3 = performance.now()
  const genMs = t3 - t2
  const totalTokens = estimateTokens(text)
  const tokensPerSec = totalTokens / (genMs / 1000)

  localWorker.terminate()

  return { warmupMs, tokensPerSec, totalTokens, text }
}
