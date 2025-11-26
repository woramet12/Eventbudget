export default defineNuxtRouteMiddleware(async (to, from) => {
  // ข้ามการทำงานถ้าอยู่ฝั่ง Server (optional: แต่ปกติ Nuxt จัดการให้)
  
  const { user, fetchUser } = useAuth()

  // 1. ถ้ายังไม่มีข้อมูล User ใน State (เช่น เพิ่งรีเฟรชหน้า) ให้ลองดึงจาก Server ก่อน
  if (!user.value) {
    await fetchUser()
  }

  // 2. รายชื่อหน้าที่ "ไม่ต้องล็อกอิน" ก็เข้าได้
  const publicPages = ['/login', '/register']
  
  const isPublicPage = publicPages.includes(to.path)

  // 3. ถ้าเข้าหน้า Login/Register แต่ "ล็อกอินอยู่แล้ว" -> ดีดไปหน้าแรก
  if (isPublicPage && user.value) {
    return navigateTo('/')
  }

  // 4. ถ้าเข้าหน้าอื่นๆ แต่ "ยังไม่ล็อกอิน" -> ดีดไปหน้า Login
  if (!isPublicPage && !user.value) {
    return navigateTo('/login')
  }
})