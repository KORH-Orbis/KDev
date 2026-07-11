import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getOrders, createOrder } from "@/modules/orders/lib/order-service";
import { sendTrackingEmail } from "@/modules/orders/lib/email-service";
import { logAction } from "@/modules/admin/lib/audit-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  }

  switch (req.method) {
    case "GET": {
      const { status, search, clientId } = req.query;
      const orders = await getOrders({
        status: status as string,
        search: search as string,
        clientId: clientId as string,
      });
      return res.status(200).json({ data: orders });
    }

    case "POST": {
      const { clientId, deviceType, deviceBrand, deviceModel, deviceSerial, deviceId, issue, notes, guaranteeDays } = req.body;

      if (!clientId || !deviceType || !issue) {
        return res.status(400).json({
          error: "Cliente, tipo de dispositivo y problema son requeridos",
          code: "VALIDATION_ERROR",
        });
      }

      try {
        const order = await createOrder({
          clientId,
          deviceType,
          deviceBrand,
          deviceModel,
          deviceSerial,
          deviceId,
          issue,
          notes,
          guaranteeDays,
        });

        if (order.client.email) {
          sendTrackingEmail({
            trackingCode: order.trackingCode,
            clientName: order.client.name,
            clientEmail: order.client.email,
            deviceType: order.deviceType,
            deviceBrand: order.deviceBrand,
            deviceModel: order.deviceModel,
            issue: order.issue,
          }).catch((err) => {
            console.error("Error enviando email de tracking:", err);
          });
        }

        logAction(Number((session.user as any).id), "CREATE_ORDER", "RepairOrder", order.id, `Orden ${order.trackingCode} para ${order.client.name}`).catch(() => {});

        return res.status(201).json({ data: order });
      } catch (error: any) {
        return res.status(500).json({ error: error.message, code: "SERVER_ERROR" });
      }
    }

    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
