<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import { useAppLocale } from '~/composables/useAppLocale'

const route = useRoute()
const { t } = useAppLocale()
const { getEventById, fetchEvents } = useEventsApi()

const event = getEventById(route.params.id)

onMounted(async () => {
  if (!event.value) {
    await fetchEvents()
    const loadedEvent = getEventById(route.params.id)
    if (loadedEvent.value) event.value = loadedEvent.value
  }
})

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A'
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)
}
</script>

<template>
  <NuxtLayout name="event">
    <div>
      <div v-if="!event" class="p-8 text-center text-gray-500 animate-pulse">
        {{ t.loading }}
      </div>

      <UiCard v-else class="p-6 animate-fade-in">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-text-primary mb-2">{{ event.name }}</h2>
          <p class="text-text-secondary whitespace-pre-line">{{ event.description || t.no_desc }}</p>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">📅</span>
              <div>
                <p class="text-sm text-gray-500">{{ t.event_date }}</p>
                <p class="text-text-primary font-medium">{{ event.start_date || '-' }} - {{ event.end_date || '-' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">💰</span>
              <div>
                <p class="text-sm text-gray-500">{{ t.budget }}</p>
                <p class="text-text-primary font-medium">{{ formatCurrency(event.total_budget) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">👤</span>
              <div>
                <p class="text-sm text-gray-500">{{ t.client }}</p>
                <p class="text-text-primary font-medium">{{ event.client_name || '-' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">📍</span>
              <div>
                <p class="text-sm text-gray-500">{{ t.location }}</p>
                <p class="text-text-primary font-medium">{{ event.location || '-' }}</p>
              </div>
            </div>
          </div>

          <hr class="border-base-border my-4" />
          
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">🏛️</span>
              <div class="flex-1">
                <p class="text-sm text-gray-500">{{ t.venue }}</p>
                <a v-if="event.venue_url" :href="event.venue_url" target="_blank" class="text-accent hover:underline font-medium">
                    {{ event.venue_name || t.open_link }} ↗
                </a>
                <span v-else class="text-text-primary">{{ event.venue_name || '-' }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">🏨</span>
              <div class="flex-1">
                <p class="text-sm text-gray-500">{{ t.accommodation }}</p>
                <a v-if="event.accommodation_url" :href="event.accommodation_url" target="_blank" class="text-accent hover:underline font-medium">
                    {{ event.accommodation_name || t.open_link }} ↗
                </a>
                <span v-else class="text-text-primary">{{ event.accommodation_name || '-' }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-accent text-xl w-8 text-center">📁</span>
              <div class="flex-1">
                <p class="text-sm text-gray-500">{{ t.files }}</p>
                <a v-if="event.drive_link" :href="event.drive_link" target="_blank" class="text-accent hover:underline font-medium">
                  Google Drive Link ↗
                </a>
                <span v-else class="text-text-secondary text-sm">{{ t.no_link }}</span>
              </div>
            </div>
          </div>
        </div>
      </UiCard>
    </div>
  </NuxtLayout>
</template>