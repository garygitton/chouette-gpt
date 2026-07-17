<template>
  <div 
    class="w-full flex ui-message-slide-in" 
    :class="[message.role === 'user' ? 'justify-end' : 'justify-start']"
    data-testid="chat-message"
    :data-role="message.role"
  >
    <div 
      class="flex items-start space-x-3.5 max-w-[85%] md:max-w-[78%]"
      :class="[message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row']"
    >
      <!-- Avatar -->
      <div class="relative flex-shrink-0">
        <Avatar class="w-9 h-9 rounded-xl shadow-md transition-all duration-300">
          <AvatarFallback
            class="text-white"
            :class="[
              message.role === 'user' 
                ? 'bg-slate-700 dark:bg-slate-800 rounded-xl' 
                : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl'
            ]"
          >
            <User v-if="message.role === 'user'" class="w-5 h-5" />
            <Zap v-else class="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        
        <!-- Active generation indicator for assistant -->
        <span 
          v-if="message.role === 'assistant' && chatStore.isGenerating && isLastMessage"
          class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#070a12] rounded-full animate-ping"
        />
        <span 
          v-if="message.role === 'assistant' && chatStore.isGenerating && isLastMessage"
          class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#070a12] rounded-full"
        />
      </div>
      
      <!-- Content & Bubble container -->
      <div class="space-y-1.5 flex-1 min-w-0">
        <!-- Floating bubble -->
        <div 
          class="relative group rounded-2xl px-5 py-3.5 text-sm transition-all"
          :class="[
            message.role === 'user' 
              ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 text-white rounded-tr-none shadow-md shadow-indigo-500/10 border border-indigo-500/15' 
              : 'bg-white/90 dark:bg-[#0d1222]/40 border border-slate-200/50 dark:border-slate-800/40 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm backdrop-blur-xl'
          ]"
        >
          <!-- Message text -->
          <div class="leading-relaxed break-words" data-testid="message-text">
            <div v-if="message.role === 'user'" class="whitespace-pre-wrap font-normal">{{ message.content }}</div>
            <MarkdownRenderer 
              v-else 
              :content="message.content || '...'" 
              class="prose max-w-none dark:prose-invert text-slate-800 dark:text-slate-200" 
              :class="[message.role === 'assistant' && chatStore.isGenerating && isLastMessage ? 'ui-typing-cursor' : '']"
            />
          </div>

          <div
            v-if="message.content"
            class="absolute -bottom-4 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700 rounded-lg shadow-md flex items-center p-0.5 z-10 gap-0.5"
          >
            <Button 
              size="icon"
              variant="ghost"
              class="rounded-md h-6 w-6"
              title="Copier le message"
              @click="copyContent"
            >
              <Check v-if="copied" class="w-3.5 h-3.5" />
              <Clipboard v-else class="w-3.5 h-3.5" />
            </Button>
            <Button 
              v-if="message.role === 'assistant'"
              size="icon"
              variant="ghost"
              class="rounded-md h-6 w-6 text-slate-400 hover:text-indigo-500"
              title="Partager cette conversation"
              @click="isShareDialogOpen = true"
            >
              <Share2 class="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <!-- Optional Timestamp / Meta info -->
        <div 
          class="text-[9px] font-bold text-slate-400 dark:text-slate-500 px-1 mt-1 flex items-center gap-2"
          :class="[message.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <span v-if="message.role === 'assistant' && modelName" class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-slate-500 border border-slate-200/50 dark:border-slate-700/50">{{ modelName }}</span>
          <span>{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
    </div>

    <!-- Ray.so Style Share Dialog -->
    <Dialog :open="isShareDialogOpen" @update:open="isShareDialogOpen = $event">
      <DialogContent class="sm:max-w-[480px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
        <DialogHeader class="mb-2">
          <DialogTitle class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 class="w-4 h-4 text-indigo-500" /> Partager la conversation
          </DialogTitle>
        </DialogHeader>

        <!-- Preview Card -->
        <div class="py-2 space-y-3">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aperçu du visuel (Ray.so Style)</div>
          
          <div id="ray-share-card" class="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col justify-between aspect-[1.5] shadow-lg text-left select-none text-white border border-white/10">
            <div class="space-y-4 overflow-hidden flex-1 flex flex-col">
              <!-- Watermark Header -->
              <div class="text-[10px] font-black opacity-60 tracking-widest flex items-center gap-1">
                <Zap class="w-3 h-3 text-yellow-300" /> CHOUETTE GPT • IA WEBGPU
              </div>
              
              <!-- Question -->
              <div v-if="precedingUserMessage" class="text-xs font-bold opacity-90 italic line-clamp-2">
                Q: "{{ precedingUserMessage.content }}"
              </div>
              
              <!-- Answer -->
              <div class="text-[10px] opacity-95 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-white/5 backdrop-blur-md overflow-y-auto whitespace-pre-wrap font-mono flex-1 min-h-0">
                {{ cleanMarkdown(message.content) }}
              </div>
            </div>
            
            <div class="text-[9px] font-bold opacity-50 text-right pt-2 border-t border-white/5 mt-2">
              chouette-gpt.localhost
            </div>
          </div>
        </div>

        <DialogFooter class="grid grid-cols-2 gap-3 sm:space-x-0 pt-4">
          <Button class="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/15 h-10" @click="shareTwitter">
            <Twitter class="w-4 h-4 mr-1.5 fill-white" /> Partager sur X
          </Button>
          <Button class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 h-10" @click="downloadSharePNG">
            <Download class="w-4 h-4 mr-1.5" /> Télécharger PNG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from '#imports'
import { ref, computed, defineAsyncComponent } from 'vue'
import type { Message } from '~/types'
import { useChatStore } from '~/stores/chatStore'
import { useConversationStore } from '~/stores/conversationStore'
import { useModelStore } from '~/stores/modelStore'
import { useDeviceStore } from '~/stores/deviceStore'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'
import { User, Zap, Check, Clipboard, Share2, Twitter, Download } from 'lucide-vue-next'

const MarkdownRenderer = defineAsyncComponent(() => import('~/components/MarkdownRenderer.vue'))

const props = defineProps<{ message: Message }>()

const chatStore = useChatStore()
const convStore = useConversationStore()
const route = useRoute()
const deviceStore = useDeviceStore()

const copied = ref(false)
const isShareDialogOpen = ref(false)

const currentConversation = computed(() => {
  return convStore.conversations.find(c => c.id === route.query.id)
})

const modelStore = useModelStore()
const modelName = computed(() => {
  if (!currentConversation.value) return null
  const modelId = currentConversation.value.modelId
  const model = modelStore.models.find(m => m.id === modelId)
  const engine = deviceStore.deviceInfo?.hasWebGPU ? 'GPU' : 'CPU'
  return model ? `${model.name} (${engine})` : modelId
})

const isLastMessage = computed(() => {
  if (!currentConversation.value) return false
  const msgs = currentConversation.value.messages
  return msgs.length > 0 && msgs[msgs.length - 1].id === props.message.id
})

const precedingUserMessage = computed(() => {
  if (props.message.role !== 'assistant' || !currentConversation.value) return null
  const msgs = currentConversation.value.messages
  const idx = msgs.findIndex(m => m.id === props.message.id)
  if (idx > 0 && msgs[idx - 1].role === 'user') {
    return msgs[idx - 1]
  }
  return null
})

function copyContent() {
  navigator.clipboard.writeText(props.message.content)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function cleanMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/[\*\_`#]/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // remove markdown links
}

function formatTime(timestamp: number): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(/\s+/)
  let line = ''
  let currentY = y

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY)
      line = words[n] + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, currentY)
  return currentY + lineHeight
}

function downloadSharePNG() {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 1. Draw gradient background
  const grad = ctx.createLinearGradient(0, 0, 1200, 800)
  grad.addColorStop(0, '#6366f1') // indigo-500
  grad.addColorStop(0.5, '#a855f7') // purple-500
  grad.addColorStop(1, '#ec4899') // pink-500
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1200, 800)

  // 2. Draw card container (Ray.so style) with rounded corners and drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 20

  ctx.fillStyle = '#0b0f19' // slate-950 dark background for the card
  const rx = 120, ry = 100, rw = 960, rh = 600, radius = 24
  ctx.beginPath()
  ctx.moveTo(rx + radius, ry)
  ctx.lineTo(rx + rw - radius, ry)
  ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius)
  ctx.lineTo(rx + rw, ry + rh - radius)
  ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh)
  ctx.lineTo(rx + radius, ry + rh)
  ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius)
  ctx.lineTo(rx, ry + radius)
  ctx.quadraticCurveTo(rx, ry, rx + radius, ry)
  ctx.closePath()
  ctx.fill()

  // Reset shadow for text drawing
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  // 3. Draw Watermark Header
  ctx.fillStyle = '#fbbf24' // amber-400
  ctx.font = '900 16px sans-serif'
  ctx.fillText('⚡ CHOUETTE GPT • IA WEBGPU 100% LOCALE', rx + 50, ry + 50)

  // 4. Draw Question
  ctx.fillStyle = '#e2e8f0' // slate-200
  ctx.font = 'italic bold 24px sans-serif'
  const userText = precedingUserMessage.value 
    ? `Q: "${precedingUserMessage.value.content}"` 
    : `Q: "${props.message.content}"`
  let currentY = ry + 110
  currentY = wrapText(ctx, userText, rx + 50, currentY, 860, 34)

  // 5. Draw Separator Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(rx + 50, currentY + 15)
  ctx.lineTo(rx + rw - 50, currentY + 15)
  ctx.stroke()

  // 6. Draw AI Answer inside bubble
  currentY += 50
  ctx.fillStyle = 'rgba(15, 23, 42, 0.5)' // semi-transparent wrapper
  ctx.beginPath()
  ctx.roundRect(rx + 50, currentY - 25, rw - 100, rh - (currentY - ry) - 60, 16)
  ctx.fill()

  ctx.fillStyle = '#f8fafc' // slate-50
  ctx.font = 'normal 18px monospace'
  const cleanAns = cleanMarkdown(props.message.content)
  wrapText(ctx, cleanAns, rx + 75, currentY, 810, 26)

  // 7. Footer website watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.font = 'bold 14px monospace'
  ctx.fillText('chouette-gpt.localhost', rx + rw - 220, ry + rh - 40)

  // Trigger download
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `chouettegpt_share_${Date.now()}.png`
  link.click()
}

function shareTwitter() {
  const text = precedingUserMessage.value 
    ? `Regardez la réponse de ChouetteGPT (IA 100% locale exécutée par WebGPU dans mon navigateur !) à ma question : "${precedingUserMessage.value.content.slice(0, 50)}..."`
    : `Regardez comment ChouetteGPT fait tourner l'IA 100% localement et confidentiellement dans mon navigateur !`
  
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://github.com/garygitton/chouette-gpt')}`
  window.open(url, '_blank')
}
</script>