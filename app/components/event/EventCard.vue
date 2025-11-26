<script setup>
defineProps({ event: Object })

// จัดรูปแบบเงิน (เช่น ฿50,000)
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-'
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount)
}

// จัดรูปแบบวันที่ (เช่น 12 ม.ค. 67)
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(date)
}
</script>

<template>
  <div 
    class="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-orange-100 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
  >
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-accent opacity-80 group-hover:opacity-100 transition-all duration-300"></div>

    <div class="p-4 flex flex-col h-full"> <div class="flex justify-between items-start gap-3 mb-3">
        <h3 class="text-base font-bold text-gray-800 group-hover:text-accent transition-colors leading-tight line-clamp-2"> {{ event.name }}
        </h3>
        
        <svg class="w-4 h-4 text-gray-300 group-hover:text-accent transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>

      <div class="space-y-2 mb-4 flex-1">
        <div class="flex items-center gap-2 text-xs text-gray-600">
           <span class="w-5 h-5 flex items-center justify-center bg-blue-50 text-blue-500 rounded-full flex-shrink-0 border border-blue-100">
             <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
           </span>
           <span class="truncate font-medium text-gray-700">{{ event.client_name || 'ไม่ระบุลูกค้า' }}</span>
        </div>
        
        <div class="flex items-center gap-2 text-xs text-gray-500">
           <span class="w-5 h-5 flex items-center justify-center bg-pink-50 text-pink-500 rounded-full flex-shrink-0 border border-pink-100">
             <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           </span>
           <span class="truncate">{{ event.location || 'ไม่ระบุสถานที่' }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
        <div class="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
           <svg class="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           {{ formatDate(event.start_date) }}
        </div>

        <div v-if="event.total_budget" class="text-sm font-bold text-emerald-600 tabular-nums">
           {{ formatCurrency(event.total_budget) }}
        </div>
        <div v-else class="text-xs text-gray-300 italic">
           -
        </div>
      </div>
    </div>
  </div>
</template>