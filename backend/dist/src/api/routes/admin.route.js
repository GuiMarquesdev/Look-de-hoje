"use strict";
// backend/src/api/routes/admin.route.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminRouter = void 0;
const express_1 = require("express");
const AdminService_1 = require("../../services/AdminService");
const createAdminRouter = (repositoryFactory) => {
    const router = (0, express_1.Router)();
    const adminService = new AdminService_1.AdminService(repositoryFactory);
    // POST /api/admin/login - Login do Admin (JÁ IMPLEMENTADO)
    router.post("/login", async (req, res) => {
        // ... (lógica existente)
        const { password } = req.body;
        if (!password) {
            return res
                .status(400)
                .json({ success: false, message: "Senha é obrigatória" });
        }
        try {
            const isAuthenticated = await adminService.checkPassword(password);
            if (isAuthenticated) {
                return res
                    .status(200)
                    .json({ success: true, message: "Login bem-sucedido" });
            }
            else {
                return res
                    .status(401)
                    .json({ success: false, message: "Credenciais inválidas" });
            }
        }
        catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ success: false, message: "Erro interno do servidor" });
        }
        // ...
    });
    // GET /api/admin/settings - Obter configurações (JÁ IMPLEMENTADO)
    router.get("/settings", async (req, res) => {
        try {
            // Obtido via service (que remove a senha)
            const settings = await adminService.getSettings();
            return res.status(200).json(settings);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar configurações" });
        }
    });
    // PUT /api/admin/settings - Atualizar informações da loja
    router.put("/password", async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Campos de senha obrigatórios não preenchidos." });
        }
        try {
            await adminService.updatePassword(currentPassword, newPassword);
            return res
                .status(200)
                .json({ success: true, message: "Senha alterada com sucesso." });
        }
        catch (error) {
            console.error("Erro ao trocar senha:", error);
            // --- CORREÇÃO DE TIPAGEM AQUI ---
            let errorMessage = "Erro ao alterar senha.";
            // Verifica se é um objeto e possui a propriedade 'message' (como um objeto Error)
            if (error && typeof error === "object" && "message" in error) {
                errorMessage = error.message;
            }
            // ---------------------------------
            // O AdminService lança um erro 401 (Não Autorizado) para senhas incorretas
            return res.status(401).json({ message: errorMessage });
        }
    });
    return router;
};
exports.createAdminRouter = createAdminRouter;
