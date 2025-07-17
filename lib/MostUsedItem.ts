import { prisma } from "@/prisma";

export async function getMostUsedItem() {
   const mostUsed = await prisma.requisition.groupBy({
    by: ['itemId'],
    _sum: {
      quantityIssued: true
    },
    orderBy: {
      _sum: {
        quantityIssued: 'desc'
      },
    },
    take: 1,
   },
  )
  if(mostUsed.length === 0) return null

  const ItemId = mostUsed[0].itemId
  const quantityUsed = mostUsed[0]._sum
  const findName = await prisma.supplyItem.findFirst({
    where: {id: ItemId},
    select: {
      name: true
    }
  })

  return {
    findName, quantityUsed
  }
}