<template>
  <div :style="{ height: appHeight }" class="w-full bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex overflow-hidden">
    
    <!-- Desktop Sidebar -->
    <aside data-testid="sidebar" class="hidden md:flex flex-col w-[280px] border-r border-slate-200 dark:border-slate-800/60 bg-slate-100/50 dark:bg-[#070a12]/80 h-full flex-shrink-0">
      <div class="flex-1 flex flex-col h-full p-3">
        <SidebarContent :is-mobile="false" />
      </div>
    </aside>

    <!-- Main Content Area with swipe gestures to open sidebars -->
    <div 
      class="flex-1 flex flex-col min-w-0 h-full relative bg-white dark:bg-[#0b0f19]"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      
      <!-- Desktop Top Bar Options -->
      <div class="hidden md:flex absolute top-4 left-4 right-4 z-20 justify-between pointer-events-none">
        <div class="pointer-events-auto"/>
        <div class="pointer-events-auto shadow-sm group">
          <Button data-testid="toggle-right-sidebar-btn" variant="ghost" size="icon" class="bg-white/60 dark:bg-[#0b0f19]/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-md hover:scale-105" @click="isRightSidebarOpen = !isRightSidebarOpen">
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
            class="min-h-[44px] min-w-[44px]"
            aria-label="Ouvrir le menu principal"
            @click="isSidebarOpen = true"
          >
            <Menu class="w-6 h-6" />
          </Button>
          <div class="flex items-center gap-1.5">
            <img src="~/assets/logo.svg" alt="" class="w-6 h-6" >
            <span class="font-black text-slate-800 dark:text-white tracking-tight text-lg">Chouette<span class="text-indigo-600 dark:text-indigo-500">GPT</span></span>
          </div>
          <div class="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              class="min-h-[44px] min-w-[44px]"
              aria-label="Nouveau chat"
              @click="newChat"
            >
              <Plus class="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="min-h-[44px] min-w-[44px]"
              aria-label="Ouvrir les paramètres"
              @click="isRightSidebarOpen = true"
            >
              <Settings2 class="w-6 h-6" />
            </Button>
          </div>
        </div>
        <div class="flex justify-center w-full pb-1"/>
      </header>

      <!-- Main viewport slot -->
      <main role="main" class="flex-1 min-h-0 relative z-0 flex flex-col">
        <slot />
      </main>
    </div>

    <!-- Desktop Right Sidebar -->
    <Transition name="slide-right">
      <aside v-show="isRightSidebarOpen" data-testid="right-sidebar" class="hidden md:flex flex-col w-[320px] border-l border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-[#070a12]/80 h-full flex-shrink-0 transition-transform duration-300 ease-in-out">
        <RightSidebar :is-mobile="false" />
      </aside>
    </Transition>

    <!-- Modals & Overlays (Absolute to avoid flex-flow breaking) -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="pointer-events-auto">
        <!-- Mobile Slideover Sidebar (Left) -->
        <Sheet v-model:open="isSidebarOpen">
          <SheetContent side="left" class="p-0 border-r border-slate-200 dark:border-slate-800/60 w-[280px]">
            <SheetTitle class="sr-only">Menu principal</SheetTitle>
            <div class="flex flex-col h-full bg-slate-100 dark:bg-[#070a12] p-3">
              <SidebarContent :is-mobile="true" @close-sidebar="isSidebarOpen = false" />
            </div>
          </SheetContent>
        </Sheet>

        <!-- Mobile Slideover Right Sidebar (Settings) -->
        <Sheet v-if="isMobileView" v-model:open="isRightSidebarOpen">
          <SheetContent side="right" class="p-0 border-l border-slate-200 dark:border-slate-800/60 w-[320px] sm:w-[380px]">
            <SheetTitle class="sr-only">Paramètres</SheetTitle>
            <RightSidebar :is-mobile="true" @close-sidebar="isRightSidebarOpen = false" />
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

import { useConversationStore } from '~/stores/conversationStore'
import { useDeviceStore } from '~/stores/deviceStore'
import SidebarContent from '~/components/SidebarContent.vue'
import RightSidebar from '~/components/RightSidebar.vue'
import DownloadProgressWidget from '~/components/DownloadProgressWidget.vue'

// Shadcn imports
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '~/components/ui/sheet'
import { Menu, Plus, Settings2 } from 'lucide-vue-next'

const convStore = useConversationStore()
const deviceStore = useDeviceStore()
const router = useRouter()
const route = useRoute()
const isSidebarOpen = ref(false)
const isRightSidebarOpen = ref(true)
const isMobileView = ref(false)
const appHeight = ref('100dvh')

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

function updateAppHeight() {
  if (typeof window !== 'undefined') {
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight
    appHeight.value = `${vh}px`
  }
}

const touchStartX = ref(0)
const touchStartY = ref(0)

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
  }
}

function handleTouchEnd(e: TouchEvent) {
  if (e.changedTouches.length === 1) {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = touchEndX - touchStartX.value
    const diffY = touchEndY - touchStartY.value
    
    // Swipe horizontal gesture criteria: low vertical deviation and significant horizontal travel
    if (Math.abs(diffY) < 40 && Math.abs(diffX) > 60) {
      if (diffX > 0 && touchStartX.value < 45) {
        // Swipe from left edge -> open main sidebar
        isSidebarOpen.value = true
      } else if (diffX < 0 && window.innerWidth - touchStartX.value < 45) {
        // Swipe from right edge -> open settings sidebar on mobile
        if (isMobileView.value) {
          isRightSidebarOpen.value = true
        }
      }
    }
  }
}

onMounted(() => {
  checkMobile()
  updateAppHeight()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('resize', updateAppHeight)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateAppHeight)
    window.visualViewport.addEventListener('scroll', updateAppHeight)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkMobile)
    window.removeEventListener('resize', updateAppHeight)
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', updateAppHeight)
      window.visualViewport.removeEventListener('scroll', updateAppHeight)
    }
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