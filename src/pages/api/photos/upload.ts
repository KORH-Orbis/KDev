import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";
import { savePhoto } from "@/modules/photos/lib/upload-service";
import formidable from "formidable";
import { readFile } from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "No autorizado", code: "UNAUTHORIZED" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }

  try {
    const form = formidable({ keepExtensions: true });
    const [fields, files] = await form.parse(req);

    const repairOrderId = fields.repairOrderId?.[0] as string;
    const caption = fields.caption?.[0] as string | undefined;

    if (!repairOrderId) {
      return res.status(400).json({ error: "repairOrderId es requerido", code: "VALIDATION_ERROR" });
    }

    const fileEntry = files.file?.[0];
    if (!fileEntry) {
      return res.status(400).json({ error: "No se envió ningún archivo", code: "VALIDATION_ERROR" });
    }

    const buffer = await readFile(fileEntry.filepath);
    const originalName = fileEntry.originalFilename || "photo.jpg";

    const photo = await savePhoto(buffer, originalName, repairOrderId, caption);

    return res.status(201).json({ data: photo });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Error al subir la foto", code: "UPLOAD_ERROR" });
  }
}
