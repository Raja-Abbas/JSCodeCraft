import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding JSCodeCraft...");
  const hashed = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
    where: { email: "dev@jscodecraft.com" },
    update: {},
    create: { email: "dev@jscodecraft.com", name: "Demo User", password: hashed, role: "USER" },
  });

  console.log("Seed complete!");
  console.log("Login: dev@jscodecraft.com / password123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
