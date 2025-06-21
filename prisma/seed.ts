import { PrismaClient, Role, Status, RequestType, Priority } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashedpassword',
      phonenumber: '0001112222',
      role: Role.ADMIN,
    },
  });

  const sectionHead = await prisma.user.upsert({
    where: { email: 'section@example.com' },
    update: {},
    create: {
      name: 'Section Head',
      email: 'section@example.com',
      password: 'hashedpassword',
      phonenumber: '1112223333',
      role: Role.SECTIONHEAD,
    },
  });

  const headClerk = await prisma.user.upsert({
    where: { email: 'hclerk@example.com' },
    update: {},
    create: {
      name: 'Head Clerk',
      email: 'hclerk@example.com',
      password: 'hashedpassword',
      phonenumber: '2223334444',
      role: Role.HCLERK,
    },
  });

  const clerk = await prisma.user.upsert({
    where: { email: 'clerk@example.com' },
    update: {},
    create: {
      name: 'Clerk User',
      email: 'clerk@example.com',
      password: 'hashedpassword',
      phonenumber: '3334445555',
      role: Role.CLERK,
    },
  });

  // Seed Suppliers
  const supplier = await prisma.supplier.create({
    data: {
      name: 'Tech Supplies Ltd',
      email: 'contact@techsupplies.com',
      city: 'Kingston',
      address: '12 Hardware St',
      phonenumber: '8765554321',
      manager: 'Mr. Wright',
    },
  });

  // Seed Items (for reference)
  await prisma.item.createMany({
    data: [
      {
        name: 'Printer Ink',
        description: 'Black printer ink cartridge',
        category: 'Office Supplies',
        unit: 'Piece',
      },
      {
        name: 'Stapler',
        description: 'Heavy-duty stapler',
        category: 'Office Equipment',
        unit: 'Piece',
      },
    ],
    skipDuplicates: true,
  });

  // Seed Office
  const office = await prisma.office.create({
    data: {
      name: 'Head Office',
      location: 'Downtown',
      manager: 'Ms. Brown',
      phonenumber: '8768889999',
      clerk: { connect: { id: clerk.id } },
    },
  });

  // Seed Supply and SupplyItems
  const supply = await prisma.supply.create({
    data: {
      supplier: { connect: { id: supplier.id } },
      author: { connect: { id: headClerk.id } },
      supplyItems: {
        create: [
          {
            name: 'Printer Ink',
            quantity: 50,
            unit: 'Piece',
            category: 'Office Supplies',
            description: 'Black printer ink cartridge',
          },
          {
            name: 'Stapler',
            quantity: 20,
            unit: 'Piece',
            category: 'Office Equipment',
            description: 'Heavy-duty stapler',
          },
        ],
      },
    },
  });

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
