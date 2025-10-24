// IMPORTAR os tipos do arquivo types.ts (assumindo que o caminho é este)
import { HeroSettings, HeroSlide } from "../common/types";

export interface IHeroSettingRepository {
  getSettings(): Promise<HeroSettings | null>;
  updateSettings(slides: HeroSlide[]): Promise<HeroSettings>;
}
