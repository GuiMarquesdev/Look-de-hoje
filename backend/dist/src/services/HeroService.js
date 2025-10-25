"use strict";
// backend/src/services/HeroService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroService = void 0;
// CORREÇÃO: Adiciona 'export' para que a classe possa ser importada por outros arquivos
class HeroService {
    // O construtor espera o repositório IHeroSettingRepository
    constructor(heroSettingRepository) {
        this.heroSettingRepository = heroSettingRepository;
    }
    // Método para buscar as configurações do Hero
    async getSettings() {
        const settings = await this.heroSettingRepository.getSettings();
        if (settings) {
            // Retorna as configurações (pode adicionar lógica para remover dados sensíveis se houver)
            return settings;
        }
        return null;
    }
    // Método para atualizar as configurações do Hero
    async updateSettings(data) {
        // Adicione validações aqui se necessário (ex: verificar se a URL da imagem é válida)
        if (!data.background_image_url && !data.title) {
            throw new Error("Pelo menos um campo deve ser fornecido para atualização.");
        }
        return this.heroSettingRepository.updateSettings(data);
    }
}
exports.HeroService = HeroService;
