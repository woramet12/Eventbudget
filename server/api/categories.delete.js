export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = Number(query.id)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    })
  }

  return await prisma.category.delete({
    where: { id: id }
  })
})
