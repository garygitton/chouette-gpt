<template>
  <div class="flex items-center space-x-2 w-full">
    <Select v-model="settingsStore.language">
      <SelectTrigger data-testid="language-select-trigger" class="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl" :class="[size === 'sm' ? 'h-8 text-xs' : 'h-10 text-sm']">
        <div class="flex items-center">
          <Languages class="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2 flex-shrink-0" />
          <SelectValue placeholder="Language" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="lang in languages"
            :key="lang.code"
            :value="lang.code"
            :data-testid="'language-item-' + lang.code"
          >
            {{ lang.name }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settingsStore'
import { useI18n, languages } from '~/composables/useI18n'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Languages } from 'lucide-vue-next'

defineProps({
  size: { type: String, default: 'md' }
})

const settingsStore = useSettingsStore()
const { t } = useI18n()
</script>
