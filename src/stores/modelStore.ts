import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRoute } from '#imports'
import type { ModelInfo } from '~/types'
import { ModelStatus } from '~/domain/model/ModelStatus'
import { useDeviceStore } from './deviceStore'

export const useModelStore = defineStore('model', () => {
  const deviceStore = useDeviceStore()

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
      ramRequired: 1024,
      performanceScore: 45,
      description: 'Rapide & polyvalent',
      domains: ['small', 'general']
    },
    {
      id: 'onnx-community/Qwen2.5-Coder-0.5B-Instruct',
      name: 'Qwen2.5-Coder-0.5B-Instruct',
      version: '2.5',
      parameters: '0.5B',
      totalSize: '350 MB',
      quantization: 'q4',
      estimatedMemory: '600 MB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 1024,
      performanceScore: 50,
      description: 'Ultra-rapide pour le code',
      domains: ['code']
    },
    {
      id: 'onnx-community/SmolLM2-360M-Instruct',
      name: 'SmolLM2-360M-Instruct',
      version: '2.0',
      parameters: '0.36B',
      totalSize: '200 MB',
      quantization: 'q4',
      estimatedMemory: '400 MB',
      usageCount: 0,
      status: ModelStatus.Available,
      ramRequired: 1024,
      performanceScore: 40,
      description: 'Ultra-léger & économe',
      domains: ['small']
    }
  ])

  const currentModelId = ref<string>('onnx-community/Qwen2.5-0.5B-Instruct')
  const currentDomain = ref<string>('small')
  const isDownloading = ref(false)
  const deviceMemory = computed(() => deviceStore.deviceInfo ? deviceStore.deviceInfo.ramGB * 1024 : null)

  const isExtension = computed(() => {
    return typeof window !== 'undefined' && 
      !!((window as any).chrome && (window as any).chrome.runtime && (window as any).chrome.runtime.id)
  })

  const domains = [
    { id: 'small', name: 'Petit / Léger', description: 'Rapide & économe (~500 MB)', icon: 'Zap', prompt: '' },
    { id: 'general', name: 'Général', description: 'Polyvalent & créatif', icon: 'Cpu', prompt: '' },
    { id: 'maths', name: 'Mathématiques', description: 'Résolution de problèmes', icon: 'Calculator', prompt: 'Tu es un assistant expert en mathématiques. Résous les problèmes étape par étape avec précision, clarté et rigueur.' },
    { id: 'code', name: 'Développement', description: 'Écriture & analyse de code', icon: 'Code2', prompt: 'Tu es un développeur et architecte logiciel expert. Écris du code propre, performant, sécurisé et bien commenté.' },
    { id: 'medicine', name: 'Médecine', description: 'Diagnostic & concepts médicaux', icon: 'Stethoscope', prompt: 'Tu es un assistant virtuel médical expert. Explique les concepts médicaux clairement, propose des pistes diagnostiques basées sur les symptômes, et rappelle toujours de consulter un médecin.' },
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
    const hasWebGPU = deviceStore.deviceInfo?.hasWebGPU ?? true
    
    // First, try to find a compatible specialized model for this domain
    const domainModels = models.value.filter(m => 
      m.domains.includes(domainId) && 
      (m.ramRequired <= ram) &&
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
      (m.ramRequired <= ram) &&
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
    // Only display domains backed by an explicit model in the catalog
    const activeDomainIds = new Set(models.value.flatMap(m => m.domains))
    return domains
      .filter(domain => activeDomainIds.has(domain.id))
      .map(domain => {
        const resolvedModel = getBestModelForDomain(domain.id)
        const isFallback = domain.id !== 'general' && !resolvedModel.domains.includes(domain.id)
        return {
          ...domain,
          resolvedModel,
          isFallback
        }
      })
  })

  const isShowAllModels = computed(() => {
    return typeof window !== 'undefined' && window.location.href.includes('showAllModels=true')
  })

  const currentModel = computed(() => {
    return models.value.find(m => m.id === currentModelId.value)
  })
  const currentModelName = computed(() => {
    return currentModel.value ? currentModel.value.name : 'Unknown'
  })

  const compatibleModels = computed(() => {
    const hasWebGPU = deviceStore.deviceInfo?.hasWebGPU ?? true
    const allCompat = models.value.filter(model => {
      // Native models only allowed in extension environment
      if (model.isNative && !isExtension.value) {
        return false
      }
      // Bypass memory checks for native models since execution is offloaded
      if (!model.isNative && deviceMemory.value && deviceMemory.value < model.ramRequired) {
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
    
    const bestModelIds = new Set(compatibleDomains.value.map(d => d.resolvedModel.id))
    return allCompat.filter(m => bestModelIds.has(m.id))
  })

  watch(currentDomain, () => {
    // In developer/test mode, the domain selector is hidden, so domain changes are
    // only side-effects of model selection. We should not auto-select models here.
    if (isShowAllModels.value) return

    // Do not auto-select if the current model is already valid for the new domain
    const currentModel = models.value.find(m => m.id === currentModelId.value)
    if (currentModel && currentModel.domains.includes(currentDomain.value)) {
      return
    }

    const bestModel = getBestModelForDomain(currentDomain.value)
    if (bestModel && currentModelId.value !== bestModel.id) {
      currentModelId.value = bestModel.id
    }
  }, { immediate: true })

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

  const isInitialized = ref(false)

  async function detectBestModel() {
    if (typeof window === 'undefined') return;

    try {
      if (!deviceStore.deviceInfo) {
        await deviceStore.evaluateDevice()
      }
      
      // Do not override if the user already interacted with the model selection
      // while the device evaluation was running in the background.
      if (currentModelId.value !== models.value[0].id) {
        return
      }

      currentDomain.value = 'small'
      const bestModel = getBestModelForDomain('small')
      currentModelId.value = bestModel.id
    } finally {
      isInitialized.value = true
    }
  }

  function updateModelStatus(id: string, updates: Partial<ModelInfo>) {
    const model = models.value.find(m => m.id === id)
    if (model) {
      Object.assign(model, updates)
    }
  }

  return {
    models,
    domains,
    currentDomain,
    currentModelId,
    currentModel,
    currentModelName,
    isDownloading,
    deviceMemory,
    isExtension,
    compatibleModels,
    compatibleDomains,
    updateModelStatus,
    detectBestModel,
    isShowAllModels,
    isInitialized
  }
})
