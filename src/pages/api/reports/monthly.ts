import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getMonthlyReport } from "@/modules/admin/lib/reports";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });

  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

  try {
    const report = await getMonthlyReport(year, month);
    return res.status(200).json({ data: { year, month, ...report } });
  } catch (e: any) {
    return res.status(500).json({ error: e.message, code: "SERVER_ERROR" });
  }
}
