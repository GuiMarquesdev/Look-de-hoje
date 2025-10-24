import { Category } from "../common/types";

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  create(name: string): Promise<Category>;
  update(id: string, name: string): Promise<Category>;
  delete(id: string): Promise<Category>;
  countPieces(categoryId: string): Promise<number>;
}
