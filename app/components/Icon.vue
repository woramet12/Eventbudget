<script setup>
import { computed } from 'vue'
import { iconCategories } from '@/utils/categoryIcons'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  class: {
    type: String,
    default: ''
  }
})

// Simple mapping for keywords to emojis if needed, 
// though the app mostly uses direct emojis now.
const iconMap = {
  'money': '💰',
  'food': '🍔',
  'transport': '🚗',
  'shopping': '🛍️',
  'entertainment': '🎉',
  'medical': '💊',
  'home': '🏠',
  'other': '📦'
}

const displayIcon = computed(() => {
  // If it's already an emoji (simple check: non-ascii or specific ranges), return it
  if (/\p{Emoji}/u.test(props.name)) {
    return props.name
  }
  // Check if it's in our map
  if (iconMap[props.name.toLowerCase()]) {
    return iconMap[props.name.toLowerCase()]
  }
  // Default fallback
  return '❓'
})
</script>

<template>
  <span :class="props.class" role="img" :aria-label="name">
    {{ displayIcon }}
  </span>
</template>
