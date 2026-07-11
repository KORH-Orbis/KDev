import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getPhotosByOrder } from "@/modules/photos/lib/upload-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }

  const { orderId } = req.query;
  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({ error: "orderId es requerido", code: "VALIDATION_ERROR" });
  }

  const photos = await getPhotosByOrder(orderId);
  return res.status(200).json({ data: photos });
}
