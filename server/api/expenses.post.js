export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.expense.create({
    data: {
      name: body.name,
      amount: Number(body.amount),
      
      // --- [New Fields] เพิ่ม 2 บรรทัดนี้ครับ ---
      estimated_amount: Number(body.estimated_amount || 0),
      is_paid: body.is_paid || false,
      // ---------------------------------------

      date: body.date,
      time: body.time,
      category: body.category,
      icon: body.icon,
      eventId: Number(body.event_id)
    }
  })
})