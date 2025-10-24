import { PrismaClient } from "@prisma/client";

// Inicializa o dotenv para carregar o .env do backend
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

let prisma: PrismaClient;

export const createPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      // Opcional: Ativar logs de consulta em ambiente de desenvolvimento
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn", "error"]
          : ["error"],
    });
  }
  return prisma;
};
