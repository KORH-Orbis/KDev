import { prisma } from "../../core/lib/prisma";

export async function getMonthlyReport(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const [orders, payments, topParts] = await Promise.all([
    prisma.repairOrder.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { status: true, budgetAmount: true },
    }),
    prisma.payment.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { amount: true, method: true },
    }),
    prisma.orderPart.groupBy({
      by: ["sparePartId"],
      where: { createdAt: { gte: start, lte: end } },
      _count: { sparePartId: true },
      orderBy: { _count: { sparePartId: "desc" } },
      take: 5,
    }),
  ]);

  const created = orders.length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;
  const rejected = orders.filter((o) => o.status === "REJECTED").length;

  const totalIncome = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  const incomeByMethod: Record<string, number> = {};
  for (const p of payments) {
    incomeByMethod[p.method] = (incomeByMethod[p.method] || 0) + Number(p.amount);
  }

  const sparePartIds = topParts.map((t) => t.sparePartId);
  const spareParts = await prisma.sparePart.findMany({
    where: { id: { in: sparePartIds } },
    select: { id: true, name: true },
  });

  const topPartsWithName = topParts.map((t) => {
    const part = spareParts.find((sp) => sp.id === t.sparePartId);
    return { name: part?.name || "Desconocido", count: t._count.sparePartId };
  });

  return { created, delivered, rejected, totalIncome, incomeByMethod, topParts: topPartsWithName };
}

export async function getTechnicianReport(technicianId: number, year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const orders = await prisma.repairOrder.findMany({
    where: { technicianId, createdAt: { gte: start, lte: end } },
    select: { status: true, budgetAmount: true },
  });

  const total = orders.length;
  const completed = orders.filter((o) => o.status === "DELIVERED").length;
  const income = orders.reduce((sum, o) => sum + Number(o.budgetAmount || 0), 0);

  return { total, completed, income };
}

export async function getDashboardReport() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [ordersToday, ordersWeek, ordersMonth, incomeToday, incomeWeek, incomeMonth] = await Promise.all([
    prisma.repairOrder.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.repairOrder.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.repairOrder.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: todayStart } } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: weekStart } } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: monthStart } } }),
  ]);

  return {
    ordersToday,
    ordersWeek,
    ordersMonth,
    incomeToday: Number(incomeToday._sum.amount || 0),
    incomeWeek: Number(incomeWeek._sum.amount || 0),
    incomeMonth: Number(incomeMonth._sum.amount || 0),
  };
}
