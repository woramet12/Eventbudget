import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET || 'secret-key-change-me-later' // ต้องตรงกับตอน Login

export default defineEventHandler(async (event) => {
  // 1. ดึง Cookie ชื่อ 'auth_token' ออกมา
  const token = getCookie(event, 'auth_token')
  if (!token) {
    return { user: null }
  }

  try {
    // 2. ตรวจสอบความถูกต้องของ Token
    const decoded = jwt.verify(token, SECRET)
    
    // 3. ดึงข้อมูล User จากฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, avatar: true } // เลือกเฉพาะข้อมูลที่จำเป็น
    })
    
    return { user }
  } catch (error) {
    // ถ้า Token หมดอายุหรือปลอมแปลง
    return { user: null }
  }
})