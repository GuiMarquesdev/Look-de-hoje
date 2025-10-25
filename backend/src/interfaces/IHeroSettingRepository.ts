// backend/src/interfaces/IHeroSettingRepository.ts

// CORREÇÃO: Importa a entidade 'HeroSetting' diretamente do Prisma Client
import { HeroSetting } from "@prisma/client";
// CORREÇÃO: Importa o DTO 'HeroSettingsDTO' do arquivo de tipos comuns
import { HeroSettingsDTO } from "../common/types";

// Interface para o repositório de configurações do Hero
export interface IHeroSettingRepository {
  // Método para buscar as configurações (geralmente haverá apenas uma)
  // Retorna a entidade completa 'HeroSetting' ou null se não encontrada
  getSettings(): Promise<HeroSetting | null>;

  // Método para atualizar as configurações
  // Recebe um DTO parcial ('HeroSettingsDTO') com os dados a serem atualizados
  // Retorna a entidade 'HeroSetting' atualizada
  updateSettings(data: Partial<HeroSettingsDTO>): Promise<HeroSetting>;
}
