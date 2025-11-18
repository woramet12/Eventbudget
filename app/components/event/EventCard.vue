<script setup>
defineProps({ event: Object })
</script>

<template>
  <div 
    class="group bg-white rounded-lg shadow-sm p-4 border border-base-border 
           transition-all duration-200 cursor-pointer transform hover:scale-[1.02] hover:shadow-md"
  >
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-text-primary group-hover:text-accent transition-colors duration-200">
          {{ event.name }}
        </h3>
        <p class="text-text-secondary mt-1">{{ event.client_name }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs bg-gray-100 px-3 py-1 rounded-full text-text-secondary border border-base-border">
          {{ event.start_date }}
        </span>
      </div>
    </div>
  </div>
</template>