<template>
  <div class="h-full flex flex-col items-center justify-center py-10 px-4 md:px-8 bg-slate-50 dark:bg-[#070a12] overflow-y-auto">
    <div class="max-w-4xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Activity class="w-10 h-10 text-indigo-500" />
          Benchmark <span class="ui-title-gradient">{{ t('bench_title') }}</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {{ t('bench_subtitle') }}
        </p>
      </div>

      <!-- Controls -->
      <Card class="p-6 bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
        <div class="flex flex-col md:flex-row gap-4 items-end">
          <div class="flex-1 w-full space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ t('bench_model_label') }}</label>
            <Select v-model="selectedModel" :disabled="isRunning">
              <SelectTrigger class="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl">
                <SelectValue :placeholder="t('bench_model_placeholder')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="model in modelStore.models" :key="model.id" :value="model.id">
                  {{ model.name }} ({{ model.totalSize }})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex-1 w-full space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ t('bench_engine_label') }}</label>
            <Select v-model="selectedEngine" :disabled="isRunning">
              <SelectTrigger class="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl">
                <SelectValue :placeholder="t('bench_engine_placeholder')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both" :disabled="!hasWebGPU">{{ t('bench_engine_both') }}</SelectItem>
                <SelectItem value="webgpu" :disabled="!hasWebGPU">{{ t('bench_engine_gpu') }}</SelectItem>
                <SelectItem value="wasm">{{ t('bench_engine_cpu') }}</SelectItem>
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
            {{ isRunning ? t('bench_running') : t('bench_start') }}
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
              <Badge v-if="activeTest === 'webgpu'" class="bg-indigo-500 animate-pulse">{{ t('bench_in_progress') }}</Badge>
              <Badge v-else-if="results.webgpu.done" class="bg-green-500">{{ t('bench_done') }}</Badge>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-500 uppercase">{{ t('bench_tokens_sec') }}</p>
                <p class="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{{ results.webgpu.tokensPerSec.toFixed(1) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-500 uppercase">{{ t('bench_init_time') }}</p>
                <p class="text-xl font-bold text-slate-700 dark:text-slate-300 font-mono">{{ (results.webgpu.warmupMs / 1000).toFixed(2) }}s</p>
              </div>
            </div>
            
            <div class="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 p-3 rounded-xl h-24 overflow-y-auto font-mono text-[10px]">
              {{ results.webgpu.text || (activeTest === 'webgpu' ? chatStore.engineProgress.text : t('bench_waiting')) }}
            </div>

            <!-- WebGPU unavailable banner -->
            <div v-if="!hasWebGPU" class="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
              <span class="text-amber-500 mt-0.5 flex-shrink-0">⚠️</span>
              <div>
                <p class="font-bold text-amber-800 dark:text-amber-300">{{ t('bench_no_webgpu_title') }}</p>
                <p class="text-amber-700 dark:text-amber-400 mt-0.5">{{ t('bench_no_webgpu_desc') }}</p>
              </div>
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
              <Badge v-if="activeTest === 'wasm'" class="bg-pink-500 animate-pulse">{{ t('bench_in_progress') }}</Badge>
              <Badge v-else-if="results.wasm.done" class="bg-green-500">{{ t('bench_done') }}</Badge>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-500 uppercase">{{ t('bench_tokens_sec') }}</p>
                <p class="text-3xl font-black text-pink-600 dark:text-pink-400 font-mono">{{ results.wasm.tokensPerSec.toFixed(1) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-500 uppercase">{{ t('bench_init_time') }}</p>
                <p class="text-xl font-bold text-slate-700 dark:text-slate-300 font-mono">{{ (results.wasm.warmupMs / 1000).toFixed(2) }}s</p>
              </div>
            </div>
            
            <div class="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 p-3 rounded-xl h-24 overflow-y-auto font-mono text-[10px]">
              {{ results.wasm.text || (activeTest === 'wasm' ? chatStore.engineProgress.text : t('bench_waiting')) }}
            </div>
          </div>
        </Card>

      </div>
      
      <!-- Analysis / Comparison & Share Panel -->
      <div v-if="selectedEngine === 'both' && results.webgpu.done && results.wasm.done" class="space-y-6">
        <Card class="p-6 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 rounded-3xl animate-in fade-in slide-in-from-bottom-4">
          <h3 class="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-2">
            <Zap class="w-5 h-5" /> {{ t('bench_analysis_title') }}
          </h3>
          <p class="text-emerald-700 dark:text-emerald-300">
            {{ t('bench_analysis_desc_gpu') }}<strong>{{ (results.webgpu.tokensPerSec / results.wasm.tokensPerSec).toFixed(1) }}{{ t('bench_analysis_desc_faster') }}</strong>{{ t('bench_analysis_desc_cpu') }}
          </p>
        </Card>

        <!-- Social Share Buttons -->
        <div class="flex flex-wrap gap-4 justify-center py-2">
          <Button @click="shareBenchmarkTwitter" class="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/15 h-11 px-6">
            <Twitter class="w-4 h-4 mr-2 fill-white" /> Partager mon score sur X
          </Button>
          <Button @click="downloadBenchmarkBadge" variant="outline" class="rounded-xl border-indigo-300 dark:border-indigo-800 hover:bg-indigo-100/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold h-11 px-6 bg-white dark:bg-transparent">
            <Download class="w-4 h-4 mr-2" /> Télécharger mon badge PNG
          </Button>
        </div>
      </div>
      
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
              {{ t('bench_dialog_title') }}
            </DialogTitle>
            <DialogDescription class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {{ t('bench_dialog_desc') }}
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
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('bench_ai_size') }}</p>
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
                <p class="font-bold text-slate-800 dark:text-slate-200">{{ t('bench_secure_test') }}</p>
                <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  {{ t('bench_secure_desc') }}
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3 text-xs">
              <div class="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                <Wifi class="w-4 h-4" />
              </div>
              <div>
                <p class="font-bold text-slate-800 dark:text-slate-200">{{ t('bench_wifi_req') }}</p>
                <p class="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  {{ t('bench_wifi_desc_1') }}{{ selectedModelSize }}{{ t('bench_wifi_desc_2') }}
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
import { ref, reactive, computed, onMounted } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Activity, Play, Cpu, Cpu as Microchip, Loader2, Zap, ShieldCheck, Wifi, Twitter, Download } from 'lucide-vue-next'
import { useChat } from '~/contexts/chatContext'
import { useI18n } from '~/composables/useI18n'
import { useModel } from '~/contexts/modelContext'

