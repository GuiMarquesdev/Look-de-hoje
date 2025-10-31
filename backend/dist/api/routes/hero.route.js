"use strict";
// backend/src/api/routes/hero.route.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeroRouter = void 0;
const express_1 = require("express");
const HeroService_1 = require("../../services/HeroService");
const createHeroRouter = (repositoryFactory) => {
    const router = (0, express_1.Router)();
    const heroSettingRepository = repositoryFactory.createHeroSettingRepository();
    const heroService = new HeroService_1.HeroService(heroSettingRepository); // Assumindo injeção correta
    // 🚨 1. ROTA GET CORRIGIDA: Lida com a URL vazia ("/") que o app.use envia
    router.get("/", async (req, res) => {
        try {
            // Usando o serviço que criamos
            const { settings, slides } = await heroService.getSettingsAndSlides();
            if (!settings) {
                // Se o dado não existe, retornamos um 404 propositalmente, o que o Frontend está vendo
                return res.status(404).json({
                    message: "Configurações do Hero não inicializadas na base de dados.",
                });
            }
            // Retorna a combinação de configurações e slides
            return res.json({ settings, slides });
        }
        catch (error) {
            console.error("Error fetching hero settings:", error);
            // Erro 500 para falhas de servidor/banco de dados
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar configurações do Hero." });
        }
    });
    // 2. ROTA PUT (Para referência)
    router.put("/", async (req, res) => {
        // ... lógica de PUT (já discutida)
        return res.status(501).json({ message: "Rota PUT não implementada." });
    });
    return router;
};
exports.createHeroRouter = createHeroRouter;
//# sourceMappingURL=hero.route.js.map