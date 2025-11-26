<script setup>
// ✅ ใช้ layout 'blank' ที่สร้างไว้ (ห้ามใช้ false ถ้าจะใช้ระบบ Layout มาตรฐาน)
definePageMeta({ 
  layout: 'blank' 
})

const router = useRouter()
const form = ref({ email: '', password: '' })
const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })
    router.push('/')
  } catch (err) {
    errorMsg.value = err.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-white">
    
    <div class="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop" 
          alt="Event Planning" 
          class="w-full h-full object-cover opacity-60"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
      </div>

      <div class="relative z-10 p-16 flex flex-col justify-between h-full text-white">
        <div>
          <div class="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-accent/50">📊</div>
          <h2 class="text-4xl font-bold leading-tight mb-4">จัดการงบประมาณอีเวนต์<br/>ได้อย่างมืออาชีพ</h2>
          <p class="text-gray-300 text-lg max-w-md">ควบคุมทุกค่าใช้จ่าย ติดตามทุกใบเสร็จ และบริหารทีมงานของคุณได้ในที่เดียว</p>
        </div>
        <div class="flex items-center gap-4 text-sm text-gray-400">
          <span>© 2024 EventBudget</span>
          <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
      <div class="max-w-md w-full">
        <div class="text-center lg:text-left mb-10">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับกลับมา 👋</h1>
          <p class="text-gray-500">กรอกข้อมูลเพื่อเข้าสู่ระบบจัดการงานของคุณ</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="errorMsg" class="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-3 animate-pulse">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ errorMsg }}
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 ml-1">อีเมล</label>
              <input v-model="form.email" type="email" placeholder="name@company.com" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none" />
            </div>
            <div>
              <div class="flex justify-between items-center mb-1.5 ml-1">
                <label class="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                <a href="#" class="text-xs font-semibold text-accent hover:text-orange-600">ลืมรหัสผ่าน?</a>
              </div>
              <input v-model="form.password" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none" />
            </div>
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-3.5 px-4 bg-accent hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-gray-500 text-sm">ยังไม่มีบัญชีใช่ไหม? <NuxtLink to="/register" class="font-bold text-accent hover:text-orange-600 hover:underline transition-all">สมัครสมาชิกฟรี</NuxtLink></p>
        </div>
      </div>
    </div>
  </div>
</template>