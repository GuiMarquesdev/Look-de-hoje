"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCategoryRepository = void 0;
class PrismaCategoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
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
    async findById(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        return category ? { id: category.id, name: category.name } : null;
    }
    async create(name) {
        const category = await this.prisma.category.create({ data: { name } });
        return { id: category.id, name: category.name };
    }
    async update(id, name) {
        const category = await this.prisma.category.update({
            where: { id },
            data: { name },
        });
        return { id: category.id, name: category.name };
    }
    async delete(id) {
        const category = await this.prisma.category.delete({ where: { id } });
        return { id: category.id, name: category.name };
    }
    async countPieces(categoryId) {
        return this.prisma.piece.count({ where: { category_id: categoryId } });
    }
}
exports.PrismaCategoryRepository = PrismaCategoryRepository;
