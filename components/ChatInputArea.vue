<template>
  <div class="w-full space-y-3">
    <!-- Solid input container -->
    <div class="relative group/input rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/70 transition-all duration-200 shadow-sm">
      <div class="p-3.5 pb-1">
          <!-- @inline-style-ignore-next -->
          <textarea 
            data-testid="chat-textarea"
            ref="inputEl"
            v-model="input" 
            @keydown="handleKeydown"
            @paste="handlePaste"
            @drop.prevent="handleDrop"
            rows="1"
            :placeholder="props.disabled ? 'Téléchargez un modèle pour commencer...' : t('chat_placeholder')"
            :disabled="props.disabled"
            class="w-full bg-transparent border-0 outline-none focus:ring-0 text-slate-800 dark:text-slate-100 resize-none max-h-48 text-sm placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style="field-sizing: content;"
          ></textarea>
        <div class="flex items-center justify-between px-4 pb-3.5 border-t border-slate-100/50 dark:border-slate-800/40 pt-3">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <span>{{ input.length }} {{ t('char') }}</span>
            <span class="opacity-50">•</span>
            <span>~{{ Math.ceil(input.length / 4) }} tokens est.</span>
          </div>
          
          <Button 
            data-testid="send-button"
            size="sm"
            class="rounded-xl font-bold px-4 hover:scale-[0.98] active:scale-[0.96] transition-all shadow-sm h-8"
            :variant="chatStore.isGenerating ? 'destructive' : 'default'"
            :disabled="props.disabled || (!input.trim() && !chatStore.isGenerating)"
            @click="chatStore.isGenerating ? chatStore.stopGenerate() : emitSubmit()"
          >
            <template v-if="chatStore.isGenerating">
              <Square class="w-4 h-4 mr-1.5" />
              {{ t('interrupt') }}
            </template>
            <template v-else>
              <Send class="w-4 h-4 mr-1.5" />
              {{ t('send') }}
            </template>
          </Button>
        </div>
      </div>
      <p class="text-center text-[9.5px] text-slate-400 dark:text-slate-500 leading-normal max-w-2xl mx-auto mt-2">
        {{ t('disclaimer') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '~/stores/chatStore'
import { useModelStore } from '~/stores/modelStore'
import { useI18n } from '~/composables/useI18n'

import { Button } from '~/components/ui/button'
import { Send, Square } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const chatStore = useChatStore()
const modelStore = useModelStore()
const { t } = useI18n()

const inputEl = ref<HTMLTextAreaElement | null>(null)

const input = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emitSubmit()
  }
}

function handlePaste(e: ClipboardEvent) {
  // basic paste is handled natively
}

function handleDrop(e: DragEvent) {
  const text = e.dataTransfer?.getData('text')
  if (text) {
    input.value += text
  }
}

function emitSubmit() {
  emit('submit')
}
</script>
