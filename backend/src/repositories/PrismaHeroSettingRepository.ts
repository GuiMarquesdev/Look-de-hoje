// backend/src/repositories/PrismaHeroSettingRepository.ts

import { PrismaClient, HeroSetting } from "@prisma/client";
import { IHeroSettingRepository } from "../interfaces/IHeroSettingRepository";
import { HeroSettingsDTO } from "../common/types";

const HERO_SETTINGS_ID = "hero";

export class PrismaHeroSettingRepository implements IHeroSettingRepository {
  constructor(private prisma: PrismaClient) {}

  async getSettings(): Promise<HeroSetting | null> {
    return this.prisma.heroSetting.findUnique({
      where: { id: HERO_SETTINGS_ID },
    });
  }

  async updateSettings(data: Partial<HeroSettingsDTO>): Promise<HeroSetting> {
    const updateData: { [key: string]: any } = {};

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

      data: updateData as any,
    });
  }
}
