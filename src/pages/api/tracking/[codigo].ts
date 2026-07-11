import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/modules/core/lib/prisma";

const statusMap: Record<string, string> = {
  RECEIVED: "recibido",
  DIAGNOSING: "diagnosticando",
  BUDGETED: "presupuestado",
  APPROVED: "aprobado",
  REPAIRING: "reparando",
  REPAIRED: "reparado",
  DELIVERED: "entregado",
  REJECTED: "rechazado",
};

const statusDescriptions: Record<string, string> = {
  RECEIVED: "Equipo recibido en nuestro taller",
  DIAGNOSING: "En proceso de diagnóstico técnico",
  BUDGETED: "Presupuesto enviado al cliente",
  APPROVED: "Presupuesto aprobado por el cliente",
  REPAIRING: "Equipo en reparación",
  REPAIRED: "Reparación completada",
  DELIVERED: "Equipo entregado al cliente",
  REJECTED: "Presupuesto rechazado por el cliente",
};

function buildHistory(order: any) {
  const history = [
    {
      estado: "recibido",
      fecha: order.createdAt.toISOString(),
      descripcion: statusDescriptions.RECEIVED,
    },
  ];

  if (order.budgetAmount && order.updatedAt > order.createdAt) {
    const budgetDate =
      order.budgetStatus === "APPROVED" || order.budgetStatus === "REJECTED"
        ? order.updatedAt
        : order.updatedAt;

    history.push({
      estado: "presupuestado",
      fecha: order.updatedAt.toISOString(),
      descripcion: `Presupuesto: $${Number(order.budgetAmount).toLocaleString("es-CO")}${order.budgetStatus ? ` (${order.budgetStatus})` : ""}`,
    });
  }

  if (["APPROVED", "REPAIRING", "REPAIRED", "DELIVERED"].includes(order.status)) {
    history.push({
      estado: "aprobado",
      fecha: order.updatedAt.toISOString(),
      descripcion: "Cliente aprobó el presupuesto",
    });
  }

  if (["REPAIRED", "DELIVERED"].includes(order.status) && order.completedAt) {
    history.push({
      estado: "reparado",
      fecha: order.completedAt.toISOString(),
      descripcion: statusDescriptions.REPAIRED,
    });
  }

  if (order.status === "DELIVERED" && order.deliveredAt) {
    history.push({
      estado: "entregado",
      fecha: order.deliveredAt.toISOString(),
      descripcion: statusDescriptions.DELIVERED,
    });
  }

  if (order.status === "REJECTED") {
    history.push({
      estado: "rechazado",
      fecha: order.updatedAt.toISOString(),
      descripcion: statusDescriptions.REJECTED,
    });
  }

  return history;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { codigo } = req.query;

  if (typeof codigo !== "string") {
    return res.status(400).json({ error: "Código inválido", code: "VALIDATION_ERROR" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }

  try {
    const order = await prisma.repairOrder.findUnique({
      where: { trackingCode: codigo.toUpperCase() },
      include: {
        client: { select: { name: true } },
        photos: { select: { url: true, caption: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada", code: "NOT_FOUND" });
    }

    return res.status(200).json({
      data: {
        id: order.id,
        codigo: order.trackingCode,
        estado: statusMap[order.status] || order.status.toLowerCase(),
        estadoOriginal: order.status,
        dispositivo: [order.deviceType, order.deviceBrand, order.deviceModel]
          .filter(Boolean)
          .join(" — "),
        problema: order.issue,
        presupuesto: order.budgetAmount ? Number(order.budgetAmount) : null,
        notaPresupuesto: order.budgetStatus,
        fecha: order.createdAt.toISOString(),
        garantia: `${order.guaranteeDays} días a partir de la entrega`,
        cliente: order.client.name,
        historial: buildHistory(order),
        fotos: order.photos.map((p) => ({ url: p.url, caption: p.caption })),
      },
    });
  } catch (error) {
    console.error("Error fetching tracking:", error);
    return res.status(500).json({ error: "Error interno", code: "SERVER_ERROR" });
  }
}
