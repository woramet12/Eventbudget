<script setup>
// ⭐️ 1. Import ปุ่ม UiIconButton ที่เราสร้างใหม่
import UiIconButton from '~/components/ui/UiIconButton.vue' 
import EventCard from '~/components/event/EventCard.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import EventFormModal from '~/components/event/EventFormModal.vue'
// (เราไม่ต้องใช้ UiButton (ปุ่มข้อความ) ในหน้านี้แล้ว)
// import UiButton from '~/components/ui/UiButton.vue' 

const { events, pending, fetchEvents, createEvent, updateEvent, deleteEvent } = useEventsApi()
const isModalOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref(null)

onMounted(() => { fetchEvents() })

const openCreateModal = () => {
  isEditing.value = false
  selectedEvent.value = { 
    id: null, name: '', description: '', start_date: '', end_date: '',
    client_name: '', location: '', total_budget: null, venue_name: '',
    venue_url: '', accommodation_name: '', accommodation_url: '', drive_link: ''
  }
  isModalOpen.value = true
}

const openEditModal = (event) => {
  isEditing.value = true
  selectedEvent.value = { ...event }
  isModalOpen.value = true
}

const handleSave = async (payload) => {
  if (isEditing.value) {
    await updateEvent(payload.id, payload)
  } else {
    const createData = { ...payload }
    delete createData.id 
    await createEvent(createData)
  }
  isModalOpen.value = false
}

const handleDelete = async (event) => {
   if (confirm(`ต้องการลบอีเว้นต์ "${event.name}" จริงหรือไม่?`)) {
     await deleteEvent(event.id)
   }
}
</script>

<template>
  <NuxtLayout name="default">
    
    <template #header-title>จัดการอีเวนต์</template>
    
    <div>
      <div v-if="pending" class="text-text-secondary">กำลังโหลด...</div>
      
      <div v-else-if="events.length === 0" class="text-text-secondary text-center py-16">
        <p>ยังไม่มีอีเวนท์ในระบบ</p>
        <UiButton variant="primary" class="mt-4" @click="openCreateModal">
          สร้างอีเว้นต์ใหม่
        </UiButton>
      </div>

      <div v-else class="space-y-4">
        <div v-for="event in events" :key="event.id" class="flex items-center gap-4">
          
          <NuxtLink :to="`/event/${event.id}`" class="flex-1">
            <EventCard :event="event" />
          </NuxtLink>
          
          <NuxtLink :to="`/event/${event.id}`">
            <UiIconButton variant="secondary" title="ดูรายละเอียด">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </UiIconButton>
          </NuxtLink>

          <UiIconButton variant="secondary" @click="openEditModal(event)" title="แก้ไข">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
          </UiIconButton>
          
          <UiIconButton variant="danger" @click="handleDelete(event)" title="ลบ">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </UiIconButton>
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
      <EventFabButton @click="openCreateModal" class="fixed bottom-8 right-8" />
    </template>

  </NuxtLayout>
</template>