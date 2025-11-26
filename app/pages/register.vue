<script setup>
definePageMeta({ layout: false })

const router = useRouter()
const form = ref({ name: '', email: '', password: '', confirmPassword: '' })
const isLoading = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง'
    return
  }

  isLoading.value = true
  errorMsg.value = ''
  
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password
      }
    })
    // สมัครสำเร็จ
    router.push('/login')
  } catch (err) {
    errorMsg.value = err.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-white">
    
    <div class="hidden lg:flex lg:w-1/2 relative bg-accent overflow-hidden">
      <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/30 rounded-full blur-3xl"></div>

      <div class="relative z-10 p-16 flex flex-col justify-center h-full text-white">
        <h2 class="text-5xl font-extrabold mb-6 leading-tight">
          เริ่มก้าวแรก<br/>
          สู่ความสำเร็จ
        </h2>
        <ul class="space-y-4 text-lg text-orange-50">
          <li class="flex items-center gap-3">
            <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">✓</span>
            วางแผนงบประมาณไม่จำกัด
          </li>
          <li class="flex items-center gap-3">
            <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">✓</span>
            เชิญทีมงานได้ไม่จำกัด
          </li>
          <li class="flex items-center gap-3">
            <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">✓</span>
            รายงานผลแบบ Real-time
          </li>
        </ul>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
      <div class="max-w-md w-full">
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">สร้างบัญชีใหม่ ✨</h1>
          <p class="text-gray-500 mt-2">ใช้เวลาเพียงไม่กี่วินาทีเพื่อเริ่มต้น</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div v-if="errorMsg" class="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
            {{ errorMsg }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5 ml-1">ชื่อ-นามสกุล</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="สมชาย ใจดี"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5 ml-1">อีเมล</label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="name@company.com"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 ml-1">รหัสผ่าน</label>
              <input 
                v-model="form.password" 
                type="password" 
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 ml-1">ยืนยันรหัสผ่าน</label>
              <input 
                v-model="form.confirmPassword" 
                type="password" 
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
              />
            </div>
          </div>

          <div class="flex items-start gap-3 mt-2">
            <input type="checkbox" id="terms" class="mt-1 rounded border-gray-300 text-accent focus:ring-accent" required />
            <label for="terms" class="text-sm text-gray-500">
              ฉันยอมรับ <a href="#" class="text-accent hover:underline">เงื่อนไขการให้บริการ</a> และ <a href="#" class="text-accent hover:underline">นโยบายความเป็นส่วนตัว</a>
            </label>
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 px-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ isLoading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-gray-500 text-sm">
            มีบัญชีอยู่แล้ว? 
            <NuxtLink to="/login" class="font-bold text-accent hover:text-orange-600 hover:underline transition-all">
              เข้าสู่ระบบ
            </NuxtLink>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>