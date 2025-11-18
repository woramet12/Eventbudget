<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'

// (Mock Data จาก SQL Dump)
const categories = ref([
  { id: 1, name: 'Catering', icon: '🍔' },
  { id: 2, name: 'Decorations', icon: '🎉' },
  { id: 3, name: 'Drinks', icon: '🍹' },
  { id: 4, name: 'Entertainment', icon: '🎤' },
  { id: 5, name: 'Food', icon: '🍎' },
  { id: 6, name: 'Marketing', icon: '📢' },
  { id: 7, name: 'Other', icon: '📦' },
  { id: 8, name: 'Transportation', icon: '🚗' },
  { id: 9, name: 'Venue', icon: '🏛️' },
])

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentCategory = ref({ id: null, name: '', icon: '' })

const openCreateModal = () => {
  isEditing.value = false
  currentCategory.value = { id: null, name: '', icon: '' }
  isModalOpen.value = true
}

const openEditModal = (category) => {
  isEditing.value = true
  currentCategory.value = { ...category }
  isModalOpen.value = true
}

const handleSave = () => {
  if (isEditing.value) {
    // (จำลอง Logic การอัปเดต)
    const index = categories.value.findIndex(c => c.id === currentCategory.value.id)
    if (index !== -1) {
      categories.value[index] = { ...currentCategory.value }
    }
  } else {
    // (จำลอง Logic การสร้าง)
    const newCategory = { ...currentCategory.value, id: Math.max(0, ...categories.value.map(c => c.id)) + 1 }
    categories.value.push(newCategory)
  }
  isModalOpen.value = false
}

const handleDelete = (category) => {
  if (confirm(`ต้องการลบหมวดหมู่ "${category.name}" จริงหรือไม่?`)) {
    // (จำลอง Logic การลบ)
    categories.value = categories.value.filter(c => c.id !== category.id)
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>หมวดหมู่ค่าใช้จ่าย</template>
    
    <div>
      <div class="max-w-2xl space-y-3">
        <UiCard v-for="cat in categories" :key="cat.id" class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ cat.icon }}</span>
            <span class="text-text-primary">{{ cat.name }}</span>
          </div>
          <div class="flex gap-2">
            <button @click="openEditModal(cat)" class="text-text-secondary hover:text-accent p-1">✎</button>
            <button @click="handleDelete(cat)" class="text-text-secondary hover:text-danger p-1">🗑</button>
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
          <h3 class="text-lg font-semibold">{{ isEditing ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-500 hover:text-gray-800 text-2xl">✕</button>
        </header>
        <div class="p-6 space-y-4 overflow-y-auto">
          <UiInput v-model="currentCategory.name" label="ชื่อหมวดหมู่" />
          <UiInput v-model="currentCategory.icon" label="ไอคอน (Emoji)" placeholder="🍔" />
        </div>
        <footer class="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <UiButton variant="secondary" @click="isModalOpen = false">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSave">{{ isEditing ? 'บันทึก' : 'สร้าง' }}</UiButton>
        </footer>
      </div>
    </div>

  </NuxtLayout>
</template>