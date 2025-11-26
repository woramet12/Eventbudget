<script setup>
import { computed } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  total: { type: Number, default: 0 }
})

// ชุดสีที่ดูทันสมัย
const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#6366F1', '#EF4444', '#6B7280']

const chartData = computed(() => {
  return props.categories.map((cat, index) => ({
    ...cat,
    color: colors[index % colors.length],
    percent: props.total > 0 ? (cat.amount / props.total) * 100 : 0
  })).sort((a, b) => b.amount - a.amount)
})

// สร้าง Conic Gradient สำหรับกราฟวงกลม
const gradientStyle = computed(() => {
  if (props.total === 0) return { background: '#F3F4F6' }
  let currentDeg = 0
  const segments = chartData.value.map(cat => {
    const start = currentDeg
    const end = currentDeg + (cat.percent * 3.6)
    currentDeg = end
    return `${cat.color} ${start}deg ${end}deg`
  })
  return { background: `conic-gradient(${segments.join(', ')})` }
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-4 w-full">
    <div class="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full shadow-lg ring-4 ring-white flex-shrink-0" :style="gradientStyle">
      <div class="absolute inset-0 m-auto w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
        <span class="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">ยอดใช้จ่าย</span>
        <span class="text-lg sm:text-xl font-bold text-gray-800">฿{{ total.toLocaleString() }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 w-full sm:w-auto">
      <div v-for="item in chartData" :key="item.name" class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0" :style="{ backgroundColor: item.color }"></span>
        <div class="min-w-0">
          <p class="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[100px]">{{ item.name }}</p>
          <p class="text-[10px] text-gray-500">{{ item.percent.toFixed(1) }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>