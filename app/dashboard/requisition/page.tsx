import { prisma } from '@/prisma'
import React from 'react'
import FormRequisition from './form';

async function getInformation() {
     const result = await prisma.supplyItem.groupBy({
        by: ['name'],
        _sum: {
         quantity: true
        }
    })
    const transformed = result.map((item) => ({
  name: item.name,
  quantity: item._sum.quantity ?? 0, // handle nulls safely
}));
return transformed
};



const Requisition = async () => {
    const info = await getInformation();
    console.log(info)
  return (
     <FormRequisition info={info} />
  )
}

export default Requisition