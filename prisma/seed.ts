import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin1";
  const adminPassword = process.env.ADMIN_PASSWORD || "22445";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      passwordHash,
      role: "admin",
    },
    update: {
      passwordHash,
    },
  });

  await prisma.page.upsert({
    where: { slug: "home" },
    create: {
      slug: "home",
      title: "Grow your local business with content and ads",
      subtitle: "Content, landing pages, and WhatsApp conversion flow in one system.",
      heroImage: "",
    },
    update: {},
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
