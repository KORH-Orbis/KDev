import { prisma } from "../../core/lib/prisma";

export type PaymentCreate = {
  repairOrderId: string;
  amount: number;
  method: "CASH" | "TRANSFER" | "CARD" | "OTHER";
  reference?: string;
  notes?: string;
};

export async function createPayment(data: PaymentCreate) {
  return prisma.payment.create({
    data: {
      repairOrderId: data.repairOrderId,
      amount: data.amount,
      method: data.method,
      reference: data.reference,
      notes: data.notes,
    },
    include: {
      repairOrder: {
        select: {
          id: true,
          trackingCode: true,
          budgetAmount: true,
          client: { select: { name: true } },
        },
      },
    },
  });
}

export async function getPaymentsByOrder(repairOrderId: string) {
  return prisma.payment.findMany({
    where: { repairOrderId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPaymentStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayPayments, monthPayments, methodCounts] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: monthStart } },
    }),
    prisma.payment.groupBy({
      by: ["method"],
      _count: { method: true },
    }),
  ]);

  let topMethod = "";
  let topCount = 0;
  for (const m of methodCounts) {
    if (m._count.method > topCount) {
      topCount = m._count.method;
      topMethod = m.method;
    }
  }

  return {
    today: Number(todayPayments._sum.amount || 0),
    month: Number(monthPayments._sum.amount || 0),
    topMethod,
  };
}
