import express, { json } from "express";
import cors from "cors";

import { PrismaRepositoryFactory } from "@/factories/PrismaRepositoryFactory";
import { createPrismaClient } from "@/database/prisma";
import { createPieceRouter } from "@/api/routes/pieces.route";
import { createAdminRouter } from "@/api/routes/admin.route";
import { createHeroRouter } from "@/api/routes/hero.route";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações
app.use(cors({ origin: "http://localhost:8080" })); // Ajuste a origem para o seu frontend
app.use(json());

// 1. Inicializa o cliente Prisma
const prisma = createPrismaClient();

// 2. Inicializa a Factory
const repositoryFactory = new PrismaRepositoryFactory(prisma);

// 3. Conecta as Rotas à Factory
app.use("/api/pieces", createPieceRouter(repositoryFactory));
app.use("/api/admin", createAdminRouter(repositoryFactory));
app.use("/api/hero", createHeroRouter(repositoryFactory));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
