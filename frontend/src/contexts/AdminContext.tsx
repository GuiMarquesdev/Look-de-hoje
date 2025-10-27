import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import { API_URL } from "@/config/api"; // Importa a URL da sua API
// Removida importação de Supabase

interface AdminUser {
  id: string;
  email: string;
  // Outras informações do admin que vierem do seu backend (Ex: nome)
}

interface AdminContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null; // O token JWT é crucial para o backend Node.js
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// ------------------------------------------
// HOOK PARA PEGAR O CONTEXTO
// ------------------------------------------
// CORREÇÃO APLICADA AQUI: Renomeado para useAdmin
export const useAdminContext = () => {
  // <--- O nome FINAL que deve ser usado!
  const context = useContext(AdminContext);
  if (context === undefined) {
    // Atualize a mensagem de erro para refletir o novo nome
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};

// ------------------------------------------
// PROVIDER PRINCIPAL
// ------------------------------------------
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar o token do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedUser = localStorage.getItem("adminUser");

    if (storedToken && storedUser) {
      // Em uma aplicação de produção, você DEVERIA validar este token com sua API aqui.
      // Por enquanto, vamos confiar no token armazenado para continuar.
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Erro ao analisar dados do usuário armazenado:", e);
        logout(); // Limpa se houver erro
      }
    }
    setIsLoading(false);
  }, []);

  // ------------------------------------------
  // LÓGICA DE LOGIN (POST)
  // Endpoint Sugerido: [API_URL]/admin/login
  // ------------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a resposta for um erro (4xx, 5xx)
        throw new Error(
          data.message || "Credenciais inválidas ou erro no servidor"
        );
      }

      // Sucesso no Login. O Backend DEVE retornar { token: '...', user: { id: '...', email: '...' } }
      const { token, user: userData } = data;

      if (!token || !userData) {
        throw new Error("Resposta de login incompleta.");
      }

      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(userData));

      toast.success("Login bem-sucedido!");
    } catch (error) {
      console.error("Erro de Login:", error);
      toast.error(`Falha no Login: ${(error as Error).message}`);
      throw error; // Propaga o erro para o componente de login
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ------------------------------------------
  // LÓGICA DE LOGOUT
  // ------------------------------------------
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast.info("Sessão encerrada.");
  }, []);

  const contextValue: AdminContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};
