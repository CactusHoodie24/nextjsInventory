import { prisma } from "@/prisma";

export async function getSupplier() {
    return await prisma.supplier.findMany()
}