import { prisma } from "../../core/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function savePhoto(
  file: Buffer,
  originalName: string,
  repairOrderId: string,
  caption?: string
) {
  const ext = path.extname(originalName) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), file);

  const url = `/uploads/${filename}`;

  return prisma.photo.create({
    data: {
      repairOrderId,
      url,
      caption: caption || null,
    },
  });
}

export async function getPhotosByOrder(repairOrderId: string) {
  return prisma.photo.findMany({
    where: { repairOrderId },
    orderBy: { createdAt: "desc" },
  });
}
