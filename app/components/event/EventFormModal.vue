<script setup>
import { reactive, watch } from 'vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiInput from '~/components/ui/UiInput.vue'
import UiTextarea from '~/components/ui/UiTextarea.vue'
import { useAppLocale } from '~/composables/useAppLocale'

const props = defineProps({ show: Boolean, event: Object, isEditing: Boolean })
const emits = defineEmits(['close', 'save'])
const { t } = useAppLocale()

const form = reactive({
  id: null, name: '', description: '', start_date: '', end_date: '',
  client_name: '', location: '', total_budget: null,
  venue_name: '', venue_url: '', accommodation_name: '', accommodation_url: '', drive_link: ''
})

watch(() => props.event, (e) => {
  if (e) {
    Object.assign(form, e)
    if(e.start_date) form.start_date = e.start_date.split('T')[0]
    if(e.end_date) form.end_date = e.end_date.split('T')[0]
  } else {
    Object.keys(form).forEach(key => form[key] = key === 'total_budget' ? null : '')
  }
}, { immediate: true })

const close = () => emits('close')
const save = () => emits('save', { ...form })
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        
        <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="close"></div>

        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh] transform transition-all">
          
          <header class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">
              {{ isEditing ? t.modal_edit_event : t.modal_add_event }}
            </h3>
            <button 
              @click="close" 
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          </header>

          <div class="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-5">
            <UiInput v-model="form.name" :label="t.label_event_name" />
            <UiTextarea v-model="form.description" :label="t.label_desc" rows="3" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <UiInput v-model="form.start_date" :label="t.label_start_date" type="date" />
              <UiInput v-model="form.end_date" :label="t.label_end_date" type="date" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <UiInput v-model="form.client_name" :label="t.label_client_name" />
              <UiInput v-model="form.location" :label="t.label_location" />
            </div>
            <div class="border-t border-gray-100 my-2"></div>
            <UiInput v-model.number="form.total_budget" :label="t.label_total_budget" type="number" />
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider">รายละเอียดเพิ่มเติม</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UiInput v-model="form.venue_name" :label="t.label_venue_name" />
                <UiInput v-model="form.venue_url" :label="t.label_venue_url" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UiInput v-model="form.accommodation_name" :label="t.label_accom_name" />
                <UiInput v-model="form.accommodation_url" :label="t.label_accom_url" />
              </div>
            </div>
            <UiInput v-model="form.drive_link" :label="t.label_drive_link" />
          </div>

          <footer class="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl">
            <UiButton variant="secondary" @click="close">{{ t.cancel }}</UiButton>
            <UiButton variant="primary" @click="save">{{ isEditing ? t.save : t.create }}</UiButton>
          </footer>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
</style>