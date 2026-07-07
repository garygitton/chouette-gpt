<template>
  <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-md p-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]">
      <DialogHeader class="p-4 border-b border-slate-100 dark:border-slate-800">
        <DialogTitle data-testid="wizard-title" class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Cpu class="w-5 h-5 text-indigo-500" />
          <span>{{ t('wizard_title') }}</span>
        </DialogTitle>
      </DialogHeader>

      <div class="p-4 space-y-6">
        <DialogDescription class="text-sm text-slate-600 dark:text-slate-400">
          {{ t('wizard_desc') }}
        </DialogDescription>

        <!-- Steps -->
        <div class="space-y-4">
          <!-- Step 1 -->
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
              1
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ t('wizard_step1_title') }}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {{ t('wizard_step1_desc') }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1">
                <em>{{ t('wizard_step1_firefox') }}</em>
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
              2
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ t('wizard_step2_title') }}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {{ t('wizard_step2_desc') }}
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
              3
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ t('wizard_step3_title') }}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {{ t('wizard_step3_desc') }}
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
              4
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ t('wizard_step4_title') }}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {{ t('wizard_step4_desc') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="p-4 border-t border-slate-100 dark:border-slate-800 flex sm:justify-end">
        <Button data-testid="wizard-close-btn" variant="ghost" class="rounded-xl mr-2" @click="$emit('update:modelValue', false)">{{ t('close') }}</Button>
        <Button data-testid="wizard-reevaluate-btn" class="rounded-xl shadow-md" @click="$emit('reevaluate')">{{ t('re_evaluate') }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Cpu } from 'lucide-vue-next'

defineProps<{ modelValue: boolean }>()
defineEmits(['update:modelValue', 'reevaluate'])
const { t } = useI18n()
</script>
