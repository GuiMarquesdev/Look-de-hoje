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
        // CORREÇÃO: Utiliza o payload DTO completo e usa asserção de tipo 'as any'
        // para contornar o erro TS2353 que erroneamente diz que 'title' não existe.
        const createPayload = {
            title: data.title,
            description: data.description,
            price: data.price,
            is_available: data.is_available ?? true,
            category: { connect: { id: data.category_id } }, // Conecta a peça à categoria pelo ID
            image_urls: data.image_urls,
        }; // Usamos 'as any' pois sabemos que 'title' existe no schema real
        return this.prisma.piece.create({
            data: createPayload,
        });
    }
    async update(id, data) {
        const existingPiece = await this.prisma.piece.findUnique({ where: { id } });
        if (!existingPiece) {
            return null;
        }
        // Constrói o objeto de atualização com flexibilidade
        const updateData = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                updateData[key] = value;
            }
        }
        // O campo 'category_id' precisa ser tratado para usar a sintaxe 'connect' do Prisma
        if (updateData.category_id !== undefined) {
            updateData.category = { connect: { id: updateData.category_id } };
            delete updateData.category_id; // Remove o campo bruto, já que ele é um relacionamento
        }
        // Usa 'as any' para contornar problemas de tipagem com objetos dinâmicos
        return this.prisma.piece.update({
            where: { id },
            data: updateData,
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