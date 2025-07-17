import { prisma } from "@/prisma";

export async function fulfillmentRate() {
  const grouped = await prisma.request.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  });

  // Extract the counts
  const dispatchedEntry = grouped.find(entry => entry.status === 'DISPATCHED');
  const pendingEntry = grouped.find(entry => entry.status === 'PENDING');

 const dispatchedCount = grouped.find(e => e.status === 'DISPATCHED')?._count.status || 0;
  const pendingCount = grouped.find(e => e.status === 'PENDING')?._count.status || 0;

  const totalConsidered = dispatchedCount + pendingCount;
  const rate = totalConsidered === 0 ? 0 : (dispatchedCount / totalConsidered) * 100;

  return {
    dispatchedCount,
    pendingCount,
    rate: rate.toFixed(2) + '%',
  };
}


export async function pendingRequest() {
 const gwap = await prisma.request.findMany({
    include: {
      item: true,
      user: true
    }
  });

  const enrichedRequests = await Promise.all(gwap.map(async (req) => {
  let officeName = "Unknown Office";

  if (req.userId) {
    const office = await prisma.office.findFirst({
      where: { clerkId: req.userId }
    });

    officeName = office?.name ?? "Unknown Office";
  }

  return {
    ...req,
    officeName
  };
}));
  return enrichedRequests;
}