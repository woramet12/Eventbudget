<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventBottomNav from '~/components/layout/EventBottomNav.vue'

// 👇 Import Component เมนูที่คุณมีอยู่แล้ว (แก้ path ให้ตรงกับที่เก็บไฟล์จริงของคุณนะครับ)


import { useExpensesApi } from '~/composables/useExpensesApi'
import { useAppLocale } from '~/composables/useAppLocale'

const route = useRoute()
const { t } = useAppLocale()
const eventId = route.params.id
const { getExpensesByEventId, addExpense, updateExpense, removeExpense, categories } = useExpensesApi()

const expenses = getExpensesByEventId(eventId)
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '', amount: null, estimated_amount: null, is_paid: false, date: '', time: '', category: '' })

// จัดกลุ่มตามวันที่
const expensesGrouped = computed(() => {
  const groups = {}
  expenses.value.forEach(item => {
    const dateKey = item.date || 'ไม่ระบุวันที่'
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(item)
  })
  return Object.keys(groups).sort().reverse().map(date => ({ date, items: groups[date] }))
})

// คำนวณยอดรวม
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

// ⚡️ Quick Toggle: กดปุ่มเดียวเปลี่ยนสถานะจ่ายเงิน
const togglePaidStatus = async (item) => {
  const newItem = { ...item, is_paid: !item.is_paid, event_id: Number(eventId) }
  const index = expenses.value.findIndex(e => e.id === item.id)
  if (index !== -1) expenses.value[index].is_paid = !item.is_paid
  await updateExpense(newItem)
}

