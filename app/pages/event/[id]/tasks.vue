<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'
// definePageMeta({ layout: 'event' }) // ⭐️ ลบออก
const tasks = ref([
  { id: 1, name: 'Order event merchandise', description: 'T-shirts, stickers, and notebooks.', due: '20 พ.ย. 2567', completed: false },
  { id: 2, name: 'Finalize speaker list', description: 'Confirm all speakers and their topics.', due: '15 พ.ย. 2567', completed: true },
])
</script>

<template>
  <NuxtLayout name="event">
    <div>
      <h2 class="text-2xl font-bold text-text-primary mb-4">
        งาน
      </h2>
      <div class="space-y-3">
        <UiCard v-for="task in tasks" :key="task.id" class="!p-4">
          <div class="flex items-start gap-4">
            <input 
              type="checkbox" 
              v-model="task.completed" 
              class="form-checkbox h-5 w-5 mt-1 text-accent bg-base-card border-base-border rounded focus:ring-accent"
            />
            <div class="flex-1" :class="{'line-through text-text-secondary': task.completed}">
              <h4 class="font-semibold text-text-primary">{{ task.name }}</h4>
              <p class="text-sm text-text-secondary">{{ task.description }}</p>
              <p class="text-sm text-text-secondary mt-1">วันที่ครบกำหนด: {{ task.due }}</p>
            </div>
            <div class="flex gap-2">
              <button class="text-text-secondary hover:text-accent">✎</button>
              <button class="text-text-secondary hover:text-accent">🗑</button>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
    
    <template #fab>
      <EventFabButton class="fixed bottom-24 right-8" />
    </template>
  </NuxtLayout>
</template>