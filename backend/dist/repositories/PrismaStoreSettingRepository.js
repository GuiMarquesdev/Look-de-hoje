"use strict";
// backend/src/repositories/PrismaStoreSettingRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaStoreSettingRepository = void 0;
const SETTINGS_ID = "settings";
class PrismaStoreSettingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // CORRIGIDO: Nome do método para 'getSettings' e tipo de retorno StoreSetting
    async getSettings() {
        return this.prisma.storeSetting.findUnique({
            // CORRIGIDO: .storeSetting
            where: { id: SETTINGS_ID },
        });
    }
    // CORRIGIDO: Tipo de retorno StoreSetting
    async updateStoreInfo(data) {
        return this.prisma.storeSetting.update({
            // CORRIGIDO: .storeSetting
            where: { id: SETTINGS_ID },
            data: {
                store_name: data.store_name,
                instagram_url: data.instagram_url,
                whatsapp_url: data.whatsapp_url,
                email: data.email,
            },
        });
    }
    // CORRIGIDO: Tipo de retorno StoreSetting
    async updateAdminPassword(hashedPassword) {
        return this.prisma.storeSetting.update({
            // CORRIGIDO: .storeSetting
            where: { id: SETTINGS_ID },
            data: {
                admin_password: hashedPassword,
            },
        });
    }
}
exports.PrismaStoreSettingRepository = PrismaStoreSettingRepository;
//# sourceMappingURL=PrismaStoreSettingRepository.js.map