"use strict";
// backend/src/api/routes/admin.route.ts
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
exports.createAdminRoutes = void 0;
const express_1 = require("express");
const AdminService_1 = require("../../services/AdminService");
const jwt = __importStar(require("jsonwebtoken"));
// Assumindo que a constante JWT_SECRET está disponível via process.env
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_insecure";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@123";
// Middleware para verificar o token JWT e autenticar o administrador
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Autenticação necessária. Token não fornecido." });
    }
    const token = authHeader.split(" ")[1];
    try {
        // Tenta verificar o token usando a chave secreta
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // Anexa as informações do usuário à requisição (útil para logs)
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
};
const createAdminRoutes = (repositoryFactory) => {
    const router = (0, express_1.Router)();
    const storeSettingRepository = repositoryFactory.createStoreSettingRepository();
    const adminCredentialsRepository = repositoryFactory.createAdminCredentialsRepository();
    // 🚨 CORREÇÃO TS2554: Passa os DOIS repositórios para o construtor 🚨
    const adminService = new AdminService_1.AdminService(storeSettingRepository, adminCredentialsRepository // Segundo argumento obrigatório agora
    );
    // ------------------------------------------
    // APLICA O MIDDLEWARE DE AUTENTICAÇÃO PARA TODAS AS ROTAS ABAIXO
    // ------------------------------------------
    router.use(authMiddleware);
    // ------------------------------------------
    // ROTA GET CONFIGURAÇÕES (GET /api/admin/settings)
    // ------------------------------------------
    router.get("/settings", async (req, res) => {
        try {
            const settings = await adminService.getSettings();
            if (!settings) {
                return res
                    .status(404)
                    .json({ message: "Configurações não encontradas." });
            }
            return res.json(settings);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro ao buscar configurações." });
        }
    });
    // ------------------------------------------
    // ROTA PUT ATUALIZA INFORMAÇÕES DA LOJA (PUT /api/admin/settings)
    // ------------------------------------------
    router.put("/settings", async (req, res) => {
        try {
            const data = req.body;
            const updatedSettings = await adminService.updateStoreInfo(data);
            return res.json(updatedSettings);
        }
        catch (error) {
            const msg = error instanceof Error
                ? error.message
                : "Erro interno ao atualizar informações.";
            return res.status(400).json({ message: msg });
        }
    });
    // ------------------------------------------
    // ROTA PUT ALTERAR SENHA (PUT /api/admin/password)
    // ------------------------------------------
    router.put("/password", async (req, res) => {
        try {
            const { current_password, new_password, confirm_password } = req.body;
            // Validação básica
            if (!current_password ||
                !new_password ||
                new_password !== confirm_password) {
                return res
                    .status(400)
                    .json({ message: "Nova senha e confirmação não coincidem." });
            }
            if (new_password.length < 6) {
                return res
                    .status(400)
                    .json({ message: "Nova senha deve ter pelo menos 6 caracteres." });
            }
            await adminService.changePassword(current_password, new_password);
            // 204 No Content - Sucesso, mas não há nada novo para retornar
            return res.status(204).send();
        }
        catch (error) {
            const msg = error instanceof Error
                ? error.message
                : "Erro interno ao alterar senha.";
            return res.status(401).json({ message: msg });
        }
    });
    return router;
};
exports.createAdminRoutes = createAdminRoutes;
//# sourceMappingURL=admin.route.js.map