// backend/src/interfaces/IStoreSettingRepository.ts

// CORREÇÃO: Importa a entidade 'StoreSetting' no singular
import { StoreSetting } from "@prisma/client";
import { StoreSettingsDTO } from "../common/types";

// Interface para o repositório de configurações da loja
export interface IStoreSettingRepository {
  // CORREÇÃO: Usa o tipo 'StoreSetting' (singular)
  getSettings(): Promise<StoreSetting | null>;

  // CORREÇÃO: Usa o tipo 'StoreSetting' (singular)
  updateStoreInfo(data: Partial<StoreSettingsDTO>): Promise<StoreSetting>;

  // CORREÇÃO: Usa o tipo 'StoreSetting' (singular)
  updateAdminPassword(hashedPassword: string): Promise<StoreSetting>;
}
