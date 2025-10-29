// backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
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

  // 1. Gera o hash para a senha de administrador (usando 10 rounds para segurança)
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(PLAIN_TEXT_PASSWORD, saltRounds);
  console.log(
    `Hash da senha de admin gerado. Senha original: ${PLAIN_TEXT_PASSWORD}`
  );

  // 2. Cria ou atualiza as configurações da loja (StoreSetting)
  // O store_name é obrigatório para a AdminService funcionar
  const storeSetting = await prisma.storeSetting.upsert({
    where: { id: "admin_config" }, // Assume-se que você tem um ID fixo ou único para as configurações
    update: {
      admin_password: passwordHash,
      store_name: "Look de Hoje",
    },
    create: {
      id: "admin_config",
      admin_password: passwordHash,
      store_name: "Look de Hoje",
    },
  });

  console.log(
    `Configurações de Administrador salvas com ID: ${storeSetting.id}`
  );

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
