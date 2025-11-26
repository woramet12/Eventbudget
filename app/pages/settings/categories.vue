<script setup>
import { ref } from 'vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
import { useSettingsApi } from '~/composables/useSettingsApi'
import { useAppLocale } from '~/composables/useAppLocale'

const { t } = useAppLocale()
const { categories, createCategory, updateCategory, deleteCategory } = useSettingsApi()

const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '', icon: '' })

const openCreate = () => {
  isEditing.value = false
  form.value = { id: null, name: '', icon: '' }
  isModalOpen.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  form.value = { ...item }
  isModalOpen.value = true
}

const handleSave = () => {
  if (!form.value.name) return alert('กรุณาระบุชื่อหมวดหมู่')
  if (isEditing.value) updateCategory(form.value.id, form.value)
  else createCategory(form.value)
  isModalOpen.value = false
}

const handleDelete = (item) => {
  if (confirm(`${t.value.confirm_delete} "${item.name}"?`)) deleteCategory(item.id)
}
</script>

<template>
  <!-- ❌ ลบ <NuxtLayout> ที่ครอบอยู่ออก -->
  <!-- ✅ เริ่มต้นด้วย div เนื้อหาได้เลย -->
  
  <div class="max-w-5xl mx-auto pb-24 pt-6 px-4 sm:px-0">
      
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900">{{ t.settings_categories }}</h2>
        <p class="text-gray-500 text-sm mt-1">จัดการประเภทรายจ่ายและไอคอนเพื่อความเป็นระเบียบ</p>
      </div>

      <div v-if="categories.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">📂</div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ t.no_categories || 'ยังไม่มีหมวดหมู่' }}</h3>
        <p class="text-gray-500 mb-6 text-sm">เพิ่มหมวดหมู่แรกของคุณเพื่อเริ่มใช้งาน</p>
        <UiButton variant="primary" @click="openCreate">เพิ่มหมวดหมู่</UiButton>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="cat in categories" 
          :key="cat.id" 
          class="group bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-200">
              {{ cat.icon || '📁' }}
            </div>
            <div>
              <h3 class="font-bold text-gray-900 group-hover:text-accent transition-colors">{{ cat.name }}</h3>
              <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Category</p>
            </div>
          </div>

          <div class="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            <button 
              @click="openEdit(cat)" 
              class="p-2 text-gray-400 hover:text-accent hover:bg-orange-50 rounded-lg transition-colors"
              :title="t.edit"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"/></svg>
            </button>
            <button 
              @click="handleDelete(cat)" 
              class="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
              :title="t.delete"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- ปุ่ม FAB ย้ายออกมาวางตรงนี้ (ไม่ต้องใส่ใน template #fab เพราะเราเอา Layout ออกแล้ว) -->
      <EventFabButton @click="openCreate" class="fixed bottom-8 right-8 z-40 shadow-xl shadow-accent/30" />

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
                <div class="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
                  {{ form.icon || '✨' }}
                </div>
                <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? t.settings_edit_category : t.settings_add_category }}</h3>
              </div>
              
              <div class="space-y-4">
                <UiInput v-model="form.name" :label="t.label_cat_name" placeholder="เช่น ค่าเดินทาง, ค่าอาหาร" />
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">{{ t.label_cat_icon }}</label>
                  <div class="flex gap-3">
                    <input 
                      v-model="form.icon" 
                      class="w-14 text-center px-2 py-2.5 bg-white border border-gray-200 rounded-xl text-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                      placeholder="🍔"
                    />
                    <div class="flex-1 text-xs text-gray-400 flex items-center bg-gray-50 rounded-xl px-3 leading-tight">
                      พิมพ์ Emoji หรือตัวอักษรเพื่อใช้เป็นไอคอน
                    </div>
                  </div>
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

  </div>
</template>

<style scoped>
.animate-scale-up { animation: scaleUp 0.2s ease-out; }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>