<template>
  <div class="h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex overflow-hidden">
    
    <!-- Desktop Sidebar -->
    <aside data-testid="sidebar" class="hidden md:flex flex-col w-[280px] border-r border-slate-200 dark:border-slate-800/60 bg-slate-100/50 dark:bg-[#070a12]/80 h-full flex-shrink-0">
      <div class="flex-1 flex flex-col h-full p-3">
        <SidebarContent :isMobile="false" />
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 h-full relative bg-white dark:bg-[#0b0f19]">
      
      <!-- Desktop Top Bar Options -->
      <div class="hidden md:flex absolute top-4 left-4 right-4 z-20 justify-between pointer-events-none">
        <div class="pointer-events-auto">
        </div>
        <div class="pointer-events-auto shadow-sm">
          <Button data-testid="toggle-right-sidebar-btn" variant="ghost" size="icon" @click="isRightSidebarOpen = !isRightSidebarOpen" class="bg-white/50 dark:bg-[#0b0f19]/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Settings2 class="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Button>
        </div>
      </div>

      <!-- Mobile Top Bar -->
      <header class="md:hidden flex-none flex flex-col p-3 border-b border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md z-20 space-y-3">
        <div class="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            @click="isSidebarOpen = true"
          >
            <Menu class="w-5 h-5" />
          </Button>
          <div class="flex items-center gap-1.5">
            <img src="/logo.svg" alt="" class="w-6 h-6" />
            <span class="font-black text-slate-800 dark:text-white tracking-tight text-lg">Chouette<span class="text-indigo-500">GPT</span></span>
          </div>
          <div class="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              @click="newChat"
            >
              <Plus class="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              @click="isRightSidebarOpen = true"
            >
              <Settings2 class="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div class="flex justify-center w-full pb-1">
        </div>
      </header>

      <!-- Main viewport slot -->
      <main class="flex-1 min-h-0 relative z-0 flex flex-col">
        <slot />
      </main>
    </div>

    <!-- Desktop Right Sidebar -->
    <aside v-show="isRightSidebarOpen" data-testid="right-sidebar" class="hidden md:flex flex-col w-[320px] border-l border-slate-200 dark:border-slate-800/60 bg-slate-100/50 dark:bg-[#070a12]/80 h-full flex-shrink-0">
      <RightSidebar :isMobile="false" />
    </aside>

    <!-- Modals & Overlays (Absolute to avoid flex-flow breaking) -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="pointer-events-auto">
        <!-- Mobile Slideover Sidebar (Left) -->
        <Sheet v-model:open="isSidebarOpen">
          <SheetContent side="left" class="p-0 border-r border-slate-200 dark:border-slate-800/60 w-[280px]">
            <div class="flex flex-col h-full bg-slate-100 dark:bg-[#070a12] p-3">
              <SidebarContent :isMobile="true" @close-sidebar="isSidebarOpen = false" />
            </div>
          </SheetContent>
        </Sheet>

        <!-- Mobile Slideover Right Sidebar (Settings) -->
        <Sheet v-model:open="isRightSidebarOpen" v-if="isMobileView">
          <SheetContent side="right" class="p-0 border-l border-slate-200 dark:border-slate-800/60 w-[320px] sm:w-[380px]">
            <RightSidebar :isMobile="true" @close-sidebar="isRightSidebarOpen = false" />
          </SheetContent>
        </Sheet>
      </div>
    </div>
    
    <!-- Floating Download Progress Widget -->
    <DownloadProgressWidget />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from '#imports'
import { ref, onMounted, onBeforeUnmount } from 'vue'

import { useConversation } from '~/contexts/conversationContext'
import { useDevice } from '~/contexts/deviceContext'
import SidebarContent from '~/components/SidebarContent.vue'
import RightSidebar from '~/components/RightSidebar.vue'
import DownloadProgressWidget from '~/components/DownloadProgressWidget.vue'

// Shadcn imports
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent } from '~/components/ui/sheet'
import { Menu, Plus, Settings2 } from 'lucide-vue-next'

const convStore = useConversation()
const deviceStore = useDevice()
const router = useRouter()
const route = useRoute()
const isSidebarOpen = ref(false)
const isRightSidebarOpen = ref(true)
const isMobileView = ref(false)

function checkMobile() {
  if (typeof window !== 'undefined') {
    isMobileView.value = window.innerWidth < 768
    if (window.innerWidth < 1200) {
      isRightSidebarOpen.value = false // Masquer par défaut sur mobile et petits écrans de portable
    } else {
      isRightSidebarOpen.value = true
    }
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkMobile)
  }
})

async function newChat() {
  const id = await convStore.createNewConversation()
  router.push({ path: '/', query: { ...route.query, id } })
}
</script>