// backend/src/api/routes/hero.route.ts

import { Router, Request, Response } from "express";
import { IRepositoryFactory } from "../../factories/IRepositoryFactory";
import { HeroService } from "../../services/HeroService";
import { HeroUpdatePayload } from "../../interfaces/IHeroSettingRepository"; // Usar o tipo correto

export const createHeroRouter = (repositoryFactory: IRepositoryFactory) => {
  const router = Router();
  const heroSettingRepository = repositoryFactory.createHeroSettingRepository();
  const heroService = new HeroService(heroSettingRepository); // Assumindo injeção correta

  // 🚨 1. ROTA GET CORRIGIDA: Lida com a URL vazia ("/") que o app.use envia
  router.get("/", async (req: Request, res: Response) => {
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
    } catch (error: any) {
      console.error("Error fetching hero settings:", error);
      // Erro 500 para falhas de servidor/banco de dados
      return res
        .status(500)
        .json({ message: "Erro interno ao buscar configurações do Hero." });
    }
  });

  // 2. ROTA PUT (Para referência)
  router.put("/", async (req: Request, res: Response) => {
    // ... lógica de PUT (já discutida)
    return res.status(501).json({ message: "Rota PUT não implementada." });
  });

  return router;
};
