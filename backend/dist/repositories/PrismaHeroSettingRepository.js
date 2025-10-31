"use strict";
// backend/src/repositories/PrismaHeroSettingRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHeroSettingRepository = void 0;
const HERO_SETTINGS_ID = "hero";
class PrismaHeroSettingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ===================================
    // MÉTODOS DE ESCRITA (PUT)
    // ===================================
    // 🚨 NOVO MÉTODO: Lógica para salvar TUDO (configurações e slides)
    async updateHeroData(data) {
        // 1. Mapeia os slides para o formato JSON esperado pelo campo 'slides'
        const slidesDataJson = data.slides.map((slide) => ({
            url: slide.image_url,
            order: slide.order,
            // Adicione quaisquer outros campos de slide que você precisa salvar aqui
        }));
        // 2. Atualiza a configuração principal (HeroSetting) e o campo JSON 'slides'
        return this.prisma.heroSetting.update({
            where: { id: HERO_SETTINGS_ID },
            data: {
                is_active: data.is_active,
                interval_ms: data.interval_ms,
                // 🚨 Assumindo que o nome do campo JSON no seu modelo Prisma é 'slides'
                slides: slidesDataJson,
            },
        });
    }
    // ===================================
    // MÉTODOS DE LEITURA (GET) - Mantidos para satisfazer a interface
    // ===================================
    async getSettings() {
        return this.prisma.heroSetting.findUnique({
            where: { id: HERO_SETTINGS_ID },
            // 🚨 ATENÇÃO: Se o campo 'slides' for JSON, o 'findUnique' o retornará aqui.
        });
    }
    async getSlides(settingId) {
        const settings = await this.getSettings();
        // O campo 'slides' será uma propriedade do objeto settings
        if (settings &&
            settings.slides &&
            Array.isArray(settings.slides)) {
            return settings.slides;
        }
        return [];
    }
    async updateSettings(data) {
        return this.prisma.heroSetting.update({
            where: { id: HERO_SETTINGS_ID },
            data: {
                is_active: data.is_active,
                interval_ms: data.interval_ms,
            },
        });
    }
}
exports.PrismaHeroSettingRepository = PrismaHeroSettingRepository;
//# sourceMappingURL=PrismaHeroSettingRepository.js.map