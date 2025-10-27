// frontend/src/pages/admin/AdminLogin.tsx

import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminContext } from "@/contexts/AdminContext";

// ATENÇÃO: Se o erro 'logo-admin.png' persiste, substitua por uma imagem alternativa ou remova.
// Para este exemplo, usarei uma imagem que está disponível no seu contexto (logo-dark.png)
import logo from "@/assets/logo-dark.png"; // Usando logo-dark como fallback, ajuste se necessário.

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // CORREÇÃO: Chama o hook com o nome correto: useAdminContext
  const { isAuthenticated, login } = useAdminContext();
  const navigate = useNavigate();

  // Se já estiver autenticado, redireciona para o painel
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chama a função de login do contexto, que se comunica com a API Node.js
      await login(email, password);

      // A navegação será tratada pelo contexto/AdminLayout, mas a linha abaixo
      // garante o redirecionamento após a atualização do estado.
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Falha no login:", error);
      // O toast já é disparado pelo useAdminContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <img src={logo} alt="Logo Admin" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl font-playfair font-bold text-center">
            Login Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@loja.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
