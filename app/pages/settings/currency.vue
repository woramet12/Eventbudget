<script setup>
import { ref } from 'vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useSettingsApi } from '~/composables/useSettingsApi'
import { useAppLocale } from '~/composables/useAppLocale'

// ✅ กำหนด Title ของหน้า
definePageMeta({ title: 'การจัดการสกุลเงิน' })

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
  <div class="min-h-screen bg-gray-50/50">
    <div class="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 pb-24">
      
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">{{ t.currency_management }}</h2>
          <p class="text-gray-500 mt-2 text-sm sm:text-base">จัดการอัตราแลกเปลี่ยนและสกุลเงินหลักที่ใช้ในระบบของคุณ</p>
        </div>
        <UiButton variant="primary" @click="openCreate" class="hidden sm:flex items-center gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          {{ t.add_currency }}
        </UiButton>
      </div>

      <div v-if="!currencies || currencies.length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm text-center">
         <div class="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner animate-bounce-slow">💱</div>
         <h3 class="text-xl font-bold text-gray-900 mb-2">ยังไม่มีสกุลเงิน</h3>
         <p class="text-gray-500 mb-8 text-sm max-w-xs mx-auto">เริ่มต้นด้วยการเพิ่มสกุลเงินหลัก หรือสกุลเงินต่างประเทศเพื่อใช้ในการคำนวณงบประมาณ</p>
         <UiButton variant="primary" @click="openCreate">{{ t.add_currency }}</UiButton>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="cur in currencies" 
          :key="cur.id" 
          class="group relative bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] border border-gray-100 hover:border-accent/20 transition-all duration-300 ease-out flex flex-col overflow-hidden cursor-default"
        >
          <div class="absolute -right-6 -top-6 text-[120px] font-black text-gray-50 group-hover:text-orange-50/50 transition-colors duration-300 select-none pointer-events-none leading-none z-0">
            {{ cur.code.substring(0, 1) }}
          </div>

          <div class="relative z-10 flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold bg-gray-50 border border-gray-100 text-gray-700 shadow-sm group-hover:scale-105 transition-transform duration-300">
              {{ cur.code.substring(0, 2) }}
            </div>
            <span 
              v-if="cur.is_base_currency" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wider shadow-sm"
            >
              Base
            </span>
          </div>

          <div class="relative z-10 flex-1">
            <h3 class="text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-accent transition-colors">{{ cur.code }}</h3>
            <p class="text-sm text-gray-500 font-medium truncate mb-6">{{ cur.name || 'Unknown Currency' }}</p>
            
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 group-hover:border-orange-100 transition-colors">
              <p class="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Exchange Rate</p>
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-bold text-gray-900">1.00</span>
                <span class="text-xs font-medium text-gray-400">{{ cur.code }}</span>
                <span class="text-gray-300">=</span>
                <span class="text-lg font-bold text-accent">{{ cur.rate_to_base }}</span>
                <span class="text-xs font-medium text-gray-400">Base</span>
              </div>
            </div>
          </div>

          <div class="relative z-10 flex gap-3 mt-6 pt-4 border-t border-gray-50 opacity-100 lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button 
              @click="openEdit(cur)" 
              class="flex-1 py-2 px-4 rounded-lg text-xs font-bold text-gray-600 bg-gray-50 hover:bg-white hover:text-accent hover:shadow-md hover:ring-1 hover:ring-accent/20 transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"/></svg>
              {{ t.edit }}
            </button>
            <button 
              v-if="!cur.is_base_currency" 
              @click="handleDelete(cur)" 
              class="py-2 px-4 rounded-lg text-xs font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white hover:shadow-md transition-all flex items-center justify-center"
              :title="t.delete"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <EventFabButton @click="openCreate" class="fixed bottom-8 right-8 z-40 shadow-xl shadow-accent/30 sm:hidden" />

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="isModalOpen = false"></div>

          <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform transition-all scale-100 overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-orange-50 to-white z-0"></div>

            <div class="relative z-10">
              <div class="text-center mb-8">
                <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg ring-4 ring-orange-50">
                  💱
                </div>
                <h3 class="text-2xl font-bold text-gray-900">{{ isEditing ? t.edit_currency : t.add_currency }}</h3>
                <p class="text-sm text-gray-500 mt-1">กรอกข้อมูลสกุลเงินและอัตราแลกเปลี่ยน</p>
              </div>
              
              <div class="space-y-5">
                <div class="grid grid-cols-3 gap-4">
                  <div class="col-span-1">
                    <UiInput v-model="form.code" :label="t.label_code" placeholder="USD" class="uppercase font-mono font-bold" />
                  </div>
                  <div class="col-span-2">
                    <UiInput v-model="form.name" :label="t.label_currency_name" placeholder="US Dollar" />
                  </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                    {{ t.label_rate }}
                    <span class="text-[10px] font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full border">เทียบกับ Base</span>
                  </label>
                  <div class="relative flex items-center">
                    <div class="absolute left-4 text-gray-400 font-bold select-none">1 {{ form.code || '???' }} =</div>
                    <input 
                      v-model.number="form.rate_to_base" 
                      type="number" 
                      step="0.0001"
                      class="w-full pl-24 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-bold focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-right"
                      placeholder="0.00"
                    />
                    <div class="absolute right-4 text-xs font-bold text-gray-400 pointer-events-none">
                      BASE
                    </div>
                  </div>
                  <p class="text-xs text-gray-400 mt-2 ml-1 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    ตัวอย่าง: 1 USD = 36.50 THB
                  </p>
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
                <UiButton variant="secondary" @click="isModalOpen = false" class="flex-1 justify-center py-3">{{ t.cancel }}</UiButton>
                <UiButton variant="primary" @click="handleSave" class="flex-1 justify-center py-3 shadow-lg shadow-accent/20 hover:shadow-accent/40">{{ t.save }}</UiButton>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}
</style>