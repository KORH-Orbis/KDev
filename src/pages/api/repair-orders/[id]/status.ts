import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { changeOrderStatus } from "@/modules/orders/lib/order-service";
import { logAction } from "@/modules/admin/lib/audit-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido", code: "VALIDATION_ERROR" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }

  const { status, notes } = req.body;
  if (!status) {
    return res.status(400).json({ error: "El estado es requerido", code: "VALIDATION_ERROR" });
  }

  try {
    const order = await changeOrderStatus(id, status, notes);
    logAction(Number((session.user as any).id), "UPDATE_STATUS", "RepairOrder", id, `Cambió a ${status} - ${order.trackingCode}`).catch(() => {});
    return res.status(200).json({ data: order });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, code: "INVALID_TRANSITION" });
  }
}
