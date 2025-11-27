<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import BudgetChart from '~/components/budget/BudgetChart.vue'
import { useAppLocale } from '~/composables/useAppLocale'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsApi } from '~/composables/useEventsApi'
import { useExpensesApi } from '~/composables/useExpensesApi'

// ✅ บอก Nuxt ว่าหน้านี้ใช้ layout 'event'
definePageMeta({
  layout: 'event'
})

const { t } = useAppLocale()
const route = useRoute()
const { getEventById } = useEventsApi()
const { getExpensesByEventId } = useExpensesApi()

const eventId = route.params.id
const event = getEventById(eventId)

const budget = computed(() => Number(event.value?.total_budget) || 0)
const eventExpenses = getExpensesByEventId(eventId)

const used = computed(() => eventExpenses.value.reduce((sum, item) => sum + Number(item.amount), 0))
const paid = computed(() => eventExpenses.value.filter(item => item.is_paid).reduce((sum, item) => sum + Number(item.amount), 0))
const remaining = computed(() => budget.value - used.value)
const pending = computed(() => used.value - paid.value)

const usedPercent = computed(() => budget.value === 0 ? 0 : Math.min(100, (used.value / budget.value) * 100))
const paidPercent = computed(() => budget.value === 0 ? 0 : Math.min(100, (paid.value / budget.value) * 100))

const formatMoney = (amount) => {
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const categories = computed(() => {
  const cats = {}
  eventExpenses.value.forEach(e => {
    if (!cats[e.category]) {
      cats[e.category] = { name: e.category, amount: 0, icon: '📝' }
    }
    cats[e.category].amount += Number(e.amount)
  })
  return Object.values(cats).sort((a, b) => b.amount - a.amount)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50/30">
    <div class="w-full py-6 px-4 sm:px-6 pb-24">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span>📊</span> {{ t.budget_overview }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <UiCard class="p-4 sm:p-5 border-l-4 border-l-blue-500 relative overflow-hidden shadow-sm">
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{{ t.total_budget }}</p>
          <p class="text-xl sm:text-2xl font-bold text-gray-800">฿{{ formatMoney(budget) }}</p>
          <div class="absolute right-0 top-0 p-4 opacity-10 text-5xl sm:text-6xl text-blue-500">💰</div>
        </UiCard>

        <UiCard class="p-4 sm:p-5 border-l-4 border-l-green-500 relative overflow-hidden shadow-sm">
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">คงเหลือ (Remaining)</p>
          <p class="text-xl sm:text-2xl font-bold" :class="remaining < 0 ? 'text-red-500' : 'text-green-600'">
            ฿{{ formatMoney(remaining) }}
          </p>
          <div class="absolute right-0 top-0 p-4 opacity-10 text-5xl sm:text-6xl text-green-500">📉</div>
        </UiCard>

        <UiCard class="p-4 sm:p-5 border-l-4 border-l-orange-500 relative overflow-hidden shadow-sm">
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">ค้างจ่าย (Pending)</p>
          <p class="text-xl sm:text-2xl font-bold text-orange-500">฿{{ formatMoney(pending) }}</p>
          <div class="absolute right-0 top-0 p-4 opacity-10 text-5xl sm:text-6xl text-orange-500">⏳</div>
        </UiCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 px-4 sm:px-0">
        <UiCard class="lg:col-span-2 p-5 sm:p-6 shadow-sm">
          <h3 class="font-bold text-gray-900 mb-4 sm:mb-6 text-lg">สถานะการใช้งบประมาณ</h3>
          <div class="mb-6 sm:mb-8">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">ใช้ไปแล้ว (Used)</span>
              <span class="font-bold text-gray-900">{{ usedPercent.toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-4 sm:h-5 shadow-inner overflow-hidden relative">
              <div 
                class="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                :class="usedPercent > 100 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'"
                :style="{ width: `${Math.min(usedPercent, 100)}%` }"
              >
                <span v-if="usedPercent > 15" class="text-[10px] text-white font-bold hidden sm:inline">{{ formatMoney(used) }}</span>
              </div>
            </div>
            <div class="text-right mt-1 text-xs text-gray-400">จากงบ {{ formatMoney(budget) }}</div>
          </div>

          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">สถานะการจ่ายเงิน (Paid)</span>
              <span class="font-bold text-green-600">{{ paidPercent.toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 mb-2 overflow-hidden">
              <div 
                class="h-full rounded-full bg-green-500 transition-all duration-700 ease-out"
                :style="{ width: `${paidPercent}%` }"
              ></div>
            </div>
            <div class="flex flex-col sm:flex-row justify-between text-xs gap-1">
              <span class="text-green-600 font-medium">✅ จ่ายแล้ว: ฿{{ formatMoney(paid) }}</span>
              <span class="text-orange-500 font-medium">⏳ ค้างจ่าย: ฿{{ formatMoney(pending) }}</span>
            </div>
          </div>
        </UiCard>

        <UiCard class="p-5 sm:p-6 flex flex-col items-center justify-center bg-gray-50/50 shadow-sm border border-gray-100">
          <h3 class="font-bold text-gray-900 mb-2 w-full text-center text-lg">สัดส่วนค่าใช้จ่าย</h3>
          <BudgetChart :categories="categories" :total="used" />
        </UiCard>
      </div>

      <UiCard class="p-5 sm:p-6 mx-4 sm:mx-0 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>📑</span> {{ t.expenses_by_category }}
        </h3>
        
        <div v-if="categories.length === 0" class="text-center py-10">
          <div class="text-4xl mb-3 opacity-30">📊</div>
          <p class="text-gray-400">ยังไม่มีข้อมูลค่าใช้จ่าย</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div v-for="cat in categories" :key="cat.name" class="relative group">
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                  {{ cat.icon }}
                </span>
                <div>
                  <p class="font-bold text-gray-800 text-sm">{{ cat.name }}</p>
                  <p class="text-xs text-gray-400">{{ ((cat.amount / used) * 100).toFixed(1) }}%</p>
                </div>
              </div>
              <span class="font-bold text-gray-900">฿{{ formatMoney(cat.amount) }}</span>
            </div>
            
            <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                class="h-full rounded-full bg-accent group-hover:opacity-80 transition-all"
                :style="{ width: `${(cat.amount / used) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </UiCard>

    </div>
  </div>
</template>