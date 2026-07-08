import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useConversationStore } from './conversationStore'
import { useModelStore } from './modelStore'
import { useSettingsStore } from './settingsStore'

export const useChatStore = defineStore('chat', () => {
  const isGenerating = ref(false)
  const isEngineLoading = ref(false)
  const isEngineReady = ref(false)
  const engineProgress = ref({ text: '', progress: 0 })
  const sessionTokens = ref(0)
  
  let worker: Worker | null = null
  let generationIdCounter = 0
  let currentGenerationId = 0
  let downloadQueue: string[] = []

  async function initEngine(modelId: string, progressPrefix = '') {
    if (isEngineReady.value && !progressPrefix) return

    const modelStore = useModelStore()
    const modelInfo = modelStore.models.find(m => m.id === modelId)

    // Check for mock mode
    let isMock = typeof window !== 'undefined' && 
      (window.location.href.includes('mock=true') || (window as any).__mock_llm);
      
    console.log('[CHATSTORE] initEngine:', { modelId, isMock, href: typeof window !== 'undefined' ? window.location.href : '' })

    if (isMock) {
      isEngineLoading.value = true;
      // Simulate progress callback
      const steps = [
        { text: progressPrefix + 'Unpacking model metadata...', progress: 0.1 },
        { text: progressPrefix + 'Loading WebGPU pipeline cache...', progress: 0.4 },
        { text: progressPrefix + 'Downloading model weights (1/4)...', progress: 0.6 },
        { text: progressPrefix + 'Downloading model weights (4/4)...', progress: 0.8 },
        { text: progressPrefix + 'Model loaded and initialized!', progress: 1.0 }
      ];
      for (const step of steps) {
        if (!isEngineLoading.value) return; // If cancelled
        engineProgress.value = step;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
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
      
      isEngineLoading.value = false;
      isEngineReady.value = true;
      return;
    }

    isEngineLoading.value = true
    try {
      worker = new Worker(new URL('../workers/transformers.worker.ts', import.meta.url), { type: 'module' })
      
      await new Promise<void>((resolve, reject) => {
        worker!.onmessage = (event) => {
          const { type, payload } = event.data
          if (type === 'progress') {
            engineProgress.value = { text: progressPrefix + payload.text, progress: payload.progress }
          } else if (type === 'init_done') {
            resolve()
          } else if (type === 'init_error') {
            reject(new Error(payload))
          }
        }
        worker!.postMessage({ type: 'init', payload: { modelId } })
      })
      if (isEngineLoading.value) { // Ensure it wasn't cancelled
        isEngineReady.value = true;
      }
    } catch (error) {
      if (isEngineLoading.value) { // Ignore error if cancelled
        console.error('Failed to init engine', error)
        throw error
      }
    } finally {
      if (!progressPrefix) {
        isEngineLoading.value = false
      }
    }
  }

  async function downloadMultipleEngines(modelIds: string[]) {
    if (isEngineReady.value || modelIds.length === 0) return

    downloadQueue = [...modelIds]
    const totalModels = downloadQueue.length
    isEngineLoading.value = true

    for (let i = 0; i < totalModels; i++) {
      const modelId = downloadQueue[i]
      if (!isEngineLoading.value) break // Cancelled

      const progressPrefix = `[${i + 1}/${totalModels}] `
      
      try {
        await initEngine(modelId, progressPrefix)
        
        // If it's not the last model, we terminate it so it stays cached but not in RAM
        if (i < totalModels - 1) {
          if (worker) {
            worker.terminate()
            worker = null
          }
          isEngineReady.value = false
        }
      } catch (err) {
        console.error(`Failed to download ${modelId}`, err)
        // Continue to the next model even if one fails
      }
    }

    isEngineLoading.value = false
  }

  function cancelDownload() {
    isEngineLoading.value = false
    isEngineReady.value = false
    if (worker) {
      worker.terminate()
      worker = null
    }
    engineProgress.value = { text: 'Téléchargement annulé', progress: 0 }
  }

  async function generate(modelId: string, text: string) {
    const convStore = useConversationStore()
    const settingsStore = useSettingsStore()
    if (!convStore.currentConversationId) {
      await convStore.createNewConversation()
    }
    const convId = convStore.currentConversationId!
    
    // Add User Message
    await convStore.addMessage(convId, {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    })

    // Update tokens for user message (rough estimation)
    sessionTokens.value += Math.ceil(text.length / 4)

    // Init Engine
    if (!worker) {
      await initEngine(modelId)
    }

    // Add Assistant Message placeholder
    const asstMsgId = (Date.now() + 1).toString()
    await convStore.addMessage(convId, {
      id: asstMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    })

    const currentConv = convStore.conversations.find(c => c.id === convId)
    if (!currentConv) return

    isGenerating.value = true
    try {
      let messages: any[] = []
      
      const historyMessages = currentConv.messages.map(m => ({ role: m.role, content: m.content }))
      historyMessages.pop() // Exclude assistant empty placeholder
      
      // If user sets their own system prompt, we use it directly
      if (settingsStore.systemPrompt && settingsStore.systemPrompt.trim().length > 0) {
        messages = [...historyMessages]
        messages.unshift({ role: 'system', content: settingsStore.systemPrompt.trim() })
        sessionTokens.value += Math.ceil(settingsStore.systemPrompt.length / 4)
      } else {
        messages = historyMessages
      }

      const llmParams = {
        temperature: settingsStore.temperature,
        top_p: settingsStore.topP,
        max_tokens: settingsStore.maxTokens,
        top_k: settingsStore.topK
      }

      let generatedChars = 0

      if (worker) {
        generationIdCounter++
        currentGenerationId = generationIdCounter
        
        await new Promise<void>((resolve, reject) => {
          let fullContent = ''
          
          worker!.onmessage = (event) => {
            const { type, payload, generationId } = event.data
            
            // Ignore messages from old generations
            if (generationId !== currentGenerationId) return
            
            if (type === 'generate_chunk') {
              fullContent += payload
              const msg = currentConv.messages.find(m => m.id === asstMsgId)
              if (msg) msg.content = fullContent
              generatedChars = fullContent.length
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
      
      // Update tokens for generated output
      sessionTokens.value += Math.ceil(generatedChars / 4)
      
      // Save final state
      await convStore.persistConversation(convId)
    } catch (error) {
      console.error('Generation error', error)
    } finally {
      isGenerating.value = false
    }
  }

  async function stopGenerate() {
    if (worker) {
      worker.postMessage({ type: 'interrupt' })
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    isEngineLoading,
    isEngineReady,
    engineProgress,
    sessionTokens,
    downloadMultipleEngines,
    initEngine,
    cancelDownload,
    generate,
    stopGenerate
  }
})
