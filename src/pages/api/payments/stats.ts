import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getPaymentStats } from "@/modules/payments/lib/payment-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }

  try {
    const stats = await getPaymentStats();
    return res.status(200).json({ data: stats });
  } catch (error) {
    return res.status(500).json({ error: "Error interno", code: "SERVER_ERROR" });
  }
}
