// backend/src/api/routes/admin.route.ts

import { Router, Request, Response, NextFunction } from "express";
import { IRepositoryFactory } from "../../factories/IRepositoryFactory";
import { AdminService } from "../../services/AdminService";
import { StoreSettingsDTO } from "../../common/types";
import * as jwt from "jsonwebtoken";

// Assumindo que a constante JWT_SECRET está disponível via process.env
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_insecure";

// Middleware para verificar o token JWT e autenticar o administrador
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
    (req as any).user = payload; // Anexa as informações do usuário à requisição (útil para logs)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

export const createAdminRoutes = (repositoryFactory: IRepositoryFactory) => {
  const router = Router();
  const storeSettingRepository =
    repositoryFactory.createStoreSettingRepository();
  const adminService = new AdminService(storeSettingRepository);

  // ------------------------------------------
  // ROTA DE LOGIN (POST /api/admin/login) - NÃO Protegida
  // ------------------------------------------
  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email e senha são obrigatórios." });
      }

      const result = await adminService.login(email, password);
      // Retorna o token e os dados do usuário para o frontend
      return res.json(result);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Erro interno ao tentar fazer login.";
      return res.status(401).json({ message: msg });
    }
  });

  // ------------------------------------------
  // APLICA O MIDDLEWARE DE AUTENTICAÇÃO PARA TODAS AS ROTAS ABAIXO
  // ------------------------------------------
  router.use(authMiddleware);

  // ------------------------------------------
  // ROTA GET CONFIGURAÇÕES (GET /api/admin/settings)
  // ------------------------------------------
  router.get("/settings", async (req: Request, res: Response) => {
    try {
      const settings = await adminService.getSettings();
      if (!settings) {
        return res
          .status(404)
          .json({ message: "Configurações não encontradas." });
      }
      return res.json(settings);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar configurações." });
    }
  });

  // ------------------------------------------
  // ROTA PUT ATUALIZA INFORMAÇÕES DA LOJA (PUT /api/admin/settings)
  // ------------------------------------------
  router.put("/settings", async (req: Request, res: Response) => {
    try {
      const data: Partial<StoreSettingsDTO> = req.body;
      const updatedSettings = await adminService.updateStoreInfo(data);
      return res.json(updatedSettings);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Erro interno ao atualizar informações.";
      return res.status(400).json({ message: msg });
    }
  });

  // ------------------------------------------
  // ROTA PUT ALTERAR SENHA (PUT /api/admin/password)
  // ------------------------------------------
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

      await adminService.changePassword(current_password, new_password);

      // 204 No Content - Sucesso, mas não há nada novo para retornar
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
