<script setup>
import { ref } from 'vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'

const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-base-bg text-text-primary">
    
    <header class="sticky top-0 z-20 flex items-center justify-between p-4 bg-white shadow-sm border-b border-base-border">
      <button @click="toggleSidebar" class="p-2 text-text-primary hover:text-accent focus:outline-none">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <h1 class="text-xl font-bold text-text-primary">
        <slot name="header-title">EventBudget</slot>
      </h1>
      <div class="w-8"></div> 
    </header>

    <main class="relative z-10 p-4 md:p-8">
      <slot />
    </main>

    <AppSidebar :isOpen="isSidebarOpen" @close="toggleSidebar" />
    <slot name="fab" />
  </div>
</template>