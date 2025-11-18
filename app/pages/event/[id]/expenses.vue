<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
// definePageMeta({ layout: 'event' }) // ⭐️ ลบออก
const expensesByDate = ref([
  { 
    date: 'วันที่ 28 ตุลาคม 2567',
    items: [ { id: 1, name: 'Keynote Speaker Fee', time: '15:00', amount: 73000, icon: '🎤' } ]
  },
  {
    date: 'วันที่ 27 ตุลาคม 2567',
    items: [ { id: 2, name: 'Lunch for 200 attendees', time: '12:30', amount: 880000, icon: '🍔' } ]
  },
  {
    date: 'วันที่ 26 ตุลาคม 2567',
    items: [ { id: 3, name: 'Convention Hall Rental', time: '10:00', amount: 150000, icon: '🏛️' } ]
  }
])
</script>

<template>
  <NuxtLayout name="event">
    <div>
      <h2 class="text-2xl font-bold text-text-primary mb-4">
        ติดตามค่าใช้จ่าย
      </h2>
      <div class="space-y-6">
        <div v-for="group in expensesByDate" :key="group.date">
          <h3 class="text-sm font-semibold text-text-secondary mb-2">{{ group.date }}</h3>
          <div class="space-y-3">
            <UiCard v-for="expense in group.items" :key="expense.id" class="!p-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-4">
                  <span class="text-2xl">{{ expense.icon }}</span>
                  <div>
                    <h4 class="font-semibold text-text-primary">{{ expense.name }}</h4>
                    <p class="text-sm text-text-secondary">{{ group.date }} - {{ expense.time }}</p>
                    <p class="text-lg font-bold text-text-primary mt-1">฿{{ expense.amount.toLocaleString() }}</p>
                  </div>
                </div>
                <span class="text-text-secondary text-xl">⌄</span>
              </div>
            </UiCard>
          </div>
        </div>
      </div>
    </div>
    
    <template #fab>
      <EventFabButton class="fixed bottom-24 right-8" /> </template>
  </NuxtLayout>
</template>