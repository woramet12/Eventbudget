export default defineEventHandler(async (event) => {
  return await prisma.category.findMany({
    orderBy: { id: 'asc' }
  })
})
