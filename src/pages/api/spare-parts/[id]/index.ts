import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getSparePartById, updateSparePart, deleteSparePart, updateStock } from "@/modules/spare-parts/lib/stock-service";
import { logAction } from "@/modules/admin/lib/audit-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });

  const { id } = req.query;
  if (typeof id !== "string") return res.status(400).json({ error: "ID inválido", code: "VALIDATION_ERROR" });

  switch (req.method) {
    case "GET": {
      const part = await getSparePartById(id);
      if (!part) return res.status(404).json({ error: "Repuesto no encontrado", code: "NOT_FOUND" });
      return res.status(200).json({ data: part });
    }
    case "PATCH": {
      const { name, category, brand, model, costPrice, sellingPrice, stock, minStock, supplier, notes } = req.body;
      const part = await updateSparePart(id, { name, category, brand, model, costPrice, sellingPrice, stock, minStock, supplier, notes });
      logAction(Number((session.user as any).id), "UPDATE_PART", "SparePart", id, `Repuesto: ${part.name}`).catch(() => {});
      return res.status(200).json({ data: part });
    }
    case "DELETE": {
      await deleteSparePart(id);
      logAction(Number((session.user as any).id), "DELETE_PART", "SparePart", id).catch(() => {});
      return res.status(200).json({ data: { success: true } });
    }
    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
