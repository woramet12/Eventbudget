export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.category.update({
    where: { id: body.id },
    data: {
      name: body.name,
      icon: body.icon,
      color: body.color
    }
  })
})
