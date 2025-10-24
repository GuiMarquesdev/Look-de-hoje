// backend/src/api/routes/pieces.route.ts

import { Router, Request, Response } from "express";
import { IRepositoryFactory } from "@/factories/IRepositoryFactory";
import { PieceService } from "@/services/PieceService";
import { Piece } from "@/common/types";

export const createPieceRouter = (repositoryFactory: IRepositoryFactory) => {
  const router = Router();
  const pieceService = new PieceService(repositoryFactory);

  // GET /api/pieces - Listar todas as peças
  router.get("/", async (req: Request, res: Response) => {
    try {
      // CORREÇÃO: Chamada sem argumentos (PieceService.getAllPieces())
      const pieces = await pieceService.getAllPieces();
      return res.status(200).json(pieces);
    } catch (error) {
      console.error("Erro ao buscar peças:", error);
      return res.status(500).json({ message: "Erro ao buscar peças." });
    }
  });

  // POST /api/pieces - Criar nova peça
  router.post("/", async (req: Request, res: Response) => {
    try {
      const newPiece = await pieceService.createPiece(
        req.body as Omit<Piece, "id" | "created_at" | "updated_at">
      );
      return res.status(201).json(newPiece);
    } catch (error) {
      console.error("Erro ao criar peça:", error);
      return res.status(400).json({ message: "Erro ao criar peça." });
    }
  });

  // PUT /api/pieces/:id - Atualizar peça
  router.put("/:id", async (req: Request, res: Response) => {
    try {
      const updatedPiece = await pieceService.updatePiece(
        req.params.id,
        req.body
      );
      return res.status(200).json(updatedPiece);
    } catch (error) {
      console.error("Erro ao atualizar peça:", error);
      return res.status(400).json({ message: "Erro ao atualizar peça." });
    }
  });

  // DELETE /api/pieces/:id - Excluir peça
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      await pieceService.deletePiece(req.params.id);
      return res.status(200).json({ message: "Peça excluída com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir peça:", error);
      return res
        .status(400)
        .json({ message: "Erro ao excluir peça. Verifique dependências." });
    }
  });

  // PUT /api/pieces/:id/toggle-status - Alternar status
  router.put("/:id/toggle-status", async (req: Request, res: Response) => {
    try {
      const piece = await pieceService.getPieceById(req.params.id);

      if (!piece)
        return res.status(404).json({ message: "Peça não encontrada." });

      const toggledPiece = await pieceService.toggleStatus(
        piece.id,
        piece.status as "available" | "rented"
      );

      return res.status(200).json(toggledPiece);
    } catch (error) {
      console.error("Erro ao alternar status:", error);
      return res.status(400).json({ message: "Erro ao alternar status." });
    }
  });

  // ROTA DE UPLOAD (MOCKADA, REQUER IMPLEMENTAÇÃO COM MULTER/S3)
  router.post("/upload-images", async (req: Request, res: Response) => {
    const mockPublicUrls = [
      "https://mock-s3-bucket/image-uploaded-1.jpg",
      "https://mock-s3-bucket/image-uploaded-2.jpg",
    ];
    return res.status(200).json({ urls: mockPublicUrls });
  });

  return router;
};
