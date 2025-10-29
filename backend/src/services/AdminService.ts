// backend/src/services/AdminService.ts

import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { StoreSetting } from "@prisma/client";
import { IAdminService } from "../interfaces/IAdminService";
import { IStoreSettingRepository } from "../interfaces/IStoreSettingRepository";
import { StoreSettingsDTO } from "../common/types";

// O JWT_SECRET DEVE vir de uma variável de ambiente (backend/.env)
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_insecure";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@123";

export class AdminService implements IAdminService {
  constructor(private storeSettingRepository: IStoreSettingRepository) {}

  // 1. Implementação do Login
  async login(
    email: string,
    password: string
  ): Promise<{
    token: string;
    user: { id: string; email: string; store_name: string };
  }> {
    const settings = await this.storeSettingRepository.getSettings();

    if (!settings || email !== ADMIN_EMAIL) {
      throw new Error("Credenciais inválidas.");
    }

    // Compara a senha (plain text) com o hash armazenado
    const passwordMatch = await bcrypt.compare(
      password,
      settings.admin_password
    );

    if (!passwordMatch) {
      throw new Error("Credenciais inválidas.");
    }

    // CORREÇÃO: Garante que store_name seja uma string, usando '' se for null.
    const payload = {
      id: settings.id,
      email: ADMIN_EMAIL,
      store_name: settings.store_name ?? "", // Usa string vazia se settings.store_name for null
    };

    // Gera o token JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    // O tipo de retorno agora está correto, pois payload.store_name é garantidamente string
    return { token, user: payload };
  }

  // 2. Implementação do GET Settings
  async getSettings(): Promise<Partial<StoreSetting> | null> {
    const settings = await this.storeSettingRepository.getSettings();
    if (settings) {
      // Remove a senha antes de enviar ao frontend!
      const { admin_password, ...safeSettings } = settings;
      return safeSettings;
    }
    return null;
  }

  // 3. Implementação do Update Store Info
  async updateStoreInfo(
    data: Partial<StoreSettingsDTO>
  ): Promise<StoreSetting> {
    if (!data.store_name) {
      throw new Error("O nome da loja é obrigatório.");
    }
    // Certifique-se de que o método no repositório também retorna StoreSetting
    return this.storeSettingRepository.updateStoreInfo(data);
  }

  // 4. Implementação do Change Password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const settings = await this.storeSettingRepository.getSettings();

    if (!settings) {
      throw new Error("Configurações não encontradas.");
    }

    // Verifica a senha atual
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      settings.admin_password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Senha atual incorreta.");
    }

    // Gera o hash da nova senha
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Salva o novo hash no banco de dados
    await this.storeSettingRepository.updateAdminPassword(newHashedPassword);
  }
}
