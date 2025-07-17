import { prisma } from "@/prisma";

export async function outofStock() {
    const item =  await prisma.supplyItem.findFirst({
        where: {quantity: 0}
    })

    return item;
}