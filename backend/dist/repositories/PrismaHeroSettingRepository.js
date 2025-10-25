"use strict";
// backend/src/repositories/PrismaHeroSettingRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHeroSettingRepository = void 0;
const HERO_SETTINGS_ID = "hero";
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
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                updateData[key] = value;
            }
        }
        if (Object.keys(updateData).length === 0) {
            throw new Error("Nenhum dado válido fornecido para atualização.");
        }
        return this.prisma.heroSetting.update({
            where: { id: HERO_SETTINGS_ID },
            data: updateData,
        });
    }
}
exports.PrismaHeroSettingRepository = PrismaHeroSettingRepository;
//# sourceMappingURL=PrismaHeroSettingRepository.js.map