<script setup>
import { ref, onMounted } from 'vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import UiTextarea from '~/components/ui/UiTextarea.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useTimelineApi } from '~/composables/useTimelineApi'

const route = useRoute()
const eventId = route.params.id
const { getTimelineByEventId, addDay, deleteDay, addItem, updateItem, deleteItem } = useTimelineApi()

const timelineData = getTimelineByEventId(eventId)

// --- Accordion Logic (Dropdown) ---
// เก็บ ID ของวันที่เปิดอยู่ (Default เปิดหมด หรือว่างไว้ถ้าอยากให้ปิดหมด)
const openDays = ref([])

// ฟังก์ชัน Toggle
const toggleDay = (dayId) => {
  if (openDays.value.includes(dayId)) {
    openDays.value = openDays.value.filter(id => id !== dayId)
  } else {
    openDays.value.push(dayId)
  }
}

// เปิดทุกวันโดย Default เมื่อโหลดหน้า
onMounted(() => {
  if (timelineData.value.length > 0) {
    openDays.value = timelineData.value.map(d => d.id)
  }
})

// --- Modals & Forms (เหมือนเดิม) ---
const isModalOpen = ref(false)
const isEditing = ref(false)
const activeDayId = ref(null)
const form = ref({ id: null, start_time: '', end_time: '', title: '', description: '', location: '', icon: '📍' })

const isDayModalOpen = ref(false)
const dayForm = ref({ date: '', title: '' })

const openAddDay = () => {
  dayForm.value = { date: '', title: '' }
  isDayModalOpen.value = true
}
const handleSaveDay = () => {
  if (!dayForm.value.date || !dayForm.value.title) return alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  addDay({ event_id: Number(eventId), date: dayForm.value.date, title: dayForm.value.title })
  // เปิดวันที่เพิ่งเพิ่มทันที
  setTimeout(() => {
      const newDay = timelineData.value[timelineData.value.length - 1]
      if (newDay) openDays.value.push(newDay.id)
  }, 100)
  isDayModalOpen.value = false
}
const handleDeleteDay = (dayId) => {
  if(confirm('ยืนยันการลบวันและกิจกรรมทั้งหมด?')) deleteDay(dayId)
}

const openCreateItem = (dayId) => {
  isEditing.value = false
  activeDayId.value = dayId
  form.value = { id: null, start_time: '', end_time: '', title: '', description: '', location: '', icon: '📍' }
  isModalOpen.value = true
}
const openEditItem = (dayId, item) => {
  isEditing.value = true
  activeDayId.value = dayId
  form.value = { ...item }
  isModalOpen.value = true
}
const handleSaveItem = () => {
  if (!form.value.title || !form.value.start_time) return alert('กรุณากรอกชื่อและเวลา')
  const payload = { ...form.value }
  isEditing.value ? updateItem(activeDayId.value, payload) : addItem(activeDayId.value, payload)
  isModalOpen.value = false
}
const handleDeleteItem = (dayId, itemId) => {
  if(confirm('ยืนยันการลบกิจกรรม?')) deleteItem(dayId, itemId)
}

const availableIcons = ['📝','🎤','☕','🍔','🗣️','🤝','🎉','🚌','🏨','💻','🎨','📍','📸','🏆','🎵']
</script>

