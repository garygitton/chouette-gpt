import { ref, computed, inject, reactive, type InjectionKey, watch } from 'vue'
import { useRoute } from '#imports'
import type { ModelInfo } from '~/types'
import { ModelStatus } from '~/domain/model/ModelStatus'
import type { DeviceContext } from './deviceContext'

export function useProvideModel(deviceContext: DeviceContext) {
  const models = ref<ModelInfo[]>([
    {
      id: 'onnx-community/Qwen2.5-0.5B-Instruct',
      name: 'Qwen2.5-0.5B-Instruct',
      version: '2.5',
      parameters: '0.5B',
      totalSize: '350 MB',
      quantization: 'q4',
      estimatedMemory: '600 MB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 2048,
      performanceScore: 45,
      description: 'Rapide & polyvalent',
      domains: ['general']
    },
    {
      id: 'onnx-community/Llama-3.2-1B-Instruct-ONNX',
      name: 'Llama-3.2-1B-Instruct',
      version: '3.2',
      parameters: '1B',
      totalSize: '1.7 GB',
      quantization: 'q4',
      estimatedMemory: '1.5 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 3072,
      performanceScore: 55,
      description: 'Équilibré & précis',
      domains: ['general']
    },
    {
      id: 'onnx-community/Qwen2.5-1.5B-Instruct',
      name: 'Qwen2.5-1.5B-Instruct',
      version: '2.5',
      parameters: '1.5B',
      totalSize: '1.8 GB',
      quantization: 'q4',
      estimatedMemory: '2 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 4096,
      performanceScore: 60,
      description: 'Puissant & logique',
      domains: ['general']
    },
    {
      id: 'onnx-community/Qwen2.5-Math-1.5B-Instruct',
      name: 'Qwen2.5-Math-1.5B-Instruct',
      version: '2.5',
      parameters: '1.5B',
      totalSize: '1.8 GB',
      quantization: 'q4',
      estimatedMemory: '2 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 4096,
      performanceScore: 65,
      description: 'Spécialisé en mathématiques',
      domains: ['maths'],
      supportsSampling: false
    },
    {
      id: 'onnx-community/Qwen2.5-Coder-1.5B-Instruct',
      name: 'Qwen2.5-Coder-1.5B-Instruct',
      version: '2.5',
      parameters: '1.5B',
      totalSize: '1.8 GB',
      quantization: 'q4',
      estimatedMemory: '2 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 4096,
      performanceScore: 68,
      description: 'Spécialisé en programmation',
      domains: ['code']
    },
    {
      id: 'onnx-community/Llama-3.2-3B-Instruct-ONNX',
      name: 'Llama-3.2-3B-Instruct',
      version: '3.2',
      parameters: '3B',
      totalSize: '3.2 GB',
      quantization: 'q4',
      estimatedMemory: '3 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 8192,
      performanceScore: 70,
      description: 'Créatif & intelligent',
      domains: ['general']
    },
    {
      id: 'onnx-community/Phi-3.5-mini-instruct-onnx-web',
      name: 'Phi-3.5-mini-instruct',
      version: '3.5',
      parameters: '3.8B',
      totalSize: '2.2 GB',
      quantization: 'q4f16',
      estimatedMemory: '4 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 8192,
      performanceScore: 75,
      description: 'Raisonnement complexe',
      domains: ['general']
    },
    {
      id: 'vmanvs/medgemma-q4f16-chunked',
      name: 'MedGemma-4B-Instruct',
      version: '1.5',
      parameters: '4B',
      totalSize: '2.6 GB',
      quantization: 'q4f16',
      estimatedMemory: '4.5 GB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 8192,
      performanceScore: 85,
      description: 'Diagnostic médical',
      domains: ['medicine']
    }
  ])



  const currentModelId = ref<string>('onnx-community/Qwen2.5-0.5B-Instruct')
  const currentDomain = ref<string>('general')
  const isDownloading = ref(false)
  const deviceMemory = computed(() => deviceContext.deviceInfo ? deviceContext.deviceInfo.ramGB * 1024 : null)

  const domains = [
    { id: 'general', name: 'Général', description: 'Polyvalent & créatif', icon: 'Cpu', prompt: '' },
    { id: 'maths', name: 'Mathématiques', description: 'Résolution de problèmes', icon: 'Calculator', prompt: 'Tu es un assistant expert en mathématiques. Résous les problèmes étape par étape avec précision, clarté et rigueur.' },
    { id: 'code', name: 'Développement', description: 'Écriture & analyse de code', icon: 'Code2', prompt: 'Tu es un développeur et architecte logiciel expert. Écris du code propre, performant, sécurisé et bien commenté.' },
    { id: 'medicine', name: 'Médecine', description: 'Diagnostic & concepts médicaux', icon: 'Stethoscope', prompt: 'Tu es un assistant médical virtuel expert. Explique les concepts médicaux clairement, propose des pistes diagnostiques basées sur les symptômes, et rappelle toujours de consulter un médecin.' },
    { id: 'legal', name: 'Droit', description: 'Analyse & rédaction juridique', icon: 'Scale', prompt: 'Tu es un assistant juridique expert en droit. Analyse les situations, explique les lois et règlements avec rigueur scientifique, et cite des références juridiques ou jurisprudentielles si possible.' },
    { id: 'writing', name: 'Rédaction & Création', description: 'Rédaction littéraire et créative', icon: 'PenTool', prompt: 'Tu es un écrivain, rédacteur et conteur expert. Rédige des textes captivants, fluides et créatifs en adaptant parfaitement ton ton au style demandé.' },
    { id: 'translation', name: 'Traduction', description: 'Traduction & apprentissage', icon: 'Languages', prompt: 'Tu es un traducteur et linguiste expert. Traduis fidèlement les textes d\'une langue à l\'autre en conservant les nuances culturelles, les expressions idiomatiques et le style d\'origine.' },
    { id: 'education', name: 'Soutien Scolaire', description: 'Pédagogie & explications simples', icon: 'GraduationCap', prompt: 'Tu es un enseignant patient et pédagogue expert. Explique les concepts de façon simple et progressive, utilise des exemples concrets et adapte tes explications pour encourager l\'apprentissage.' },
    { id: 'marketing', name: 'Marketing & SEO', description: 'Accroches publicitaires & SEO', icon: 'TrendingUp', prompt: 'Tu es un spécialiste du marketing digital et du SEO expert. Rédige des accroches percutantes, suggère des mots-clés stratégiques et conseille sur l\'optimisation.' },
    { id: 'finance', name: 'Finance & Calculs', description: 'Finance, bilans & formules de tableur', icon: 'Coins', prompt: 'Tu es un conseiller financier et analyste commercial expert. Aide à la modélisation financière, structure des bilans ou résous des formules de tableur de manière rigoureuse et structurée.' }
  ]

  const route = useRoute()
  const isMock = computed(() => {
    return (route.query && route.query.mock === 'true') || 
      (typeof window !== 'undefined' && (window.location.href.includes('mock=true') || (window as any).__mock_llm))
  })

  function getBestModelForDomain(domainId: string): ModelInfo {
    const ram = deviceMemory.value || 2048
    const hasWebGPU = deviceContext.deviceInfo?.hasWebGPU ?? true
    
    // First, try to find a compatible specialized model for this domain
    const domainModels = models.value.filter(m => 
      m.domains.includes(domainId) && 
      m.ramRequired <= ram &&
      (m.quantization !== 'q4f16' || hasWebGPU || isMock.value)
    )
    
    if (domainModels.length > 0) {
      return domainModels.reduce((best, current) => 
        (current.performanceScore || 0) > (best.performanceScore || 0) ? current : best
      , domainModels[0])
    }
    
    // Fallback to the best compatible general model
    const generalModels = models.value.filter(m => 
      m.domains.includes('general') && 
      m.ramRequired <= ram &&
      (m.quantization !== 'q4f16' || hasWebGPU || isMock.value)
    )
    if (generalModels.length > 0) {
      return generalModels.reduce((best, current) => 
        (current.performanceScore || 0) > (best.performanceScore || 0) ? current : best
      , generalModels[0])
    }
    
    // Absolute fallback
    return models.value[0]
  }

  const compatibleDomains = computed(() => {
    return domains.map(domain => {
      const resolvedModel = getBestModelForDomain(domain.id)
      const isFallback = domain.id !== 'general' && !resolvedModel.domains.includes(domain.id)
      return {
        ...domain,
        resolvedModel,
        isFallback
      }
    })
  })

  // Track if we are in "show all models" mode (e.g. for testing all models)
  const isShowAllModels = computed(() => {
    return typeof window !== 'undefined' && window.location.href.includes('showAllModels=true')
  })

  const currentModel = computed(() => {
    return models.value.find(m => m.id === currentModelId.value)
  })
  const currentModelName = computed(() => {
    return currentModel.value ? currentModel.value.name : 'Unknown'
  })

  // compatibleModels filters models compatible with user's RAM.
  // In standard mode, we only display the best model of each domain.
  // In "show all models" developer/test mode, we return all compatible models.
  const compatibleModels = computed(() => {
    const hasWebGPU = deviceContext.deviceInfo?.hasWebGPU ?? true
    const allCompat = models.value.filter(model => {
      if (deviceMemory.value && deviceMemory.value < model.ramRequired) {
        return false
      }
      if (model.quantization === 'q4f16' && !hasWebGPU && !isMock.value) {
        return false
      }
      return true
    })
    
    if (isShowAllModels.value) {
      return allCompat
    }
    
    // Unique list of resolved models from compatibleDomains
    const bestModelIds = new Set(compatibleDomains.value.map(d => d.resolvedModel.id))
    return allCompat.filter(m => bestModelIds.has(m.id))
  })

  // Watch currentDomain and update currentModelId
  watch([currentDomain, deviceMemory], () => {
    const bestModel = getBestModelForDomain(currentDomain.value)
    if (bestModel && currentModelId.value !== bestModel.id) {
      currentModelId.value = bestModel.id
    }
  }, { immediate: true })

  // Synced: if currentModelId is changed manually, switch currentDomain if current model is not compatible with currentDomain
  watch(currentModelId, (newId) => {
    const model = models.value.find(m => m.id === newId)
    if (model) {
      if (model.domains.includes(currentDomain.value)) {
        return
      }
      if (model.domains.length > 0) {
        currentDomain.value = model.domains[0]
      } else {
        currentDomain.value = 'general'
      }
    }
  })

  async function detectBestModel() {
    if (typeof window === 'undefined') return;

    if (!deviceContext.deviceInfo) {
      await deviceContext.evaluateDevice()
    }
    
    currentDomain.value = 'general'
    const bestModel = getBestModelForDomain('general')
    currentModelId.value = bestModel.id
  }

  function updateModelStatus(id: string, updates: Partial<ModelInfo>) {
    const model = models.value.find(m => m.id === id)
    if (model) {
      Object.assign(model, updates)
    }
  }

  return reactive({
    models,
    domains,
    currentDomain,
    currentModelId,
    currentModel,
    currentModelName,
    isDownloading,
    deviceMemory,
    compatibleModels,
    compatibleDomains,
    updateModelStatus,
    detectBestModel,
    isShowAllModels
  })
}

export type ModelContext = ReturnType<typeof useProvideModel>
export const modelKey: InjectionKey<ModelContext> = Symbol('model')

export function useModel() {
  const context = inject(modelKey)
  if (!context) throw new Error('useModel must be used within a provider')
  return context
}
