import { ref, inject, reactive, computed, watch, type InjectionKey } from 'vue'
import { MessageRole } from '~/domain/chat/MessageRole'
import type { ConversationContext } from './conversationContext'
import type { ModelContext } from './modelContext'
import type { SettingsContext } from './settingsContext'
import { executeBenchmark } from '~/utils/benchmark'
import { estimateTokens, isModelCached } from '~/utils/chatUtils'
export function useProvideChat(modelContext: ModelContext, convContext: ConversationContext, settingsContext: SettingsContext) {
  const isGenerating = ref(false)
  const isEngineLoading = ref(false)
  const isEngineReady = ref(false)
  const isEnginePaused = ref(false)
  const engineProgress = ref({ text: '', progress: 0 })
  const actualDevice = ref<'webgpu' | 'wasm' | null>(null)
  
  let worker: Worker | null = null
  let generationIdCounter = 0
  let currentGenerationId = 0
  let downloadQueue: string[] = []
  let engineLoadSessionId = 0
  const conversationTokens = computed(() => {
    let total = 0
    if (settingsContext.systemPrompt && settingsContext.systemPrompt.trim().length > 0) {
      total += estimateTokens(settingsContext.systemPrompt.trim())
    }
    if (convContext.currentConversationId) {
      const currentConv = convContext.conversations.find((c: any) => c.id === convContext.currentConversationId)
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
  
  const pendingModelForConfirmation = computed(() => {
    if (!pendingDownloadModelId.value) return null
    return modelContext.models.find(m => m.id === pendingDownloadModelId.value) || null
  })

  function confirmDownload() {
    if (pendingDownloadModelId.value) {
      downloadMultipleEngines([pendingDownloadModelId.value], true)
      pendingDownloadModelId.value = null
    }
    showDownloadConfirmation.value = false
  }

  let isInitialModelChange = true

  // Reset engine status when selected model changes
  watch(() => modelContext.currentModelId, (newId, oldId) => {
    if (newId && newId !== oldId) {
      cancelDownload()
      isEngineReady.value = false

      if (isInitialModelChange) {
        isInitialModelChange = false
        return
      }

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          downloadMultipleEngines([newId])
        }, 50)
      }
    }
  })


  async function initEngine(modelId: string, progressPrefix = '', sessionId?: number) {
    if (isEngineReady.value && !progressPrefix) return
    isEnginePaused.value = false

    const modelInfo = modelContext.models.find(m => m.id === modelId)

    let isMock = typeof window !== 'undefined' && 
      (window.location.href.includes('mock=true') || (window as any).__mock_llm);
      
    console.log('[CHATSTORE] initEngine:', { modelId, isMock, href: typeof window !== 'undefined' ? window.location.href : '' })

    const activeSessionId = sessionId || ++engineLoadSessionId

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

      worker = {
        postMessage: async (msg: any) => {
          if (msg.type === 'generate') {
             const userPrompt = msg.payload.messages[msg.payload.messages.length - 1].content;
             const responseText = `Bonjour ! Je suis ChouetteGPT, un modèle d'IA local simulé (bouchonné) pour les tests E2E.\n\nVous m'avez demandé : "${userPrompt}".\n\nEst-ce que je peux vous aider pour autre chose ?`;
             
             const chunks = responseText.match(/.{1,4}/g) || [responseText];
             for (const chunk of chunks) {
               await new Promise(r => setTimeout(r, 20));
               if (worker?.onmessage) {
                 worker.onmessage({ data: { type: 'generate_chunk', payload: chunk, generationId: msg.payload.generationId } } as any);
               }
             }
             if (worker?.onmessage) {
               worker.onmessage({ data: { type: 'generate_done', generationId: msg.payload.generationId } } as any);
             }
          } else if (msg.type === 'interrupt') {
             if (worker?.onmessage) {
               worker.onmessage({ data: { type: 'interrupt_done' } } as any);
             }
          }
        },
        terminate: () => {},
        onmessage: null
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
      
      await new Promise<void>((resolve, reject) => {
        worker!.onmessage = (event) => {
          if (engineLoadSessionId !== activeSessionId) {
            reject(new Error('Session cancelled'))
            return
          }
          const { type, payload } = event.data
          if (type === 'progress') {
            engineProgress.value = { text: progressPrefix + payload.text, progress: payload.progress }
          } else if (type === 'init_done') {
            actualDevice.value = payload?.device || 'webgpu'
            resolve()
          } else if (type === 'init_error') {
            reject(new Error(payload))
          }
        }
        const model = modelContext.models.find(m => m.id === modelId)
        const dtype = model?.quantization || 'q4'
        worker!.postMessage({ type: 'init', payload: { modelId, dtype } })
      })

      if (engineLoadSessionId !== activeSessionId) return

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
    }
    engineProgress.value = { text: 'Téléchargement annulé', progress: 0 }
  }

  async function generate(modelId: string, text: string) {
    if (!convContext.currentConversationId) {
      await convContext.createNewConversation()
    }
    const convId = convContext.currentConversationId!
    
    await convContext.addMessage(convId, {
      id: Date.now().toString(),
      role: MessageRole.User,
      content: text,
      timestamp: Date.now()
    })

    if (!worker) {
      await initEngine(modelId)
    }

    const asstMsgId = (Date.now() + 1).toString()
    await convContext.addMessage(convId, {
      id: asstMsgId,
      role: MessageRole.Assistant,
      content: '',
      timestamp: Date.now()
    })

    const currentConv = convContext.conversations.find((c: any) => c.id === convId)
    if (!currentConv) return

    isGenerating.value = true
    try {
      let messages: any[] = []
      
      const historyMessages = currentConv.messages.map((m: any) => ({ role: m.role, content: m.content }))
      historyMessages.pop() 
      
      const activeDomain = modelContext.domains?.find((d: any) => d.id === modelContext.currentDomain)
      let finalSystemPrompt = ''
      if (activeDomain && activeDomain.prompt) {
        finalSystemPrompt = activeDomain.prompt
      }

      if (settingsContext.systemPrompt && settingsContext.systemPrompt.trim().length > 0) {
        if (finalSystemPrompt) {
          finalSystemPrompt += '\n\n' + settingsContext.systemPrompt.trim()
        } else {
          finalSystemPrompt = settingsContext.systemPrompt.trim()
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

      const supportsSampling = modelContext.currentModel?.supportsSampling !== false

      const llmParams = {
        temperature: (supportsSampling && settingsContext.doSample) ? settingsContext.temperature : 0.0,
        topP: (supportsSampling && settingsContext.doSample) ? settingsContext.topP : 1.0,
        maxTokens: settingsContext.maxTokens,
        topK: (supportsSampling && settingsContext.doSample) ? settingsContext.topK : 50,
        repetitionPenalty: settingsContext.repetitionPenalty
      }

      let finalContent = ''

      if (worker) {
        generationIdCounter++
        currentGenerationId = generationIdCounter
        
        await new Promise<void>((resolve, reject) => {
          let fullContent = ''
          
          worker!.onmessage = (event) => {
            const { type, payload, generationId } = event.data
            
            if (generationId !== currentGenerationId) return
            
            if (type === 'generate_chunk') {
              fullContent += payload
              const msg = currentConv.messages.find((m: any) => m.id === asstMsgId)
              if (msg) msg.content = fullContent
              finalContent = fullContent
            } else if (type === 'generate_done') {
              resolve()
            } else if (type === 'generate_error') {
              reject(new Error(payload))
            } else if (type === 'interrupt_done') {
              resolve()
            }
          }
          
          worker!.postMessage({ 
            type: 'generate', 
            payload: { 
              messages, 
              generationId: currentGenerationId,
              ...llmParams
            } 
          })
        })
      }
      
      await convContext.persistConversation(convId)
    } catch (error) {
      console.error('Generation error', error)
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
    }
    isEngineReady.value = false
    isEngineLoading.value = true
    engineProgress.value = { text: 'Initialisation Benchmark...', progress: 0 }

    try {
      return await executeBenchmark(modelId, device, modelContext, onProgress, (type, payload) => {
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
    if (worker) {
      worker.postMessage({ type: 'interrupt' })
      isGenerating.value = false
    }
  }

  return reactive({
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
  })
}

export type ChatContext = ReturnType<typeof useProvideChat>
export const chatKey: InjectionKey<ChatContext> = Symbol('chat')

export function useChat() {
  const context = inject(chatKey)
  if (!context) throw new Error('useChat must be used within a provider')
  return context
}
