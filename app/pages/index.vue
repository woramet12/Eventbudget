<script setup>
import { ref, computed, onMounted } from 'vue'
import EventCard from '~/components/event/EventCard.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import EventFormModal from '~/components/event/EventFormModal.vue'
import UiButton from '~/components/ui/UiButton.vue' 
import { useAppLocale } from '~/composables/useAppLocale'
import { useRouter } from 'vue-router'

const { t } = useAppLocale()
const router = useRouter()
const { events, pending, fetchEvents, createEvent, updateEvent, deleteEvent } = useEventsApi()

const isModalOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref(null)
const searchQuery = ref('')

onMounted(() => { fetchEvents() })

const filteredEvents = computed(() => {
  if (!events.value) return []
  if (!searchQuery.value) return events.value
  const query = searchQuery.value.toLowerCase()
  return events.value.filter(e => 
    e.name.toLowerCase().includes(query) || 
    (e.location && e.location.toLowerCase().includes(query)) ||
    (e.client_name && e.client_name.toLowerCase().includes(query))
  )
})

const totalBudget = computed(() => {
  return events.value ? events.value.reduce((sum, e) => sum + Number(e.total_budget || 0), 0) : 0
})

const goToEventDetail = (id) => { if (id) router.push(`/event/${id}`) }

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
  <div class="max-w-7xl mx-auto pb-24 px-4 sm:px-0 pt-6">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="md:col-span-1">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchQuery" type="text" class="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-white shadow-sm ring-1 ring-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="ค้นหาอีเวนต์..." />
          </div>
        </div>

        <div class="md:col-span-2 grid grid-cols-2 gap-4">
          <div class="bg-white p-3 px-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">อีเวนต์ทั้งหมด</p>
              <p class="text-2xl font-bold text-gray-800">{{ events.length }} <span class="text-xs text-gray-400 font-normal">รายการ</span></p>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">📅</div>
          </div>
          <div class="bg-white p-3 px-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">งบรวมทั้งหมด</p>
              <p class="text-2xl font-bold text-accent">฿{{ totalBudget.toLocaleString() }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-orange-50 text-accent flex items-center justify-center text-xl">💰</div>
          </div>
        </div>
      </div>

      <div v-if="pending" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-accent mb-4"></div>
        <p class="text-gray-400 text-sm animate-pulse">กำลังโหลดข้อมูล...</p>
      </div>
      
      <div v-else-if="filteredEvents.length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">{{ searchQuery ? '🔍' : '📭' }}</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ searchQuery ? 'ไม่พบข้อมูลที่ค้นหา' : t.no_events }}</h3>
        <UiButton v-if="!searchQuery" variant="primary" @click="openCreateModal" class="shadow-lg shadow-accent/30 px-8">{{ t.create_first_event }}</UiButton>
        <button v-else @click="searchQuery = ''" class="text-accent hover:underline text-sm font-medium">ล้างคำค้นหา</button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="event in filteredEvents" :key="event.id" class="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden ring-1 ring-transparent hover:ring-accent/20">
          <div @click="goToEventDetail(event.id)" class="flex-1 cursor-pointer p-1">
            <EventCard :event="event" class="h-full border-0 shadow-none" />
          </div>
          <div class="px-5 py-3 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 flex items-center justify-between mt-auto">
             <div class="flex items-center gap-2">
               <span class="w-2 h-2 rounded-full bg-green-500"></span>
               <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active</span>
             </div>
             <div class="flex items-center gap-1 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                <button @click.stop="openEditModal(event)" class="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95" :title="t.edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <div class="w-px h-4 bg-gray-200 mx-1"></div>
                <button @click.stop="handleDelete(event)" class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95" :title="t.delete">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
             </div>
          </div>
        </div>
      </div>
      
      <EventFormModal :show="isModalOpen" :event="selectedEvent" :isEditing="isEditing" @close="isModalOpen = false" @save="handleSave" />
      
      <template>
        <EventFabButton @click="openCreateModal" class="fixed bottom-8 right-8 shadow-xl shadow-accent/40 z-40 hover:scale-110 active:scale-95 transition-transform duration-200" />
      </template>

  </div>
</template>