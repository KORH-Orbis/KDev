import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { usePartInOrder, removePartFromOrder, getOrderParts } from "@/modules/spare-parts/lib/stock-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });

  switch (req.method) {
    case "GET": {
      const { orderId } = req.query;
      if (!orderId || typeof orderId !== "string") {
        return res.status(400).json({ error: "orderId requerido", code: "VALIDATION_ERROR" });
      }
      const parts = await getOrderParts(orderId);
      return res.status(200).json({ data: parts });
    }
    case "POST": {
      const { sparePartId, repairOrderId, quantity, unitPrice } = req.body;
      if (!sparePartId || !repairOrderId) {
        return res.status(400).json({ error: "sparePartId y repairOrderId requeridos", code: "VALIDATION_ERROR" });
      }
      try {
        const part = await usePartInOrder(sparePartId, repairOrderId, quantity || 1, unitPrice || 0);
        return res.status(201).json({ data: part });
      } catch (error: any) {
        return res.status(400).json({ error: error.message, code: "SERVER_ERROR" });
      }
    }
    case "DELETE": {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "id requerido", code: "VALIDATION_ERROR" });
      }
      try {
        await removePartFromOrder(id);
        return res.status(200).json({ data: { success: true } });
      } catch (error: any) {
        return res.status(400).json({ error: error.message, code: "SERVER_ERROR" });
      }
    }
    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
