"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaStoreSettingRepository = void 0;
class PrismaStoreSettingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        // Assume que só haverá uma linha na tabela de configurações
        const settings = await this.prisma.storeSetting.findFirst();
        return settings;
    }
    async updateSettings(data) {
        const currentSettings = await this.getSettings();
        if (!currentSettings) {
            throw new Error("Store settings not found. Cannot update.");
        }
        const updatedSettings = await this.prisma.storeSetting.update({
            where: { id: currentSettings.id },
            data,
        });
        return updatedSettings;
    }
}
exports.PrismaStoreSettingRepository = PrismaStoreSettingRepository;
