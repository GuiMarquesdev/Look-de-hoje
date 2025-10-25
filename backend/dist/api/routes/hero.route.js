"use strict";
// backend/src/api/routes/hero.route.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeroRouter = void 0;
const express_1 = require("express");
// Importa o Serviço que contém a lógica de negócio
const HeroService_1 = require("../../services/HeroService");
// Middleware de Autenticação JWT (Adapte conforme sua implementação)
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Autenticação necessária." });
    }
    // Adicione a lógica real de verificação do token aqui (ex: jwt.verify)
    try {
        // jwt.verify(token, process.env.JWT_SECRET); // Exemplo
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
};
// Renomeado para createHeroRoutes para consistência (verifique server.ts se necessário)
const createHeroRouter = (repositoryFactory) => {
    const router = (0, express_1.Router)();
    // 1. Usa a FÁBRICA para criar o REPOSITÓRIO específico (IHeroSettingRepository)
    const heroSettingRepository = repositoryFactory.createHeroSettingRepository();
    // 2. Cria o SERVIÇO, injetando o REPOSITÓRIO correto (IHeroSettingRepository)
    const heroService = new HeroService_1.HeroService(heroSettingRepository);
    // --- Rotas Públicas ---
    // GET /api/hero/settings - Busca as configurações atuais do Hero (público)
    router.get("/settings", async (req, res) => {
        try {
            const settings = await heroService.getSettings();
            if (!settings) {
                // Se não houver configurações, pode retornar um default ou 404
                return res
                    .status(404)
                    .json({ message: "Configurações do Hero não encontradas." });
            }
            return res.json(settings);
        }
        catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "Erro ao buscar configurações do Hero." });
        }
    });
    // --- Rotas Administrativas ---
    // Aplica o middleware de autenticação para as rotas abaixo
    router.use(authMiddleware);
    // PUT /api/hero/settings - Atualiza as configurações do Hero (protegido)
    router.put("/settings", async (req, res) => {
        try {
            const data = req.body;
            const updatedSettings = await heroService.updateSettings(data);
            return res.json(updatedSettings);
        }
        catch (error) {
            const msg = error instanceof Error
                ? error.message
                : "Erro ao atualizar configurações do Hero.";
            // Retorna 400 Bad Request se a validação no serviço falhar
            return res.status(400).json({ message: msg });
        }
    });
    return router;
};
exports.createHeroRouter = createHeroRouter;
//# sourceMappingURL=hero.route.js.map