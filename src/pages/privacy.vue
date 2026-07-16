<template>
  <div class="h-full overflow-y-auto bg-slate-50 dark:bg-[#0b0f19] relative p-4 md:p-8">
    <div class="max-w-4xl mx-auto relative z-10 space-y-8">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <Button
          data-testid="back-button"
          variant="ghost"
          size="icon"
          class="rounded-xl"
          @click="router.push('/')"
        >
          <ArrowLeft class="w-5 h-5 text-slate-500" />
        </Button>
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ t('privacy_title') }}
        </h1>
      </div>

      <!-- Core Principle Card -->
      <Card class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-lg">
        <CardContent class="pt-6">
          <p class="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
            {{ t('privacy_intro') }}
          </p>
        </CardContent>
      </Card>

      <!-- Key Pillars Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 100% Local -->
        <Card class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-md">
          <CardContent class="pt-6 flex items-start space-x-4">
            <div class="p-3 rounded-xl bg-green-500/10 text-green-500">
              <Cpu class="w-6 h-6" />
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-slate-900 dark:text-white text-base">{{ t('pillar_local_title') }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ t('pillar_local_desc') }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- Aucun Serveur -->
        <Card class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-md">
          <CardContent class="pt-6 flex items-start space-x-4">
            <div class="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <Server class="w-6 h-6" />
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-slate-900 dark:text-white text-base">{{ t('pillar_server_title') }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ t('pillar_server_desc') }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- Stockage Local -->
        <Card class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-md">
          <CardContent class="pt-6 flex items-start space-x-4">
            <div class="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <FolderDown class="w-6 h-6" />
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-slate-900 dark:text-white text-base">{{ t('pillar_storage_title') }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ t('pillar_storage_desc') }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- Hors-ligne -->
        <Card class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-md">
          <CardContent class="pt-6 flex items-start space-x-4">
            <div class="p-3 rounded-xl bg-orange-500/10 text-orange-500">
              <WifiOff class="w-6 h-6" />
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-slate-900 dark:text-white text-base">{{ t('pillar_offline_title') }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ t('pillar_offline_desc') }}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Guarantees Card -->
      <Card class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-xl shadow-lg">
        <CardHeader class="flex flex-row items-center space-x-2 pb-2">
          <ShieldCheck class="w-6 h-6 text-indigo-500" />
          <CardTitle class="text-lg">{{ t('guarantees_title') }}</CardTitle>
        </CardHeader>

        <CardContent class="pt-4">
          <ul class="space-y-3.5">
            <li class="flex items-start space-x-3 text-slate-700 dark:text-slate-300">
              <CheckCircle class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{{ t('guarantee_no_account') }}</span>
            </li>
            <li class="flex items-start space-x-3 text-slate-700 dark:text-slate-300">
              <CheckCircle class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{{ t('guarantee_no_telemetry') }}</span>
            </li>
            <li class="flex items-start space-x-3 text-slate-700 dark:text-slate-300">
              <CheckCircle class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{{ t('guarantee_no_share') }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- Security banner -->
      <div class="p-5 rounded-2xl border border-indigo-500/10 dark:border-indigo-500/5 bg-indigo-500/5 dark:bg-indigo-950/10 flex items-start space-x-4">
        <div class="p-2 bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-500/25 flex-shrink-0">
          <Lock class="w-5 h-5" />
        </div>
        <div class="space-y-1">
          <h3 class="font-bold text-slate-900 dark:text-white text-base">{{ t('security_banner_title') }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-normal">
            {{ t('security_banner_desc') }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from '#imports'

import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { ArrowLeft, Cpu, Server, FolderDown, WifiOff, ShieldCheck, CheckCircle, Lock } from 'lucide-vue-next'
import { useI18n } from '~/composables/useI18n'

const router = useRouter()
const { t } = useI18n()
</script>