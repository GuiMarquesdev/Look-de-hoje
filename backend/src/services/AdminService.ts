// backend/src/services/AdminService.ts
import { IRepositoryFactory } from "../factories/IRepositoryFactory";
import { IStoreSettingRepository } from "../interfaces/IStoreSettingRepository";
import { IAdminService } from "../interfaces/IAdminService";
import { StoreSetting } from "../common/types";
import * as bcrypt from "bcrypt";

// Variável para definir a força do hash (10 é um bom padrão)
const HASH_SALT_ROUNDS = 10;

export class AdminService implements IAdminService {
  private storeSettingRepository: IStoreSettingRepository;

  constructor(repositoryFactory: IRepositoryFactory) {
    this.storeSettingRepository =
      repositoryFactory.createStoreSettingRepository();
  }

  // Lógica de Login: Compara a senha fornecida com o hash armazenado
  async checkPassword(password: string): Promise<boolean> {
    const settings = await this.storeSettingRepository.getSettings();
    if (!settings) return false;

    // Se o backend iniciar sem um hash inicial, ele tentará o texto puro (BAD PRACTICE, but safe for initial migration)
    if (settings.admin_password === "admin123") {
      // Se a senha for a padrão não hasheada, faça o hash e atualize
      if (password === "admin123") {
        const newHash = await bcrypt.hash("admin123", HASH_SALT_ROUNDS);
        await this.storeSettingRepository.updateSettings({
          admin_password: newHash,
        });
        return true;
      }
    }

    try {
      const isMatch = await bcrypt.compare(password, settings.admin_password);
      return isMatch;
    } catch (e) {
      console.error("Erro ao comparar senha (hash inválido):", e);
      return false;
    }
  }

  // Lógica para obter configurações (sem a senha)
  async getSettings(): Promise<StoreSetting | null> {
    const settings = await this.storeSettingRepository.getSettings();
    if (settings) {
      // Remove a senha antes de enviar para o frontend
      const { admin_password, ...safeSettings } = settings;
      return safeSettings as StoreSetting;
    }
    return null;
  }

  // Lógica para salvar informações da loja (GET /api/admin/settings)
  async updateSettings(data: Partial<StoreSetting>): Promise<StoreSetting> {
    return this.storeSettingRepository.updateSettings(data);
  }

  // Lógica para trocar a senha (PUT /api/admin/password)
  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<StoreSetting> {
    const settings = await this.storeSettingRepository.getSettings();
    if (!settings) throw new Error("Configurações da loja não encontradas.");

    // 1. Verifica se a senha atual é válida
    const isValid = await bcrypt.compare(
      currentPassword,
      settings.admin_password
    );
    if (!isValid) {
      throw new Error("Senha atual incorreta");
    }

    // 2. Valida o tamanho da nova senha
    if (newPassword.length < 6) {
      throw new Error("Nova senha deve ter pelo menos 6 caracteres");
    }

    // 3. Gera o novo hash e atualiza
    const newPasswordHash = await bcrypt.hash(newPassword, HASH_SALT_ROUNDS);
    return this.storeSettingRepository.updateSettings({
      admin_password: newPasswordHash,
    });
  }
}
