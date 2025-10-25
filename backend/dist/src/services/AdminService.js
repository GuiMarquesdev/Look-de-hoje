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
// O JWT_SECRET DEVE vir de uma variável de ambiente (backend/.env)
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_insecure";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@exemplo.com";
class AdminService {
    constructor(storeSettingRepository) {
        this.storeSettingRepository = storeSettingRepository;
    }
    // 1. Implementação do Login
    async login(email, password) {
        const settings = await this.storeSettingRepository.getSettings();
        if (!settings || email !== ADMIN_EMAIL) {
            throw new Error("Credenciais inválidas.");
        }
        // Compara a senha (plain text) com o hash armazenado
        const passwordMatch = await bcrypt_1.default.compare(password, settings.admin_password);
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
    async getSettings() {
        const settings = await this.storeSettingRepository.getSettings();
        if (settings) {
            // Remove a senha antes de enviar ao frontend!
            const { admin_password, ...safeSettings } = settings;
            return safeSettings;
        }
        return null;
    }
    // 3. Implementação do Update Store Info
    async updateStoreInfo(data) {
        if (!data.store_name) {
            throw new Error("O nome da loja é obrigatório.");
        }
        // Certifique-se de que o método no repositório também retorna StoreSetting
        return this.storeSettingRepository.updateStoreInfo(data);
    }
    // 4. Implementação do Change Password
    async changePassword(currentPassword, newPassword) {
        const settings = await this.storeSettingRepository.getSettings();
        if (!settings) {
            throw new Error("Configurações não encontradas.");
        }
        // Verifica a senha atual
        const isCurrentPasswordValid = await bcrypt_1.default.compare(currentPassword, settings.admin_password);
        if (!isCurrentPasswordValid) {
            throw new Error("Senha atual incorreta.");
        }
        // Gera o hash da nova senha
        const newHashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        // Salva o novo hash no banco de dados
        await this.storeSettingRepository.updateAdminPassword(newHashedPassword);
    }
}
exports.AdminService = AdminService;
