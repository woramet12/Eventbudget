<script setup>
import UiCard from '~/components/ui/UiCard.vue'

const { getEventById } = useEventsApi()
const route = useRoute()
const event = getEventById(route.params.id)
</script>

<template>
  <NuxtLayout name="event">
    
    <div>
      <UiCard v-if="event">
        <h2 class="text-xl font-bold text-text-primary mb-2">{{ event.name }}</h2>
        <p class="text-text-secondary mb-6">{{ event.description }}</p>
        
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span class="text-accent text-xl">📅</span>
            <span class="text-text-secondary">ช่วงวันที่: {{ event.start_date }} ถึง {{ event.end_date }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-accent text-xl">👤</span>
            <span class="text-text-secondary">ลูกค้า: {{ event.client_name }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-accent text-xl">📍</span>
            <span class="text-text-secondary">สถานที่: {{ event.location }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-accent text-xl">💰</span>
            <span class="text-text-secondary">งบประมาณ: ฿{{ event.total_budget?.toLocaleString() || 'N/A' }}</span>
          </div>

          <hr class="border-base-border" />
          
          <div class="flex items-center gap-3">
            <span class="text-accent text-xl">🏛️</span>
            <a :href="event.venue_url || '#'" target="_blank" class="text-text-secondary hover:text-accent">
              สถานที่จัดงาน: {{ event.venue_name }} ↗
            </a>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-accent text-xl">🏨</span>
            <a :href="event.accommodation_url || '#'" target="_blank" class="text-text-secondary hover:text-accent">
              ที่พัก: {{ event.accommodation_name }} ↗
            </a>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-accent text-xl">📁</span>
            <a :href="event.drive_link || '#'" target="_blank" class="text-text-secondary hover:text-accent">
              ลิงก์ไดรฟ์ (Access Files) ↗
            </a>
          </div>
        </div>
      </UiCard>
      <div v-else class="text-text-secondary p-4">ไม่พบข้อมูลอีเวนต์</div>
    </div>
    
    <template #fab>
      </template>
    
  </NuxtLayout>
</template>