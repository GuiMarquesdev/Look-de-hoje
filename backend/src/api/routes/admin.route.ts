// backend/src/api/routes/admin.route.ts

import { Router, Request, Response, NextFunction } from "express";
import { IRepositoryFactory } from "../../factories/IRepositoryFactory";
import { AdminService } from "../../services/AdminService";
import { StoreSettingsDTO } from "../../common/types";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Autenticação necessária. Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];
};

export const createAdminRoutes = (repositoryFactory: IRepositoryFactory) => {
  const router = Router();
  const storeSettingRepository =
    repositoryFactory.createStoreSettingRepository();

  const adminCredentialsRepository =
    repositoryFactory.createAdminCredentialsRepository();

  router.use(authMiddleware);

  router.put("/password", async (req: Request, res: Response) => {
    try {
      const { current_password, new_password, confirm_password } = req.body;

      // Validação básica
      if (
        !current_password ||
        !new_password ||
        new_password !== confirm_password
      ) {
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
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Erro interno ao alterar senha.";
      return res.status(401).json({ message: msg });
    }
  });

  return router;
};
