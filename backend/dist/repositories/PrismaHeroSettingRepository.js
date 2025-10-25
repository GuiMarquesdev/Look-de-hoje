"use strict";
// backend/src/repositories/PrismaHeroSettingRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHeroSettingRepository = void 0;
const HERO_SETTINGS_ID = "hero";
// A classe foi corrigida na revisão anterior para PrismaHeroSettingRepository
class PrismaHeroSettingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        return this.prisma.heroSetting.findUnique({
            where: { id: HERO_SETTINGS_ID },
        });
    }
    // NOVO ESTILO: Utiliza Object.entries para mapear dinamicamente o DTO
    async updateSettings(data) {
        // 1. Define um tipo genérico e limpo para o objeto de dados de atualização.
        // Omitimos campos como 'id' que não devem ser atualizados.
        const updateData = {};
        // 2. Itera sobre o objeto DTO de entrada.
        // Esta abordagem é mais robusta contra erros de digitação e tipos incompletos.
        for (const [key, value] of Object.entries(data)) {
            // Apenas inclui valores que não são 'undefined' no payload de atualização.
            // O valor null (se permitido pelo campo) pode ser incluído se não for 'undefined'
            if (value !== undefined) {
                updateData[key] = value;
            }
        }
        // 3. Verificação de segurança (opcional, mas bom)
        if (Object.keys(updateData).length === 0) {
            // Se a requisição PUT não contiver dados, lança um erro para evitar requisição vazia.
            throw new Error("Nenhum dado válido fornecido para atualização.");
        }
        // 4. Executa a atualização no Prisma.
        return this.prisma.heroSetting.update({
            where: { id: HERO_SETTINGS_ID },
            // O uso de 'as any' é uma forma de último recurso para contornar a incompatibilidade
            // entre DTO e tipos gerados, mas garante que o código seja compilado.
            data: updateData,
        });
    }
}
exports.PrismaHeroSettingRepository = PrismaHeroSettingRepository;
//# sourceMappingURL=PrismaHeroSettingRepository.js.map