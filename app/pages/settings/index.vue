<script setup>
import { ref, onMounted } from 'vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiButton from '~/components/ui/UiButton.vue'
import { useAppLocale } from '~/composables/useAppLocale'

const { t, locale, setLocale } = useAppLocale()

// --- State ---
const isProcessing = ref(false) // กันการกดย้ำ
const hasCustomBg = ref(false)

// --- Lifecycle ---
onMounted(() => {
  // เช็คว่ามีภาพพื้นหลังเดิมไหม
  hasCustomBg.value = !!localStorage.getItem('app_bg_image')
})

// --- 1. Logic พื้นหลัง ---
const bgInput = ref(null)

const triggerBgUpload = () => bgInput.value.click()

const handleBgUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) { // เพิ่ม limit เป็น 5MB เพื่อความยืดหยุ่น
    alert('⚠️ ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target.result
    try {
      localStorage.setItem('app_bg_image', result)
      document.body.style.backgroundImage = `url('${result}')`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundAttachment = 'fixed'
      document.body.style.backgroundPosition = 'center'
      hasCustomBg.value = true
    } catch (err) {
      alert('❌ พื้นที่จัดเก็บ (LocalStorage) เต็ม ไม่สามารถบันทึกรูปภาพได้')
    }
  }
  reader.readAsDataURL(file)
}

const resetBackground = () => {
  if (confirm('ต้องการลบรูปพื้นหลังและกลับไปใช้ค่าเริ่มต้น?')) {
    localStorage.removeItem('app_bg_image')
    document.body.style.backgroundImage = ''
    hasCustomBg.value = false
  }
}

// --- 2. Logic Backup ---
const downloadBackup = async () => {
  if (isProcessing.value) return
  isProcessing.value = true
  
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
    alert('❌ เกิดข้อผิดพลาดในการสำรองข้อมูล')
    console.error(error)
  } finally {
    isProcessing.value = false
  }
}

// --- 3. Logic Restore ---
const restoreInput = ref(null)

const triggerRestore = () => {
  if (confirm('⚠️ คำเตือน: การกู้คืนข้อมูลจะ "ลบข้อมูลปัจจุบันทั้งหมด" และแทนที่ด้วยไฟล์ Backup\n\nคุณแน่ใจหรือไม่?')) {
    restoreInput.value.click()
  }
}

const handleRestore = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (isProcessing.value) return
  isProcessing.value = true

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const jsonData = JSON.parse(e.target.result)
      await $fetch('/api/settings/restore', {
        method: 'POST',
        body: jsonData
      })
      alert('✅ กู้คืนข้อมูลสำเร็จ! ระบบจะรีโหลดหน้าจอ')
      window.location.reload()
    } catch (error) {
      alert('❌ ไฟล์ไม่ถูกต้อง หรือเกิดข้อผิดพลาดที่ Server')
      console.error(error)
      isProcessing.value = false
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="min-h-screen p-4 sm:p-6 bg-gray-50/30">
    <div class="max-w-4xl mx-auto pb-24">
      <input type="file" ref="bgInput" accept="image/*" class="hidden" @change="handleBgUpload" />
      <input type="file" ref="restoreInput" accept=".json" class="hidden" @change="handleRestore" />

      <div class="mb-8 flex items-end justify-between">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">{{ t.headerTitle }}</h2>
          <p class="text-gray-500 mt-1">ปรับแต่งการใช้งานและจัดการข้อมูลระบบ</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 space-y-6">
          
          <UiCard class="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">🌐</div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ t.language }}</h3>
                  <p class="text-xs text-gray-500">เลือกภาษาที่ต้องการแสดงผล</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <button 
                  @click="setLocale('th')" 
                  class="relative group p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2"
                  :class="locale === 'th' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'"
                >
                  <span class="text-3xl filter drop-shadow-sm">🇹🇭</span>
                  <span class="font-bold" :class="locale === 'th' ? 'text-blue-700' : 'text-gray-600'">ภาษาไทย</span>
                  <div v-if="locale === 'th'" class="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500"></div>
                </button>

                <button 
                  @click="setLocale('en')" 
                  class="relative group p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2"
                  :class="locale === 'en' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'"
                >
                  <span class="text-3xl filter drop-shadow-sm">🇬🇧</span>
                  <span class="font-bold" :class="locale === 'en' ? 'text-blue-700' : 'text-gray-600'">English</span>
                  <div v-if="locale === 'en'" class="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500"></div>
                </button>
              </div>
            </div>
          </UiCard>

          <UiCard class="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center text-xl">🎨</div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ t.appBackground }}</h3>
                  <p class="text-xs text-gray-500">ปรับแต่งรูปภาพพื้นหลังของแอปพลิเคชัน</p>
                </div>
              </div>

              <div class="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200 hover:border-pink-300 hover:bg-pink-50/30 transition-all cursor-pointer group" @click="triggerBgUpload">
                <div class="mb-3">
                  <div class="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm text-3xl group-hover:scale-110 transition-transform duration-300">🖼️</div>
                </div>
                <h4 class="font-bold text-gray-700 mb-1 group-hover:text-pink-600 transition-colors">คลิกเพื่ออัปโหลดรูปภาพ</h4>
                <p class="text-xs text-gray-400">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
              </div>

              <div v-if="hasCustomBg" class="mt-4 flex justify-end">
                <button @click="resetBackground" class="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 hover:underline">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  รีเซ็ตเป็นค่าเริ่มต้น
                </button>
              </div>
            </div>
          </UiCard>
        </div>

        <div class="space-y-6">
          <UiCard class="h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
            <div class="p-6 border-b border-gray-50 bg-gray-50/50">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl">💾</div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">จัดการข้อมูล</h3>
                  <p class="text-xs text-gray-500">Backup & Restore</p>
                </div>
              </div>
            </div>

            <div class="p-6 flex-1 flex flex-col gap-6">
              
              <div class="space-y-3">
                <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  {{ t.backup }}
                </h4>
                <p class="text-xs text-gray-500 leading-relaxed">
                  ดาวน์โหลดข้อมูลทั้งหมดเก็บไว้ในรูปแบบไฟล์ JSON เพื่อป้องกันข้อมูลสูญหาย
                </p>
                <UiButton 
                  variant="secondary" 
                  class="w-full justify-center gap-2 py-3 border-gray-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50" 
                  @click="downloadBackup"
                  :disabled="isProcessing"
                >
                  <span v-if="isProcessing && !restoreInput?.value" class="animate-spin">⏳</span>
                  <span v-else>⬇️</span>
                  ดาวน์โหลดไฟล์ Backup
                </UiButton>
              </div>

              <div class="border-t border-gray-100 my-2"></div>

              <div class="space-y-3">
                <h4 class="text-sm font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  {{ t.restore }} (Danger Zone)
                </h4>
                <p class="text-xs text-gray-500 leading-relaxed">
                  นำเข้าไฟล์ Backup เพื่อกู้คืนข้อมูล <span class="text-red-500 font-bold">ข้อมูลปัจจุบันจะถูกลบทั้งหมด</span>
                </p>
                <UiButton 
                  variant="secondary" 
                  class="w-full justify-center gap-2 py-3 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200" 
                  @click="triggerRestore"
                  :disabled="isProcessing"
                >
                  <span v-if="isProcessing && restoreInput?.value" class="animate-spin">⏳</span>
                  <span v-else>⬆️</span>
                  อัปโหลดเพื่อกู้คืน
                </UiButton>
              </div>

            </div>
          </UiCard>
        </div>

      </div>
    </div>
  </div>
</template>