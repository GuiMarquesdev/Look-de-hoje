"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPieceRepository = void 0;
// Helper para converter tipos do Prisma para o tipo da aplicação (Piece)
const mapToPiece = (prismaPiece) => ({
    ...prismaPiece,
    status: prismaPiece.status,
    images: prismaPiece.images || undefined,
    measurements: prismaPiece.measurements || undefined,
    category: prismaPiece.category
        ? { name: prismaPiece.category.name }
        : undefined,
});
class PrismaPieceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filter) {
        const prismaPieces = await this.prisma.piece.findMany({
            // Inclui a categoria, como era feito no Supabase
            include: { category: { select: { name: true } } },
            orderBy: { created_at: "desc" },
            where: filter,
        });
        return prismaPieces.map(mapToPiece);
    }
    // ... Implementar findById, create, update, delete ...
    async findById(id) {
        const prismaPiece = await this.prisma.piece.findUnique({
            where: { id },
            include: { category: { select: { name: true } } },
        });
        return prismaPiece ? mapToPiece(prismaPiece) : null;
    }
    async create(data) {
        const prismaPiece = await this.prisma.piece.create({ data: data });
        return mapToPiece(prismaPiece);
    }
    async update(id, data) {
        const prismaPiece = await this.prisma.piece.update({
            where: { id },
            data: data,
        });
        return mapToPiece(prismaPiece);
    }
    async delete(id) {
        const prismaPiece = await this.prisma.piece.delete({ where: { id } });
        return mapToPiece(prismaPiece);
    }
}
exports.PrismaPieceRepository = PrismaPieceRepository;
