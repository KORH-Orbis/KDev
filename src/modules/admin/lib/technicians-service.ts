import { prisma } from "../../core/lib/prisma";
import bcrypt from "bcryptjs";

export type TechnicianCreate = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "TECHNICIAN";
};

export type TechnicianUpdate = {
  name?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "TECHNICIAN";
};

export async function getTechnicians() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function getTechnicianById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function createTechnician(data: TechnicianCreate) {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function updateTechnician(id: number, data: TechnicianUpdate) {
  const updateData: any = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function deleteTechnician(id: number) {
  return prisma.user.delete({ where: { id } });
}
