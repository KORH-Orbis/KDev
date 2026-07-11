import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getConfig, updateConfig } from "@/modules/admin/lib/config-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });

  const userRole = (session.user as any)?.role;
  if (userRole !== "ADMIN") return res.status(403).json({ error: "Solo administradores", code: "FORBIDDEN" });

  switch (req.method) {
    case "GET": {
      const config = await getConfig();
      return res.status(200).json({ data: config });
    }
    case "PATCH": {
      const { appName, appDescription, contactEmail, phone, whatsapp, address, guaranteeDays, trackingPrefix, sparePartMargin } = req.body;
      const config = await updateConfig({ appName, appDescription, contactEmail, phone, whatsapp, address, guaranteeDays, trackingPrefix, sparePartMargin });
      return res.status(200).json({ data: config });
    }
    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
