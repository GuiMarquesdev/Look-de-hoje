import { PrismaClient, Category as PrismaCategory } from "@prisma/client";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { Category } from "../common/types";

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }));
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return category ? { id: category.id, name: category.name } : null;
  }

  async create(name: string): Promise<Category> {
    const category = await this.prisma.category.create({ data: { name } });
    return { id: category.id, name: category.name };
  }

  async update(id: string, name: string): Promise<Category> {
    const category = await this.prisma.category.update({
      where: { id },
      data: { name },
    });
    return { id: category.id, name: category.name };
  }

  async delete(id: string): Promise<Category> {
    const category = await this.prisma.category.delete({ where: { id } });
    return { id: category.id, name: category.name };
  }

  async countPieces(categoryId: string): Promise<number> {
    return this.prisma.piece.count({ where: { category_id: categoryId } });
  }
}
