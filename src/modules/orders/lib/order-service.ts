import { prisma } from "../../core/lib/prisma";
import { config } from "../../core/lib/config";

export type OrderCreate = {
  clientId: string;
  deviceType: "PC" | "LAPTOP" | "PHONE" | "TABLET" | "OTHER";
  deviceBrand?: string;
  deviceModel?: string;
  deviceSerial?: string;
  deviceId?: string;
  issue: string;
  notes?: string;
  guaranteeDays?: number;
};

export type OrderUpdate = {
  deviceType?: "PC" | "LAPTOP" | "PHONE" | "TABLET" | "OTHER";
  deviceBrand?: string;
  deviceModel?: string;
  deviceSerial?: string;
  issue?: string;
  notes?: string;
  technicianId?: number | null;
  budgetAmount?: number;
  budgetStatus?: string;
  guaranteeDays?: number;
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  RECEIVED: ["DIAGNOSING"],
  DIAGNOSING: ["BUDGETED"],
  BUDGETED: ["APPROVED", "REJECTED"],
  APPROVED: ["REPAIRING"],
  REPAIRING: ["REPAIRED"],
  REPAIRED: ["DELIVERED"],
  DELIVERED: [],
  REJECTED: [],
};

export async function generateTrackingCode(): Promise<string> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.repairOrder.count({
    where: { createdAt: { gte: today } },
  });

  const num = String(count + 1).padStart(4, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${config.trackingPrefix}-${day}${month}-${num}`;
}

export async function getOrders(filters?: {
  status?: string;
  search?: string;
  clientId?: string;
}) {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.clientId) {
    where.clientId = filters.clientId;
  }

  if (filters?.search) {
    where.OR = [
      { trackingCode: { contains: filters.search, mode: "insensitive" as const } },
      { issue: { contains: filters.search, mode: "insensitive" as const } },
      { client: { name: { contains: filters.search, mode: "insensitive" as const } } },
    ];
  }

  return prisma.repairOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, phone: true } },
      technician: { select: { id: true, name: true } },
    },
  });
}

export async function getOrderById(id: string) {
  return prisma.repairOrder.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, email: true, phone: true } },
      technician: { select: { id: true, name: true } },
      device: { select: { id: true, type: true, brand: true, model: true } },
    },
  });
}

export async function createOrder(data: OrderCreate) {
  const trackingCode = await generateTrackingCode();

  return prisma.repairOrder.create({
    data: {
      trackingCode,
      clientId: data.clientId,
      deviceType: data.deviceType,
      deviceBrand: data.deviceBrand,
      deviceModel: data.deviceModel,
      deviceSerial: data.deviceSerial,
      deviceId: data.deviceId || null,
      issue: data.issue,
      notes: data.notes,
      guaranteeDays: data.guaranteeDays || config.guaranteeDays,
    },
    include: {
      client: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function updateOrder(id: string, data: OrderUpdate) {
  const updateData: any = { ...data };

  if (typeof data.budgetAmount === "number") {
    updateData.budgetAmount = data.budgetAmount;
  }

  return prisma.repairOrder.update({
    where: { id },
    data: updateData,
    include: {
      client: { select: { id: true, name: true } },
      technician: { select: { id: true, name: true } },
    },
  });
}

export async function changeOrderStatus(
  id: string,
  newStatus: string,
  notes?: string
) {
  const order = await prisma.repairOrder.findUnique({ where: { id } });

  if (!order) {
    throw new Error("Orden no encontrada");
  }

  const allowed = VALID_TRANSITIONS[order.status];
  if (!allowed?.includes(newStatus)) {
    throw new Error(
      `No se puede cambiar de "${order.status}" a "${newStatus}"`
    );
  }

  const updateData: any = { status: newStatus };

  if (newStatus === "REPAIRED") {
    updateData.completedAt = new Date();
  }

  if (newStatus === "DELIVERED") {
    updateData.deliveredAt = new Date();
  }

  if (notes) {
    updateData.notes = notes;
  }

  return prisma.repairOrder.update({
    where: { id },
    data: updateData,
    include: {
      client: { select: { id: true, name: true } },
      technician: { select: { id: true, name: true } },
    },
  });
}

export async function deleteOrder(id: string) {
  return prisma.repairOrder.delete({ where: { id } });
}

export async function getOrderStats() {
  const [total, active, clients] = await Promise.all([
    prisma.repairOrder.count(),
    prisma.repairOrder.count({
      where: {
        status: { notIn: ["DELIVERED", "REJECTED"] },
      },
    }),
    prisma.client.count(),
  ]);

  return { total, active, clients };
}
