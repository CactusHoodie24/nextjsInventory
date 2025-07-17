import { prisma } from "@/prisma";

export async function getChartData() {
  const requests = await prisma.requisition.findMany({
    select: { createdAt: true, quantityIssued: true },
  });

  const groupedByMonth = requests.reduce((acc: Record<string, number>, request) => {
    const date = new Date(request.createdAt);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    const quantity = request.quantityIssued ?? 0;
    acc[key] = (acc[key] || 0) + quantity;

    return acc;
  }, {} as Record<string, number>);

  const requests1 = await prisma.supply.findMany({
    select: {
      createdAt: true,
      supplyItems: {
        select: { quantity: true }
      }
    }
  });

  const groupedByMonth1 = requests1.reduce((acc: Record<string, number>, request) => {
    const date = new Date(request.createdAt);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    const totalQuantity = request.supplyItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
    acc[key] = (acc[key] || 0) + totalQuantity;

    return acc;
  }, {});

  // Combine the months from both datasets
  const allMonths = new Set([
    ...Object.keys(groupedByMonth),
    ...Object.keys(groupedByMonth1)
  ]);

  // Create merged array for chart consumption
  const chartData = Array.from(allMonths).map(month => ({
    month,
    requisition: groupedByMonth[month] || 0,
    supply: groupedByMonth1[month] || 0
  }));

  console.log("Chart Data:", chartData);

  return chartData;
}


