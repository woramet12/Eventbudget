<script setup>
import { ref } from 'vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useSettingsApi } from '~/composables/useSettingsApi'
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
const { teamMembers, createTeamMember, updateTeamMember, deleteTeamMember } = useSettingsApi()
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '', email: '', phone: '' })

const openCreate = () => {
  isEditing.value = false
  form.value = { id: null, name: '', email: '', phone: '' }
  isModalOpen.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSave = () => {
  if (!form.value.name) return alert('กรุณาระบุชื่อ')
  if (isEditing.value) updateTeamMember(form.value.id, form.value)
  else createTeamMember(form.value)
  isModalOpen.value = false
}

const handleDelete = (item) => {
  if (confirm(`${t.value.confirm_delete_member} "${item.name}"`)) deleteTeamMember(item.id)
}

// Helper สำหรับสร้างสีพื้นหลัง Avatar จากชื่อ
const getAvatarColor = (name) => {
  const colors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600', 'bg-pink-100 text-pink-600']
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}
</script>

<template>
  <div class="min-h-screen p-4 sm:p-6 bg-gray-50/30">
    <div class="max-w-6xl mx-auto pb-24">
      
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900">{{ t.team_management }}</h2>
        <p class="text-gray-500 text-sm mt-1">จัดการสมาชิกในทีมและข้อมูลการติดต่อ</p>
      </div>

      <div v-if="teamMembers.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">👥</div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">ยังไม่มีสมาชิกในทีม</h3>
        <p class="text-gray-500 mb-6 text-sm">เชิญสมาชิกใหม่เพื่อเริ่มทำงานร่วมกัน</p>
        <UiButton variant="primary" @click="openCreate">เพิ่มสมาชิก</UiButton>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div 
          v-for="member in teamMembers" 
          :key="member.id" 
          class="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 relative overflow-hidden flex flex-col items-center text-center"
        >
          <div class="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button @click="openEdit(member)" class="p-1.5 text-gray-400 hover:text-accent bg-white/80 hover:bg-orange-50 rounded-lg shadow-sm border border-gray-100" title="แก้ไข">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"/></svg>
            </button>
            <button @click="handleDelete(member)" class="p-1.5 text-gray-400 hover:text-danger bg-white/80 hover:bg-red-50 rounded-lg shadow-sm border border-gray-100" title="ลบ">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>

          <div :class="['w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-inner', getAvatarColor(member.name)]">
            {{ member.name.charAt(0).toUpperCase() }}
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{{ member.name }}</h3>
          
          <div class="w-full border-t border-gray-50 my-3"></div>
          
          <div class="space-y-2 w-full">
            <div class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg justify-center">
              <span class="text-xs">📧</span>
              <span class="truncate">{{ member.email || '-' }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg justify-center">
              <span class="text-xs">📱</span>
              <span class="truncate">{{ member.phone || '-' }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <EventFabButton @click="openCreate" class="fixed bottom-8 right-8 z-40 shadow-xl shadow-accent/30" />

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="isModalOpen = false"></div>

          <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-scale-up">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
                👤
              </div>
              <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? t.edit_member : t.add_member }}</h3>
            </div>
            
            <div class="space-y-4">
              <UiInput v-model="form.name" :label="t.label_name" placeholder="ชื่อ-นามสกุล" />
              <UiInput v-model="form.email" :label="t.label_email" type="email" placeholder="example@email.com" />
              <UiInput v-model="form.phone" :label="t.label_phone" placeholder="0xx-xxx-xxxx" />
            </div>

            <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <UiButton variant="secondary" @click="isModalOpen = false" class="flex-1 justify-center">{{ t.cancel }}</UiButton>
              <UiButton variant="primary" @click="handleSave" class="flex-1 justify-center">{{ t.save }}</UiButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.animate-scale-up { animation: scaleUp 0.2s ease-out; }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>