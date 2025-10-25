// backend/src/api/server.ts

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
// Caminho CORRETO: Sobe um nível (para src), entra em factories
import { PrismaRepositoryFactory } from "../factories/PrismaRepositoryFactory";
// Caminho CORRETO: Mesma pasta (api), entra em routes
import { createAdminRoutes } from "./routes/admin.route";
import { createPiecesRoutes } from "./routes/pieces.route";
import { createHeroRouter } from "./routes/hero.route";

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();
const repositoryFactory = new PrismaRepositoryFactory(prisma);

app.use(cors());
app.use(express.json());

const adminRouter = createAdminRoutes(repositoryFactory);
const piecesRouter = createPiecesRoutes(repositoryFactory);
const heroRouter = createHeroRouter(repositoryFactory);

app.use("/api/admin", adminRouter);
app.use("/api/pieces", piecesRouter);
app.use("/api/hero", heroRouter);

app.get("/api", (req, res) => {
  res.json({ message: "API Look de Hoje está online!" });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Algo deu errado no servidor!" });
  }
);

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Tratamento de Encerramento (mantido)
process.on("SIGTERM", () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
process.on("SIGINT", () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
