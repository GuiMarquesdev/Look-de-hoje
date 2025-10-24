// backend/src/repositories/PrismaHeroSettingRepository.ts

import { PrismaClient, Prisma } from "@prisma/client";
import { IHeroSettingRepository } from "../interfaces/IHeroSettingRepository";
import { HeroSettings, HeroSlide } from "../common/types";

// Não precisamos de tipos utilitários do Prisma, apenas da instância.

export class PrismaHeroSettingRepository implements IHeroSettingRepository {
  constructor(private prisma: PrismaClient) {}

  async getSettings(): Promise<HeroSettings | null> {
    const settings = await this.prisma.heroSetting.findFirst();

    if (!settings) return null;

    return {
      id: settings.id,
      // CORREÇÃO REFINADA (1): Converter o tipo Json do Prisma para o tipo HeroSlide[]
      slides: (settings.slides as unknown as HeroSlide[]) || [],
      created_at: settings.created_at,
      updated_at: settings.updated_at,
    } as HeroSettings;
  }

  async updateSettings(slides: HeroSlide[]): Promise<HeroSettings> {
    const existing = await this.getSettings();

    if (!existing) {
      // Se não existe, cria.
      const newSettings = await this.prisma.heroSetting.create({
        // CORREÇÃO REFINADA (2): Usar 'as any' ao passar o array de objetos para um campo Json
        data: { slides: slides as any },
      });

      // Mapeamos o retorno de criação
      return {
        id: newSettings.id,
        slides: (newSettings.slides as unknown as HeroSlide[]) || [],
        created_at: newSettings.created_at,
        updated_at: newSettings.updated_at,
      } as HeroSettings;
    }

    // Se existe, atualiza
    const updated = await this.prisma.heroSetting.update({
      where: { id: existing.id },
      // CORREÇÃO REFINADA (3): Usar 'as any' na atualização
      data: { slides: slides as any },
    });

    // Mapeamos a resposta de atualização
    return {
      id: updated.id,
      slides: (updated.slides as unknown as HeroSlide[]) || [],
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    } as HeroSettings;
  }
}
