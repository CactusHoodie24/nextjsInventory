import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const  body = await req.json()
     const {supplierId, name, unit, quantity, category, description, email} = body
     console.log(body)
  
    try {
        if (!supplierId || !name || !unit || !quantity || !category || !email) {

  return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
}

const user = await prisma.user.findUnique({
    where: { email: email }
})

if (!user) {
  return NextResponse.json({ message: "User not found" }, { status: 404 });
}

await prisma.supply.create({
  data: {
    supplierId,
    status: 'DISPATCHED',
    authorId: user?.id,
    supplyItems: {
      create: [
        {
          name,
          unit,
          quantity: Number(quantity), // optional if it's already a number
          category,
          description,
        },
      ],
    },
  },
  include: {
    supplyItems: true,
  },
});

        return NextResponse.json({message: `Created a new Row of supplies`}, {status: 200})
    } catch (error) {
        console.log('Error inserting into the database', error)
        return NextResponse.json({message: 'Intenal Server Error'}, {status: 200})
    }
}