<template>
  <NuxtLayout name="event">
    <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">กำหนดการ (Timeline)</h2>
          <p class="text-gray-500 mt-1 text-sm">จัดการลำดับกิจกรรมแบบเรียลไทม์</p>
        </div>
        <UiButton variant="primary" @click="openAddDay" class="shadow-lg hover:shadow-xl transition-shadow">
          <span class="mr-2 text-lg">+</span> เพิ่มวัน
        </UiButton>
      </div>

      <div v-if="timelineData.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">📅</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">เริ่มต้นสร้างกำหนดการ</h3>
        <p class="text-gray-500 mb-6 text-center max-w-xs">ยังไม่มีข้อมูลกิจกรรมในระบบ เริ่มต้นด้วยการเพิ่มวันแรกของงาน</p>
        <UiButton variant="secondary" @click="openAddDay">เพิ่มวันใหม่</UiButton>
      </div>

      <div v-for="(day, index) in timelineData" :key="day.id" class="relative mb-8 last:mb-0">
        
        <div 
          @click="toggleDay(day.id)"
          class="sticky top-[70px] z-10 py-3 -mx-4 px-4 sm:mx-0 sm:px-4 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all duration-200 group/header select-none"
        >
          <div class="flex items-center gap-4">
            <div class="transition-transform duration-300 text-gray-400" :class="{ 'rotate-180': !openDays.includes(day.id) }">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>

            <div class="flex items-center gap-3">
               <div class="bg-accent/10 text-accent px-3 py-1 rounded-lg font-bold text-lg min-w-[3rem] text-center">
                 {{ new Date(day.date).getDate() }}
               </div>
               <div>
                 <h3 class="text-lg font-bold text-gray-900 line-clamp-1">{{ day.title }}</h3>
                 <p class="text-xs text-gray-500">
                   {{ new Date(day.date).toLocaleDateString('th-TH', { month: 'long', year: 'numeric', weekday: 'long' }) }}
                 </p>
               </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2" @click.stop>
             <button @click="openCreateItem(day.id)" class="text-accent hover:bg-accent/10 p-2 rounded-lg transition-colors text-sm font-semibold hidden sm:flex items-center gap-1">
               <span>+ กิจกรรม</span>
             </button>
             <button @click="handleDeleteDay(day.id)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="ลบวัน">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </button>
          </div>
        </div>

        <transition 
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-4 max-h-0 overflow-hidden"
          enter-to-class="opacity-100 translate-y-0 max-h-[1000px] overflow-visible"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 max-h-[1000px] overflow-visible"
          leave-to-class="opacity-0 -translate-y-4 max-h-0 overflow-hidden"
        >
          <div v-show="openDays.includes(day.id)" class="relative pl-4 sm:pl-2 pb-4">
            
            <div class="absolute left-[27px] sm:left-[138px] top-0 bottom-0 w-[2px] bg-gray-100"></div>

            <div v-if="day.items.length === 0" class="pl-12 sm:pl-[160px] py-6">
               <button @click="openCreateItem(day.id)" class="text-gray-400 hover:text-accent text-sm flex items-center gap-2 border border-dashed border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                 + เพิ่มกิจกรรมแรกของวันนี้
               </button>
            </div>

            <div v-for="item in day.items" :key="item.id" class="relative mb-6 last:mb-0 group/item">
              <div class="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                
                <div class="sm:w-[140px] flex-shrink-0 pl-10 sm:pl-0 sm:text-right sm:pr-10 pt-1 relative">
                  <span class="text-base font-bold text-gray-900 font-numeric block">{{ item.start_time }}</span>
                  <span class="text-xs font-medium text-gray-400 font-numeric block mt-0.5" v-if="item.end_time">ถึง {{ item.end_time }}</span>
                </div>

                <div class="absolute left-[19px] sm:left-[130px] top-1.5 w-[18px] h-[18px] rounded-full border-[3px] border-white shadow-sm z-10 transition-transform duration-200 group-hover/item:scale-110 bg-accent"></div>

                <div class="flex-1 pr-1">
                  <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 relative group/card overflow-hidden">
                    
                    <div class="flex gap-4">
                      <div class="w-10 h-10 rounded-lg bg-gray-50 text-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                        {{ item.icon }}
                      </div>

                      <div class="flex-1 min-w-0">
                        <h4 class="text-base font-bold text-gray-900 leading-tight">{{ item.title }}</h4>
                        <p v-if="item.description" class="text-gray-500 text-sm mt-1 line-clamp-2">{{ item.description }}</p>
                        <div v-if="item.location" class="flex flex-wrap gap-2 mt-2">
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-gray-500">
                            📍 {{ item.location }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 bg-white/90 p-1 rounded-lg">
                      <button @click.stop="openEditItem(day.id, item)" class="p-1.5 text-gray-400 hover:text-blue-600 rounded-md transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"/></svg></button>
                      <button @click.stop="handleDeleteItem(day.id, item.id)" class="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="day.items.length > 0" class="ml-[31px] sm:ml-[140px] pl-10 sm:pl-0 mt-2 relative z-0">
              <button @click="openCreateItem(day.id)" class="group flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-accent transition-colors py-1.5 px-3 rounded-lg hover:bg-orange-50 border border-dashed border-gray-200 hover:border-accent/30 w-full sm:w-auto">
                <span class="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-accent group-hover:text-white flex items-center justify-center text-lg transition-colors">+</span>
                เพิ่มกิจกรรมถัดไป
              </button>
            </div>
          </div>
        </transition>

      </div>

    </div>

    <div v-if="isDayModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-scale-up">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-orange-50 text-accent rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📅</div>
          <h3 class="text-2xl font-bold text-gray-900">กำหนดวันใหม่</h3>
          <p class="text-sm text-gray-500">เลือกวันที่และตั้งชื่อธีมงาน</p>
        </div>
        <div class="space-y-5">
          <UiInput v-model="dayForm.date" label="วันที่จัดงาน" type="date" />
          <UiInput v-model="dayForm.title" label="ชื่อวัน / ธีม (Theme Title)" placeholder="เช่น Day 1: Opening Ceremony" />
        </div>
        <div class="grid grid-cols-2 gap-3 mt-8">
          <UiButton variant="secondary" @click="isDayModalOpen = false" class="justify-center">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSaveDay" class="justify-center">บันทึก</UiButton>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-scale-up overflow-hidden">
        <header class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่' }}</h3>
            <p class="text-sm text-gray-500 mt-1">กรอกรายละเอียดให้ครบถ้วน</p>
          </div>
          <button @click="isModalOpen = false" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-500 transition-colors">✕</button>
        </header>
        <div class="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          <UiInput v-model="form.title" label="ชื่อกิจกรรม" placeholder="เช่น ลงทะเบียน, Keynote Speaker" />
          <div class="grid grid-cols-2 gap-5">
            <UiInput v-model="form.start_time" label="เริ่มเวลา" type="time" />
            <UiInput v-model="form.end_time" label="สิ้นสุด (ถ้ามี)" type="time" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">เลือกไอคอนกิจกรรม</label>
            <div class="grid grid-cols-5 gap-3">
              <button v-for="icon in availableIcons" :key="icon" @click="form.icon = icon"
                :class="['h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 shadow-sm', form.icon === icon ? 'bg-accent text-white ring-4 ring-orange-100 scale-110' : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300']">
                {{ icon }}
              </button>
            </div>
          </div>
          <div class="space-y-4">
            <UiInput v-model="form.location" label="สถานที่ (Location)" placeholder="ระบุห้อง หรือสถานที่..." />
            <UiTextarea v-model="form.description" label="รายละเอียด (Optional)" rows="3" placeholder="บันทึกช่วยจำเพิ่มเติม..." />
          </div>
        </div>
        <footer class="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <UiButton variant="secondary" @click="isModalOpen = false">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSaveItem">บันทึกข้อมูล</UiButton>
        </footer>
      </div>
    </div>

    <template #fab>
      <EventFabButton class="fixed bottom-8 right-8 shadow-2xl z-50" /> 
    </template>
  </NuxtLayout>
</template>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>