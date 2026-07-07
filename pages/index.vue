<!-- @ds-ignore-file -->
<template>
  <div class="flex-1 flex flex-col relative h-full bg-white dark:bg-[#0b0f19]">
    <EngineLoadingOverlay />

    <!-- Chat Feed Container -->
    <div ref="scrollContainer" class="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-36">
      <div class="max-w-3xl w-full mx-auto flex flex-col justify-between">
        <LandingDashboard v-if="!currentConversation || currentConversation.messages.length === 0" @send-prompt="sendPrompt" />
        
        <!-- Active Chat Feed -->
        <div v-else class="space-y-6 py-4">
          <ChatMessage v-for="msg in currentConversation.messages" :key="msg.id" :message="msg" />
          
          <div v-if="chatStore.isEngineLoading" class="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <Loader2 class="w-5 h-5 text-indigo-500 animate-spin" />
            <span class="text-sm text-slate-500 dark:text-slate-400">Chargement du modèle... {{ chatStore.engineProgress.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Input Area -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent dark:from-[#0b0f19] dark:via-[#0b0f19] dark:to-transparent pt-12 pb-4 px-4 md:px-8 pointer-events-none">
      <div class="max-w-3xl mx-auto pointer-events-auto">
        <ChatInputArea v-model="input" @submit="submit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore } from '~/stores/chatStore'
import { useConversationStore } from '~/stores/conversationStore'
import { useModelStore } from '~/stores/modelStore'
import ChatMessage from '~/components/ChatMessage.vue'
import EngineLoadingOverlay from '~/components/EngineLoadingOverlay.vue'
import LandingDashboard from '~/components/LandingDashboard.vue'
import ChatInputArea from '~/components/ChatInputArea.vue'
import { Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const convStore = useConversationStore()
const modelStore = useModelStore()

const input = ref('')
const scrollContainer = ref<HTMLElement | null>(null)



const currentConversation = computed(() => {
  return convStore.conversations.find(c => c.id === route.query.id)
})

watch(() => route.query.id, (newId) => {
  if (newId) {
    convStore.currentConversationId = newId as string
  } else {
    convStore.currentConversationId = null
  }
}, { immediate: true })

watch(() => currentConversation.value?.messages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

function scrollToBottom() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}



function sendPrompt(text: string) {
  input.value = text
  submit()
}

async function submit() {
  if (!input.value.trim() || chatStore.isGenerating) return
  
  const text = input.value
  input.value = ''
  
  if (!route.query.id) {
    const id = await convStore.createNewConversation()
    router.replace({ path: '/', query: { ...route.query, id } })
  }
  
  await chatStore.generate(modelStore.currentModelId, text)
}
</script>