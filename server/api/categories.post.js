export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.category.create({
    data: {
      name: body.name,
      icon: body.icon,
      color: body.color
    }
  })
})
