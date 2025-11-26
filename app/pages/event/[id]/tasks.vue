<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
// นำเข้า Nav และ FAB
import EventBottomNav from '~/components/layout/EventBottomNav.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'

import { useEventDetailsApi } from '~/composables/useEventDetailsApi'
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
const route = useRoute()
const eventId = route.params.id
const { getTasksByEvent, createTask, toggleTask, deleteTask } = useEventDetailsApi()

const tasks = getTasksByEvent(eventId)
const isModalOpen = ref(false)
const form = ref({ title: '', description: '', due_date: '' })

const openCreate = () => { form.value = { title: '', description: '', due_date: '' }; isModalOpen.value = true }
const handleSave = () => { createTask({ ...form.value, event_id: eventId }); isModalOpen.value = false }
const handleDelete = (id) => { if(confirm(t.value.confirm_delete_task)) deleteTask(id) }
</script>

<template>
  <div class="min-h-screen bg-gray-50/30">
    <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 pb-24">
      
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">{{ t.tasks_title }}</h2>
        <UiButton variant="primary" @click="openCreate" class="hidden sm:flex shadow-md">
           <span class="mr-2">+</span> {{ t.create_new_task }}
        </UiButton>
      </div>

      <div v-if="tasks.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center">
        <div class="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">✅</div>
        <p class="text-gray-500 font-medium mb-4">{{ t.no_tasks }}</p>
        <UiButton variant="primary" @click="openCreate">{{ t.create_new_task }}</UiButton>
      </div>

      <div v-else class="space-y-3">
        <div v-for="task in tasks" :key="task.id" class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group" :class="{'opacity-60 bg-gray-50': task.is_completed}">
          <div class="pt-1">
            <input type="checkbox" :checked="task.is_completed" @change="toggleTask(task.id)" class="w-6 h-6 rounded-md border-2 border-gray-300 text-accent focus:ring-accent cursor-pointer transition-colors" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-bold text-gray-800 transition-all truncate pr-2" :class="{'line-through text-gray-400': task.is_completed}">{{ task.title }}</h4>
            <p class="text-sm text-gray-500 line-clamp-2">{{ task.description }}</p>
            <div v-if="task.due_date" class="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border" :class="task.is_completed ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-orange-50 text-accent border-orange-100'">
              📅 {{ t.due_date_prefix }} {{ task.due_date }}
            </div>
          </div>
          <button @click="handleDelete(task.id)" class="text-gray-300 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all p-2 hover:bg-red-50 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <EventFabButton @click="openCreate" class="fixed bottom-24 right-4 md:bottom-8 md:right-8 shadow-xl z-50 hover:scale-110 transition-transform" />

    <EventBottomNav :eventId="eventId" />
    
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center p-4 z-[100]">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="isModalOpen = false"></div>
      <div class="relative w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-up">
        <div class="flex justify-between items-center mb-2">
           <h3 class="text-xl font-bold text-gray-900">{{ t.add_task }}</h3>
           <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <div class="space-y-4">
          <UiInput v-model="form.title" :label="t.label_task_title" placeholder="ชื่อรายการสิ่งที่ต้องทำ" />
          <UiInput v-model="form.description" :label="t.label_task_desc" placeholder="รายละเอียดเพิ่มเติม" />
          <UiInput v-model="form.due_date" :label="t.label_due_date" type="date" />
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
          <UiButton variant="secondary" @click="isModalOpen = false">{{ t.cancel }}</UiButton>
          <UiButton variant="primary" @click="handleSave">{{ t.save }}</UiButton>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-scale-up { animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>