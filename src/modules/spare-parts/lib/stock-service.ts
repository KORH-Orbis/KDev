import { prisma } from "../../core/lib/prisma";

export type SparePartCreate = {
  name: string;
  category?: string;
  brand?: string;
  model?: string;
  costPrice: number;
  sellingPrice?: number | null;
  stock?: number;
  minStock?: number;
  supplier?: string;
  notes?: string;
};

export type SparePartUpdate = Partial<SparePartCreate>;

export async function getSpareParts(filters?: { search?: string; lowStock?: boolean }) {
  const where: any = {};

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" as const } },
      { category: { contains: filters.search, mode: "insensitive" as const } },
      { brand: { contains: filters.search, mode: "insensitive" as const } },
      { model: { contains: filters.search, mode: "insensitive" as const } },
      { supplier: { contains: filters.search, mode: "insensitive" as const } },
    ];
  }

  if (filters?.lowStock) {
    where.stock = { lt: prisma.sparePart.fields.minStock };
  }

  return prisma.sparePart.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getSparePartById(id: string) {
  return prisma.sparePart.findUnique({
    where: { id },
    include: {
      orderParts: {
        orderBy: { createdAt: "desc" },
        include: {
          repairOrder: { select: { id: true, trackingCode: true } },
        },
      },
    },
  });
}

export async function createSparePart(data: SparePartCreate) {
  return prisma.sparePart.create({
    data: {
      name: data.name,
      category: data.category,
      brand: data.brand,
      model: data.model,
      costPrice: data.costPrice,
      sellingPrice: data.sellingPrice ?? (data.costPrice * 1.5),
      stock: data.stock ?? 0,
      minStock: data.minStock ?? 1,
      supplier: data.supplier,
      notes: data.notes,
    },
  });
}

export async function updateSparePart(id: string, data: SparePartUpdate) {
  return prisma.sparePart.update({ where: { id }, data });
}

export async function deleteSparePart(id: string) {
  return prisma.sparePart.delete({ where: { id } });
}

export async function updateStock(id: string, quantity: number) {
  return prisma.sparePart.update({
    where: { id },
    data: { stock: { increment: quantity } },
  });
}

export async function getLowStock() {
  return prisma.sparePart.findMany({
    where: { stock: { lt: prisma.sparePart.fields.minStock } },
    orderBy: { stock: "asc" },
  });
}

export async function usePartInOrder(
  sparePartId: string,
  repairOrderId: string,
  quantity: number,
  unitPrice: number
) {
  const part = await prisma.sparePart.findUnique({ where: { id: sparePartId } });
  if (!part) throw new Error("Repuesto no encontrado");

  await prisma.sparePart.update({
    where: { id: sparePartId },
    data: { stock: { decrement: quantity } },
  });

  return prisma.orderPart.create({
    data: {
      repairOrderId,
      sparePartId,
      quantity,
      unitPrice: unitPrice ?? part.sellingPrice ?? part.costPrice,
    },
    include: {
      sparePart: true,
    },
  });
}

export async function removePartFromOrder(orderPartId: string) {
  const orderPart = await prisma.orderPart.findUnique({ where: { id: orderPartId } });
  if (!orderPart) throw new Error("Movimiento no encontrado");

  await prisma.sparePart.update({
    where: { id: orderPart.sparePartId },
    data: { stock: { increment: orderPart.quantity } },
  });

  return prisma.orderPart.delete({ where: { id: orderPartId } });
}

export async function getOrderParts(repairOrderId: string) {
  return prisma.orderPart.findMany({
    where: { repairOrderId },
    orderBy: { createdAt: "desc" },
    include: {
      sparePart: true,
    },
  });
}

export async function getMovementHistory(sparePartId: string) {
  return prisma.orderPart.findMany({
    where: { sparePartId },
    orderBy: { createdAt: "desc" },
    include: {
      repairOrder: { select: { id: true, trackingCode: true } },
    },
  });
}