const chatStore = useChat()
const modelStore = useModel()
const { t } = useI18n()

// WebGPU availability detection (lightweight, no full adapter request)
const hasWebGPU = ref(false)
onMounted(async () => {
  if ('gpu' in navigator) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter()
      hasWebGPU.value = !!adapter
    } catch {
      hasWebGPU.value = false
    }
  }
  // Auto-select CPU-only mode when WebGPU is unavailable
  if (!hasWebGPU.value && selectedEngine.value !== 'wasm') {
    selectedEngine.value = 'wasm'
  }
})

const selectedModel = ref('onnx-community/SmolLM2-135M-Instruct-ONNX-MHA')
const selectedEngine = ref<'both' | 'webgpu' | 'wasm'>('both')
const isRunning = ref(false)
const activeTest = ref<'webgpu' | 'wasm' | null>(null)
const showBenchmarkConfirm = ref(false)

const selectedModelName = computed(() => {
  const model = modelStore.models.find(m => m.id === selectedModel.value)
  return model ? model.name : selectedModel.value
})

const selectedModelSize = computed(() => {
  const model = modelStore.models.find(m => m.id === selectedModel.value)
  return model ? model.totalSize : t('bench_unknown')
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
    alert(t('bench_fail'))
  } finally {
    activeTest.value = null
    isRunning.value = false
  }
}

function shareBenchmarkTwitter() {
  const model = selectedModelName.value
  const gpuScore = results.webgpu.tokensPerSec.toFixed(1)
  const multiplier = (results.webgpu.tokensPerSec / results.wasm.tokensPerSec).toFixed(1)
  const text = `Mon navigateur fait tourner localement l'IA à ${gpuScore} tok/s (${model}) grâce à WebGPU sur ChouetteGPT ! Le GPU est ${multiplier}x plus rapide que le CPU. Calculez votre score :`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://github.com/garygitton/chouette-gpt')}`
  window.open(url, '_blank')
}

function downloadBenchmarkBadge() {
  const canvas = document.createElement('canvas')
  canvas.width = 1000
  canvas.height = 600
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 1. Gradient Background
  const grad = ctx.createLinearGradient(0, 0, 1000, 600)
  grad.addColorStop(0, '#0b0f19') // slate-950
  grad.addColorStop(1, '#1e1b4b') // indigo-950
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1000, 600)

  // 2. Inner border decoration
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.roundRect(30, 30, 940, 540, 24)
  ctx.stroke()

  // Reset shadow
  ctx.shadowColor = 'transparent'

  // 3. Score display
  // Header watermark
  ctx.fillStyle = '#a5b4fc' // indigo-300
  ctx.font = '900 16px sans-serif'
  ctx.fillText('⚡ CHOUETTE GPT • BANC D\'ESSAI PERFORMANCE', 80, 90)

  // Model Name
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px sans-serif'
  ctx.fillText(selectedModelName.value, 80, 160)

  // GPU Tokens/s
  ctx.fillStyle = '#6366f1' // Indigo-500
  ctx.font = '900 96px sans-serif'
  const gpuScore = results.webgpu.tokensPerSec.toFixed(1)
  ctx.fillText(gpuScore, 80, 290)
  
  ctx.fillStyle = '#a5b4fc' // Light indigo
  ctx.font = 'bold 20px sans-serif'
  ctx.fillText('tok/s (WebGPU GPU)', 85 + ctx.measureText(gpuScore).width + 10, 240)

  // CPU Tokens/s
  ctx.fillStyle = '#ec4899' // Pink-500
  ctx.font = '900 48px sans-serif'
  const cpuScore = results.wasm.tokensPerSec.toFixed(1)
  ctx.fillText(cpuScore, 80, 390)

  ctx.fillStyle = '#fbcfe8' // Light pink
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText('tok/s (WASM CPU)', 85 + ctx.measureText(cpuScore).width + 10, 370)

  // Performance multiplier
  ctx.fillStyle = '#10b981' // Emerald-500
  ctx.font = 'bold 24px sans-serif'
  const multiplier = (results.webgpu.tokensPerSec / results.wasm.tokensPerSec).toFixed(1)
  ctx.fillText(`⚡ Le GPU (WebGPU) est ${multiplier}x plus rapide que le CPU !`, 80, 465)

  // Footer link
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.font = 'bold 16px monospace'
  ctx.fillText('chouette-gpt.localhost', 80, 525)

  // Trigger download
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `chouettegpt_benchmark_${selectedModelName.value.replace(/\s+/g, '_')}_score.png`
  link.click()
}
</script>
