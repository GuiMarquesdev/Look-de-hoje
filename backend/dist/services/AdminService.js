"use strict";
// backend/src/services/AdminService.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
// As variáveis de ambiente devem ser carregadas via dotenv no ponto de entrada
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_insecure";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@exemplo.com";
class AdminService {
    constructor(storeSettingRepository, 
    // 🚨 NOVO: Injeção do Repositório de Credenciais
    adminCredentialsRepository) {
        this.storeSettingRepository = storeSettingRepository;
        this.adminCredentialsRepository = adminCredentialsRepository;
    }
    // 1. Implementação do Login (AGORA UTILIZA AS DUAS TABELAS)
    async login(email, password) {
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
        const passwordMatch = await bcrypt_1.default.compare(password, credentials.admin_password // Lendo da nova tabela AdminCredentials
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
    async getSettings() {
        const settings = await this.storeSettingRepository.getSettings();
        if (settings) {
            // 🚨 Atenção: Não precisamos remover admin_password, pois ele foi removido do modelo StoreSetting 🚨
            // Retornamos todas as colunas de StoreSetting
            return settings;
        }
        return null;
    }
    // 3. Implementação do Update Store Info (CORRIGIDO: Apenas StoreSetting)
    async updateStoreInfo(data) {
        if (!data.store_name) {
            throw new Error("O nome da loja é obrigatório.");
        }
        return this.storeSettingRepository.updateStoreInfo(data);
    }
    // 4. Implementação do Change Password (CORRIGIDO: Usa AdminCredentialsRepository)
    async changePassword(currentPassword, newPassword) {
        const credentials = await this.adminCredentialsRepository.getCredentials();
        if (!credentials) {
            throw new Error("Configurações de administrador não encontradas.");
        }
        // Verifica a senha atual
        const isCurrentPasswordValid = await bcrypt_1.default.compare(currentPassword, credentials.admin_password);
        if (!isCurrentPasswordValid) {
            throw new Error("Senha atual incorreta.");
        }
        // Gera o hash da nova senha
        const newHashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        // Salva o novo hash na nova tabela
        await this.adminCredentialsRepository.updateAdminPassword(newHashedPassword);
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=AdminService.js.map