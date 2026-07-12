<template>
  <div class="h-full overflow-y-auto bg-slate-50 dark:bg-[#0b0f19] relative p-4 md:p-8">
    <div class="max-w-6xl mx-auto relative z-10 space-y-8">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <Button data-testid="back-button" variant="ghost" size="icon" @click="router.push('/')" class="rounded-xl">
          <ArrowLeft class="w-5 h-5 text-slate-500" />
        </Button>
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Paramètres & <span class="ui-title-gradient">Modèles</span>
        </h1>
      </div>

      <div class="max-w-2xl mx-auto space-y-6">
        <DeviceInfoCard />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '#imports'
import { onMounted } from 'vue'

import { useDevice } from '~/contexts/deviceContext'
import DeviceInfoCard from '~/components/DeviceInfoCard.vue'

import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const deviceStore = useDevice()

onMounted(() => {
  if (!deviceStore.deviceInfo) {
    deviceStore.evaluateDevice()
  }
})
</script>