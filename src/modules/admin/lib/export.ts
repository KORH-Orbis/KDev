import { prisma } from "../../core/lib/prisma";

function toCSV(data: Record<string, any>[], columns: { key: string; label: string }[]): string {
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = row[c.key] ?? "";
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

export function exportToCSV(data: Record<string, any>[], filename: string): { content: string; filename: string } {
  return { content: toCSV(data, Object.keys(data[0] || {}).map((k) => ({ key: k, label: k }))), filename };
}

export async function exportOrdersCSV(filters?: { status?: string; from?: string; to?: string }) {
  const where: any = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.from || filters?.to) {
    where.createdAt = {};
    if (filters?.from) where.createdAt.gte = new Date(filters.from);
    if (filters?.to) where.createdAt.lte = new Date(filters.to);
  }

  const orders = await prisma.repairOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true } } },
  });

  const columns = [
    { key: "trackingCode", label: "Código" },
    { key: "clientName", label: "Cliente" },
    { key: "deviceType", label: "Tipo" },
    { key: "deviceBrand", label: "Marca" },
    { key: "deviceModel", label: "Modelo" },
    { key: "issue", label: "Problema" },
    { key: "status", label: "Estado" },
    { key: "budgetAmount", label: "Presupuesto" },
    { key: "createdAt", label: "Fecha" },
  ];

  const rows = orders.map((o) => ({
    trackingCode: o.trackingCode,
    clientName: o.client.name,
    deviceType: o.deviceType,
    deviceBrand: o.deviceBrand || "",
    deviceModel: o.deviceModel || "",
    issue: o.issue,
    status: o.status,
    budgetAmount: o.budgetAmount ? `$${Number(o.budgetAmount)}` : "",
    createdAt: o.createdAt.toISOString().split("T")[0],
  }));

  const content = toCSV(rows, columns);
  return { content, filename: `ordenes_${new Date().toISOString().split("T")[0]}.csv` };
}

export async function exportPaymentsCSV(filters?: { from?: string; to?: string }) {
  const where: any = {};
  if (filters?.from || filters?.to) {
    where.createdAt = {};
    if (filters?.from) where.createdAt.gte = new Date(filters.from);
    if (filters?.to) where.createdAt.lte = new Date(filters.to);
  }

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      repairOrder: { select: { trackingCode: true, client: { select: { name: true } } } },
    },
  });

  const columns = [
    { key: "trackingCode", label: "Orden" },
    { key: "clientName", label: "Cliente" },
    { key: "amount", label: "Monto" },
    { key: "method", label: "Método" },
    { key: "reference", label: "Referencia" },
    { key: "createdAt", label: "Fecha" },
  ];

  const rows = payments.map((p) => ({
    trackingCode: p.repairOrder.trackingCode,
    clientName: p.repairOrder.client.name,
    amount: `$${Number(p.amount)}`,
    method: p.method,
    reference: p.reference || "",
    createdAt: p.createdAt.toISOString().split("T")[0],
  }));

  const content = toCSV(rows, columns);
  return { content, filename: `pagos_${new Date().toISOString().split("T")[0]}.csv` };
}
