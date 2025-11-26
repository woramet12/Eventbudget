<script setup>
import { ref } from 'vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
// ✅ Import useAuth เพื่อดึงข้อมูล User
import { useAuth } from '~/composables/useAuth'

// State สำหรับควบคุมการเปิด/ปิด Sidebar
const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// --- Auth Logic ---
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
          <button 
            @click="toggleSidebar" 
            class="p-2.5 -ml-2 rounded-xl text-gray-500 hover:text-accent hover:bg-orange-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent/30 active:scale-95"
            title="เปิดเมนู"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
          </button>

          <div class="flex items-center gap-3 select-none">
            <div class="w-9 h-9 bg-gradient-to-br from-accent to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 transform -rotate-3">
              <span class="font-bold text-lg">EB</span>
            </div>
            <h1 class="text-xl font-extrabold tracking-tight text-gray-900 hidden sm:block">
              <slot name="header-title">
                Event<span class="text-accent">Budget</span>
              </slot>
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          
          <button class="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span class="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div class="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          <div v-if="user" class="relative z-50">
            <button 
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 group"
            >
              <div class="hidden md:block text-right">
                <p class="text-sm font-bold text-gray-700 leading-none group-hover:text-accent transition-colors">{{ user.name }}</p>
                <p class="text-[10px] text-gray-400 leading-none mt-1">{{ user.email }}</p>
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
                 <div class="px-4 py-3 border-b border-gray-50 md:hidden bg-gray-50/50">
                    <p class="text-sm font-bold text-gray-900 truncate">{{ user.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                 </div>

                 <div class="px-2 py-1">
                   <NuxtLink to="/settings" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                     <span>⚙️</span> ตั้งค่าบัญชี
                   </NuxtLink>
                 </div>
                 
                 <div class="border-t border-gray-50 my-1"></div>
                 
                 <div class="px-2 pb-1">
                   <button @click="handleLogout" class="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl flex items-center gap-3 transition-colors font-medium">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                     ออกจากระบบ
                   </button>
                 </div>
              </div>
            </transition>
            
            <div v-if="isUserMenuOpen" @click="isUserMenuOpen = false" class="fixed inset-0 z-[-1] cursor-default"></div>
          </div>

          <NuxtLink v-else to="/login" class="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200 hover:shadow-xl active:scale-95">
            เข้าสู่ระบบ
          </NuxtLink>

        </div>

      </div>
    </header>

    <main class="relative z-10 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <slot />
    </main>

    <AppSidebar :isOpen="isSidebarOpen" @close="toggleSidebar" />
    <slot name="fab" />
    
  </div>
</template>