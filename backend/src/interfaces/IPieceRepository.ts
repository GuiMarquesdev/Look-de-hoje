import { Piece } from "../common/types";

export interface IPieceRepository {
  findAll(filter?: any): Promise<Piece[]>;
  findById(id: string): Promise<Piece | null>;
  create(data: Omit<Piece, "id" | "created_at" | "updated_at">): Promise<Piece>;
  update(id: string, data: Partial<Piece>): Promise<Piece>;
  delete(id: string): Promise<Piece>;
}
