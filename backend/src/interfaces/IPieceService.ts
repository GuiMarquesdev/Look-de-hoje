// backend/src/interfaces/IPieceService.ts

// CORREÇÃO: Importa a entidade 'Piece' diretamente do Prisma Client
import { Piece } from "@prisma/client";
// Importa os DTOs para criação e atualização
import { CreatePieceDTO, UpdatePieceDTO } from "../common/types";

// Interface que define os métodos que o PieceService deve implementar.
export interface IPieceService {
  getAllPieces(): Promise<Piece[]>;
  getPieceById(id: string): Promise<Piece | null>;
  createPiece(data: CreatePieceDTO): Promise<Piece>;
  updatePiece(id: string, data: UpdatePieceDTO): Promise<Piece | null>;
  deletePiece(id: string): Promise<void>;
}
