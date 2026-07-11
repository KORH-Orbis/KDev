import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getLogs } from "@/modules/admin/lib/audit-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });

  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });

  const { userId, action, entity, from, to, page, limit } = req.query;

  const result = await getLogs({
    userId: userId ? Number(userId) : undefined,
    action: action as string,
    entity: entity as string,
    from: from as string,
    to: to as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 50,
  });

  return res.status(200).json(result);
}
