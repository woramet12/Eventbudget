<script setup>
import { ref } from 'vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import { useAppLocale } from '~/composables/useAppLocale'

const { t, locale, setLocale } = useAppLocale()

// --- 1. Logic สำหรับ Background Image ---
const bgInput = ref(null)

const triggerBgUpload = () => {
  bgInput.value.click()
}

const handleBgUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('ขนาดไฟล์ต้องไม่เกิน 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target.result
    localStorage.setItem('app_bg_image', result)
    document.body.style.backgroundImage = `url('${result}')`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundAttachment = 'fixed'
    alert('เปลี่ยนพื้นหลังเรียบร้อย!')
  }
  reader.readAsDataURL(file)
}

// --- 2. Logic สำหรับ Backup ---
const downloadBackup = async () => {
  try {
    const data = await $fetch('/api/settings/backup')
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `eventbudget-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการสำรองข้อมูล')
    console.error(error)
  }
}

// --- 3. Logic สำหรับ Restore ---
const restoreInput = ref(null)

const triggerRestore = () => {
  if(confirm('คำเตือน! การกู้คืนข้อมูลจะ "ลบข้อมูลปัจจุบันทั้งหมด" คุณแน่ใจหรือไม่?')) {
    restoreInput.value.click()
  }
}

const handleRestore = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const jsonData = JSON.parse(e.target.result)
      await $fetch('/api/settings/restore', {
        method: 'POST',
        body: jsonData
      })
      alert('กู้คืนข้อมูลสำเร็จ! ระบบจะรีโหลดหน้าจอ')
      window.location.reload()
    } catch (error) {
      alert('ไฟล์ไม่ถูกต้อง หรือเกิดข้อผิดพลาดที่ Server')
      console.error(error)
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header-title>{{ t.headerTitle }}</template>
    
    <div class="max-w-4xl mx-auto pb-24">
      <input type="file" ref="bgInput" accept="image/*" class="hidden" @change="handleBgUpload" />
      <input type="file" ref="restoreInput" accept=".json" class="hidden" @change="handleRestore" />

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900">{{ t.headerTitle }}</h2>
        <p class="text-gray-500 text-sm mt-1">ปรับแต่งการใช้งานและจัดการข้อมูลระบบ</p>
      </div>

      <div class="space-y-6">
        
        <UiCard class="p-0 overflow-hidden border border-gray-100 shadow-sm">
          <div class="p-6 border-b border-gray-50">
            <div class="flex items-center gap-3 mb-1">
              <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg">🎨</span>
              <h3 class="text-lg font-bold text-gray-900">การแสดงผล</h3>
            </div>
            <p class="text-sm text-gray-500 ml-11">ปรับแต่งภาษาและพื้นหลังของแอปพลิเคชัน</p>
          </div>

          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">{{ t.language }}</label>
              <div class="flex gap-3">
                <button 
                  @click="setLocale('th')" 
                  class="flex-1 py-2.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2"
                  :class="locale === 'th' ? 'border-accent bg-orange-50 text-accent font-bold' : 'border-gray-100 hover:border-gray-200 text-gray-600'"
                >
                  <span class="text-xl">🇹🇭</span> ไทย
                </button>
                <button 
                  @click="setLocale('en')" 
                  class="flex-1 py-2.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2"
                  :class="locale === 'en' ? 'border-accent bg-orange-50 text-accent font-bold' : 'border-gray-100 hover:border-gray-200 text-gray-600'"
                >
                  <span class="text-xl">🇬🇧</span> English
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">{{ t.appBackground }}</label>
              <UiButton variant="secondary" class="w-full justify-center border-dashed border-2" @click="triggerBgUpload">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ t.uploadImage }}
              </UiButton>
              <p class="text-xs text-gray-400 mt-2 text-center">รองรับไฟล์ภาพขนาดไม่เกิน 2MB</p>
            </div>
          </div>
        </UiCard>

        <UiCard class="p-0 overflow-hidden border border-gray-100 shadow-sm">
          <div class="p-6 border-b border-gray-50">
            <div class="flex items-center gap-3 mb-1">
              <span class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg">💾</span>
              <h3 class="text-lg font-bold text-gray-900">จัดการข้อมูล</h3>
            </div>
            <p class="text-sm text-gray-500 ml-11">สำรองข้อมูลเก็บไว้ หรือกู้คืนข้อมูลจากไฟล์ Backup</p>
          </div>

          <div class="p-6 bg-gray-50/50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl">⬇️</div>
                  <div>
                    <h4 class="font-bold text-gray-900">{{ t.backup }}</h4>
                    <p class="text-xs text-gray-500">Download JSON File</p>
                  </div>
                </div>
                <UiButton variant="secondary" class="w-full justify-center mt-2" @click="downloadBackup">
                  ดาวน์โหลดข้อมูล
                </UiButton>
              </div>

              <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 text-xl">⬆️</div>
                  <div>
                    <h4 class="font-bold text-gray-900">{{ t.restore }}</h4>
                    <p class="text-xs text-gray-500">Upload JSON File</p>
                  </div>
                </div>
                <UiButton variant="secondary" class="w-full justify-center mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100" @click="triggerRestore">
                  กู้คืนข้อมูล
                </UiButton>
              </div>

            </div>
          </div>
        </UiCard>

      </div>
    </div>
  </NuxtLayout>
</template>