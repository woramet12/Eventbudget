<script setup>
import { ref } from 'vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useSettingsApi } from '~/composables/useSettingsApi'
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
const { currencies, createCurrency, updateCurrency, deleteCurrency } = useSettingsApi()
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, code: '', name: '', rate_to_base: 1.0 })

const openCreate = () => {
  isEditing.value = false
  form.value = { id: null, code: '', name: '', rate_to_base: 1.0 }
  isModalOpen.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSave = () => {
  if (!form.value.code) return alert('กรุณาระบุรหัสสกุลเงิน')
  if (isEditing.value) updateCurrency(form.value.id, form.value)
  else createCurrency(form.value)
  isModalOpen.value = false
}

const handleDelete = (item) => {
  if (item.is_base_currency) return alert(t.value.cannot_delete_base)
  if (confirm(`${t.value.confirm_delete} "${item.code}"?`)) deleteCurrency(item.id)
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>{{ t.currency_management }}</template>
    
    <div class="max-w-6xl mx-auto pb-24">
      
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900">{{ t.currency_management }}</h2>
        <p class="text-gray-500 text-sm mt-1">จัดการอัตราแลกเปลี่ยนและสกุลเงินหลักของระบบ</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div 
          v-for="cur in currencies" 
          :key="cur.id" 
          class="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 relative overflow-hidden"
        >
          <div class="absolute -right-4 -top-4 text-[100px] text-gray-50 opacity-10 font-bold select-none pointer-events-none">
            {{ cur.code.substring(0, 1) }}
          </div>

          <div class="relative z-10">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-2xl font-extrabold text-gray-900 tracking-tight">{{ cur.code }}</h3>
              <span 
                v-if="cur.is_base_currency" 
                class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-green-200"
              >
                Base Currency
              </span>
            </div>
            
            <p class="text-sm text-gray-500 font-medium mb-4 truncate">{{ cur.name }}</p>
            
            <div class="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
              <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Exchange Rate</p>
              <p class="text-lg font-bold text-text-primary flex items-baseline gap-1">
                {{ cur.rate_to_base }} 
                <span class="text-xs font-normal text-gray-400">to Base</span>
              </p>
            </div>

            <div class="flex gap-2 pt-2 border-t border-gray-50">
              <button 
                @click="openEdit(cur)" 
                class="flex-1 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-accent hover:border-gray-300 transition-colors"
              >
                {{ t.edit }}
              </button>
              <button 
                v-if="!cur.is_base_currency" 
                @click="handleDelete(cur)" 
                class="px-3 py-2 text-xs font-semibold text-red-500 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                :title="t.delete"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #fab>
      <EventFabButton @click="openCreate" class="fixed bottom-8 right-8 z-40 shadow-xl shadow-accent/30" />
    </template>

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

          <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-scale-up">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
                💱
              </div>
              <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? t.edit_currency : t.add_currency }}</h3>
            </div>
            
            <div class="space-y-4">
              <UiInput v-model="form.code" :label="t.label_code" placeholder="เช่น USD, JPY" class="uppercase" />
              <UiInput v-model="form.name" :label="t.label_currency_name" placeholder="ชื่อเต็มสกุลเงิน" />
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">{{ t.label_rate }}</label>
                <div class="relative">
                  <input 
                    v-model.number="form.rate_to_base" 
                    type="number" 
                    step="0.01"
                    class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                  <div class="absolute right-4 top-2.5 text-xs text-gray-400 pointer-events-none">
                    Rate to Base
                  </div>
                </div>
                <p class="text-[10px] text-gray-400 mt-1 ml-1">กำหนดอัตราแลกเปลี่ยนเมื่อเทียบกับสกุลเงินหลัก</p>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <UiButton variant="secondary" @click="isModalOpen = false" class="flex-1 justify-center">{{ t.cancel }}</UiButton>
              <UiButton variant="primary" @click="handleSave" class="flex-1 justify-center">{{ t.save }}</UiButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </NuxtLayout>
</template>

<style scoped>
.animate-scale-up { animation: scaleUp 0.2s ease-out; }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>