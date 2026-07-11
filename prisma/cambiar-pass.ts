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
  const newPassword = "T3@fN9!Qx7.M2#kR8";
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { email: "rodr.kevin99@gmail.com" },
    data: { password: hashed },
  });
  console.log("✅ Contraseña actualizada");
  await prisma.$disconnect();
}
main();
