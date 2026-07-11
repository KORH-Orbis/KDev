import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { getTechnicians, getTechnicianById, createTechnician, updateTechnician, deleteTechnician } from "@/modules/admin/lib/technicians-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });

  const userRole = (session.user as any)?.role;
  if (userRole !== "ADMIN") return res.status(403).json({ error: "Solo administradores", code: "FORBIDDEN" });

  switch (req.method) {
    case "GET": {
      const { id } = req.query;
      if (id) {
        const tech = await getTechnicianById(Number(id));
        if (!tech) return res.status(404).json({ error: "Técnico no encontrado", code: "NOT_FOUND" });
        return res.status(200).json({ data: tech });
      }
      const techs = await getTechnicians();
      return res.status(200).json({ data: techs });
    }

    case "POST": {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "name, email y password requeridos", code: "VALIDATION_ERROR" });
      }
      try {
        const tech = await createTechnician({ name, email, password, role: role || "TECHNICIAN" });
        return res.status(201).json({ data: tech });
      } catch (e: any) {
        if (e.code === "P2002") return res.status(400).json({ error: "El email ya existe", code: "DUPLICATE" });
        return res.status(500).json({ error: e.message, code: "SERVER_ERROR" });
      }
    }

    case "PATCH": {
      const { id, name, email, password, role } = req.body;
      if (!id) return res.status(400).json({ error: "id requerido", code: "VALIDATION_ERROR" });
      try {
        const tech = await updateTechnician(Number(id), { name, email, password, role });
        return res.status(200).json({ data: tech });
      } catch (e: any) {
        return res.status(500).json({ error: e.message, code: "SERVER_ERROR" });
      }
    }

    case "DELETE": {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "id requerido", code: "VALIDATION_ERROR" });
      try {
        await deleteTechnician(Number(id));
        return res.status(200).json({ data: { success: true } });
      } catch (e: any) {
        return res.status(500).json({ error: e.message, code: "SERVER_ERROR" });
      }
    }

    default:
      return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }
}
