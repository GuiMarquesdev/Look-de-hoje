// backend/src/api/routes/pieces.route.ts

import { Router, Request, Response, NextFunction } from "express";
import { IRepositoryFactory } from "../../factories/IRepositoryFactory";
import { Piece } from "@prisma/client";
import { CreatePieceDTO, UpdatePieceDTO } from "../../common/types";
import { PieceService } from "../../services/PieceService";

// Middleware de Autenticação JWT (Assumindo que você o tem)
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Lógica de verificação do JWT
  // ...
  next();
};

export const createPiecesRoutes = (repositoryFactory: IRepositoryFactory) => {
  const router = Router();
  // 1. Usa a FÁBRICA para criar o REPOSITÓRIO (IPieceRepository)
  const pieceRepository = repositoryFactory.createPieceRepository();
  // 2. Cria o SERVIÇO, injetando o REPOSITÓRIO (IPieceRepository)
  const pieceService = new PieceService(pieceRepository);

  // ROTAS PÚBLICAS (Leitura)

  // GET /api/pieces
  router.get("/", async (req: Request, res: Response) => {
    try {
      const pieces = await pieceService.getAllPieces();
      return res.json(pieces);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar peças." });
    }
  });

  // GET /api/pieces/:id
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const piece = await pieceService.getPieceById(id);

      if (!piece) {
        return res.status(404).json({ message: "Peça não encontrada." });
      }

      return res.json(piece);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar peça." });
    }
  });

  // Aplica o middleware de autenticação para as rotas administrativas (CUD)
  router.use(authMiddleware);

  // ROTAS ADMINISTRATIVAS (Criação, Atualização, Deleção)

  // POST /api/pieces (Criação de nova peça)
  router.post("/", async (req: Request, res: Response) => {
    try {
      const data: CreatePieceDTO = req.body;
      const newPiece = await pieceService.createPiece(data);
      return res.status(201).json(newPiece);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Erro ao criar peça.";
      return res.status(400).json({ message: msg });
    }
  });

  // PUT /api/pieces/:id (Atualização de peça)
  router.put("/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data: UpdatePieceDTO = req.body;
      const updatedPiece = await pieceService.updatePiece(id, data);

      if (!updatedPiece) {
        return res.status(404).json({ message: "Peça não encontrada." });
      }

      return res.json(updatedPiece);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Erro ao atualizar peça.";
      return res.status(400).json({ message: msg });
    }
  });

  // DELETE /api/pieces/:id (Deleção de peça)
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await pieceService.deletePiece(id);
      return res.status(204).send(); // 204 No Content para sucesso na deleção
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao deletar peça." });
    }
  });

  return router;
};
