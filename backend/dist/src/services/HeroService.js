"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroService = void 0;
class HeroService {
    constructor(repositoryFactory) {
        this.heroSettingRepository =
            repositoryFactory.createHeroSettingRepository();
    }
    async getHeroSettings() {
        return this.heroSettingRepository.getSettings();
    }
    async saveHeroSettings(slides) {
        // Lógica de validação pode vir aqui
        if (!slides || slides.length === 0) {
            throw new Error("Pelo menos um slide é obrigatório.");
        }
        return this.heroSettingRepository.updateSettings(slides);
    }
}
exports.HeroService = HeroService;
