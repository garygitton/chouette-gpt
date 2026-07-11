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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- GPU Card -->
        <Card class="relative overflow-hidden rounded-3xl border transition-all duration-500" :class="activeTest === 'webgpu' ? 'border-indigo-500 shadow-xl shadow-indigo-500/20' : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50'">
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
        <Card class="relative overflow-hidden rounded-3xl border transition-all duration-500" :class="activeTest === 'wasm' ? 'border-pink-500 shadow-xl shadow-pink-500/20' : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50'">
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
      <Card v-if="results.webgpu.done && results.wasm.done" class="p-6 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 rounded-3xl animate-in fade-in slide-in-from-bottom-4">
        <h3 class="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-2">
          <Zap class="w-5 h-5" /> Analyse des performances
        </h3>
        <p class="text-emerald-700 dark:text-emerald-300">
          Le GPU (WebGPU) est <strong>{{ (results.webgpu.tokensPerSec / results.wasm.tokensPerSec).toFixed(1) }}x plus rapide</strong> que le CPU (WASM) pour la génération de texte sur ce modèle.
        </p>
      </Card>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Activity, Play, Cpu, Cpu as Microchip, Loader2, Zap } from 'lucide-vue-next'
import { useChat } from '~/contexts/chatContext'

const chatStore = useChat()

const selectedModel = ref('HuggingFaceTB/SmolLM-135M-Instruct')
const isRunning = ref(false)
const activeTest = ref<'webgpu' | 'wasm' | null>(null)

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
  
  isRunning.value = true
  resetResults()
  
  try {
    // 1. Run WebGPU Test
    activeTest.value = 'webgpu'
    const gpuRes = await chatStore.runBenchmark(selectedModel.value, 'webgpu', () => {})
    results.webgpu.warmupMs = gpuRes.warmupMs
    results.webgpu.tokensPerSec = gpuRes.tokensPerSec
    results.webgpu.text = gpuRes.text
    results.webgpu.done = true
    
    // 2. Wait a bit for GC / Cooling
    activeTest.value = null
    await new Promise(r => setTimeout(r, 2000))
    
    // 3. Run WASM Test
    activeTest.value = 'wasm'
    const wasmRes = await chatStore.runBenchmark(selectedModel.value, 'wasm', () => {})
    results.wasm.warmupMs = wasmRes.warmupMs
    results.wasm.tokensPerSec = wasmRes.tokensPerSec
    results.wasm.text = wasmRes.text
    results.wasm.done = true
    
  } catch (err) {
    console.error('Benchmark failed', err)
    alert('Le test a échoué. Regardez la console pour plus de détails.')
  } finally {
    activeTest.value = null
    isRunning.value = false
  }
}
</script>
