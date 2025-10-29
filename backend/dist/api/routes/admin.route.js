"use strict";
// backend/src/api/routes/admin.route.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminRoutes = void 0;
const express_1 = require("express");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Autenticação necessária. Token não fornecido." });
    }
    const token = authHeader.split(" ")[1];
};
const createAdminRoutes = (repositoryFactory) => {
    const router = (0, express_1.Router)();
    const storeSettingRepository = repositoryFactory.createStoreSettingRepository();
    const adminCredentialsRepository = repositoryFactory.createAdminCredentialsRepository();
    router.use(authMiddleware);
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