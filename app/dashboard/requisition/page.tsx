import { prisma } from '@/prisma'
import React from 'react'
import FormRequisition from './form';
import { auth } from '@/lib/auth';

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

async function getItems() {
  const rawItems = await prisma.supplyItem.findMany({
    select: {
      id: true,
      name: true,
      quantity: true
    }
  });

  // Group by name, keeping first id and total quantity
  const grouped: Record<string, { id: number; name: string; totalQuantity: number }> = {};

  for (const item of rawItems) {
    if (!grouped[item.name]) {
      grouped[item.name] = {
        id: item.id,
        name: item.name,
        totalQuantity: item.quantity
      };
    } else {
      grouped[item.name].totalQuantity += item.quantity;
    }
  }

  return Object.values(grouped); // now includes id
}



const Requisition = async () => {
    const info = await getInformation();
    const items = await getItems();
    console.log(info)
    const session = await auth();
  return (
    <div className='flex ml-[230px] mt-[100px]'>
     <FormRequisition info={info} items={items} />
     </div>
  )
}

export default Requisition