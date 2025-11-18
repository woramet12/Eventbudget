<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'

// (Mock Data - สร้างขึ้นเองตาม Schema)
const teamMembers = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '0812345678' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0898765432' },
])

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentMember = ref({ id: null, name: '', email: '', phone: '' })

const openCreateModal = () => {
  isEditing.value = false
  currentMember.value = { id: null, name: '', email: '', phone: '' }
  isModalOpen.value = true
}

const openEditModal = (member) => {
  isEditing.value = true
  currentMember.value = { ...member }
  isModalOpen.value = true
}

const handleSave = () => {
  if (isEditing.value) {
    // (จำลอง Logic การอัปเดต)
    const index = teamMembers.value.findIndex(m => m.id === currentMember.value.id)
    if (index !== -1) {
      teamMembers.value[index] = { ...currentMember.value }
    }
  } else {
    // (จำลอง Logic การสร้าง)
    const newMember = { ...currentMember.value, id: Math.max(0, ...teamMembers.value.map(m => m.id)) + 1 }
    teamMembers.value.push(newMember)
  }
  isModalOpen.value = false
}

const handleDelete = (member) => {
  if (confirm(`ต้องการลบสมาชิกทีม "${member.name}" จริงหรือไม่?`)) {
    // (จำลอง Logic การลบ)
    teamMembers.value = teamMembers.value.filter(m => m.id !== member.id)
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>จัดการทีม</template>
    
    <div>
      <div class="max-w-2xl space-y-3">
        <UiCard v-for="member in teamMembers" :key="member.id" class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="bg-gray-200 text-gray-700 rounded-full h-10 w-10 flex items-center justify-center font-semibold">
              {{ member.name.charAt(0) }}
            </span>
            <div>
              <h4 class="font-semibold text-text-primary">{{ member.name }}</h4>
              <p class="text-sm text-text-secondary">{{ member.email }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="openEditModal(member)" class="text-text-secondary hover:text-accent p-1">✎</button>
            <button @click="handleDelete(member)" class="text-text-secondary hover:text-danger p-1">🗑</button>
          </div>
        </UiCard>
      </div>
    </div>
    
    <template #fab>
      <EventFabButton @click="openCreateModal" class="fixed bottom-8 right-8" />
    </template>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-start justify-center p-4 pt-20 z-[100] bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div class="relative w-full max-w-lg bg-white text-gray-900 rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
        <header class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold">{{ isEditing ? 'แก้ไขสมาชิกทีม' : 'เพิ่มสมาชิกทีม' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-500 hover:text-gray-800 text-2xl">✕</button>
        </header>
        <div class="p-6 space-y-4 overflow-y-auto">
          <UiInput v-model="currentMember.name" label="ชื่อ-นามสกุล" />
          <UiInput v-model="currentMember.email" label="อีเมล" type="email" />
          <UiInput v-model="currentMember.phone" label="เบอร์โทรศัพท์" />
        </div>
        <footer class="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <UiButton variant="secondary" @click="isModalOpen = false">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSave">{{ isEditing ? 'บันทึก' : 'สร้าง' }}</UiButton>
        </footer>
      </div>
    </div>
    
  </NuxtLayout>
</template>