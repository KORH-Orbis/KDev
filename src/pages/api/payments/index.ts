import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { createPayment, getPaymentsByOrder } from "@/modules/payments/lib/payment-service";
import { logAction } from "@/modules/admin/lib/audit-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  }

  switch (req.method) {
    case "GET": {
      const { orderId } = req.query;
      if (!orderId || typeof orderId !== "string") {
        return res.status(400).json({ error: "orderId es requerido", code: "VALIDATION_ERROR" });
      }
      const payments = await getPaymentsByOrder(orderId);
      return res.status(200).json({ data: payments });
    }

    case "POST": {
      const { repairOrderId, amount, method, reference, notes } = req.body;

      if (!repairOrderId || !amount || !method) {
        return res.status(400).json({
          error: "repairOrderId, amount y method son requeridos",
          code: "VALIDATION_ERROR",
        });
      }

      try {
        const payment = await createPayment({ repairOrderId, amount, method, reference, notes });
        logAction(Number((session.user as any).id), "CREATE_PAYMENT", "Payment", payment.id, `$${amount} - ${payment.repairOrder.trackingCode}`).catch(() => {});
        return res.status(201).json({ data: payment });
      } catch (error: any) {
        return res.status(500).json({ error: error.message, code: "SERVER_ERROR" });
      }
    }

    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
