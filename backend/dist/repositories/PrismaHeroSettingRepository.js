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
    // MÉTODOS DE LEITURA (GET) - ESSENCIAIS PARA TS2420
    // ===================================
    // 1. Implementa getSettings() (RESOLVE O ERRO TS2420)
    async getSettings() {
        return this.prisma.heroSetting.findUnique({
            where: { id: HERO_SETTINGS_ID },
        });
    }
    // 2. Implementa getSlides() (RESOLVE O ERRO TS2420)
    async getSlides(settingId) {
        const settings = await this.getSettings();
        // O campo 'slides' será uma propriedade do objeto settings (JSON)
        if (settings &&
            settings.slides &&
            Array.isArray(settings.slides)) {
            // 🚨 IMPORTANTE: No JSON lido, a chave é 'image_url' (agora corrigida na escrita)
            // Se tiver dados antigos com 'url', isso pode causar inconsistência até serem reescritos.
            return settings.slides;
        }
        return [];
    }
    // ===================================
    // MÉTODOS DE ESCRITA (PUT) - CORRIGIDOS COM NOVOS CAMPOS E UPSERT
    // ===================================
    // Mantido para satisfazer a interface (apesar de updateHeroData ser usado na rota)
    async updateSettings(data) {
        return this.prisma.heroSetting.update({
            where: { id: HERO_SETTINGS_ID },
            data: {
                is_active: data.is_active,
                interval_ms: data.interval_ms,
                // Incluindo novos campos
                title: data.title,
                subtitle: data.subtitle,
                cta_text: data.cta_text,
                cta_link: data.cta_link,
                background_image_url: data.background_image_url,
            },
        });
    }
    // Implementação principal com UPSERT
    async updateHeroData(data) {
        // 1. Mapeia os slides, usando 'image_url' (CORREÇÃO DE CHAVE)
        const slidesDataJson = data.slides.map((slide) => ({
            image_url: slide.image_url,
            order: slide.order,
        }));
        // 2. Usa UPSERT para atualizar ou criar (incluindo todos os campos)
        return this.prisma.heroSetting.upsert({
            where: { id: HERO_SETTINGS_ID },
            update: {
                is_active: data.is_active,
                interval_ms: data.interval_ms,
                slides: slidesDataJson,
                // Campos de texto
                title: data.title,
                subtitle: data.subtitle,
                cta_text: data.cta_text,
                cta_link: data.cta_link,
                background_image_url: data.background_image_url,
            },
            create: {
                id: HERO_SETTINGS_ID,
                is_active: data.is_active,
                interval_ms: data.interval_ms,
                slides: slidesDataJson,
                // Campos de texto
                title: data.title,
                subtitle: data.subtitle,
                cta_text: data.cta_text,
                cta_link: data.cta_link,
                background_image_url: data.background_image_url,
            },
        });
    }
}
exports.PrismaHeroSettingRepository = PrismaHeroSettingRepository;
//# sourceMappingURL=PrismaHeroSettingRepository.js.map