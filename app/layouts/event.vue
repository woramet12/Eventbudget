<script setup>
import EventBottomNav from '~/components/layout/EventBottomNav.vue'
const route = useRoute()
const eventId = route.params.id
const eventName = ref("Event Details") 
</script>

<template>
  <div class="bg-base-bg min-h-screen text-text-primary">
    
    <header class="p-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-base-border">
      <NuxtLink to="/" class="text-accent text-2xl hover:text-accent-hover">&lt;</NuxtLink>
      <h1 class="text-xl font-semibold">{{ eventId ? `Event (ID: ${eventId})` : eventName }}</h1>
    </header>

    <main class="pb-28 px-4">
      <slot />
    </main>

    <EventBottomNav :event-id="eventId" />
    <slot name="fab" />
  </div>
</template>