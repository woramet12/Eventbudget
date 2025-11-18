<script setup>
import { ref } from 'vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'

// State สำหรับควบคุมการเปิด/ปิด Sidebar
const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-base-bg text-text-primary">
    
    <header class="sticky top-0 z-20 flex items-center gap-4 p-4 bg-white shadow-sm border-b border-base-border">
      
      <button @click="toggleSidebar" class="p-2 text-text-primary hover:text-accent focus:outline-none transition-colors">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <h1 class="text-2xl font-bold text-accent tracking-tight">
        <slot name="header-title">EventBudget</slot>
      </h1>
      
    </header>

    <main class="relative z-10 p-4 md:p-8">
      <slot />
    </main>

    <AppSidebar :isOpen="isSidebarOpen" @close="toggleSidebar" />

    <slot name="fab" />
  </div>
</template>