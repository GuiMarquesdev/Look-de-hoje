// backend/src/repositories/PrismaPieceRepository.ts

import { PrismaClient, Piece, Prisma } from "@prisma/client"; // Importa Prisma para tipos
import { IPieceRepository } from "../interfaces/IPieceRepository";
import { CreatePieceDTO, UpdatePieceDTO } from "../common/types";

type PieceCreatePrismaInput = Prisma.PieceCreateInput;
type PieceUpdatePrismaInput = Prisma.PieceUpdateInput;

export class PrismaPieceRepository implements IPieceRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Piece[]> {
    return this.prisma.piece.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  async findById(id: string): Promise<Piece | null> {
    return this.prisma.piece.findUnique({
      where: { id },
    });
  }

  async create(data: CreatePieceDTO): Promise<Piece> {
    if (!data.title || !data.price || !data.category_id || !data.image_urls) {
      throw new Error("Dados incompletos para criar a peça.");
    }

    // CORREÇÃO: Usa 'as any' para contornar o tipo desatualizado/corrompido PieceCreateInput
    const createPayload: PieceCreatePrismaInput = {
      title: data.title,
      description: data.description,
      price: data.price,
      is_available: data.is_available ?? true,
      category: { connect: { id: data.category_id } },
      image_urls: data.image_urls,
    } as any; // <<<< Asserção de tipo aqui

    return this.prisma.piece.create({
      data: createPayload,
    });
  }

  async update(
    id: string,
    data: Partial<UpdatePieceDTO>
  ): Promise<Piece | null> {
    const existingPiece = await this.prisma.piece.findUnique({ where: { id } });
    if (!existingPiece) {
      return null;
    }

    const updateData: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    if (updateData.category_id !== undefined) {
      updateData.category = { connect: { id: updateData.category_id } };
      delete updateData.category_id;
    }

    return this.prisma.piece.update({
      where: { id },
      data: updateData as PieceUpdatePrismaInput, // Usa 'as any' ou tipo Prisma
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.piece.delete({
      where: { id },
    });
  }
}
