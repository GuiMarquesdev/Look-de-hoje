// backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

// Carrega as variáveis de ambiente (necessário para ADMIN_EMAIL, se definido)
dotenv.config({ path: "../.env" });

const prisma = new PrismaClient();

// Use o email definido no .env ou o fallback padrão
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@exemplo";

// 🚨 ATENÇÃO: Esta é a senha que você usará para logar: 'admin123'
const PLAIN_TEXT_PASSWORD = "admin123";

async function main() {
  console.log(`Iniciando o seeding...`);

  // Opcional: Criar uma categoria inicial
  const category1 = await prisma.category.upsert({
    where: { slug: "vestidos" },
    update: {},
    create: {
      name: "Vestidos",
      slug: "vestidos",
      is_active: true,
    },
  });
  console.log(`Categoria criada/atualizada: ${category1.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
