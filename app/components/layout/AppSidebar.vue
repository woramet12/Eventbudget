<script setup>
import { watch, onMounted, onUnmounted, computed } from 'vue'
import { useAppLocale } from '~/composables/useAppLocale'

const props = defineProps({ isOpen: Boolean })
const emits = defineEmits(['close'])
const { t } = useAppLocale()

// Logic เดิม: รายการเมนู
const menuItems = computed(() => [
  { name: t.value.nav_events, to: '/', icon: '📅' },
  { name: t.value.nav_categories, to: '/settings/categories', icon: '💳' },
  { name: t.value.nav_currency, to: '/settings/currency', icon: '💲' },
  { name: t.value.nav_team, to: '/settings/team', icon: '👥' },
  { name: t.value.nav_settings, to: '/settings', icon: '⚙️' },
])

onMounted(() => {
  watch(() => props.isOpen, (val) => {
    if (val) document.body.classList.add('overflow-hidden')
    else document.body.classList.remove('overflow-hidden')
  }, { immediate: true })
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})

watch(() => useRoute().fullPath, () => {
  if (props.isOpen) emits('close')
})
</script>

<template>
  <div>
    <div 
      v-if="isOpen" 
      @click="$emit('close')"
      class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 transition-all duration-300"
    ></div>

    <aside 
      :class="[
        'fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-6 flex items-center justify-between border-b border-gray-100">
        <div class="flex items-center gap-3">
           <div class="w-8 h-8 bg-gradient-to-br from-accent to-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-orange-200">
             EB
           </div>
           <h2 class="text-xl font-bold text-gray-800 tracking-tight">EventBudget</h2>
        </div>
        
        <button 
          @click="$emit('close')" 
          class="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav class="p-4 space-y-1.5 mt-2">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          active-class="!bg-orange-50 !text-accent shadow-sm ring-1 ring-orange-100"
        >
          <span class="text-xl group-hover:scale-110 transition-transform duration-200">{{ item.icon }}</span>
          <span>{{ item.name }}</span>
          
          <div v-if="$route.path === item.to" class="ml-auto w-1.5 h-1.5 rounded-full bg-accent"></div>
        </NuxtLink>
      </nav>

      
    </aside>
  </div>
</template>