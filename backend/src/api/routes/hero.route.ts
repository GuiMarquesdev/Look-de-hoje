import { Router, Request, Response } from "express";
import { IRepositoryFactory } from "../../factories/IRepositoryFactory";
import { HeroService } from "../../services/HeroService";

export const createHeroRouter = (repositoryFactory: IRepositoryFactory) => {
  const router = Router();
  const heroService = new HeroService(repositoryFactory);

  // GET /api/hero - Busca as configurações do Hero (Usado pelo Frontend e Admin)
  router.get("/", async (req: Request, res: Response) => {
    try {
      const settings = await heroService.getHeroSettings();
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Erro ao buscar HeroSettings:", error);
      return res
        .status(500)
        .json({ message: "Erro ao carregar configurações da Vitrine." });
    }
  });

  // POST /api/hero - Salva as configurações do Hero (Usado pelo Admin)
  router.post("/", async (req: Request, res: Response) => {
    try {
      const { slides } = req.body;
      const updatedSettings = await heroService.saveHeroSettings(slides);
      return res.status(200).json(updatedSettings);
    } catch (error) {
      console.error("Erro ao salvar HeroSettings:", error);

      let errorMessage = "Erro ao salvar alterações.";

      if (error && typeof error === "object" && "message" in error) {
        errorMessage = error.message as string;
      }

      return res.status(400).json({ message: errorMessage });
    }
  });

  return router;
};
