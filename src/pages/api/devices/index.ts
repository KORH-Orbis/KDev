import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getDevices, createDevice } from "@/modules/devices/lib/device-service";
import { logAction } from "@/modules/admin/lib/audit-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  }

  switch (req.method) {
    case "GET": {
      const { search, clientId } = req.query;
      const devices = await getDevices({
        search: search as string,
        clientId: clientId as string,
      });
      return res.status(200).json({ data: devices });
    }

    case "POST": {
      const { clientId, type, brand, model, serialNumber, imei, color, accessories, notes } = req.body;
      if (!clientId || !type) {
        return res.status(400).json({ error: "clientId y type son requeridos", code: "VALIDATION_ERROR" });
      }

      try {
        const device = await createDevice({ clientId, type, brand, model, serialNumber, imei, color, accessories, notes });
        logAction(Number((session.user as any).id), "CREATE_DEVICE", "Device", device.id, `${device.type} ${device.brand || ""}`.trim()).catch(() => {});
        return res.status(201).json({ data: device });
      } catch (error: any) {
        return res.status(500).json({ error: error.message, code: "SERVER_ERROR" });
      }
    }

    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
