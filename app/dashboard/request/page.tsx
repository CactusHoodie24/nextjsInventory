import { prisma } from "@/prisma"
import Request from "./form"

async function getItem() {
   return await prisma.item.findMany()
}
export default async function RequestPage() {
      const item = await getItem()
    return(
       <Request item={item} />
    )
}