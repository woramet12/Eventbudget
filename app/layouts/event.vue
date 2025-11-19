<script setup>
import EventBottomNav from '~/components/layout/EventBottomNav.vue'
import { useEventsApi } from '~/composables/useEventsApi'

const route = useRoute()
// ใช้ computed เพื่อให้ค่าอัปเดตตลอดเวลา
const eventId = computed(() => route.params.id)

const { events, fetchEvents } = useEventsApi()

const currentEventName = computed(() => {
  const found = events.value.find(e => e.id == eventId.value)
  return found ? found.name : 'กำลังโหลด...'
})

onMounted(() => {
  if (events.value.length === 0) {
    fetchEvents()
  }
})
</script>

<template>
  <div class="bg-base-bg min-h-screen text-text-primary">
    
    <header class="px-4 py-3 flex items-center gap-3 sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm transition-all">
      
      <NuxtLink to="/" class="p-2 -ml-2 rounded-full text-gray-500 hover:text-accent hover:bg-orange-50 transition-colors group" title="กลับหน้ารายการ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 group-hover:-translate-x-1 transition-transform">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </NuxtLink>
      
      <div class="flex-1 min-w-0">
        <h1 class="text-lg font-bold text-gray-900 truncate leading-tight">
          {{ currentEventName }}
        </h1>
        <p class="text-[10px] text-gray-500 font-medium">Event Manager</p>
      </div>

      </header>

    <main class="pb-32 px-4 pt-4">
      <slot />
    </main>

    <EventBottomNav :event-id="eventId" />
    
    <slot name="fab" />
  </div>
</template>