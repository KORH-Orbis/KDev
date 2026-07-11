import { prisma } from "../../core/lib/prisma";

export type DeviceCreate = {
  clientId: string;
  type: "PC" | "LAPTOP" | "PHONE" | "TABLET" | "OTHER";
  brand?: string;
  model?: string;
  serialNumber?: string;
  imei?: string;
  color?: string;
  accessories?: string;
  notes?: string;
};

export type DeviceUpdate = Partial<DeviceCreate>;

export async function getDevices(filters?: { search?: string; clientId?: string }) {
  const where: any = {};

  if (filters?.clientId) {
    where.clientId = filters.clientId;
  }

  if (filters?.search) {
    where.OR = [
      { brand: { contains: filters.search, mode: "insensitive" as const } },
      { model: { contains: filters.search, mode: "insensitive" as const } },
      { serialNumber: { contains: filters.search, mode: "insensitive" as const } },
      { imei: { contains: filters.search, mode: "insensitive" as const } },
      { client: { name: { contains: filters.search, mode: "insensitive" as const } } },
    ];
  }

  return prisma.device.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true } },
      _count: { select: { repairOrders: true } },
    },
  });
}

export async function getDeviceById(id: string) {
  return prisma.device.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, email: true, phone: true } },
      repairOrders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          trackingCode: true,
          status: true,
          issue: true,
          deviceType: true,
          budgetAmount: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function createDevice(data: DeviceCreate) {
  return prisma.device.create({
    data,
    include: {
      client: { select: { id: true, name: true } },
    },
  });
}

export async function updateDevice(id: string, data: DeviceUpdate) {
  return prisma.device.update({
    where: { id },
    data,
    include: {
      client: { select: { id: true, name: true } },
    },
  });
}

export async function deleteDevice(id: string) {
  return prisma.device.delete({ where: { id } });
}
