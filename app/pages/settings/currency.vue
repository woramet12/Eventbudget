<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'

// (Mock Data จาก SQL Dump)
const currencies = ref([
  { id: 1, code: 'THB', name: 'Thai Baht', rate_to_base: 1.0000, is_base_currency: 1 },
  { id: 2, code: 'USD', name: 'US Dollar', rate_to_base: 36.5000, is_base_currency: 0 },
  { id: 3, code: 'EUR', name: 'Euro', rate_to_base: 39.5000, is_base_currency: 0 },
])

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentCurrency = ref({ id: null, code: '', name: '', rate_to_base: null })

const openCreateModal = () => {
  isEditing.value = false
  currentCurrency.value = { id: null, code: '', name: '', rate_to_base: null }
  isModalOpen.value = true
}

const openEditModal = (currency) => {
  isEditing.value = true
  currentCurrency.value = { ...currency }
  isModalOpen.value = true
}

const handleSave = () => {
  if (isEditing.value) {
    // (จำลอง Logic การอัปเดต)
    const index = currencies.value.findIndex(c => c.id === currentCurrency.value.id)
    if (index !== -1) {
      currencies.value[index] = { ...currentCurrency.value }
    }
  } else {
    // (จำลอง Logic การสร้าง)
    const newCurrency = { ...currentCurrency.value, id: Math.max(0, ...currencies.value.map(c => c.id)) + 1 }
    currencies.value.push(newCurrency)
  }
  isModalOpen.value = false
}

const handleDelete = (currency) => {
  if (currency.is_base_currency) {
    alert('ไม่สามารถลบสกุลเงินหลักได้')
    return
  }
  if (confirm(`ต้องการลบสกุลเงิน "${currency.name}" จริงหรือไม่?`)) {
    // (จำลอง Logic การลบ)
    currencies.value = currencies.value.filter(c => c.id !== currency.id)
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>จัดการสกุลเงิน</template>
    
    <div>
      <div class="max-w-2xl space-y-3">
        <UiCard v-for="currency in currencies" :key="currency.id" class="flex justify-between items-center">
          <div>
            <h4 class="font-semibold text-text-primary">
              {{ currency.code }} - {{ currency.name }}
              <span v-if="currency.is_base_currency" class="text-xs bg-accent text-white px-2 py-0.5 rounded-full ml-2">Base</span>
            </h4>
            <p class="text-sm text-text-secondary">1 {{ currency.code }} = {{ Number(currency.rate_to_base).toFixed(4) }} THB</p>
          </div>
          <div class="flex gap-2">
            <button @click="openEditModal(currency)" class="text-text-secondary hover:text-accent p-1">✎</button>
            <button v-if="!currency.is_base_currency" @click="handleDelete(currency)" class="text-text-secondary hover:text-danger p-1">🗑</button>
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
          <h3 class="text-lg font-semibold">{{ isEditing ? 'แก้ไขสกุลเงิน' : 'เพิ่มสกุลเงินใหม่' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-500 hover:text-gray-800 text-2xl">✕</button>
        </header>
        <div class="p-6 space-y-4 overflow-y-auto">
          <UiInput v-model="currentCurrency.code" label="Code (เช่น USD)" />
          <UiInput v-model="currentCurrency.name" label="ชื่อสกุลเงิน (เช่น US Dollar)" />
          <UiInput v-model.number="currentCurrency.rate_to_base" label="อัตราแลกเปลี่ยนเทียบกับ THB" type="number" />
        </div>
        <footer class="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <UiButton variant="secondary" @click="isModalOpen = false">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSave">{{ isEditing ? 'บันทึก' : 'สร้าง' }}</UiButton>
        </footer>
      </div>
    </div>
    
  </NuxtLayout>
</template>