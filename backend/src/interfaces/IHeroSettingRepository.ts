// backend/src/interfaces/IHeroSettingRepository.ts

import { HeroSetting } from "@prisma/client";
import { HeroSettingsDTO } from "../common/types";

// 🚨 CORREÇÃO: Definir a interface HeroSlideData aqui
interface HeroSlideData {
  id?: string; // ID opcional para novos slides
  image_url: string;
  order: number;
  // Adicione quaisquer outros campos de slide que você precisa salvar (title, subtitle, etc.)
}

// Definição do Payload completo que a rota envia
export interface HeroUpdatePayload extends Partial<HeroSettingsDTO> {
  slides: HeroSlideData[];
}

export interface IHeroSettingRepository {
  getSettings(): Promise<HeroSetting | null>;

  updateSettings(data: Partial<HeroSettingsDTO>): Promise<HeroSetting>;

  // Usar HeroSlideData no retorno
  getSlides(settingId: string): Promise<HeroSlideData[]>;

  updateHeroData(data: HeroUpdatePayload): Promise<HeroSetting>;
}

// 🚨 EXPORTAÇÃO: Exportamos para que outros arquivos (como o Repositório) possam usar o tipo
export { HeroSlideData };
