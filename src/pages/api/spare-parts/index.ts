import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getSpareParts, createSparePart, getLowStock } from "@/modules/spare-parts/lib/stock-service";
import { logAction } from "@/modules/admin/lib/audit-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });

  switch (req.method) {
    case "GET": {
      const { search, lowStock } = req.query;
      if (lowStock === "true") {
        const parts = await getLowStock();
        return res.status(200).json({ data: parts });
      }
      const parts = await getSpareParts({ search: search as string });
      return res.status(200).json({ data: parts });
    }
    case "POST": {
      const { name, category, brand, model, costPrice, sellingPrice, stock, minStock, supplier, notes } = req.body;
      if (!name || costPrice == null) {
        return res.status(400).json({ error: "name y costPrice son requeridos", code: "VALIDATION_ERROR" });
      }
      const part = await createSparePart({ name, category, brand, model, costPrice, sellingPrice, stock, minStock, supplier, notes });
      logAction(Number((session.user as any).id), "CREATE_PART", "SparePart", part.id, `Repuesto: ${part.name}`).catch(() => {});
      return res.status(201).json({ data: part });
    }
    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
