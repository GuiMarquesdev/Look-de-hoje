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
        return this.prisma.piece.create({
            // O tipo PieceCreateInput DEVE aceitar 'title' após 'prisma generate'
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                is_available: data.is_available ?? true,
                category_id: data.category_id,
                image_urls: data.image_urls,
            },
        });
    }
    async update(id, data) {
        const existingPiece = await this.prisma.piece.findUnique({ where: { id } });
        if (!existingPiece) {
            return null;
        }
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.price !== undefined)
            updateData.price = data.price;
        if (data.is_available !== undefined)
            updateData.is_available = data.is_available;
        if (data.category_id !== undefined)
            updateData.category_id = data.category_id;
        if (data.image_urls !== undefined)
            updateData.image_urls = data.image_urls;
        return this.prisma.piece.update({
            where: { id },
            data: updateData, // O tipo PieceUpdateInput deve aceitar 'title'
        });
    }
    async delete(id) {
        await this.prisma.piece.delete({
            where: { id },
        });
    }
}
exports.PrismaPieceRepository = PrismaPieceRepository;
