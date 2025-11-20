<script setup>
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'

// เรียกใช้ Logic ภาษา
const { t, locale, setLocale } = useAppLocale()
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>{{ t.headerTitle }}</template>
    
    <div>
      <UiCard class="max-w-2xl space-y-8 p-6">
        
        <div class="space-y-3">
          <h2 class="text-lg font-medium text-text-primary border-l-4 border-accent pl-3">
            {{ t.language }}
          </h2>
          <div class="flex gap-3 pl-4">
            <UiButton 
              @click="setLocale('th')" 
              :variant="locale === 'th' ? 'primary' : 'secondary'"
              class="min-w-[100px]"
            >
              🇹🇭 ไทย
            </UiButton>
            <UiButton 
              @click="setLocale('en')" 
              :variant="locale === 'en' ? 'primary' : 'secondary'"
              class="min-w-[100px]"
            >
              🇬🇧 English
            </UiButton>
          </div>
        </div>

        <hr class="border-gray-100" />

        <div class="space-y-3">
          <h2 class="text-lg font-medium text-text-primary border-l-4 border-accent pl-3">
            {{ t.appBackground }}
          </h2>
          <div class="pl-4">
             <UiButton variant="secondary" class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                </svg>
                {{ t.uploadImage }}
             </UiButton>
          </div>
        </div>

        <hr class="border-gray-100" />

        <div class="space-y-3">
          <h2 class="text-lg font-medium text-text-primary border-l-4 border-accent pl-3">
            {{ t.backupRestore }}
          </h2>
          <div class="flex gap-3 pl-4">
            <UiButton variant="secondary" class="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
               </svg>
               {{ t.backup }}
            </UiButton>
            <UiButton variant="secondary" class="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
               </svg>
               {{ t.restore }}
            </UiButton>
          </div>
        </div>

      </UiCard>
    </div>
  </NuxtLayout>
</template>