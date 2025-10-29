// backend/src/services/AdminService.ts

import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { StoreSetting } from "@prisma/client";
import { IAdminService } from "../interfaces/IAdminService";
import { IStoreSettingRepository } from "../interfaces/IStoreSettingRepository";
// 🚨 NOVO: Interface para o Repositório de Credenciais
import { IAdminCredentialsRepository } from "../interfaces/IAdminCredentialsRepository";
import { StoreSettingsDTO } from "../common/types";

// As variáveis de ambiente devem ser carregadas via dotenv no ponto de entrada
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_insecure";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@exemplo.com";

export class AdminService implements IAdminService {
  constructor(
    private storeSettingRepository: IStoreSettingRepository,
    // 🚨 NOVO: Injeção do Repositório de Credenciais
    private adminCredentialsRepository: IAdminCredentialsRepository
  ) {}

  // 1. Implementação do Login (AGORA UTILIZA AS DUAS TABELAS)
  async login(
    email: string,
    password: string
  ): Promise<{
    token: string;
    user: { id: string; email: string; store_name: string };
  }> {
    // Busca as credenciais e as configurações da loja
    const credentials = await this.adminCredentialsRepository.getCredentials();
    const settings = await this.storeSettingRepository.getSettings();

    // 1. Verifica se ambos os registros iniciais existem
    if (!credentials || !settings) {
      throw new Error("Credenciais inválidas.");
    }

    // 2. Verifica o e-mail
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error("Credenciais inválidas.");
    }

    // 3. Compara a senha (plain text) com o hash da nova tabela de credenciais
    const passwordMatch = await bcrypt.compare(
      password,
      credentials.admin_password // Lendo da nova tabela AdminCredentials
    );

    if (!passwordMatch) {
      throw new Error("Credenciais inválidas.");
    }

    // Geração do token JWT
    const payload = {
      id: credentials.id,
      email: ADMIN_EMAIL,
      store_name: settings.store_name ?? "",
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return { token, user: payload };
  }

  // 2. Implementação do GET Settings (CORRIGIDO: Apenas StoreSetting)
  async getSettings(): Promise<Partial<StoreSetting> | null> {
    const settings = await this.storeSettingRepository.getSettings();
    if (settings) {
      // 🚨 Atenção: Não precisamos remover admin_password, pois ele foi removido do modelo StoreSetting 🚨
      // Retornamos todas as colunas de StoreSetting
      return settings;
    }
    return null;
  }

  // 3. Implementação do Update Store Info (CORRIGIDO: Apenas StoreSetting)
  async updateStoreInfo(
    data: Partial<StoreSettingsDTO>
  ): Promise<StoreSetting> {
    if (!data.store_name) {
      throw new Error("O nome da loja é obrigatório.");
    }
    return this.storeSettingRepository.updateStoreInfo(data);
  }

  // 4. Implementação do Change Password (CORRIGIDO: Usa AdminCredentialsRepository)
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const credentials = await this.adminCredentialsRepository.getCredentials();

    if (!credentials) {
      throw new Error("Configurações de administrador não encontradas.");
    }

    // Verifica a senha atual
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      credentials.admin_password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Senha atual incorreta.");
    }

    // Gera o hash da nova senha
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Salva o novo hash na nova tabela
    await this.adminCredentialsRepository.updateAdminPassword(
      newHashedPassword
    );
  }
}
