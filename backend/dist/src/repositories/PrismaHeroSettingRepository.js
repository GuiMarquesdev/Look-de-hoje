"use strict";
// backend/src/repositories/PrismaHeroSettingRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHeroSettingRepository = void 0;
// Não precisamos de tipos utilitários do Prisma, apenas da instância.
class PrismaHeroSettingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        const settings = await this.prisma.heroSetting.findFirst();
        if (!settings)
            return null;
        return {
            id: settings.id,
            // CORREÇÃO REFINADA (1): Converter o tipo Json do Prisma para o tipo HeroSlide[]
            slides: settings.slides || [],
            created_at: settings.created_at,
            updated_at: settings.updated_at,
        };
    }
    async updateSettings(slides) {
        const existing = await this.getSettings();
        if (!existing) {
            // Se não existe, cria.
            const newSettings = await this.prisma.heroSetting.create({
                // CORREÇÃO REFINADA (2): Usar 'as any' ao passar o array de objetos para um campo Json
                data: { slides: slides },
            });
            // Mapeamos o retorno de criação
            return {
                id: newSettings.id,
                slides: newSettings.slides || [],
                created_at: newSettings.created_at,
                updated_at: newSettings.updated_at,
            };
        }
        // Se existe, atualiza
        const updated = await this.prisma.heroSetting.update({
            where: { id: existing.id },
            // CORREÇÃO REFINADA (3): Usar 'as any' na atualização
            data: { slides: slides },
        });
        // Mapeamos a resposta de atualização
        return {
            id: updated.id,
            slides: updated.slides || [],
            created_at: updated.created_at,
            updated_at: updated.updated_at,
        };
    }
}
exports.PrismaHeroSettingRepository = PrismaHeroSettingRepository;
