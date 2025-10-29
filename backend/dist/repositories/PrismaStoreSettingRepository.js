"use strict";
// backend/src/repositories/PrismaStoreSettingRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaStoreSettingRepository = void 0;
const SETTINGS_ID = "settings"; // Ou "admin_config" se for o ID que você usa
class PrismaStoreSettingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    updateAdminPassword(hashedPassword) {
        throw new Error("Method not implemented.");
    }
    async getSettings() {
        return this.prisma.storeSetting.findUnique({
            where: { id: SETTINGS_ID },
        });
    }
    async updateStoreInfo(data) {
        return this.prisma.storeSetting.update({
            where: { id: SETTINGS_ID },
            data: {
                store_name: data.store_name,
                instagram_url: data.instagram_url,
                whatsapp_url: data.whatsapp_url,
                email: data.email,
            },
        });
    }
}
exports.PrismaStoreSettingRepository = PrismaStoreSettingRepository;
//# sourceMappingURL=PrismaStoreSettingRepository.js.map