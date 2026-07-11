import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getDeviceById, updateDevice, deleteDevice } from "@/modules/devices/lib/device-service";
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

  switch (req.method) {
    case "GET": {
      const device = await getDeviceById(id);
      if (!device) return res.status(404).json({ error: "Dispositivo no encontrado", code: "NOT_FOUND" });
      return res.status(200).json({ data: device });
    }
    case "PATCH": {
      const { type, brand, model, serialNumber, imei, color, accessories, notes } = req.body;
      const device = await updateDevice(id, { type, brand, model, serialNumber, imei, color, accessories, notes });
      logAction(Number((session.user as any).id), "UPDATE_DEVICE", "Device", id, `${device.type} ${device.brand || ""}`).catch(() => {});
      return res.status(200).json({ data: device });
    }
    case "DELETE": {
      await deleteDevice(id);
      logAction(Number((session.user as any).id), "DELETE_DEVICE", "Device", id).catch(() => {});
      return res.status(200).json({ data: { success: true } });
    }
    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
