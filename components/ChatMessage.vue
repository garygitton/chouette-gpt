<template>
  <div class="w-full flex ui-message-slide-in" :class="[message.role === 'user' ? 'justify-end' : 'justify-start']">
    <div 
      class="flex items-start space-x-3.5 max-w-[85%] md:max-w-[78%]"
      :class="[message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row']"
    >
      <!-- Avatar -->
      <div class="relative flex-shrink-0">
        <div 
          class="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-all duration-300"
          :class="[
            message.role === 'user' 
              ? 'bg-slate-700 dark:bg-slate-800' 
              : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500'
          ]"
        >
          <User v-if="message.role === 'user'" class="w-5 h-5" />
          <Zap v-else class="w-5 h-5" />
        </div>
        
        <!-- Active generation indicator for assistant -->
        <span 
          v-if="message.role === 'assistant' && chatStore.isGenerating && isLastMessage"
          class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#070a12] rounded-full animate-ping"
        ></span>
        <span 
          v-if="message.role === 'assistant' && chatStore.isGenerating && isLastMessage"
          class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#070a12] rounded-full"
        ></span>
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
          <div class="leading-relaxed break-words">
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
            class="absolute -bottom-4 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-lg shadow-md flex items-center p-0.5 z-10"
          >
            <Button 
              size="icon"
              variant="ghost"
              class="rounded-md h-6 w-6"
              @click="copyContent"
            >
              <Check v-if="copied" class="w-3.5 h-3.5" />
              <Clipboard v-else class="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <!-- Optional Timestamp / Meta info -->
        <div 
          class="text-[9px] font-bold text-slate-400 dark:text-slate-500 px-1"
          :class="[message.role === 'user' ? 'text-right' : 'text-left']"
        >
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Message } from '~/types'
import { useChatStore } from '~/stores/chatStore'
import { useRoute } from 'vue-router'
import { useConversationStore } from '~/stores/conversationStore'
import MarkdownRenderer from '~/components/MarkdownRenderer.vue'
import { Button } from '~/components/ui/button'
import { User, Zap, Check, Clipboard } from 'lucide-vue-next'

const props = defineProps<{ message: Message }>()
const chatStore = useChatStore()
const convStore = useConversationStore()
const route = useRoute()

const copied = ref(false)

const currentConversation = computed(() => {
  return convStore.conversations.find(c => c.id === route.query.id)
})

const isLastMessage = computed(() => {
  if (!currentConversation.value) return false
  const msgs = currentConversation.value.messages
  return msgs.length > 0 && msgs[msgs.length - 1].id === props.message.id
})

function copyContent() {
  navigator.clipboard.writeText(props.message.content)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function formatTime(timestamp: number): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>