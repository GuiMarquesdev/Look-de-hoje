import { IRepositoryFactory } from "../factories/IRepositoryFactory";
import { IHeroSettingRepository } from "../interfaces/IHeroSettingRepository";
import { HeroSettings, HeroSlide } from "../common/types";

export class HeroService {
  private heroSettingRepository: IHeroSettingRepository;

  constructor(repositoryFactory: IRepositoryFactory) {
    this.heroSettingRepository =
      repositoryFactory.createHeroSettingRepository();
  }

  async getHeroSettings(): Promise<HeroSettings | null> {
    return this.heroSettingRepository.getSettings();
  }

  async saveHeroSettings(slides: HeroSlide[]): Promise<HeroSettings> {
    // Lógica de validação pode vir aqui
    if (!slides || slides.length === 0) {
      throw new Error("Pelo menos um slide é obrigatório.");
    }
    return this.heroSettingRepository.updateSettings(slides);
  }
}
