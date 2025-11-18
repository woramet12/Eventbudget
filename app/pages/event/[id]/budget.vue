<script setup>
import UiCard from '~/components/ui/UiCard.vue'
// definePageMeta({ layout: 'event' }) // ⭐️ ลบออก

// (Mock Data)
const budget = ref(500000)
const used = ref(303000)
const remaining = ref(197000)
const percent = ref((used.value / budget.value) * 100)
const categories = ref([
  { name: 'Venue', amount: 150000, icon: '🏛️' },
  { name: 'Entertainment', amount: 73000, icon: '🎤' },
  { name: 'Catering', amount: 65000, icon: '🍔' },
  { name: 'Drinks', amount: 15000, icon: '🍹' },
])
</script>

<template>
  <NuxtLayout name="event">
    <div>
      <h2 class="text-2xl font-bold text-text-primary mb-4">
        ภาพรวมงบประมาณ
      </h2>
      <UiCard class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-text-secondary">ใช้ไปแล้ว</span>
          <span class="text-sm text-text-secondary">ทั้งหมด: ฿{{ budget.toLocaleString() }}</span>
        </div>
        <div class="w-full bg-base-border rounded-full h-2.5">
          <div class="bg-accent h-2.5 rounded-full" :style="{ width: `${percent}%` }"></div>
        </div>
        <div class="flex justify-between items-center mt-3">
          <div>
            <div class="text-xs text-text-secondary">ใช้ไปแล้ว</div>
            <div class="text-lg font-bold text-accent">฿{{ used.toLocaleString() }}</div>
          </div>
          <div>
            <div class="text-xs text-text-secondary">คงเหลือ</div>
            <div class="text-lg font-bold text-green-500">฿{{ remaining.toLocaleString() }}</div>
          </div>
          <div class="text-text-secondary">{{ percent.toFixed(1) }}% ที่ใช้ไปแล้ว</div>
        </div>
      </UiCard>
      <UiCard>
        <h3 class="text-xl font-bold text-text-primary mb-4">Spending by Category</h3>
        <div class="space-y-4">
          <div v-for="cat in categories" :key="cat.name" class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ cat.icon }}</span>
              <span class="text-text-primary">{{ cat.name }}</span>
            </div>
            <span class="text-text-primary font-medium">฿{{ cat.amount.toLocaleString() }}</span>
          </div>
        </div>
      </UiCard>
    </div>
  </NuxtLayout>
</template>