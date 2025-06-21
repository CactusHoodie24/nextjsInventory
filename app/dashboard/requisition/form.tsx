"use client"

import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

type thing = {
  name: string
  quantity: number
}

interface Application {
  info: thing[]
}

const FormRequisition = ({ info }: Application) => {
  const pathname = usePathname()

useEffect(() => {
  if (pathname?.includes('/dashboard/requisition') && info.length > 0) {
    info.forEach((item, index) => {
      setTimeout(() => {
        toast('Stock Info', {
          description: `${item.name}: ${item.quantity}`,
          duration: 4000,
        });
      }, index * 2000); // Delay each toast by 0.5s
    });
  }
}, [pathname, info]);


  return null
}

export default FormRequisition
