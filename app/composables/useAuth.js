export const useAuth = () => {
  // State เก็บข้อมูล User (ใช้ useState เพื่อแชร์ค่าทั้งแอป)
  const user = useState('user', () => null)

  // ฟังก์ชันดึงข้อมูล User ปัจจุบัน (เช็คว่าล็อกอินอยู่ไหม)
  const fetchUser = async () => {
    try {
      // ✅ เพิ่มบรรทัดนี้: ดึง Cookie จาก Request ปัจจุบัน
      const headers = useRequestHeaders(['cookie'])

      // ✅ ส่ง headers ไปพร้อมกับ request
      const { user: userData } = await $fetch('/api/auth/user', {
        headers
      })
      
      user.value = userData
    } catch (e) {
      user.value = null
    }
  }

  // ฟังก์ชันออกจากระบบ
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // ignore error
    }
    user.value = null
    return navigateTo('/login')
  }

  return { user, fetchUser, logout }
}