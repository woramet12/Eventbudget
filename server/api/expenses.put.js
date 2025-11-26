// server/api/expenses.put.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  return await prisma.expense.update({
    where: { id: body.id },
    data: {
      name: body.name,
      amount: Number(body.amount),
      estimated_amount: Number(body.estimated_amount || 0), // บันทึกงบที่ตั้งไว้
      is_paid: body.is_paid, // ✅ บันทึกสถานะว่าจ่ายแล้วหรือยัง
      date: body.date,
      time: body.time,
      category: body.category,
      icon: body.icon
    }
  })
})