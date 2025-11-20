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
  <div v-if="show" class="fixed inset-0 flex items-start justify-center p-4 pt-24 z-[999] bg-black/50 backdrop-blur-sm overflow-y-auto">
    <div class="relative w-full max-w-2xl bg-white text-text-primary rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
      <header class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? t.modal_edit_event : t.modal_add_event }}
        </h3>
        <button @click="close" class="text-gray-500 hover:text-gray-800 text-2xl">✕</button>
      </header>

      <div class="p-6 space-y-4 overflow-y-auto">
        <UiInput v-model="form.name" :label="t.label_event_name" />
        <UiTextarea v-model="form.description" :label="t.label_desc" rows="3" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput v-model="form.start_date" :label="t.label_start_date" type="date" />
          <UiInput v-model="form.end_date" :label="t.label_end_date" type="date" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput v-model="form.client_name" :label="t.label_client_name" />
          <UiInput v-model="form.location" :label="t.label_location" />
        </div>
        <UiInput v-model.number="form.total_budget" :label="t.label_total_budget" type="number" />
        
        <hr class="border-gray-200 my-2" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput v-model="form.venue_name" :label="t.label_venue_name" />
          <UiInput v-model="form.venue_url" :label="t.label_venue_url" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput v-model="form.accommodation_name" :label="t.label_accom_name" />
          <UiInput v-model="form.accommodation_url" :label="t.label_accom_url" />
        </div>
        <hr class="border-gray-200 my-2" />
        <UiInput v-model="form.drive_link" :label="t.label_drive_link" />
      </div>

      <footer class="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <UiButton variant="secondary" @click="close">{{ t.cancel }}</UiButton>
        <UiButton variant="primary" @click="save">{{ isEditing ? t.save : t.create }}</UiButton>
      </footer>
    </div>
  </div>
</template>