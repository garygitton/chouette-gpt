import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useConversationStore } from './conversationStore'
import { useModelStore } from './modelStore'
import { useSettingsStore } from './settingsStore'

export const useChatStore = defineStore('chat', () => {
  const isGenerating = ref(false)
  const isEngineLoading = ref(false)
  const engineProgress = ref({ text: '', progress: 0 })
  let engine: any = null
  let worker: Worker | null = null
  let currentBackend: 'mlc' | 'transformers' | null = null
  let generationIdCounter = 0
  let currentGenerationId = 0

  async function initEngine(modelId: string) {
    if (engine || (worker && currentBackend === 'transformers')) return

    const modelStore = useModelStore()
    const modelInfo = modelStore.models.find(m => m.id === modelId)
    const backend = modelInfo?.backend || 'mlc'
    currentBackend = backend

    // Check for mock mode
    let isMock = typeof window !== 'undefined' && 
      (window.location.href.includes('mock=true') || (window as any).__mock_llm);
      
    console.log('[CHATSTORE] initEngine:', { modelId, isMock, href: typeof window !== 'undefined' ? window.location.href : '' })

    if (isMock) {
      isEngineLoading.value = true;
      // Simulate progress callback
      const steps = [
        { text: 'Unpacking model metadata...', progress: 0.1 },
        { text: 'Loading WebGPU pipeline cache...', progress: 0.4 },
        { text: 'Downloading model weights (1/4)...', progress: 0.6 },
        { text: 'Downloading model weights (4/4)...', progress: 0.8 },
        { text: 'Model loaded and initialized!', progress: 1.0 }
      ];
      for (const step of steps) {
        engineProgress.value = step;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      engine = {
        chat: {
          completions: {
            create: async function (options: any) {
              const userPrompt = options.messages[options.messages.length - 1].content;
              const responseText = `Bonjour ! Je suis ChouetteGPT, un modèle d'IA local simulé (bouchonné) pour les tests E2E.\n\nVous m'avez demandé : "${userPrompt}".\n\nEst-ce que je peux vous aider pour autre chose ?`;
              
              if (options.stream) {
                return (async function* () {
                  const chunks = responseText.match(/.{1,4}/g) || [responseText];
                  for (const chunk of chunks) {
                    await new Promise(r => setTimeout(r, 20));
                    yield {
                      choices: [
                        {
                          delta: {
                            content: chunk
                          }
                        }
                      ]
                    };
                  }
                })();
              } else {
                return {
                  choices: [
                    {
                      message: {
                        content: responseText
                      }
                    }
                  ]
                };
              }
            }
          }
        },
        interruptGenerate: async () => {}
      };
      
      isEngineLoading.value = false;
      return;
    }

    isEngineLoading.value = true
    try {
      if (backend === 'transformers') {
        worker = new Worker(new URL('../workers/transformers.worker.ts', import.meta.url), { type: 'module' })
        
        await new Promise<void>((resolve, reject) => {
          worker!.onmessage = (event) => {
            const { type, payload } = event.data
            if (type === 'progress') {
              engineProgress.value = payload
            } else if (type === 'init_done') {
              resolve()
            } else if (type === 'init_error') {
              reject(new Error(payload))
            }
          }
          worker!.postMessage({ type: 'init', payload: { modelId } })
        })
      } else {
        worker = new Worker(new URL('../workers/llm.worker.ts', import.meta.url), { type: 'module' })
        const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm')
        engine = await CreateWebWorkerMLCEngine(worker, modelId, {
          initProgressCallback: (progress) => {
            engineProgress.value = progress
          }
        })
      }
    } catch (error) {
      console.error('Failed to init engine', error)
      throw error
    } finally {
      isEngineLoading.value = false
    }
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

    // Init Engine
    if (!engine && !(worker && currentBackend === 'transformers')) {
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
      const messages = currentConv.messages.map(m => ({ role: m.role, content: m.content }))
      // Exclude the last empty assistant message
      messages.pop()

      if (currentBackend === 'transformers' && worker) {
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
              temperature: settingsStore.temperature,
              topP: settingsStore.topP,
              maxTokens: settingsStore.maxTokens
            } 
          })
        })
      } else if (engine) {
        const chunks = await engine.chat.completions.create({
          messages,
          stream: true,
          temperature: settingsStore.temperature,
          top_p: settingsStore.topP,
          max_tokens: settingsStore.maxTokens
        })

        let fullContent = ''
        for await (const chunk of chunks) {
          if (!isGenerating.value) break
          const delta = chunk.choices[0]?.delta?.content || ''
          fullContent += delta
          
          // Update the message reactively
          const msg = currentConv.messages.find(m => m.id === asstMsgId)
          if (msg) {
            msg.content = fullContent
          }
        }
      }
      
      // Save final state
      await convStore.persistConversation(convId)
    } catch (error) {
      console.error('Generation error', error)
    } finally {
      isGenerating.value = false
    }
  }

  async function stopGenerate() {
    if (currentBackend === 'transformers' && worker) {
      worker.postMessage({ type: 'interrupt' })
      isGenerating.value = false
    } else if (engine) {
      await engine.interruptGenerate()
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    isEngineLoading,
    engineProgress,
    initEngine,
    generate,
    stopGenerate
  }
})
