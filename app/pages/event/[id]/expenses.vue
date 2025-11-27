<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventBottomNav from '~/components/layout/EventBottomNav.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'

import { useExpensesApi } from '~/composables/useExpensesApi'
import { useCategories } from '~/composables/useCategories'
import { useAppLocale } from '~/composables/useAppLocale'

definePageMeta({
  layout: 'event'
})

const route = useRoute()
const { t } = useAppLocale()
const eventId = route.params.id
const { getExpensesByEventId, addExpense, updateExpense, removeExpense } = useExpensesApi()
const { categories, loadCategories } = useCategories()

const expenses = getExpensesByEventId(eventId)
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '', amount: null, estimated_amount: null, is_paid: false, date: '', time: '', category: '' })

// โหลด categories เมื่อเริ่มต้น
loadCategories()

// ... (Logic เดิมทั้งหมด) ...
const expensesGrouped = computed(() => {
  const groups = {}
  expenses.value.forEach(item => {
    const dateKey = item.date || 'ไม่ระบุวันที่'
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(item)
  })
  return Object.keys(groups).sort().reverse().map(date => ({ date, items: groups[date] }))
})

const totalActual = computed(() => expenses.value.reduce((sum, e) => sum + Number(e.amount || 0), 0))
const totalPaid = computed(() => expenses.value.filter(e => e.is_paid).reduce((sum, e) => sum + Number(e.amount || 0), 0))
const totalEstimated = computed(() => expenses.value.reduce((sum, e) => sum + Number(e.estimated_amount || 0), 0))
const budgetHealth = computed(() => {
  if (totalEstimated.value === 0) return 0
  return Math.min((totalActual.value / totalEstimated.value) * 100, 100)
})

const getCategoryIcon = (catName) => {
  const found = categories.value.find(c => c.name === catName)
  return found ? found.icon : '🧾'
}

const togglePaidStatus = async (item) => {
  const newItem = { ...item, is_paid: !item.is_paid, event_id: Number(eventId) }
  const index = expenses.value.findIndex(e => e.id === item.id)
  if (index !== -1) expenses.value[index].is_paid = !item.is_paid
  await updateExpense(newItem)
}

