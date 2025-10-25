"use strict";
// backend/src/repositories/PrismaCategoryRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCategoryRepository = void 0;
class PrismaCategoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: "asc" },
        });
    }
    async findById(id) {
        return this.prisma.category.findUnique({
            where: { id },
        });
    }
    // Usa findFirst para buscar por slug
    async findBySlug(slug) {
        return this.prisma.category.findFirst({
            where: { slug }, // findFirst aceita 'slug' aqui
        });
    }
    async create(data) {
        if (!data.name || !data.slug) {
            throw new Error("Nome e slug são obrigatórios para criar a categoria.");
        }
        // Verifica se o slug já existe usando findFirst
        const existing = await this.prisma.category.findFirst({
            where: { slug: data.slug },
        }); // findFirst aceita 'slug'
        if (existing) {
            throw new Error(`Já existe uma categoria com o slug '${data.slug}'.`);
        }
        return this.prisma.category.create({
            data: {
                // Os tipos CategoryCreateInput devem aceitar 'slug' se estiver no schema
                name: data.name,
                slug: data.slug,
                is_active: data.is_active ?? true,
            },
        });
    }
    async update(id, data) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            return null;
        }
        // CORREÇÃO: Tipando updateData explicitamente para ajudar o TypeScript
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.slug !== undefined)
            updateData.slug = data.slug;
        if (data.is_active !== undefined)
            updateData.is_active = data.is_active;
        // Não permite atualizar para um slug que já existe em OUTRA categoria
        if (updateData.slug && updateData.slug !== existingCategory.slug) {
            // Usa findFirst
            const conflictingCategory = await this.prisma.category.findFirst({
                where: { slug: updateData.slug },
            }); // findFirst aceita 'slug'
            if (conflictingCategory && conflictingCategory.id !== id) {
                throw new Error(`Já existe outra categoria com o slug '${updateData.slug}'.`);
            }
        }
        return this.prisma.category.update({
            where: { id },
            data: updateData, // Os tipos CategoryUpdateInput devem aceitar 'slug' se estiver no schema
        });
    }
    async delete(id) {
        await this.prisma.category.delete({
            where: { id },
        });
    }
}
exports.PrismaCategoryRepository = PrismaCategoryRepository;
