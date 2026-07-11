import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { exportOrdersCSV, exportPaymentsCSV } from "@/modules/admin/lib/export";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });

  const { type, status, from, to } = req.query;

  try {
    let result: { content: string; filename: string };

    if (type === "payments") {
      result = await exportPaymentsCSV({ from: from as string, to: to as string });
    } else {
      result = await exportOrdersCSV({ status: status as string, from: from as string, to: to as string });
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
    return res.status(200).send(result.content);
  } catch (e: any) {
    return res.status(500).json({ error: e.message, code: "SERVER_ERROR" });
  }
}
