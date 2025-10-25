// backend/src/repositories/PrismaStoreSettingRepository.ts

import { PrismaClient, StoreSetting } from "@prisma/client"; // CORRIGIDO: StoreSetting
import { IStoreSettingRepository } from "../interfaces/IStoreSettingRepository";
import { StoreSettingsDTO } from "../common/types";

const SETTINGS_ID = "settings";

export class PrismaStoreSettingRepository implements IStoreSettingRepository {
  constructor(private prisma: PrismaClient) {}

  // CORRIGIDO: Nome do método para 'getSettings' e tipo de retorno StoreSetting
  async getSettings(): Promise<StoreSetting | null> {
    return this.prisma.storeSetting.findUnique({
      // CORRIGIDO: .storeSetting
      where: { id: SETTINGS_ID },
    });
  }

  // CORRIGIDO: Tipo de retorno StoreSetting
  async updateStoreInfo(
    data: Partial<StoreSettingsDTO>
  ): Promise<StoreSetting> {
    return this.prisma.storeSetting.update({
      // CORRIGIDO: .storeSetting
      where: { id: SETTINGS_ID },
      data: {
        store_name: data.store_name,
        instagram_url: data.instagram_url,
        whatsapp_url: data.whatsapp_url,
        email: data.email,
      },
    });
  }

  // CORRIGIDO: Tipo de retorno StoreSetting
  async updateAdminPassword(hashedPassword: string): Promise<StoreSetting> {
    return this.prisma.storeSetting.update({
      // CORRIGIDO: .storeSetting
      where: { id: SETTINGS_ID },
      data: {
        admin_password: hashedPassword,
      },
    });
  }
}
