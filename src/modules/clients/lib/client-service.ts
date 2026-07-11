import { prisma } from "../../core/lib/prisma";

export type ClientCreate = {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
};

export type ClientUpdate = Partial<ClientCreate>;

export async function getClients(search?: string) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  return prisma.client.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { repairOrders: true } },
    },
  });
}

export async function getClientById(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      repairOrders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          trackingCode: true,
          deviceType: true,
          deviceBrand: true,
          deviceModel: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function createClient(data: ClientCreate) {
  return prisma.client.create({ data });
}

export async function updateClient(id: string, data: ClientUpdate) {
  return prisma.client.update({
    where: { id },
    data,
  });
}

export async function deleteClient(id: string) {
  return prisma.client.delete({ where: { id } });
}
