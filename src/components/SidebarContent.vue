<template>
  <aside class="flex flex-col h-full" aria-label="Menu principal">
    <!-- Header (Mobile only) -->
    <div v-if="isMobile" class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-1.5">
        <img :src="'/logo.svg'" alt="" class="w-6 h-6" />
        <span class="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">Chouette<span class="text-indigo-500">GPT</span></span>
      </div>
      <Button variant="ghost" size="icon" @click="$emit('close-sidebar')" aria-label="Fermer le menu">
        <X class="w-5 h-5" />
      </Button>
    </div>

    <!-- New Chat Button -->
    <Button
      class="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/10 rounded-xl hover:scale-[0.98] active:scale-[0.97] transition-all w-full justify-start"
      @click="handleNewChat"
    >
      <PlusCircle class="w-5 h-5 mr-2" />
      {{ t('new_chat') }}
    </Button>

    <SidebarModelSelector />

    <!-- Search bar -->
    <div class="relative mb-4">
      <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
      <Input
        v-model="searchQuery"
        :placeholder="t('search_placeholder')"
        class="pl-9 pr-12 rounded-xl shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      />
      <div class="absolute right-2.5 top-2.5 flex items-center">
        <Badge variant="outline" class="hidden lg:inline-flex items-center gap-0.5 h-5 select-none pointer-events-none px-1.5 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded">
          <kbd>Ctrl</kbd><kbd>K</kbd>
        </Badge>
      </div>
    </div>

    <!-- Conversations list -->
    <div class="flex-1 overflow-y-auto space-y-1 pr-1">
      <div v-if="filteredConversations.length === 0" class="text-xs text-slate-400 dark:text-slate-500 text-center py-8">
        {{ t('no_conversations') }}
      </div>
      <div
        v-for="conv in filteredConversations"
        :key="conv.id"
        class="group flex items-center justify-between transition-all duration-200"
        :class="[
          isMobile ? 'p-2' : 'p-2.5',
          route.query.id === conv.id
            ? 'bg-indigo-50/50 dark:bg-indigo-950/15 text-indigo-600 dark:text-indigo-400 font-bold border-l-2 border-indigo-500 rounded-r-xl rounded-l-none'
            : 'hover:bg-slate-100/50 dark:hover:bg-slate-900/30 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-xl hover:-translate-x-0.5'
        ]"
      >
        <NuxtLink :to="{ path: '/', query: { ...route.query, id: conv.id } }" class="flex items-center space-x-3 flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md" @click="$emit('close-sidebar')">
          <MessageSquare class="w-4 h-4 flex-shrink-0" :class="route.query.id === conv.id ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'" />
          <span class="truncate text-xs tracking-tight">{{ conv.title || 'Conversation sans titre' }}</span>
        </NuxtLink>
        <Button
          variant="ghost"
          size="icon"
          class="h-6 w-6 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 focus-visible:ring-2 focus-visible:ring-red-500"
          :class="isMobile ? '' : 'opacity-0 group-hover:opacity-100 transition-all hover:text-red-600 dark:hover:text-red-400'"
          aria-label="Supprimer la conversation"
          @click.prevent="deleteConv(conv.id)"
        >
          <Trash2 class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="mt-auto pt-4 space-y-3.5">
      <Separator class="bg-slate-200/60 dark:bg-slate-800/40" />
      
      <!-- Premium Config & Action Card -->
      <div class="p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-900/50 space-y-3 shadow-inner">
        <!-- Language Selector -->
        <LanguageSelector size="sm" />

        <nav class="grid grid-cols-5 gap-1" aria-label="Paramètres et préférences">
          <Button
            data-testid="settings-button"
            variant="ghost"
            class="rounded-xl justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            :title="t('settings')"
            @click="navigateTo('/settings'); $emit('close-sidebar')"
          >
            <Settings class="w-4 h-4" />
          </Button>
          <Button
            data-testid="privacy-button"
            variant="ghost"
            class="rounded-xl justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            :title="t('privacy')"
            @click="navigateTo('/privacy'); $emit('close-sidebar')"
          >
            <ShieldCheck class="w-4 h-4" />
          </Button>
          <Button
            data-testid="theme-toggle"
            variant="ghost"
            class="rounded-xl justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            :title="settingsStore.isDarkMode ? t('light_mode') : t('dark_mode')"
            @click="toggleTheme"
          >
            <component :is="settingsStore.isDarkMode ? Sun : Moon" class="w-4 h-4" />
          </Button>
          <Button
            data-testid="benchmark-button"
            variant="ghost"
            class="rounded-xl justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            :title="t('sidebar_benchmark')"
            @click="navigateTo('/benchmark'); $emit('close-sidebar')"
          >
            <Activity class="w-4 h-4" />
          </Button>
          <Button
            data-testid="brand-assets-button"
            variant="ghost"
            class="rounded-xl justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            :title="t('brand_assets')"
            @click="navigateTo('/brand-assets'); $emit('close-sidebar')"
          >
            <Briefcase class="w-4 h-4" />
          </Button>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from '#imports'
import { ref, computed, onMounted } from 'vue'
import { useConversation } from '~/contexts/conversationContext'
import { useSettings } from '~/contexts/settingsContext'

import { useI18n } from '~/composables/useI18n'
import LanguageSelector from '~/components/LanguageSelector.vue'
import SidebarModelSelector from '~/components/SidebarModelSelector.vue'

// Shadcn imports
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { Badge } from '~/components/ui/badge'
import {
  X, PlusCircle, Search, MessageSquare, Trash2,
  Settings, ShieldCheck, Sun, Moon, Globe, Activity, Briefcase
} from 'lucide-vue-next'

const props = defineProps({
  isMobile: { type: Boolean, default: false }
})

const emit = defineEmits(['close-sidebar'])

const convStore = useConversation()
const settingsStore = useSettings()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const searchQuery = ref('')

onMounted(() => {
  convStore.loadConversations()
})

const filteredConversations = computed(() => {
  const withMessages = convStore.conversations.filter(c => c.messages && c.messages.length > 0)
  if (!searchQuery.value) return withMessages
  return withMessages.filter(c => c.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

async function handleNewChat() {
  const id = await convStore.createNewConversation()
  router.push({ path: '/', query: { ...route.query, id } })
  emit('close-sidebar')
}

async function deleteConv(id: string) {
  await convStore.deleteConversation(id)
  if (route.query.id === id) {
    const query = { ...route.query }
    delete query.id
    router.push({ path: '/', query })
  }
}

function toggleTheme() {
  settingsStore.toggleTheme()
}

function navigateTo(path: string) {
  router.push({ path })
}
</script>
