<script setup>
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useExpensesApi } from '~/composables/useExpensesApi'
import { useAppLocale } from '~/composables/useAppLocale'

const route = useRoute()
const { t } = useAppLocale()
const eventId = route.params.id
const { getExpensesByEventId, addExpense, updateExpense, removeExpense, categories } = useExpensesApi()

const expenses = getExpensesByEventId(eventId)
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '', amount: null, date: '', time: '', category: '' })

const expensesGrouped = computed(() => {
  const groups = {}
  expenses.value.forEach(item => {
    if (!groups[item.date]) groups[item.date] = []
    groups[item.date].push(item)
  })
  return Object.keys(groups).sort().reverse().map(date => ({ date, items: groups[date] }))
})

const totalAmount = computed(() => expenses.value.reduce((sum, e) => sum + Number(e.amount), 0))

const getCategoryIcon = (catName) => {
  const found = categories.value.find(c => c.name === catName)
  return found ? found.icon : '🧾'
}

const openCreate = () => {
  isEditing.value = false
  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  form.value = { id: null, name: '', amount: null, date: today, time: now, category: categories.value[0]?.name || '' }
  isModalOpen.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSave = () => {
  const payload = { ...form.value, event_id: Number(eventId) }
  isEditing.value ? updateExpense(payload) : addExpense(payload)
  isModalOpen.value = false
}

const handleDelete = (id) => {
  if(confirm(t.value.confirm_delete_expense)) removeExpense(id)
}
</script>

<template>
  <NuxtLayout name="event">
    <div class="max-w-4xl mx-auto py-2">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 class="text-2xl font-bold text-text-primary">{{ t.expenses_title }}</h2>
        <div class="bg-white px-5 py-3 rounded-xl border border-base-border shadow-sm flex items-center gap-3">
          <div>
            <p class="text-xs text-text-secondary font-medium uppercase tracking-wide">{{ t.expenses_total }}</p>
            <p class="text-xl font-bold text-accent">฿{{ totalAmount.toLocaleString() }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="expenses.length === 0" class="text-center text-text-secondary py-20 flex flex-col items-center bg-white rounded-xl border-2 border-dashed border-base-border">
        <p class="text-lg font-medium text-gray-900">{{ t.no_expenses }}</p>
        <p class="text-sm mb-6 text-gray-500">{{ t.start_tracking }}</p>
        <UiButton variant="primary" @click="openCreate">+ {{ t.btn_add_expense }}</UiButton>
      </div>

      <div v-else class="space-y-8 pb-24">
        <div v-for="group in expensesGrouped" :key="group.date">
          <h3 class="sticky top-[64px] z-10 bg-base-bg/95 backdrop-blur py-3 text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-orange-100"></span>
            {{ group.date }}
          </h3>
          <div class="space-y-3">
            <div v-for="expense in group.items" :key="expense.id" class="group bg-white rounded-xl border border-base-border flex flex-col sm:flex-row overflow-hidden relative">
              <div class="flex-1 p-4 flex items-center gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 shadow-sm">
                  {{ getCategoryIcon(expense.category) }}
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="font-bold text-text-primary text-lg truncate">{{ expense.name }}</h4>
                  <div class="flex items-center gap-2 text-sm text-text-secondary mt-1">
                    <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-medium">{{ expense.category }}</span>
                    <span class="text-xs">{{ expense.time }} น.</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between sm:justify-end gap-4 p-4 sm:border-l border-t sm:border-t-0 border-base-border bg-gray-50/50 min-w-[160px]">
                <div class="text-lg font-bold text-text-primary">฿{{ Number(expense.amount).toLocaleString() }}</div>
                <div class="flex gap-1">
                  <button @click="openEdit(expense)" class="p-2 text-gray-500 hover:text-accent"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg></button>
                  <button @click="handleDelete(expense.id)" class="p-2 text-gray-500 hover:text-red-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #fab><EventFabButton @click="openCreate" class="fixed bottom-8 right-8 shadow-xl z-50" /></template>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-center sm:items-start justify-center p-4 sm:pt-20 z-[100] bg-black/60 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white text-text-primary rounded-2xl shadow-2xl flex flex-col">
        <header class="flex items-center justify-between px-6 py-4 border-b border-base-border">
          <h3 class="text-lg font-bold">{{ isEditing ? t.modal_edit_expense : t.modal_add_expense }}</h3>
          <button @click="isModalOpen = false">✕</button>
        </header>
        <div class="p-6 space-y-5">
          <UiInput v-model="form.name" :label="t.label_item_name" />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t.label_amount }} (THB)</label>
            <input type="number" v-model.number="form.amount" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t.label_category }}</label>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="cat in categories" :key="cat.id" @click="form.category = cat.name" :class="['p-2 rounded-xl border', form.category === cat.name ? 'border-accent bg-orange-50' : 'border-gray-100']">
                <span class="text-2xl">{{ cat.icon }}</span>
                <span class="text-[10px] block truncate">{{ cat.name }}</span>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UiInput v-model="form.date" :label="t.label_date" type="date" />
            <UiInput v-model="form.time" :label="t.label_time" type="time" />
          </div>
        </div>
        <footer class="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <UiButton variant="secondary" @click="isModalOpen = false">{{ t.cancel }}</UiButton>
          <UiButton variant="primary" @click="handleSave">{{ isEditing ? t.save : t.save }}</UiButton>
        </footer>
      </div>
    </div>
  </NuxtLayout>
</template>