<script setup>
defineProps({ eventId: [String, Number] })

const navItems = [
  { name: 'ภาพรวม', to: '', icon: '📊' },
  { name: 'ค่าใช้จ่าย', to: '/expenses', icon: '🧾' },
  { name: 'งบประมาณ', to: '/budget', icon: '💰' },
  { name: 'กำหนดการ', to: '/timeline', icon: '🗓️' },
  { name: 'งาน', to: '/tasks', icon: '✅' },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-base-border h-[88px] pb-6 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
    <NuxtLink
      v-for="item in navItems"
      :key="item.name"
      :to="`/event/${eventId}${item.to}`"
      class="group flex flex-col items-center justify-center w-full h-full transition-all duration-200"
      :class="[
        $route.path === `/event/${eventId}${item.to}` 
          ? 'text-accent scale-110 font-semibold' 
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      ]"
    >
      <span class="text-2xl mb-1 transition-transform duration-200 group-active:scale-90">{{ item.icon }}</span>
      <span class="text-[10px] tracking-wide">{{ item.name }}</span>
    </NuxtLink>
  </nav>
</template>