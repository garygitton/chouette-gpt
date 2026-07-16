<template>
  <div class="w-full h-[400px] relative">
    <Scatter :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js'
import { Scatter } from 'vue-chartjs'
import type { ModelInfo } from '~/types'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title)

const props = defineProps<{
  models: ModelInfo[]
}>()

const emit = defineEmits<{
  (e: 'select-model', modelId: string): void
}>()

const getCategory = (ram: number) => {
  if (ram < 2000) return 'Ultra-Léger'
  if (ram <= 4096) return 'Équilibré'
  return 'Haute Performance'
}

const chartData = computed(() => {
  // Group by category for the legend
  const categories: Record<string, any> = {
    'Ultra-Léger': { data: [], backgroundColor: '#10b981', pointRadius: 8, pointHoverRadius: 10 },
    'Équilibré': { data: [], backgroundColor: '#f59e0b', pointRadius: 8, pointHoverRadius: 10 },
    'Haute Performance': { data: [], backgroundColor: '#ef4444', pointRadius: 8, pointHoverRadius: 10 }
  }

  props.models.forEach((m) => {
    const cat = getCategory(m.ramRequired)
    categories[cat].data.push({
      x: m.ramRequired,
      y: m.performanceScore || 0,
      modelName: m.name,
      modelId: m.id,
      size: m.totalSize
    })
  })

  return {
    datasets: Object.keys(categories).map(cat => ({
      label: cat,
      data: categories[cat].data,
      backgroundColor: categories[cat].backgroundColor,
      pointRadius: categories[cat].pointRadius,
      pointHoverRadius: categories[cat].pointHoverRadius
    }))
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  onClick: (event: any, elements: any[], chart: any) => {
    if (elements.length > 0) {
      const datasetIndex = elements[0].datasetIndex
      const index = elements[0].index
      const dataPoint = chart.data.datasets[datasetIndex].data[index]
      if (dataPoint && dataPoint.modelId) {
        emit('select-model', dataPoint.modelId)
      }
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#94a3b8' // slate-400
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const point = context.raw
          return `${point.modelName} (Score: ${point.y}, Poids: ${point.size})`
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'RAM Requise (Mo)',
        color: '#94a3b8'
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Score d\'Intelligence (MMLU Estimé)',
        color: '#94a3b8'
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      },
      min: 0,
      max: 100
    }
  }
}))
</script>
