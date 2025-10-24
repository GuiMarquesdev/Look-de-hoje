import express, { json } from "express";
import cors from "cors";
import { PrismaRepositoryFactory } from "@/factories/PrismaRepositoryFactory";
import { createPrismaClient } from "@/database/prisma";
import { createPieceRouter } from "./routes/pieces.route";
import { createAdminRouter } from "./routes/admin.route";
import { createHeroRouter } from "./routes/hero.route";

// Para ler variáveis de ambiente
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:8080/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(json()); // Para processar body em JSON

// Inicialização da Arquitetura
const prisma = createPrismaClient();
const repositoryFactory = new PrismaRepositoryFactory(prisma);

// Rotas
app.use("/api/pieces", createPieceRouter(repositoryFactory));
app.use("/api/admin", createAdminRouter(repositoryFactory));
app.use("/api/hero", createHeroRouter(repositoryFactory));

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend LooksdeHoje rodando com Express e Prisma!");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
