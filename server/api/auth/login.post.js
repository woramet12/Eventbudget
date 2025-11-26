import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET || 'secret-key-change-me-later' // ควรตั้งใน .env

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // หา User
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
  }

  // เช็ค Password
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw createError({ statusCode: 401, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
  }

  // สร้าง Token
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' })

  // ส่ง Token กลับไป (หรือจะ Set Cookie ตรงนี้ก็ได้)
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 7 วัน
  })

  return { 
    success: true,
    user: { id: user.id, email: user.email, name: user.name } 
  }
})