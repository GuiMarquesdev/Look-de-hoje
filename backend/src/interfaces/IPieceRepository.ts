// backend/src/interfaces/IPieceRepository.ts

// CORREÇÃO: Importa a entidade 'Piece' diretamente do Prisma Client
import { Piece } from "@prisma/client";
// Importa os DTOs de criação e atualização
import { CreatePieceDTO, UpdatePieceDTO } from "../common/types";

// Interface que define os métodos que o repositório de peças deve implementar.
export interface IPieceRepository {
  // Busca todas as peças (pode adicionar filtros/paginações depois)
  findAll(): Promise<Piece[]>;

  // Busca uma peça pelo ID
  findById(id: string): Promise<Piece | null>;

  // Cria uma nova peça
  // Recebe um DTO com os dados de criação
  // Retorna a entidade 'Piece' criada
  create(data: CreatePieceDTO): Promise<Piece>;

  // Atualiza uma peça existente
  // Recebe o ID e um DTO parcial com os dados a serem atualizados
  // Retorna a entidade 'Piece' atualizada ou null se não encontrada
  update(id: string, data: Partial<UpdatePieceDTO>): Promise<Piece | null>;

  // Deleta uma peça pelo ID
  delete(id: string): Promise<void>;
}
