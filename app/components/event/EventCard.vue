<script setup>
defineProps({ event: Object })
</script>
<template>
  <div 
    class="bg-white rounded-lg shadow-sm p-4 border border-base-border 
           transition-all duration-300 cursor-pointer transform 
           hover:border-accent hover:scale-105 hover:shadow-xl"
  >
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-text-primary">{{ event.name }}</h3>
        <p class="text-text-secondary">{{ event.client_name }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs bg-base-bg px-3 py-1 rounded-full text-text-secondary border border-base-border">{{ event.start_date }}</span>
      </div>
    </div>
  </div>
</template>