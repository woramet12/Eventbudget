<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()
const isUserMenuOpen = ref(false)

const handleLogout = async () => {
  if (confirm('ยืนยันการออกจากระบบ?')) {
    await logout()
    isUserMenuOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 text-text-primary font-sans">
    
    <header class="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="flex items-center gap-3 select-none group">
            <div class="w-9 h-9 bg-gradient-to-br from-accent to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 transform -rotate-3 group-hover:rotate-0 transition-transform">
              <span class="font-bold text-lg">EB</span>
            </div>
            <h1 class="text-xl font-extrabold tracking-tight text-gray-900 hidden sm:block">
              Event<span class="text-accent">Budget</span>
            </h1>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <div v-if="user" class="relative z-50">
            <button 
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 group"
            >
              <div class="hidden md:block text-right">
                <p class="text-sm font-bold text-gray-700 leading-none group-hover:text-accent transition-colors">{{ user.name }}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-orange-400 p-[2px] shadow-sm">
                <div class="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                   <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover" />
                   <span v-else class="text-lg">👤</span>
                </div>
              </div>
            </button>

            <transition 
              enter-active-class="transition ease-out duration-100" 
              enter-from-class="transform opacity-0 scale-95" 
              enter-to-class="transform opacity-100 scale-100" 
              leave-active-class="transition ease-in duration-75" 
              leave-from-class="transform opacity-100 scale-100" 
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-if="isUserMenuOpen" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden origin-top-right">
                 <div class="px-2 py-1">
                   <NuxtLink to="/settings" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                     <span>⚙️</span> ตั้งค่าบัญชี
                   </NuxtLink>
                 </div>
                 <div class="border-t border-gray-50 my-1"></div>
                 <div class="px-2 pb-1">
                   <button @click="handleLogout" class="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl flex items-center gap-3 transition-colors font-medium">
                     ออกจากระบบ
                   </button>
                 </div>
              </div>
            </transition>
            <div v-if="isUserMenuOpen" @click="isUserMenuOpen = false" class="fixed inset-0 z-[-1] cursor-default"></div>
          </div>
        </div>

      </div>
    </header>

    <main class="relative z-10 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <slot />
    </main>
    
  </div>
</template>
