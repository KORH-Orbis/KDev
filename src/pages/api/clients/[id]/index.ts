import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getClientById, updateClient, deleteClient } from "@/modules/clients/lib/client-service";
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
      const client = await getClientById(id);
      if (!client) {
        return res.status(404).json({ error: "Cliente no encontrado", code: "NOT_FOUND" });
      }
      return res.status(200).json({ data: client });
    }

    case "PATCH": {
      const { name, email, phone } = req.body;
      const client = await updateClient(id, { name, email, phone });
      logAction(Number((session.user as any).id), "UPDATE_CLIENT", "Client", id, `Cliente: ${client.name}`).catch(() => {});
      return res.status(200).json({ data: client });
    }

    case "DELETE": {
      await deleteClient(id);
      logAction(Number((session.user as any).id), "DELETE_CLIENT", "Client", id).catch(() => {});
      return res.status(200).json({ data: { success: true } });
    }

    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
