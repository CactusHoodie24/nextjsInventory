import { prisma } from "@/prisma";

export async function MostRequisitions() {
    const office = await prisma.requisition.groupBy({
        by: ['officeId'],
        _count: {
            quantityIssued: true
        }
    })
    const officeId = office[0].officeId 
    if(!officeId) return null
    const officeName = await prisma.office.findUnique({
        where: {
            id: officeId
        }
    })
    const quantityIssued = office[0]._count
    return {officeName, quantityIssued}
}