const getCurrentTime = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const openCreate = () => {
  isEditing.value = false
  const today = new Date().toISOString().split('T')[0]
  const now = getCurrentTime()
  form.value = { 
    id: null, 
    name: '', 
    amount: null, 
    estimated_amount: null, 
    is_paid: false, 
    date: today, 
    time: now, 
    category: categories.value[0]?.name || '' 
  }
  isModalOpen.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSave = () => {
  const payload = { 
    ...form.value, 
    event_id: Number(eventId),
    amount: Number(form.value.amount),
    estimated_amount: Number(form.value.estimated_amount || 0)
  }
  isEditing.value ? updateExpense(payload) : addExpense(payload)
  isModalOpen.value = false
}

const handleDelete = (id) => {
  if(confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
    removeExpense(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/30">
    <div class="w-full py-6 px-4 sm:px-6 pb-24">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-sm">
            💸
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ t.expenses_title }}</h2>
            <p class="text-sm text-gray-500">จัดการและติดตามรายจ่ายทั้งหมดในงานนี้</p>
          </div>
        </div>
        <UiButton variant="primary" @click="openCreate" class="hidden md:flex shadow-md">
           <span class="mr-2">+</span> เพิ่มรายการ
        </UiButton>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div class="flex justify-between items-end mb-3">
          <h2 class="text-gray-500 text-xs font-bold uppercase tracking-wider">งบประมาณคงเหลือ</h2>
          <div class="text-right">
             <span class="text-2xl font-bold" :class="totalActual > totalEstimated ? 'text-red-500' : 'text-gray-800'">
               {{ Math.round(budgetHealth) }}%
             </span>
          </div>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden relative shadow-inner">
          <div class="h-full rounded-full transition-all duration-700 ease-out shadow-sm" :class="totalActual > totalEstimated ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'" :style="{ width: `${budgetHealth}%` }"></div>
        </div>
        <div class="flex flex-wrap justify-between text-sm pt-2 border-t border-gray-50 gap-y-2">
          <div class="text-center w-1/3 min-w-[80px] border-r border-gray-50"><p class="text-xs text-gray-400 mb-1">ตั้งงบไว้ (Plan)</p><p class="font-bold text-gray-700">฿{{ totalEstimated.toLocaleString() }}</p></div>
          <div class="text-center w-1/3 min-w-[80px] border-r border-gray-50"><p class="text-xs text-gray-400 mb-1">ใช้จริง (Actual)</p><p class="font-bold text-blue-600">฿{{ totalActual.toLocaleString() }}</p></div>
          <div class="text-center w-1/3 min-w-[80px]"><p class="text-xs text-gray-400 mb-1">จ่ายแล้ว (Paid)</p><p class="font-bold text-green-600">฿{{ totalPaid.toLocaleString() }}</p></div>
        </div>
      </div>

      <div v-if="expenses.length === 0" class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
        <div class="text-5xl mb-4 opacity-20">🧾</div>
        <p class="text-gray-900 font-medium">ยังไม่มีรายการค่าใช้จ่าย</p>
        <UiButton variant="primary" class="mt-4" @click="openCreate">เพิ่มรายการแรก</UiButton>
      </div>

      <div v-else class="space-y-8">
        <div v-for="group in expensesGrouped" :key="group.date">
          <div class="flex items-center gap-3 mb-3 pl-1">
            <span class="w-2 h-2 rounded-full bg-accent"></span>
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider">{{ group.date }}</h3>
          </div>
          <div class="space-y-3">
            <div v-for="expense in group.items" :key="expense.id" class="group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md overflow-hidden" :class="[expense.amount > expense.estimated_amount && expense.estimated_amount > 0 ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100', expense.is_paid ? 'bg-green-50/30' : '']">
              <div class="flex flex-col sm:flex-row">
                <div class="flex-1 p-4 flex items-center gap-4 cursor-pointer" @click="openEdit(expense)">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">{{ getCategoryIcon(expense.category) }}</div>
                  <div class="min-w-0">
                    <h4 class="font-bold text-gray-800 text-lg">{{ expense.name }}</h4>
                    <div class="flex items-center flex-wrap gap-2 text-xs mt-1">
                      <span class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{{ expense.category }}</span>
                      <span v-if="expense.time" class="flex items-center gap-1 text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">⏰ {{ expense.time }}</span>
                      <span v-if="expense.estimated_amount > 0">
                        <span v-if="expense.amount > expense.estimated_amount" class="text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">⚠️ เกินงบ {{ (expense.amount - expense.estimated_amount).toLocaleString() }}</span>
                        <span v-else class="text-green-600 bg-green-50 px-2 py-0.5 rounded-md font-medium">✅ คุมงบได้ดี</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between sm:justify-end gap-5 p-4 bg-gray-50/50 sm:w-auto w-full border-t sm:border-t-0 sm:border-l border-gray-100">
                  <div class="text-right min-w-[80px]">
                    <div class="text-xl font-bold" :class="expense.amount > expense.estimated_amount && expense.estimated_amount > 0 ? 'text-red-600' : 'text-gray-900'">฿{{ Number(expense.amount).toLocaleString() }}</div>
                    <div v-if="expense.estimated_amount" class="text-xs text-gray-400">จากงบ {{ Number(expense.estimated_amount).toLocaleString() }}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                       <button @click.stop="openEdit(expense)" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg></button>
                       <button @click.stop="handleDelete(expense.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    </div>
                    <button @click.stop="togglePaidStatus(expense)" class="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95 border-2" :class="expense.is_paid ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-300 hover:border-green-400'"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <EventFabButton @click="openCreate" class="fixed bottom-24 right-4 md:bottom-8 md:right-8 shadow-xl z-50 hover:scale-110 transition-transform md:hidden" />
    <EventBottomNav :eventId="eventId" />

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-10 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] scale-100 transition-transform">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 class="font-bold text-gray-800 text-lg flex items-center gap-2">
            <span class="text-xl">{{ isEditing ? '✏️' : '✨' }}</span> 
            {{ isEditing ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่' }}
          </h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-xl">✕</button>
        </div>
        
        <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar bg-white">
          <div class="space-y-1.5">
             <label class="text-sm font-semibold text-gray-700 ml-1">ชื่อรายการ (เช่น ค่าสถานที่)</label>
             <UiInput v-model="form.name" placeholder="ระบุชื่อรายการ..." class="bg-gray-50 border-gray-200 focus:bg-white" />
          </div>
          
          <div class="flex gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div class="flex-1">
              <label class="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-wider">งบที่ตั้งไว้ (PLAN)</label>
              <input type="number" v-model.number="form.estimated_amount" class="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 outline-none text-center text-lg font-medium transition-all" placeholder="0" />
            </div>
            <div class="flex items-center text-gray-300 pt-5">➜</div>
            <div class="flex-1">
              <label class="text-[10px] font-bold text-accent uppercase mb-2 block tracking-wider">จ่ายจริง (ACTUAL)</label>
              <input type="number" v-model.number="form.amount" class="w-full bg-white border-2 border-accent/20 rounded-xl px-3 py-3 font-bold text-accent focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none text-center text-xl transition-all" placeholder="0" />
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold text-gray-700 mb-3 block ml-1">หมวดหมู่</label>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <button v-for="cat in categories" :key="cat.name" @click="form.category = cat.name"
                class="flex flex-col items-center justify-center py-3 px-1 rounded-xl border transition-all duration-200 aspect-square"
                :class="form.category === cat.name ? 'border-accent bg-orange-50 text-accent ring-2 ring-orange-100 shadow-sm translate-y-[-2px]' : 'border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-600'"
              >
                <span class="text-2xl mb-1">{{ cat.icon }}</span>
                <span class="text-[10px] font-medium truncate w-full text-center">{{ cat.name }}</span>
              </button>
            </div>
          </div>
          
          <div class="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border bg-gray-50 border-gray-100 hover:border-gray-300 group"
               @click="form.is_paid = !form.is_paid">
            <div class="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm bg-white" 
                 :class="{'bg-green-500 border-green-500': form.is_paid, 'border-gray-300 text-gray-300': !form.is_paid}">
               <svg v-if="form.is_paid" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div class="flex-1">
              <span class="text-base font-bold block" :class="form.is_paid ? 'text-green-600' : 'text-gray-700'">{{ form.is_paid ? 'ชำระเงินเรียบร้อยแล้ว' : 'ยังไม่ได้ชำระเงิน' }}</span>
              <span class="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">คลิกเพื่อเปลี่ยนสถานะ</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700 ml-1">วันที่</label>
              <UiInput v-model="form.date" type="date" class="bg-gray-50 border-gray-200" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700 ml-1">เวลา</label>
              <UiInput v-model="form.time" type="time" class="bg-gray-50 border-gray-200" />
            </div>
          </div>
        </div>

        <div class="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            v-if="isEditing" 
            @click="handleDelete(form.id)"
            class="mr-auto text-red-400 text-sm font-bold hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            ลบ
          </button>

          <UiButton variant="secondary" @click="isModalOpen = false" class="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 border-transparent">ยกเลิก</UiButton>
          <UiButton variant="primary" @click="handleSave" class="px-8 py-2.5 shadow-lg shadow-accent/30 hover:shadow-accent/50 transform hover:-translate-y-0.5 transition-all">บันทึก</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
</style>