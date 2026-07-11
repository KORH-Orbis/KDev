import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getOrderById, updateOrder, deleteOrder } from "@/modules/orders/lib/order-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido", code: "VALIDATION_ERROR" });
  }

  switch (req.method) {
    case "GET": {
      const order = await getOrderById(id);
      if (!order) {
        return res.status(404).json({ error: "Orden no encontrada", code: "NOT_FOUND" });
      }
      return res.status(200).json({ data: order });
    }

    case "PATCH": {
      const { deviceType, deviceBrand, deviceModel, deviceSerial, issue, notes, technicianId, budgetAmount, budgetStatus, guaranteeDays } = req.body;

      try {
        const order = await updateOrder(id, {
          deviceType,
          deviceBrand,
          deviceModel,
          deviceSerial,
          issue,
          notes,
          technicianId,
          budgetAmount,
          budgetStatus,
          guaranteeDays,
        });
        return res.status(200).json({ data: order });
      } catch (error: any) {
        return res.status(500).json({ error: error.message, code: "SERVER_ERROR" });
      }
    }

    case "DELETE": {
      await deleteOrder(id);
      return res.status(200).json({ data: { success: true } });
    }

    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
