// backend/src/services/HeroService.ts

// Importa a interface do repositório
import { IHeroSettingRepository } from "../interfaces/IHeroSettingRepository";
// Importa a entidade HeroSetting do Prisma
import { HeroSetting } from "@prisma/client";
// Importa o DTO para atualizações
import { HeroSettingsDTO } from "../common/types";

// CORREÇÃO: Adiciona 'export' para que a classe possa ser importada por outros arquivos
export class HeroService {
  // O construtor espera o repositório IHeroSettingRepository
  constructor(private heroSettingRepository: IHeroSettingRepository) {}

  // Método para buscar as configurações do Hero
  async getSettings(): Promise<Partial<HeroSetting> | null> {
    const settings = await this.heroSettingRepository.getSettings();
    if (settings) {
      // Retorna as configurações (pode adicionar lógica para remover dados sensíveis se houver)
      return settings;
    }
    return null;
  }

  // Método para atualizar as configurações do Hero
  async updateSettings(data: Partial<HeroSettingsDTO>): Promise<HeroSetting> {
    // Adicione validações aqui se necessário (ex: verificar se a URL da imagem é válida)
    if (!data.background_image_url && !data.title) {
      throw new Error(
        "Pelo menos um campo deve ser fornecido para atualização."
      );
    }
    return this.heroSettingRepository.updateSettings(data);
  }
}
