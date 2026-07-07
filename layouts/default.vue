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
      
      <!-- Desktop Right Sidebar Toggle -->
      <div class="hidden md:flex absolute top-4 right-4 z-20">
        <Button variant="ghost" size="icon" @click="isRightSidebarOpen = !isRightSidebarOpen" class="bg-white/50 dark:bg-[#0b0f19]/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
          <Settings2 class="w-5 h-5" />
        </Button>
      </div>

      <!-- Mobile Top Bar -->
      <header class="md:hidden flex-none flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md z-20">
        <Button
          variant="ghost"
          size="icon"
          @click="isSidebarOpen = true"
        >
          <Menu class="w-5 h-5" />
        </Button>
        <span class="font-black text-slate-800 dark:text-white tracking-tight">Chouette<span class="text-indigo-500">GPT</span></span>
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

        <!-- Modals -->
        <WebGpuWizardModal :model-value="isOnboardingOpen" @update:model-value="closeOnboarding" @reevaluate="reEvaluateGpu" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConversationStore } from '~/stores/conversationStore'
import { useDeviceStore } from '~/stores/deviceStore'
import SidebarContent from '~/components/SidebarContent.vue'
import RightSidebar from '~/components/RightSidebar.vue'
import WebGpuWizardModal from '~/components/WebGpuWizardModal.vue'

// Shadcn imports
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent } from '~/components/ui/sheet'
import { Menu, Plus, Settings2 } from 'lucide-vue-next'

const convStore = useConversationStore()
const deviceStore = useDeviceStore()
const router = useRouter()
const route = useRoute()
const isSidebarOpen = ref(false)
const isRightSidebarOpen = ref(true)
const isOnboardingOpen = ref(false)
const isMobileView = ref(false)

function checkMobile() {
  if (typeof window !== 'undefined') {
    isMobileView.value = window.innerWidth < 768
    if (isMobileView.value) {
      isRightSidebarOpen.value = false // Hide right sidebar by default on mobile
    }
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  const hasSeenOnboarding = localStorage.getItem('chouette-onboarding-seen')
  if (!hasSeenOnboarding && typeof navigator !== 'undefined' && !navigator.gpu) {
    isOnboardingOpen.value = true
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkMobile)
  }
})

function closeOnboarding(val: boolean) {
  isOnboardingOpen.value = val
  if (!val) {
    localStorage.setItem('chouette-onboarding-seen', 'true')
  }
}

async function reEvaluateGpu() {
  await deviceStore.evaluateDevice()
  if (typeof navigator !== 'undefined' && navigator.gpu) {
    closeOnboarding(false)
  }
}

async function newChat() {
  const id = await convStore.createNewConversation()
  router.push({ path: '/', query: { ...route.query, id } })
}
</script>