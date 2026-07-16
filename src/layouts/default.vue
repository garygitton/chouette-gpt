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
        <div class="pointer-events-auto shadow-sm group">
          <Button data-testid="toggle-right-sidebar-btn" variant="ghost" size="icon" @click="isRightSidebarOpen = !isRightSidebarOpen" class="bg-white/60 dark:bg-[#0b0f19]/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-md hover:scale-105">
            <Settings2 class="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:rotate-45 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      <!-- Mobile Top Bar -->
      <header class="md:hidden flex-none flex flex-col p-3 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl z-20 space-y-3 shadow-sm transition-colors duration-300">
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
    <Transition name="slide-right">
      <aside v-show="isRightSidebarOpen" data-testid="right-sidebar" class="hidden md:flex flex-col w-[320px] border-l border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-[#070a12]/80 h-full flex-shrink-0 transition-transform duration-300 ease-in-out">
        <RightSidebar :isMobile="false" />
      </aside>
    </Transition>

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

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
  margin-right: -320px; /* Collapse layout space smoothly */
}
</style>