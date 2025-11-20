<script setup>
import UiIconButton from '~/components/ui/UiIconButton.vue' 
import EventCard from '~/components/event/EventCard.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import EventFormModal from '~/components/event/EventFormModal.vue'
import UiButton from '~/components/ui/UiButton.vue' 
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
const router = useRouter()
const { events, pending, fetchEvents, createEvent, updateEvent, deleteEvent } = useEventsApi()

const isModalOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref(null)

onMounted(() => { fetchEvents() })

const goToEventDetail = (id) => {
  if (!id) return 
  router.push(`/event/${id}`)
}

const openCreateModal = () => {
  isEditing.value = false
  selectedEvent.value = null
  isModalOpen.value = true
}

const openEditModal = (event) => {
  isEditing.value = true
  selectedEvent.value = { ...event }
  isModalOpen.value = true
}

const handleSave = async (payload) => {
  if (isEditing.value) await updateEvent(payload.id, payload)
  else await createEvent(payload)
  isModalOpen.value = false
}

const handleDelete = async (event) => {
   if (confirm(`${t.value.confirm_delete_event_msg} "${event.name}"`)) {
     await deleteEvent(event.id)
   }
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>{{ t.events_title }}</template>
    
    <div>
      <div v-if="pending" class="text-text-secondary p-4">{{ t.loading }}</div>
      
      <div v-else-if="events.length === 0" class="flex flex-col items-center justify-center py-16 text-text-secondary">
        <div class="text-6xl mb-4">📭</div>
        <p class="text-lg mb-4">{{ t.no_events }}</p>
        <UiButton variant="primary" @click="openCreateModal">
          {{ t.create_first_event }}
        </UiButton>
      </div>

      <div v-else class="space-y-4 pb-20">
        <div v-for="event in events" :key="event.id" class="flex items-start gap-3">
          
          <div 
            @click="goToEventDetail(event.id)"
            class="flex-1 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <EventCard :event="event" />
          </div>
          
          <div class="flex flex-col gap-2 pt-1">
            <UiIconButton variant="secondary" @click.stop="openEditModal(event)" :title="t.edit">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
            </UiIconButton>
            <UiIconButton variant="danger" @click.stop="handleDelete(event)" :title="t.delete">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </UiIconButton>
          </div>

        </div>
      </div>
      
      <EventFormModal 
        :show="isModalOpen" 
        :event="selectedEvent"
        :isEditing="isEditing"
        @close="isModalOpen = false" 
        @save="handleSave"
      />
    </div>
    
    <template #fab>
      <EventFabButton @click="openCreateModal" class="fixed bottom-8 right-8 shadow-lg z-50" />
    </template>

  </NuxtLayout>
</template>