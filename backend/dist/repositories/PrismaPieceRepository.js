"use strict";
// backend/src/repositories/PrismaPieceRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPieceRepository = void 0;
class PrismaPieceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.piece.findMany({
            orderBy: { created_at: "desc" },
        });
    }
    async findById(id) {
        return this.prisma.piece.findUnique({
            where: { id },
        });
    }
    async create(data) {
        if (!data.title || !data.price || !data.category_id || !data.image_urls) {
            throw new Error("Dados incompletos para criar a peça.");
        }
        // CORREÇÃO: Usa 'as any' para contornar o tipo desatualizado/corrompido PieceCreateInput
        const createPayload = {
            title: data.title,
            description: data.description,
            price: data.price,
            is_available: data.is_available ?? true,
            category: { connect: { id: data.category_id } },
            image_urls: data.image_urls,
        }; // <<<< Asserção de tipo aqui
        return this.prisma.piece.create({
            data: createPayload,
        });
    }
    async update(id, data) {
        const existingPiece = await this.prisma.piece.findUnique({ where: { id } });
        if (!existingPiece) {
            return null;
        }
        const updateData = {};
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
            data: updateData, // Usa 'as any' ou tipo Prisma
        });
    }
    async delete(id) {
        await this.prisma.piece.delete({
            where: { id },
        });
    }
}
exports.PrismaPieceRepository = PrismaPieceRepository;
//# sourceMappingURL=PrismaPieceRepository.js.map