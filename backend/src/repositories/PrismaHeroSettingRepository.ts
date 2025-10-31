// backend/src/repositories/PrismaHeroSettingRepository.ts

import { PrismaClient, HeroSetting } from "@prisma/client";
import {
  IHeroSettingRepository,
  HeroUpdatePayload,
  HeroSlideData,
} from "../interfaces/IHeroSettingRepository";
import { HeroSettingsDTO } from "../common/types";

const HERO_SETTINGS_ID = "hero";

export class PrismaHeroSettingRepository implements IHeroSettingRepository {
  constructor(private prisma: PrismaClient) {}

  // ===================================
  // MÉTODOS DE ESCRITA (PUT)
  // ===================================

  // 🚨 NOVO MÉTODO: Lógica para salvar TUDO (configurações e slides)
  async updateHeroData(data: HeroUpdatePayload): Promise<HeroSetting> {
    // 1. Mapeia os slides para o formato JSON esperado pelo campo 'slides'
    const slidesDataJson = data.slides.map((slide: HeroSlideData) => ({
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
        slides: slidesDataJson as any,
      },
    });
  }

  // ===================================
  // MÉTODOS DE LEITURA (GET) - Mantidos para satisfazer a interface
  // ===================================

  async getSettings(): Promise<HeroSetting | null> {
    return this.prisma.heroSetting.findUnique({
      where: { id: HERO_SETTINGS_ID },
      // 🚨 ATENÇÃO: Se o campo 'slides' for JSON, o 'findUnique' o retornará aqui.
    });
  }

  async getSlides(settingId: string): Promise<HeroSlideData[]> {
    const settings = await this.getSettings();
    // O campo 'slides' será uma propriedade do objeto settings
    if (
      settings &&
      (settings as any).slides &&
      Array.isArray((settings as any).slides)
    ) {
      return (settings as any).slides as HeroSlideData[];
    }
    return [];
  }

  async updateSettings(data: Partial<HeroSettingsDTO>): Promise<HeroSetting> {
    return this.prisma.heroSetting.update({
      where: { id: HERO_SETTINGS_ID },
      data: {
        is_active: data.is_active,
        interval_ms: data.interval_ms,
      },
    });
  }
}
