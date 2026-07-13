<template>
  <div class="h-full flex flex-col items-center justify-center py-10 px-4 md:px-8 bg-slate-50 dark:bg-[#070a12] overflow-y-auto">
    <div class="max-w-4xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Activity class="w-10 h-10 text-indigo-500" />
          Benchmark <span class="ui-title-gradient">Hardware</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Ce banc d'essai permet de torturer votre machine en mesurant les performances d'inférence en temps réel entre votre processeur (WASM) et votre carte graphique (WebGPU).
        </p>
      </div>

      <!-- Controls -->
      <Card class="p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
        <div class="flex flex-col md:flex-row gap-4 items-end">
          <div class="flex-1 w-full space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Modèle de Test</label>
            <Select v-model="selectedModel" :disabled="isRunning">
              <SelectTrigger class="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl">
                <SelectValue placeholder="Choisir un modèle..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HuggingFaceTB/SmolLM-135M-Instruct">SmolLM-135M-Instruct (Très Rapide)</SelectItem>
                <SelectItem value="Xenova/Qwen1.5-0.5B-Chat">Qwen1.5-0.5B-Chat (Rapide)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex-1 w-full space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Moteur de Test</label>
            <Select v-model="selectedEngine" :disabled="isRunning">
              <SelectTrigger class="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl">
                <SelectValue placeholder="Choisir le moteur..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Les deux (Comparaison)</SelectItem>
                <SelectItem value="webgpu">GPU uniquement (WebGPU)</SelectItem>
                <SelectItem value="wasm">CPU uniquement (WASM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            @click="runFullBenchmark" 
            :disabled="isRunning || !selectedModel"
            class="h-12 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 w-full md:w-auto font-bold"
          >
            <Play class="w-5 h-5 mr-2" v-if="!isRunning" />
            <Loader2 class="w-5 h-5 mr-2 animate-spin" v-else />
            {{ isRunning ? 'Test en cours...' : 'Lancer le Stress Test' }}
          </Button>
        </div>
      </Card>

      <!-- Results Grid -->
      <div class="grid grid-cols-1 gap-6" :class="selectedEngine === 'both' ? 'md:grid-cols-2' : ''">
        
        <!-- GPU Card -->
        <Card v-if="selectedEngine === 'both' || selectedEngine === 'webgpu'" class="relative overflow-hidden rounded-3xl border transition-all duration-500" :class="activeTest === 'webgpu' ? 'border-indigo-500 shadow-xl shadow-indigo-500/20' : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50'">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
          <div class="p-6 relative z-10 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Cpu class="w-6 h-6 text-indigo-500" /> GPU (WebGPU)
              </h3>
              <Badge v-if="activeTest === 'webgpu'" class="bg-indigo-500 animate-pulse">En cours</Badge>
              <Badge v-else-if="results.webgpu.done" class="bg-green-500">Terminé</Badge>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-500 uppercase">Tokens / Sec</p>
                <p class="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{{ results.webgpu.tokensPerSec.toFixed(1) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-500 uppercase">Temps d'Init.</p>
                <p class="text-xl font-bold text-slate-700 dark:text-slate-300 font-mono">{{ (results.webgpu.warmupMs / 1000).toFixed(2) }}s</p>
              </div>
            </div>
            
            <div class="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 p-3 rounded-xl h-24 overflow-y-auto font-mono text-[10px]">
              {{ results.webgpu.text || (activeTest === 'webgpu' ? chatStore.engineProgress.text : 'En attente...') }}
            </div>
          </div>
        </Card>

        <!-- CPU Card -->
        <Card v-if="selectedEngine === 'both' || selectedEngine === 'wasm'" class="relative overflow-hidden rounded-3xl border transition-all duration-500" :class="activeTest === 'wasm' ? 'border-pink-500 shadow-xl shadow-pink-500/20' : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50'">
          <div class="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-orange-500/5 pointer-events-none"></div>
          <div class="p-6 relative z-10 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Microchip class="w-6 h-6 text-pink-500" /> CPU (WASM)
              </h3>
              <Badge v-if="activeTest === 'wasm'" class="bg-pink-500 animate-pulse">En cours</Badge>
              <Badge v-else-if="results.wasm.done" class="bg-green-500">Terminé</Badge>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-500 uppercase">Tokens / Sec</p>
                <p class="text-3xl font-black text-pink-600 dark:text-pink-400 font-mono">{{ results.wasm.tokensPerSec.toFixed(1) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-500 uppercase">Temps d'Init.</p>
                <p class="text-xl font-bold text-slate-700 dark:text-slate-300 font-mono">{{ (results.wasm.warmupMs / 1000).toFixed(2) }}s</p>
              </div>
            </div>
            
            <div class="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 p-3 rounded-xl h-24 overflow-y-auto font-mono text-[10px]">
              {{ results.wasm.text || (activeTest === 'wasm' ? chatStore.engineProgress.text : 'En attente...') }}
            </div>
          </div>
        </Card>

      </div>
      
      <!-- Analysis / Comparison -->
      <Card v-if="selectedEngine === 'both' && results.webgpu.done && results.wasm.done" class="p-6 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 rounded-3xl animate-in fade-in slide-in-from-bottom-4">
        <h3 class="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-2">
          <Zap class="w-5 h-5" /> Analyse des performances
        </h3>
        <p class="text-emerald-700 dark:text-emerald-300">
          Le GPU (WebGPU) est <strong>{{ (results.webgpu.tokensPerSec / results.wasm.tokensPerSec).toFixed(1) }}x plus rapide</strong> que le CPU (WASM) pour la génération de texte sur ce modèle.
        </p>
      </Card>
      
    </div>

    <!-- Reassuring Benchmark Consent Dialog -->
    <Dialog :open="showBenchmarkConfirm" @update:open="showBenchmarkConfirm = $event">
      <DialogContent class="sm:max-w-[450px] bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6">
        <DialogHeader class="space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Activity class="w-6 h-6" />
          </div>
          <div>
            <DialogTitle class="text-xl font-bold text-slate-900 dark:text-white">
              Autoriser le test de performance ?
            </DialogTitle>
            <DialogDescription class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pour mesurer les performances, ChouetteGPT doit charger un modèle de test.
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div class="py-4 space-y-4">
          <!-- Model Info Card -->
          <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Modèle de test</p>
              <p class="text-sm font-bold text-slate-800 dark:text-slate-200">
                {{ selectedModelName }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Taille de l'IA</p>
              <Badge class="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 font-mono font-bold mt-0.5">
                {{ selectedModelSize }}
              </Badge>
            </div>
          </div>
          
          <!-- Reassurance Bullet Points -->
          <div class="space-y-3.5 pt-2">
            <div class="flex items-start space-x-3 text-xs">
              <div class="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
                <ShieldCheck class="w-4 h-4" />
              </div>
              <div>
                <p class="font-bold text-slate-800 dark:text-slate-200">Test local & sécurisé</p>
                <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Le calcul s'effectue entièrement sur votre matériel (CPU/GPU) via votre navigateur. Aucune donnée n'est collectée.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3 text-xs">
              <div class="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                <Wifi class="w-4 h-4" />
              </div>
              <div>
                <p class="font-bold text-slate-800 dark:text-slate-200">Connexion internet requise</p>
                <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Si le modèle de test ({{ selectedModelSize }}) n'est pas dans votre cache, il sera téléchargé. Nous vous recommandons d'utiliser le Wi-Fi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="grid grid-cols-2 gap-3 sm:space-x-0 pt-2">
          <Button variant="outline" @click="showBenchmarkConfirm = false" class="rounded-xl border-slate-200 dark:border-slate-800 h-11 text-xs font-semibold">
            Annuler
          </Button>
          <Button @click="startBenchmarkAfterConfirm" class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 text-xs font-bold shadow-lg shadow-indigo-500/20">
            Autoriser et Démarrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Activity, Play, Cpu, Cpu as Microchip, Loader2, Zap, ShieldCheck, Wifi } from 'lucide-vue-next'
import { useChat } from '~/contexts/chatContext'

const chatStore = useChat()

const selectedModel = ref('HuggingFaceTB/SmolLM-135M-Instruct')
const selectedEngine = ref<'both' | 'webgpu' | 'wasm'>('both')
const isRunning = ref(false)
const activeTest = ref<'webgpu' | 'wasm' | null>(null)
const showBenchmarkConfirm = ref(false)

const selectedModelName = computed(() => {
  if (selectedModel.value === 'HuggingFaceTB/SmolLM-135M-Instruct') return 'SmolLM-135M-Instruct'
  if (selectedModel.value === 'Xenova/Qwen1.5-0.5B-Chat') return 'Qwen1.5-0.5B-Chat'
  return selectedModel.value
})

const selectedModelSize = computed(() => {
  if (selectedModel.value === 'HuggingFaceTB/SmolLM-135M-Instruct') return '150 MB'
  if (selectedModel.value === 'Xenova/Qwen1.5-0.5B-Chat') return '350 MB'
  return 'Inconnue'
})

const results = reactive({
  webgpu: {
    tokensPerSec: 0,
    warmupMs: 0,
    text: '',
    done: false
  },
  wasm: {
    tokensPerSec: 0,
    warmupMs: 0,
    text: '',
    done: false
  }
})

function resetResults() {
  results.webgpu = { tokensPerSec: 0, warmupMs: 0, text: '', done: false }
  results.wasm = { tokensPerSec: 0, warmupMs: 0, text: '', done: false }
}

async function runFullBenchmark() {
  if (!selectedModel.value || isRunning.value) return
  
  // Check cache before starting
  const isCached = await chatStore.isModelCached(selectedModel.value)
  if (!isCached) {
    showBenchmarkConfirm.value = true
  } else {
    await executeBenchmark()
  }
}

async function startBenchmarkAfterConfirm() {
  showBenchmarkConfirm.value = false
  await executeBenchmark()
}

async function executeBenchmark() {
  isRunning.value = true
  resetResults()
  
  try {
    const runGpu = selectedEngine.value === 'both' || selectedEngine.value === 'webgpu'
    const runCpu = selectedEngine.value === 'both' || selectedEngine.value === 'wasm'

    if (runGpu) {
      // 1. Run WebGPU Test
      activeTest.value = 'webgpu'
      const gpuRes = await chatStore.runBenchmark(selectedModel.value, 'webgpu', () => {})
      results.webgpu.warmupMs = gpuRes.warmupMs
      results.webgpu.tokensPerSec = gpuRes.tokensPerSec
      results.webgpu.text = gpuRes.text
      results.webgpu.done = true
    }
    
    if (runGpu && runCpu) {
      // 2. Wait a bit for GC / Cooling
      activeTest.value = null
      await new Promise(r => setTimeout(r, 2000))
    }
    
    if (runCpu) {
      // 3. Run WASM Test
      activeTest.value = 'wasm'
      const wasmRes = await chatStore.runBenchmark(selectedModel.value, 'wasm', () => {})
      results.wasm.warmupMs = wasmRes.warmupMs
      results.wasm.tokensPerSec = wasmRes.tokensPerSec
      results.wasm.text = wasmRes.text
      results.wasm.done = true
    }
    
  } catch (err) {
    console.error('Benchmark failed', err)
    alert('Le test a échoué. Regardez la console pour plus de détails.')
  } finally {
    activeTest.value = null
    isRunning.value = false
  }
}
</script>
