import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getClients, createClient } from "@/modules/clients/lib/client-service";
import { logAction } from "@/modules/admin/lib/audit-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  }

  switch (req.method) {
    case "GET": {
      const { search } = req.query;
      const clients = await getClients(search as string);
      return res.status(200).json({ data: clients });
    }

    case "POST": {
      const { name, email, phone } = req.body;
      if (!name) {
        return res.status(400).json({ error: "El nombre es requerido", code: "VALIDATION_ERROR" });
      }
      const client = await createClient({ name, email, phone });
      logAction(Number((session.user as any).id), "CREATE_CLIENT", "Client", client.id, `Cliente: ${client.name}`).catch(() => {});
      return res.status(201).json({ data: client });
    }

    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
