<template>
  <div class="flex-1 flex flex-col relative min-h-0 bg-white dark:bg-[#0b0f19]">

    <!-- Chat Feed Container -->
    <div ref="scrollContainer" class="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-4" @scroll="onScroll">
      <div class="max-w-3xl w-full mx-auto flex flex-col justify-between min-h-full pb-4">
        <LandingDashboard v-if="!currentConversation || currentConversation.messages.length === 0" @send-prompt="sendPrompt" />
        
        <!-- Active Chat Feed -->
        <div v-else class="space-y-6 py-4">
          <ChatMessage v-for="msg in currentConversation.messages" :key="msg.id" :message="msg" />
        </div>
      </div>
    </div>

    <!-- Floating Scroll To Bottom Button -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
    >
      <div v-if="!isAtBottom && currentConversation?.messages?.length" class="absolute bottom-[130px] md:bottom-[150px] left-0 right-0 flex justify-center pointer-events-none z-10">
        <Button 
          variant="secondary" 
          class="pointer-events-auto rounded-full shadow-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-xs h-8 px-4 font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400" 
          @click="forceScrollToBottom"
        >
          <ArrowDown :class="'w-3.5 h-3.5 mr-1.5'" />
          {{ t('new_messages_notification') }}
        </Button>
      </div>
    </Transition>

    <!-- Fixed Bottom Input Area -->
    <div class="flex-none border-t border-slate-100 dark:border-slate-800/40 bg-white dark:bg-[#0b0f19] pt-3 pb-6 md:pb-8 px-4 md:px-8">
      <div class="max-w-3xl mx-auto">
        <ChatInputArea 
          v-model="input" 
          :disabled="!chatStore.isEngineReady" 
          @submit="submit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from '#imports'
import { ref, computed, watch, nextTick } from 'vue'

import { useChatStore } from '~/stores/chatStore'
import { useConversationStore } from '~/stores/conversationStore'
import { useModelStore } from '~/stores/modelStore'
import { useI18n } from '~/composables/useI18n'
import ChatMessage from '~/components/ChatMessage.vue'
import LandingDashboard from '~/components/LandingDashboard.vue'
import ChatInputArea from '~/components/ChatInputArea.vue'
import { Button } from '~/components/ui/button'
import { ArrowDown } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const convStore = useConversationStore()
const modelStore = useModelStore()
const { t } = useI18n()

const input = ref('')
const scrollContainer = ref<HTMLElement | null>(null)
const isAtBottom = ref(true)

const currentConversation = computed(() => {
  return convStore.conversations.find(c => c.id === route.query.id)
})

const lastMessageContent = computed(() => {
  const msgs = currentConversation.value?.messages
  if (!msgs || msgs.length === 0) return ''
  return msgs[msgs.length - 1].content
})

watch(() => route.query.id, (newId) => {
  if (newId) {
    convStore.currentConversationId = newId as string
  } else {
    convStore.currentConversationId = null
  }
}, { immediate: true })

watch(() => currentConversation.value?.messages.length, () => {
  isAtBottom.value = true
  nextTick(() => {
    scrollToBottom(false)
  })
})

watch(lastMessageContent, () => {
  if (isAtBottom.value) {
    nextTick(() => {
      scrollToBottom(false)
    })
  }
})

function onScroll() {
  if (!scrollContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  const distanceToBottom = scrollHeight - scrollTop - clientHeight
  isAtBottom.value = distanceToBottom < 50
}

function scrollToBottom(smooth = false) {
  if (!scrollContainer.value) return
  if (smooth) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  } else {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

function forceScrollToBottom() {
  isAtBottom.value = true
  scrollToBottom(true)
}

function sendPrompt(text: string) {
  input.value = text
  submit()
}

async function submit() {
  if (!input.value.trim() || chatStore.isGenerating || !chatStore.isEngineReady) return
  
  const text = input.value
  input.value = ''
  
  if (!route.query.id) {
    const id = await convStore.createNewConversation()
    router.replace({ path: '/', query: { ...route.query, id } })
  }
  
  await chatStore.generate(modelStore.currentModelId, text)
}
</script>