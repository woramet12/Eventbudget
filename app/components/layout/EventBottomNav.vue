<script setup>
defineProps({ eventId: [String, Number] })

// Logic เดิม: รายการเมนู
const navItems = [
  { name: 'ภาพรวม', to: '', icon: '📊' },
  { name: 'ค่าใช้จ่าย', to: '/expenses', icon: '🧾' },
  { name: 'งบประมาณ', to: '/budget', icon: '💰' },
  { name: 'กำหนดการ', to: '/timeline', icon: '🗓️' },
  { name: 'งาน', to: '/tasks', icon: '✅' },
]
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-0 md:pb-6">
    
    <nav class="pointer-events-auto bg-white/90 backdrop-blur-xl border-t md:border border-gray-200/60 
                w-full md:w-auto md:min-w-[400px] md:rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.06)] md:shadow-2xl
                h-[80px] md:h-[72px] px-2 md:px-6 flex justify-around md:gap-8 items-center transition-all duration-300">
      
      <NuxtLink
        v-for="item in navItems"
        :key="item.name"
        :to="`/event/${eventId}${item.to}`"
        class="group relative flex flex-col items-center justify-center w-full md:w-auto h-full px-2 md:px-4 py-1"
        :class="[
          $route.path === `/event/${eventId}${item.to}` 
            ? 'text-accent' 
            : 'text-gray-400 hover:text-gray-600'
        ]"
      >
        <span 
          class="absolute top-0 w-8 h-1 rounded-b-full bg-accent transition-all duration-300"
          :class="$route.path === `/event/${eventId}${item.to}` ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
        ></span>

        <span 
          class="text-2xl mb-1 transition-all duration-300 filter drop-shadow-sm"
          :class="$route.path === `/event/${eventId}${item.to}` ? '-translate-y-1 scale-110' : 'group-hover:scale-105'"
        >
          {{ item.icon }}
        </span>
        
        <span 
          class="text-[10px] md:text-xs font-medium tracking-wide transition-colors duration-200"
          :class="$route.path === `/event/${eventId}${item.to}` ? 'font-bold' : ''"
        >
          {{ item.name }}
        </span>
      </NuxtLink>
    </nav>
  </div>
</template>