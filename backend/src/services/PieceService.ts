// backend/src/services/PieceService.ts

import { IRepositoryFactory } from "../factories/IRepositoryFactory";
import { IPieceRepository } from "../interfaces/IPieceRepository";
import { Piece } from "../common/types";

export class PieceService {
  private pieceRepository: IPieceRepository;

  // Usa o Factory Method para criar a dependência (PrismaPieceRepository)
  constructor(repositoryFactory: IRepositoryFactory) {
    this.pieceRepository = repositoryFactory.createPieceRepository();
  }

  // Lógica para listar todas as peças
  async getAllPieces(filter?: any): Promise<Piece[]> {
    return this.pieceRepository.findAll(filter);
  }

  // Lógica para obter uma peça por ID
  async getPieceById(id: string): Promise<Piece | null> {
    return this.pieceRepository.findById(id);
  }

  // Lógica para criar uma nova peça
  async createPiece(
    data: Omit<Piece, "id" | "created_at" | "updated_at">
  ): Promise<Piece> {
    return this.pieceRepository.create(data);
  }

  // Lógica para atualizar uma peça
  async updatePiece(id: string, data: Partial<Piece>): Promise<Piece> {
    return this.pieceRepository.update(id, data);
  }

  // Lógica para deletar uma peça
  async deletePiece(id: string): Promise<Piece> {
    return this.pieceRepository.delete(id);
  }

  // Lógica para alternar o status
  async toggleStatus(
    id: string,
    currentStatus: "available" | "rented"
  ): Promise<Piece> {
    const newStatus = currentStatus === "available" ? "rented" : "available";
    return this.pieceRepository.update(id, { status: newStatus });
  }
}
