"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const bcrypt = __importStar(require("bcrypt"));
// Variável para definir a força do hash (10 é um bom padrão)
const HASH_SALT_ROUNDS = 10;
class AdminService {
    constructor(repositoryFactory) {
        this.storeSettingRepository =
            repositoryFactory.createStoreSettingRepository();
    }
    // Lógica de Login: Compara a senha fornecida com o hash armazenado
    async checkPassword(password) {
        const settings = await this.storeSettingRepository.getSettings();
        if (!settings)
            return false;
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
        }
        catch (e) {
            console.error("Erro ao comparar senha (hash inválido):", e);
            return false;
        }
    }
    // Lógica para obter configurações (sem a senha)
    async getSettings() {
        const settings = await this.storeSettingRepository.getSettings();
        if (settings) {
            // Remove a senha antes de enviar para o frontend
            const { admin_password, ...safeSettings } = settings;
            return safeSettings;
        }
        return null;
    }
    // Lógica para salvar informações da loja (GET /api/admin/settings)
    async updateSettings(data) {
        return this.storeSettingRepository.updateSettings(data);
    }
    // Lógica para trocar a senha (PUT /api/admin/password)
    async updatePassword(currentPassword, newPassword) {
        const settings = await this.storeSettingRepository.getSettings();
        if (!settings)
            throw new Error("Configurações da loja não encontradas.");
        // 1. Verifica se a senha atual é válida
        const isValid = await bcrypt.compare(currentPassword, settings.admin_password);
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
exports.AdminService = AdminService;
