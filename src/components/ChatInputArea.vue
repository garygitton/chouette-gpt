<template>
  <div class="w-full space-y-3">
    <!-- Model Warning / Info Banner -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="chatStore.isEngineReady" class="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-2xl flex items-start gap-2 shadow-sm">
        <AlertTriangle class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span class="leading-relaxed">
          <strong class="font-semibold">{{ modelStore.currentModel?.name }}</strong> : {{ tModel(modelStore.currentModelId, 'warn') }}
        </span>
      </div>
    </Transition>

    <!-- Solid input container -->
    <div class="relative group/input rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/70 transition-all duration-200 shadow-sm">
      <div class="p-3.5 pb-1">
        <textarea 
          ref="inputEl"
          v-model="input"
          data-testid="chat-textarea" 
          rows="1"
          :placeholder="props.disabled ? 'Téléchargez un modèle pour commencer...' : t('chat_placeholder')"
          :disabled="props.disabled"
          class="w-full bg-transparent border-0 outline-none focus:ring-0 text-slate-800 dark:text-slate-100 resize-none max-h-48 text-sm placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed [field-sizing:content]"
          @keydown="handleKeydown"
          @paste="handlePaste"
          @drop.prevent="handleDrop"
        />
        <div class="flex items-center justify-between px-4 pb-3.5 border-t border-slate-100/50 dark:border-slate-800/40 pt-3">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>{{ input.length }} {{ t('char') }}</span>
            <span class="opacity-50">•</span>
            <span>~{{ Math.ceil(input.length / 4) }} tokens est.</span>
          </div>
          
          <Button 
            data-testid="send-button"
            size="sm"
            class="rounded-xl font-bold px-4 hover:scale-[0.98] active:scale-[0.96] transition-all shadow-sm min-h-[44px] md:min-h-[32px] md:h-8"
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
      <!-- Disclaimer on the border -->
      <p class="absolute -top-[9px] left-5 bg-white dark:bg-[#0b0f19] px-2 text-[9.5px] text-slate-400 dark:text-slate-500 leading-normal z-10 pointer-events-none tracking-wide">
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
import { useModelI18n } from '~/composables/useModelI18n'

import { Button } from '~/components/ui/button'
import { Send, Square, AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const chatStore = useChatStore()
const modelStore = useModelStore()
const { t } = useI18n()
const { tModel } = useModelI18n()

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
