import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { prisma } from "@/modules/core/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return res.status(401).json({ error: "No autorizado" });
  }

  if (req.method === "GET") {
    const { page = "1", limit = "50" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.contactMessage.count(),
    ]);

    return res.status(200).json({ data: messages, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
