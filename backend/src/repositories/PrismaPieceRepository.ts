import { PrismaClient, Piece as PrismaPiece } from "@prisma/client";
import { IPieceRepository } from "../interfaces/IPieceRepository";
import { Piece } from "../common/types";

// Helper para converter tipos do Prisma para o tipo da aplicação (Piece)
const mapToPiece = (
  prismaPiece: PrismaPiece & { category?: { name: string } | null }
): Piece => ({
  ...prismaPiece,
  status: prismaPiece.status as "available" | "rented",
  images: prismaPiece.images || undefined,
  measurements: prismaPiece.measurements || undefined,
  category: prismaPiece.category
    ? { name: prismaPiece.category.name }
    : undefined,
});

export class PrismaPieceRepository implements IPieceRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filter?: any): Promise<Piece[]> {
    const prismaPieces = await this.prisma.piece.findMany({
      // Inclui a categoria, como era feito no Supabase
      include: { category: { select: { name: true } } },
      orderBy: { created_at: "desc" },
      where: filter,
    });
    return prismaPieces.map(mapToPiece);
  }

  // ... Implementar findById, create, update, delete ...
  async findById(id: string): Promise<Piece | null> {
    const prismaPiece = await this.prisma.piece.findUnique({
      where: { id },
      include: { category: { select: { name: true } } },
    });
    return prismaPiece ? mapToPiece(prismaPiece) : null;
  }

  async create(
    data: Omit<Piece, "id" | "created_at" | "updated_at" | "category">
  ): Promise<Piece> {
    const prismaPiece = await this.prisma.piece.create({ data: data as any });
    return mapToPiece(prismaPiece as any);
  }

  async update(id: string, data: Partial<Piece>): Promise<Piece> {
    const prismaPiece = await this.prisma.piece.update({
      where: { id },
      data: data as any,
    });
    return mapToPiece(prismaPiece as any);
  }

  async delete(id: string): Promise<Piece> {
    const prismaPiece = await this.prisma.piece.delete({ where: { id } });
    return mapToPiece(prismaPiece as any);
  }
}
