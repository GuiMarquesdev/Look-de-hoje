import { PrismaClient } from "@prisma/client";
import { IStoreSettingRepository } from "../interfaces/IStoreSettingRepository";
import { StoreSetting } from "../common/types";

export class PrismaStoreSettingRepository implements IStoreSettingRepository {
  constructor(private prisma: PrismaClient) {}

  async getSettings(): Promise<StoreSetting | null> {
    // Assume que só haverá uma linha na tabela de configurações
    const settings = await this.prisma.storeSetting.findFirst();
    return settings as StoreSetting | null;
  }

  async updateSettings(data: Partial<StoreSetting>): Promise<StoreSetting> {
    const currentSettings = await this.getSettings();
    if (!currentSettings) {
      throw new Error("Store settings not found. Cannot update.");
    }

    const updatedSettings = await this.prisma.storeSetting.update({
      where: { id: currentSettings.id },
      data,
    });

    return updatedSettings as StoreSetting;
  }
}
