import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("8&Zr.*N5@cY2#Wm9*Qs", 12);

  await prisma.user.deleteMany({ where: { email: "admin@lkdev.app" } });

  const admin = await prisma.user.upsert({
    where: { email: "rodr.kevin99@gmail.com" },
    update: {},
    create: {
      name: "Kevin",
      email: "rodr.kevin99@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Usuario admin:", admin.email);

  const appConfig = await prisma.appConfig.upsert({
    where: { id: 1 },
    update: {
      appName: "KDev",
      appDescription: "Reparación de computadoras, portátiles, teléfonos y desarrollo web",
      contactEmail: "rodr.kevin99@gmail.com",
      phone: "+543764815871",
      whatsapp: "543764815871",
      guaranteeDays: 30,
      trackingPrefix: "K",
    },
    create: {
      id: 1,
      appName: "KDev",
      appDescription: "Reparación de computadoras, portátiles, teléfonos y desarrollo web",
      contactEmail: "rodr.kevin99@gmail.com",
      phone: "+543764815871",
      whatsapp: "543764815871",
      guaranteeDays: 30,
      trackingPrefix: "LK",
    },
  });

  console.log("AppConfig actualizada:", appConfig.appName);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
