// backend/src/api/routes/admin.route.ts

import { Router, Request, Response } from "express";
import { IRepositoryFactory } from "../../factories/IRepositoryFactory";
import { AdminService } from "../../services/AdminService";

export const createAdminRouter = (repositoryFactory: IRepositoryFactory) => {
  const router = Router();
  const adminService = new AdminService(repositoryFactory);

  // POST /api/admin/login - Login do Admin (JÁ IMPLEMENTADO)
  router.post("/login", async (req: Request, res: Response) => {
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
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Credenciais inválidas" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
    // ...
  });

  // GET /api/admin/settings - Obter configurações (JÁ IMPLEMENTADO)
  router.get("/settings", async (req: Request, res: Response) => {
    try {
      // Obtido via service (que remove a senha)
      const settings = await adminService.getSettings();
      return res.status(200).json(settings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  });

  // PUT /api/admin/settings - Atualizar informações da loja
  router.put("/password", async (req: Request, res: Response) => {
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
    } catch (error) {
      console.error("Erro ao trocar senha:", error);

      // --- CORREÇÃO DE TIPAGEM AQUI ---
      let errorMessage = "Erro ao alterar senha.";

      // Verifica se é um objeto e possui a propriedade 'message' (como um objeto Error)
      if (error && typeof error === "object" && "message" in error) {
        errorMessage = error.message as string;
      }
      // ---------------------------------

      // O AdminService lança um erro 401 (Não Autorizado) para senhas incorretas
      return res.status(401).json({ message: errorMessage });
    }
  });

  return router;
};
