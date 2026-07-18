import { defineStore } from 'pinia'

import { ref, computed, watch } from 'vue'
import * as Comlink from 'comlink'
import { MessageRole } from '~/domain/chat/MessageRole'
import { useConversationStore } from './conversationStore'
import { useModelStore } from './modelStore'
import { useSettingsStore } from './settingsStore'
import { useDeviceStore } from './deviceStore'
import { executeBenchmark } from '~/utils/benchmark'
import { estimateTokens, isModelCached } from '~/utils/chatUtils'
import type { TransformersWorkerAPI } from '~/workers/transformers.worker'

export const useChatStore = defineStore('chat', () => {
  const modelStore = useModelStore()
  const convStore = useConversationStore()
  const settingsStore = useSettingsStore()
  const deviceStore = useDeviceStore()

  const isGenerating = ref(false)
  const isEngineLoading = ref(false)
  const isEngineReady = ref(false)
  const isEnginePaused = ref(false)
  const engineProgress = ref({ text: '', progress: 0 })
  const actualDevice = ref<'webgpu' | 'wasm' | null>(null)
  
  let worker: Worker | null = null
  let workerApi: Comlink.Remote<TransformersWorkerAPI> | null = null
  
  let generationIdCounter = 0
  let currentGenerationId = 0
  let downloadQueue: string[] = []
  let engineLoadSessionId = 0

  const conversationTokens = computed(() => {
    let total = 0
    if (settingsStore.systemPrompt && settingsStore.systemPrompt.trim().length > 0) {
      total += estimateTokens(settingsStore.systemPrompt.trim())
    }
    if (convStore.currentConversationId) {
      const currentConv = convStore.conversations.find((c: any) => c.id === convStore.currentConversationId)
      if (currentConv && currentConv.messages) {
        for (const msg of currentConv.messages) {
          total += estimateTokens(msg.content || '')
        }
      }
    }
    return total
  })

  const showDownloadConfirmation = ref(false)
  const pendingDownloadModelId = ref<string | null>(null)
  const extensionPort = ref<any>(null)
  
  const pendingModelForConfirmation = computed(() => {
    if (!pendingDownloadModelId.value) return null
    return modelStore.models.find(m => m.id === pendingDownloadModelId.value) || null
  })

  function confirmDownload() {
    if (pendingDownloadModelId.value) {
      downloadMultipleEngines([pendingDownloadModelId.value], true)
      pendingDownloadModelId.value = null
    }
    showDownloadConfirmation.value = false
  }

  // Reset engine status when selected model changes
  watch(() => modelStore.currentModelId, (newId, oldId) => {
    if (newId && newId !== oldId) {
      cancelDownload()
      isEngineReady.value = false

      if (!modelStore.isInitialized) {
        return
      }

      if (typeof window !== 'undefined') {
        const href = window.location.href
        if (href.includes('autoDownload=false') || href.includes('noAutoDownload=true')) {
          return
        }
        setTimeout(() => {
          downloadMultipleEngines([newId])
        }, 50)
      }
    }
  })

  async function initEngine(modelId: string, progressPrefix = '', sessionId?: number) {
    if (isEngineReady.value && !progressPrefix) return
    isEnginePaused.value = false

    const activeSessionId = sessionId || ++engineLoadSessionId

    if (modelId.startsWith('native/')) {
      isEngineLoading.value = true
      isEngineReady.value = false
      
      try {
        if (typeof window === 'undefined' || !(window as any).chrome?.runtime?.connect) {
          throw new Error("L'extension Chrome et son compagnon natif sont requis pour ce modèle.")
        }
        
        // Connect to service worker
        extensionPort.value = (window as any).chrome.runtime.connect({ name: 'chouette-ui' })
        
        // Listen to download progress and success
        const onMessage = (msg: any) => {
          if (engineLoadSessionId !== activeSessionId) return
          
          if (msg.type === 'download_progress') {
            engineProgress.value = { 
              text: `${progressPrefix}Téléchargement : ${msg.downloaded} / ${msg.total} (${msg.speed})`, 
              progress: msg.progress / 100 
            }
          } else if (msg.type === 'download_success') {
            isEngineReady.value = true
            isEngineLoading.value = false
            engineProgress.value = { text: 'Modèle natif prêt !', progress: 1.0 }
          } else if (msg.type === 'status' && msg.status === 'info') {
            engineProgress.value = { text: msg.message, progress: 0.1 }
          } else if (msg.type === 'status' && msg.status === 'error') {
            console.error('Companion error:', msg.error)
            engineProgress.value = { text: `Erreur : ${msg.error}`, progress: 0 }
            isEngineLoading.value = false
            isEngineReady.value = false
          }
        }
        
        extensionPort.value.onMessage.addListener(onMessage)
        
        // Trigger download
        extensionPort.value.postMessage({ action: 'download', modelId })
        
        // Await model readiness
        return new Promise<void>((resolve, reject) => {
          const checkTimer = setInterval(() => {
            if (engineLoadSessionId !== activeSessionId) {
              clearInterval(checkTimer)
              reject(new Error('Session annulée'))
            }
            if (isEngineReady.value) {
              clearInterval(checkTimer)
              resolve()
            }
            if (!isEngineLoading.value && !isEngineReady.value) {
              clearInterval(checkTimer)
              reject(new Error(engineProgress.value.text || 'Échec du chargement du modèle natif'))
            }
          }, 100)
        })
      } catch (err: any) {
        console.error('Failed to init native engine:', err)
        isEngineLoading.value = false
        isEngineReady.value = false
        engineProgress.value = { text: `Erreur extension : ${err.message}`, progress: 0 }
        throw err
      }
    }

    const modelInfo = modelStore.models.find(m => m.id === modelId)

    const isMock = typeof window !== 'undefined' && 
      (window.location.href.includes('mock=true') || (window as any).__mock_llm);
      
    console.log('[CHATSTORE] initEngine:', { modelId, isMock, href: typeof window !== 'undefined' ? window.location.href : '' })

    
    if (isMock) {
      isEngineLoading.value = true;
      const steps = [
        { text: progressPrefix + 'Unpacking model metadata...', progress: 0.1 },
        { text: progressPrefix + 'Loading WebGPU pipeline cache...', progress: 0.4 },
        { text: progressPrefix + 'Downloading model weights (1/4)...', progress: 0.6 },
        { text: progressPrefix + 'Downloading model weights (4/4)...', progress: 0.8 },
        { text: progressPrefix + 'Model loaded and initialized!', progress: 1.0 }
      ];
      for (const step of steps) {
        if (engineLoadSessionId !== activeSessionId || !isEngineLoading.value) return; 
        engineProgress.value = step;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (engineLoadSessionId !== activeSessionId) return;

      workerApi = {
        generate: async (messages: any[], genId: number, params: any, onChunk: any) => {
             const userPrompt = messages[messages.length - 1].content;
             const responseText = `Bonjour ! Je suis ChouetteGPT, un modèle d'IA local simulé (bouchonné) pour les tests E2E.\n\nVous m'avez demandé : "${userPrompt}".\n\nEst-ce que je peux vous aider pour autre chose ?`;
             
             const chunks = responseText.match(/.{1,4}/g) || [responseText];
             for (const chunk of chunks) {
               await new Promise(r => setTimeout(r, 20));
               await onChunk(chunk);
             }
        },
        interrupt: async () => {},
        init: async () => ({ device: 'mock' })
      } as any;
      
      if (engineLoadSessionId === activeSessionId) {
        isEngineReady.value = true;
        setTimeout(() => {
          if (engineLoadSessionId === activeSessionId) {
            isEngineLoading.value = false;
          }
        }, 1500);
      }
      return;
    }

    isEngineLoading.value = true
    try {
      if (engineLoadSessionId !== activeSessionId) return

      worker = new Worker(new URL('../workers/transformers.worker.ts', import.meta.url), { type: 'module' })
      workerApi = Comlink.wrap<TransformersWorkerAPI>(worker)
      
      const onProgress = Comlink.proxy((payload: any) => {
        if (engineLoadSessionId !== activeSessionId) return
        engineProgress.value = { text: progressPrefix + payload.text, progress: payload.progress }
      })

      const model = modelStore.models.find(m => m.id === modelId)
      const dtype = model?.quantization || 'q4'
      const forceDevice = (settingsStore.forceWasm || !deviceStore.deviceInfo?.hasWebGPU) ? 'wasm' : undefined
      
      const result = await workerApi.init(modelId, dtype, forceDevice, onProgress)
      
      if (engineLoadSessionId !== activeSessionId) return

      actualDevice.value = result.device as any

      if (isEngineLoading.value) { 
        isEngineReady.value = true;
      }
    } catch (error) {
      if (engineLoadSessionId === activeSessionId && isEngineLoading.value) { 
        console.error('Failed to init engine', error)
        throw error
      }
    } finally {
      if (engineLoadSessionId === activeSessionId && !progressPrefix) {
        setTimeout(() => {
          if (engineLoadSessionId === activeSessionId) {
            isEngineLoading.value = false;
          }
        }, 1500);
      }
    }
  }

  async function downloadMultipleEngines(modelIds: string[], force = false) {
    console.log('[CHATSTORE] downloadMultipleEngines called', { isEngineReady: isEngineReady.value, modelIds, isEngineLoading: isEngineLoading.value, downloadQueue });
    if (isEngineReady.value || modelIds.length === 0) return

    const targetModelId = modelIds[0]
    const cached = await isModelCached(targetModelId)
    if (!cached && !force) {
      pendingDownloadModelId.value = targetModelId
      showDownloadConfirmation.value = true
      return
    }

    if (isEngineLoading.value && JSON.stringify(downloadQueue) === JSON.stringify(modelIds)) {
      return
    }

    downloadQueue = [...modelIds]
    const totalModels = downloadQueue.length
    isEngineLoading.value = true
    const sessionId = ++engineLoadSessionId

    for (let i = 0; i < totalModels; i++) {
      const modelId = downloadQueue[i]
      if (engineLoadSessionId !== sessionId || !isEngineLoading.value) break

      const progressPrefix = `[${i + 1}/${totalModels}] `
      
      try {
        await initEngine(modelId, progressPrefix, sessionId)
        
        if (i < totalModels - 1) {
          if (worker) {
            worker.terminate()
            worker = null
            workerApi = null
          }
          isEngineReady.value = false
        }
      } catch (err) {
        console.error(`Failed to download ${modelId}`, err)
        if (err instanceof Error && err.message === 'Session cancelled') {
          // User paused explicitly
        } else {
          engineProgress.value = { 
            text: "Interruption réseau. En attente...", 
            progress: engineProgress.value.progress 
          };
          pauseDownload();
        }
        break;
      }
    }

    if (engineLoadSessionId === sessionId) {
      setTimeout(() => {
        if (engineLoadSessionId === sessionId) {
          isEngineLoading.value = false;
        }
      }, 1500);
    }
  }

  function pauseDownload() {
    engineLoadSessionId++
    isEngineLoading.value = false
    isEnginePaused.value = true
    if (worker) {
      worker.terminate()
      worker = null
      workerApi = null
    }
    if (extensionPort.value) {
      extensionPort.value.disconnect()
      extensionPort.value = null
    }
  }

  function cancelDownload() {
    engineLoadSessionId++
    isEngineLoading.value = false
    isEngineReady.value = false
    isEnginePaused.value = false
    if (worker) {
      worker.terminate()
      worker = null
      workerApi = null
    }
    engineProgress.value = { text: 'Téléchargement annulé', progress: 0 }
  }

  async function generate(modelId: string, text: string) {
    if (!convStore.currentConversationId) {
      await convStore.createNewConversation()
    }
    const convId = convStore.currentConversationId!
    
    await convStore.addMessage(convId, {
      id: Date.now().toString(),
      role: MessageRole.User,
      content: text,
      timestamp: Date.now()
    })

    if (modelId.startsWith('native/')) {
      if (!extensionPort.value) {
        await initEngine(modelId)
      }
    } else if (!workerApi) {
      await initEngine(modelId)
    }

    const asstMsgId = (Date.now() + 1).toString()
    await convStore.addMessage(convId, {
      id: asstMsgId,
      role: MessageRole.Assistant,
      content: '',
      timestamp: Date.now()
    })

    const currentConv = convStore.conversations.find((c: any) => c.id === convId)
    if (!currentConv) return

    isGenerating.value = true
    try {
      let messages: any[] = []
      
      const historyMessages = currentConv.messages.map((m: any) => ({ role: m.role, content: m.content }))
      historyMessages.pop() 
      
      const activeDomain = modelStore.domains?.find((d: any) => d.id === modelStore.currentDomain)
      let finalSystemPrompt = ''
      if (activeDomain && activeDomain.prompt) {
        finalSystemPrompt = activeDomain.prompt
      }

      if (settingsStore.systemPrompt && settingsStore.systemPrompt.trim().length > 0) {
        if (finalSystemPrompt) {
          finalSystemPrompt += '\n\n' + settingsStore.systemPrompt.trim()
        } else {
          finalSystemPrompt = settingsStore.systemPrompt.trim()
        }
      }

      if (finalSystemPrompt && finalSystemPrompt.trim().length > 0) {
        messages = historyMessages.map((m: any) => ({ ...m }))
        
        // For small models (like 135M/0.5B), system roles are often ignored if placed at the very beginning of a long conversation.
        // Injecting the system instructions into the latest user prompt ensures it is heavily weighted by the attention mechanism.
        const lastMsg = messages[messages.length - 1]
        if (lastMsg && lastMsg.role === MessageRole.User) {
          lastMsg.content = `[Instructions Système : ${finalSystemPrompt.trim()}]\n\n${lastMsg.content}`
        } else {
          messages.unshift({ role: MessageRole.System, content: finalSystemPrompt.trim() })
        }
      } else {
        messages = historyMessages.map((m: any) => ({ ...m }))
      }

      const supportsSampling = modelStore.currentModel?.supportsSampling !== false

      const llmParams = {
        temperature: (supportsSampling && settingsStore.doSample) ? settingsStore.temperature : 0.0,
        topP: (supportsSampling && settingsStore.doSample) ? settingsStore.topP : 1.0,
        maxTokens: settingsStore.maxTokens,
        topK: (supportsSampling && settingsStore.doSample) ? settingsStore.topK : 50,
        repetitionPenalty: settingsStore.repetitionPenalty
      }

      if (modelId.startsWith('native/')) {
        let fullContent = ''
        
        await new Promise<void>((resolve, reject) => {
          const onMessage = (msg: any) => {
            if (!isGenerating.value) {
              extensionPort.value?.onMessage.removeListener(onMessage)
              resolve()
              return
            }
            
            if (msg.type === 'chat_chunk') {
              fullContent += msg.chunk
              const m = currentConv.messages.find((m: any) => m.id === asstMsgId)
              if (m) m.content = fullContent
            } else if (msg.type === 'chat_done') {
              extensionPort.value?.onMessage.removeListener(onMessage)
              resolve()
            } else if (msg.type === 'status' && msg.status === 'error') {
              extensionPort.value?.onMessage.removeListener(onMessage)
              reject(new Error(msg.error))
            }
          }
          
          extensionPort.value.onMessage.addListener(onMessage)
          extensionPort.value.postMessage({ action: 'chat', prompt: text, modelId })
        })
      } else if (workerApi) {
        generationIdCounter++
        currentGenerationId = generationIdCounter
        
        let fullContent = ''
        
        const onChunk = Comlink.proxy((payloadText: string) => {
          fullContent += payloadText
          const msg = currentConv.messages.find((m: any) => m.id === asstMsgId)
          if (msg) msg.content = fullContent
        })

        await workerApi.generate(
          messages, 
          currentGenerationId,
          llmParams,
          onChunk
        )
      }
      
      await convStore.persistConversation(convId)
    } catch (error: any) {
      console.error('Generation error', error)
      // Display the error to the user in the assistant's message if native failed
      if (modelId.startsWith('native/')) {
        const msg = currentConv.messages.find((m: any) => m.id === asstMsgId)
        if (msg) msg.content = `[Erreur du compagnon natif] : ${error.message || error}`
      }
    } finally {
      isGenerating.value = false
    }
  }

  async function runBenchmark(
    modelId: string, 
    device: 'webgpu' | 'wasm',
    onProgress: (info: { text: string, tokens: number, elapsedMs: number, warmupMs: number }) => void
  ) {
    if (worker) {
      worker.terminate()
      worker = null
      workerApi = null
    }
    isEngineReady.value = false
    isEngineLoading.value = true
    engineProgress.value = { text: 'Initialisation Benchmark...', progress: 0 }

    try {
      // NOTE: benchmark.ts expects modelStore directly
      return await executeBenchmark(modelId, device, modelStore as any, onProgress, (type, payload) => {
        if (type === 'progress') {
          engineProgress.value = { text: payload.text, progress: payload.progress }
        }
      })
    } finally {
      isEngineLoading.value = false
      isEngineReady.value = false
    }
  }

  async function stopGenerate() {
    if (workerApi) {
      await workerApi.interrupt()
      isGenerating.value = false
    }
    if (extensionPort.value) {
      extensionPort.value.postMessage({ action: 'interrupt' })
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    isEngineLoading,
    isEngineReady,
    isEnginePaused,
    engineProgress,
    actualDevice,
    conversationTokens,
    downloadMultipleEngines,
    initEngine,
    cancelDownload,
    pauseDownload,
    generate,
    stopGenerate,
    runBenchmark,
    showDownloadConfirmation,
    pendingModelForConfirmation,
    confirmDownload,
    isModelCached
  }
})
