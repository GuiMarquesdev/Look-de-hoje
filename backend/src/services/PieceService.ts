// backend/src/services/PieceService.ts

import { IPieceRepository } from "../interfaces/IPieceRepository";
// Importa a entidade Piece do Prisma
import { Piece } from "@prisma/client";
// NÃO deve importar 'Category' de common/types. Se precisar, importe de '@prisma/client'
import { CreatePieceDTO, UpdatePieceDTO } from "../common/types";
import { IPieceService } from "../interfaces/IPieceService";

export class PieceService implements IPieceService {
  constructor(private pieceRepository: IPieceRepository) {}

  async getAllPieces(): Promise<Piece[]> {
    return this.pieceRepository.findAll();
  }

  async getPieceById(id: string): Promise<Piece | null> {
    return this.pieceRepository.findById(id);
  }

  async createPiece(data: CreatePieceDTO): Promise<Piece> {
    // Adicionar validações de negócio aqui, se necessário
    // Ex: Verificar se a category_id existe
    return this.pieceRepository.create(data);
  }

  async updatePiece(id: string, data: UpdatePieceDTO): Promise<Piece | null> {
    // Adicionar validações de negócio aqui, se necessário
    return this.pieceRepository.update(id, data);
  }

  async deletePiece(id: string): Promise<void> {
    // Adicionar validações de negócio aqui, se necessário
    await this.pieceRepository.delete(id);
  }
}