// ฟอร์ม
const openCreate = () => {
  isEditing.value = false
  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  form.value = { id: null, name: '', amount: null, estimated_amount: null, is_paid: false, date: today, time: now, category: categories.value[0]?.name || '' }
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
    isModalOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen p-4 sm:p-6 bg-gray-50/30">
    <div class="max-w-4xl mx-auto pb-24">
      
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
          <div 
            class="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
            :class="totalActual > totalEstimated ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'"
            :style="{ width: `${budgetHealth}%` }"
          ></div>
        </div>

        <div class="flex justify-between text-sm pt-2 border-t border-gray-50">
          <div class="text-center w-1/3 border-r border-gray-50">
            <p class="text-xs text-gray-400 mb-1">ตั้งงบไว้ (Plan)</p>
            <p class="font-bold text-gray-700">฿{{ totalEstimated.toLocaleString() }}</p>
          </div>
          <div class="text-center w-1/3 border-r border-gray-50">
            <p class="text-xs text-gray-400 mb-1">ใช้จริง (Actual)</p>
            <p class="font-bold text-blue-600">฿{{ totalActual.toLocaleString() }}</p>
          </div>
          <div class="text-center w-1/3">
            <p class="text-xs text-gray-400 mb-1">จ่ายแล้ว (Paid)</p>
            <p class="font-bold text-green-600">฿{{ totalPaid.toLocaleString() }}</p>
          </div>
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
            <div 
              v-for="expense in group.items" 
              :key="expense.id" 
              class="group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md overflow-hidden"
              :class="[
                expense.amount > expense.estimated_amount && expense.estimated_amount > 0 ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100',
                expense.is_paid ? 'bg-green-50/30' : ''
              ]"
            >
              <div class="flex flex-col sm:flex-row">
                
                <div class="flex-1 p-4 flex items-center gap-4 cursor-pointer" @click="openEdit(expense)">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                    {{ getCategoryIcon(expense.category) }}
                  </div>
                  <div class="min-w-0">
                    <h4 class="font-bold text-gray-800 text-lg">{{ expense.name }}</h4>
                    <div class="flex items-center gap-2 text-xs mt-1">
                      <span class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{{ expense.category }}</span>
                      
                      <span v-if="expense.estimated_amount > 0">
                        <span v-if="expense.amount > expense.estimated_amount" class="text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                          ⚠️ เกินงบ {{ (expense.amount - expense.estimated_amount).toLocaleString() }}
                        </span>
                        <span v-else class="text-green-600 bg-green-50 px-2 py-0.5 rounded-md font-medium">
                          ✅ คุมงบได้ดี
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-5 p-4 bg-gray-50/50 sm:w-auto w-full border-t sm:border-t-0 sm:border-l border-gray-100">
                  <div class="text-right min-w-[80px]">
                    <div class="text-xl font-bold" :class="expense.amount > expense.estimated_amount && expense.estimated_amount > 0 ? 'text-red-600' : 'text-gray-900'">
                      ฿{{ Number(expense.amount).toLocaleString() }}
                    </div>
                    <div v-if="expense.estimated_amount" class="text-xs text-gray-400">จากงบ {{ Number(expense.estimated_amount).toLocaleString() }}</div>
                  </div>

                  <div class="flex items-center gap-2">
                    <div class="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                       <button @click.stop="openEdit(expense)" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors" title="แก้ไข">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
                       </button>
                       <button @click.stop="handleDelete(expense.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="ลบ">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                    </div>

                    <button 
                      @click.stop="togglePaidStatus(expense)"
                      class="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95 border-2"
                      :class="expense.is_paid 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-300 hover:border-green-400'"
                      title="สถานะการจ่ายเงิน"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EventFabButton @click="openCreate" class="fixed bottom-24 right-4 md:bottom-8 md:right-8 shadow-xl z-50 hover:scale-110 transition-transform" />
    
    <EventBottomNav :eventId="eventId" />

    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center p-4 z-[100]">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="isModalOpen = false"></div>
      <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] scale-100 transition-transform">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-gray-800 text-lg">{{ isEditing ? '✏️ แก้ไขรายการ' : '✨ เพิ่มรายการใหม่' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">✕</button>
        </div>
        
        <div class="p-6 space-y-5 overflow-y-auto">
          <UiInput v-model="form.name" label="ชื่อรายการ (เช่น ค่าสถานที่)" />
          
          <div class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div class="flex-1">
              <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">งบที่ตั้งไว้ (Plan)</label>
              <input type="number" v-model.number="form.estimated_amount" class="w-full bg-white border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none text-center" placeholder="0" />
            </div>
            <div class="flex items-center text-gray-300">➜</div>
            <div class="flex-1">
              <label class="text-xs font-bold text-accent uppercase mb-1 block">จ่ายจริง (Actual)</label>
              <input type="number" v-model.number="form.amount" class="w-full bg-white border-2 border-accent/30 rounded-lg p-2 font-bold text-accent focus:ring-2 focus:ring-accent outline-none text-center text-lg" placeholder="0" />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">หมวดหมู่</label>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="cat in categories" :key="cat.name" @click="form.category = cat.name"
                class="flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200"
                :class="form.category === cat.name ? 'border-accent bg-orange-50 text-accent ring-1 ring-orange-200 scale-105 shadow-sm' : 'border-gray-100 hover:bg-gray-50 hover:border-gray-300'"
              >
                <span class="text-xl mb-1">{{ cat.icon }}</span>
                <span class="text-[10px] font-medium">{{ cat.name }}</span>
              </button>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border" 
               :class="form.is_paid ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'"
               @click="form.is_paid = !form.is_paid">
            <div class="w-6 h-6 rounded border bg-white flex items-center justify-center transition-all" 
                 :class="{'bg-green-500 border-green-500': form.is_paid}">
               <svg v-if="form.is_paid" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <span class="text-sm font-bold block" :class="form.is_paid ? 'text-green-700' : 'text-gray-600'">{{ form.is_paid ? 'ชำระเงินเรียบร้อยแล้ว' : 'ยังไม่ได้ชำระเงิน' }}</span>
              <span class="text-xs text-gray-400 font-normal">คลิกเพื่อเปลี่ยนสถานะ</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UiInput v-model="form.date" label="วันที่" type="date" />
            <UiInput v-model="form.time" label="เวลา" type="time" />
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <button 
            v-if="isEditing" 
            @click="handleDelete(form.id)"
            class="text-red-400 text-sm font-medium hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            ลบรายการ
          </button>
          <div v-else></div> <div class="flex gap-2">
            <UiButton variant="secondary" @click="isModalOpen = false">ยกเลิก</UiButton>
            <UiButton variant="primary" @click="handleSave" class="px-6 shadow-md shadow-accent/20">บันทึก</UiButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>