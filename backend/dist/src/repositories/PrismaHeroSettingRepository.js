"use strict";
// backend/src/repositories/PrismaHeroSettingRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHeroSettingRepository = void 0;
const HERO_SETTINGS_ID = "hero";
// NOME CORRETO DA CLASSE
class PrismaHeroSettingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        return this.prisma.heroSetting.findUnique({
            where: { id: HERO_SETTINGS_ID },
        });
    }
    async updateSettings(data) {
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.subtitle !== undefined)
            updateData.subtitle = data.subtitle;
        if (data.cta_text !== undefined)
            updateData.cta_text = data.cta_text;
        if (data.cta_link !== undefined)
            updateData.cta_link = data.cta_link;
        if (data.background_image_url !== undefined)
            updateData.background_image_url = data.background_image_url;
        if (data.is_active !== undefined)
            updateData.is_active = data.is_active;
        return this.prisma.heroSetting.update({
            where: { id: HERO_SETTINGS_ID },
            data: updateData,
        });
    }
}
exports.PrismaHeroSettingRepository = PrismaHeroSettingRepository;
