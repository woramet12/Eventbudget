<script setup>
defineProps({ event: Object })

// Logic เดิม: ฟังก์ชันจัดรูปแบบเงิน
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A'
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount)
}
</script>

<template>
  <div 
    class="group relative bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 
           transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
  >
    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-accent transition-all duration-300 group-hover:w-2"></div>

    <div class="p-5 pl-7">
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-gray-800 group-hover:text-accent transition-colors duration-200 leading-tight">
            {{ event.name }}
          </h3>
          
          <div class="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            <div class="flex items-center gap-1.5">
               <span class="p-1 bg-blue-50 text-blue-500 rounded-full text-xs">👤</span>
               <span>{{ event.client_name || 'ไม่ระบุลูกค้า' }}</span>
            </div>
            <div v-if="event.location" class="flex items-center gap-1.5">
               <span class="p-1 bg-red-50 text-red-500 rounded-full text-xs">📍</span>
               <span>{{ event.location }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-1.5 mt-2 md:mt-0">
          <div class="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 text-xs font-medium text-gray-600">
            <span>📅</span>
            {{ event.start_date || 'ไม่ระบุวันที่' }}
          </div>
          
          <div v-if="event.total_budget" 
               class="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-lg border border-green-100 text-xs font-bold text-green-700">
            <span>💰</span>
            {{ formatCurrency(event.total_budget) }}
          </div>
        </div>

      </div>
    </div>
    
    <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
        <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
    </div>
  </div>
</template>