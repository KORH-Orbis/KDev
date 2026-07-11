import { prisma } from "../../core/lib/prisma";

export async function logAction(
  userId: number | null,
  action: string,
  entity: string,
  entityId?: string,
  details?: string
) {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entity, entityId, details },
    });
  } catch (error) {
    console.error("Error saving audit log:", error);
  }
}

export async function getLogs(filters?: {
  userId?: number;
  action?: string;
  entity?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}) {
  const where: any = {};
  if (filters?.userId) where.userId = filters.userId;
  if (filters?.action) where.action = filters.action;
  if (filters?.entity) where.entity = filters.entity;
  if (filters?.from || filters?.to) {
    where.createdAt = {};
    if (filters?.from) where.createdAt.gte = new Date(filters.from);
    if (filters?.to) where.createdAt.lte = new Date(filters.to);
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { name: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs,
    meta: { total, page, pageSize: limit, totalPages: Math.ceil(total / limit) },
  };
}
