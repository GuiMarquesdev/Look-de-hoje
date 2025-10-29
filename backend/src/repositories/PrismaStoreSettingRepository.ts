// backend/src/repositories/PrismaStoreSettingRepository.ts

import { PrismaClient, StoreSetting } from "@prisma/client";
import { IStoreSettingRepository } from "../interfaces/IStoreSettingRepository";
import { StoreSettingsDTO } from "../common/types";

const SETTINGS_ID = "settings"; // Ou "admin_config" se for o ID que você usa

export class PrismaStoreSettingRepository implements IStoreSettingRepository {
  constructor(private prisma: PrismaClient) {}
  updateAdminPassword(hashedPassword: string): Promise<StoreSetting> {
    throw new Error("Method not implemented.");
  }

  async getSettings(): Promise<StoreSetting | null> {
    return this.prisma.storeSetting.findUnique({
      where: { id: SETTINGS_ID },
    });
  }

  async updateStoreInfo(
    data: Partial<StoreSettingsDTO>
  ): Promise<StoreSetting> {
    return this.prisma.storeSetting.update({
      where: { id: SETTINGS_ID },
      data: {
        store_name: data.store_name,
        instagram_url: data.instagram_url,
        whatsapp_url: data.whatsapp_url,
        email: data.email,
      },
    });
  }

  // 🚨 MÉTODO updateAdminPassword REMOVIDO 🚨
  // A lógica de senha agora está no AdminCredentialsRepository
}
