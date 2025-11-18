<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
// definePageMeta({ layout: 'event' }) // ⭐️ ลบออก
const timelineDays = ref([
  { 
    id: 1, date: '26', month: 'ต.ค.', title: 'Event Start',
    items: [
      { id: 101, time: '08:00 - 09:00', name: 'Registration & Breakfast', description: 'Doors open, Coffee and croissants available.' },
      { id: 102, time: '09:00 - 10:00', name: 'Opening Keynote', description: 'Vision for the Future of Web Dev.' },
    ]
  },
  { id: 2, date: '27', month: 'ต.ค.', title: 'Day 2', items: [] },
  { id: 3, date: '28', month: 'ต.ค.', title: 'Event End', items: [] },
])
</script>

<template>
  <NuxtLayout name="event">
    <div>
      <h2 class="text-2xl font-bold text-text-primary mb-4">
        ปฏิทิน
      </h2>
      <div class="space-y-6">
        <div v-for="day in timelineDays" :key="day.id">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-4">
              <div class="text-center w-10">
                <p class="text-3xl font-bold text-text-primary">{{ day.date }}</p>
                <p class="text-xs text-text-secondary">{{ day.month }}</p>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-text-primary">{{ day.title }}</h3>
                <p class="text-sm text-text-secondary">{{ day.items.length }} items</p>
              </div>
            </div>
            <button class="text-text-secondary hover:text-accent">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
          <div v-if="day.items.length > 0" class="space-y-3 pl-14">
            <UiCard v-for="item in day.items" :key="item.id" class="!p-4">
              <div class="flex justify-between items-start">
                <div class="flex gap-4">
                  <span class="text-sm text-text-secondary w-24">{{ item.time }}</span>
                  <div>
                    <h4 class="font-semibold text-text-primary">{{ item.name }}</h4>
                    <p class="text-sm text-text-secondary">{{ item.description }}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="text-text-secondary hover:text-accent">✎</button>
                  <button class="text-text-secondary hover:text-accent">🗑</button>
                </div>
              </div>
            </UiCard>
            <button class="flex items-center gap-2 text-accent hover:text-accent-hover pl-4 pt-2">
              <span class="text-lg">+</span>
              <span class="text-sm font-semibold">เพิ่มกำหนดการ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <template #fab>
      </template>
  </NuxtLayout>
</template>