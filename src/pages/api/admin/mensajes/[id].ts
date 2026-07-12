import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { prisma } from "@/modules/core/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return res.status(401).json({ error: "No autorizado" });
  }

  const { id } = req.query;

  if (req.method === "PATCH") {
    await prisma.contactMessage.update({ where: { id: String(id) }, data: { read: true } });
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    await prisma.contactMessage.delete({ where: { id: String(id) } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
