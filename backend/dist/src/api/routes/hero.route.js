"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeroRouter = void 0;
const express_1 = require("express");
const HeroService_1 = require("../../services/HeroService");
const createHeroRouter = (repositoryFactory) => {
    const router = (0, express_1.Router)();
    const heroService = new HeroService_1.HeroService(repositoryFactory);
    // GET /api/hero - Busca as configurações do Hero (Usado pelo Frontend e Admin)
    router.get("/", async (req, res) => {
        try {
            const settings = await heroService.getHeroSettings();
            return res.status(200).json(settings);
        }
        catch (error) {
            console.error("Erro ao buscar HeroSettings:", error);
            return res
                .status(500)
                .json({ message: "Erro ao carregar configurações da Vitrine." });
        }
    });
    // POST /api/hero - Salva as configurações do Hero (Usado pelo Admin)
    router.post("/", async (req, res) => {
        try {
            const { slides } = req.body;
            const updatedSettings = await heroService.saveHeroSettings(slides);
            return res.status(200).json(updatedSettings);
        }
        catch (error) {
            console.error("Erro ao salvar HeroSettings:", error);
            let errorMessage = "Erro ao salvar alterações.";
            if (error && typeof error === "object" && "message" in error) {
                errorMessage = error.message;
            }
            return res.status(400).json({ message: errorMessage });
        }
    });
    return router;
};
exports.createHeroRouter = createHeroRouter;
