// frontend/src/pages/admin/Settings.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
// A importação do supabase FOI REMOVIDA
// import { supabase } from '@/integrations/supabase/client';
import {
  Settings as SettingsIcon,
  Shield,
  Store,
  Link as LinkIcon,
} from "lucide-react";
import { API_URL } from "@/config/api"; // Importando a URL da sua API
import { useAdmin } from "@/contexts/AdminContext"; // <--- CORREÇÃO

// Mapeando a estrutura do banco de dados (ajuste se o backend retornar algo diferente)
interface StoreSettings {
  id: string;
  store_name: string;
  instagram_url?: string;
  whatsapp_url?: string;
  email?: string;
  // A senha do admin não deve ser retornada no fetch de settings, mas o tipo
  // é mantido aqui para alinhamento com o estado local.
  admin_password: string;
}

// ------------------------------------------
// Funções Utilitárias para API (simulando um cliente HTTP)
// ------------------------------------------

// Função auxiliar para fazer requisições à API com autenticação
const apiRequest = async (
  path: string,
  method: "GET" | "PUT",
  token: string,
  body?: any
) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_URL}${path}`, config);

  if (!response.ok) {
    let errorDetail = "Erro na requisição";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || errorDetail;
    } catch {
      // Ignora se não for JSON
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }

  // Não tenta fazer .json() se for 204 No Content (ex: PUT/UPDATE)
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null;
  }

  return response.json();
};

const Settings = () => {
  // ATENÇÃO: Se não tiver o useAdminContext, substitua por uma maneira de obter o token
  const { user, token } = useAdmin();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    store_name: "",
    instagram_url: "",
    whatsapp_url: "",
    email: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token]);

  // ------------------------------------------
  // LÓGICA DE BUSCA DE DADOS (GET)
  // Endpoint Sugerido: [API_URL]/settings
  // ------------------------------------------
  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Fazendo a chamada GET para buscar as configurações da loja
      const data = await apiRequest("/settings", "GET", token);

      if (!data) {
        throw new Error("Dados de configurações não encontrados.");
      }

      // Assumindo que o backend retorna um objeto StoreSettings
      setSettings(data);
      setFormData({
        store_name: data.store_name || "",
        instagram_url: data.instagram_url || "",
        whatsapp_url: data.whatsapp_url || "",
        email: data.email || "",
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error(
        `Erro ao carregar configurações: ${(error as Error).message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------------------------------
  // LÓGICA DE ATUALIZAÇÃO DE INFO DA LOJA (PUT)
  // Endpoint Sugerido: [API_URL]/settings
  // ------------------------------------------
  const saveStoreInfo = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const updatePayload = {
        store_name: formData.store_name,
        instagram_url: formData.instagram_url,
        whatsapp_url: formData.whatsapp_url,
        email: formData.email,
        // Não envie a senha, pois esta função é apenas para info da loja
      };

      // Fazendo a chamada PUT para atualizar as informações da loja
      await apiRequest("/settings", "PUT", token, updatePayload);

      toast.success("Informações da loja atualizadas com sucesso!");
      fetchSettings(); // Recarrega os dados após a atualização
    } catch (error) {
      console.error("Error updating store info:", error);
      toast.error(
        `Erro ao atualizar informações da loja: ${(error as Error).message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------
  // LÓGICA DE ALTERAÇÃO DE SENHA (PUT)
  // Endpoint Sugerido: [API_URL]/admin/password (mais seguro)
  // ------------------------------------------
  const changePassword = async () => {
    if (!settings) return;

    if (
      !formData.current_password ||
      !formData.new_password ||
      !formData.confirm_password
    ) {
      toast.error("Preencha todos os campos de senha");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error("Nova senha e confirmação não coincidem");
      return;
    }

    if (formData.new_password.length < 6) {
      toast.error("Nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setSaving(true);
    try {
      const passwordPayload = {
        current_password: formData.current_password,
        new_password: formData.new_password,
      };

      // Fazendo a chamada PUT para alterar a senha
      // Nota: Este endpoint DEVE ser protegido por JWT no backend e usar bcrypt para verificar
      // a senha atual e hashear a nova.
      await apiRequest("/admin/password", "PUT", token, passwordPayload);

      toast.success("Senha alterada com sucesso!");
      // Limpa os campos de senha após o sucesso
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));
      // Não é necessário recarregar settings, pois a senha não é exposta
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(`Erro ao alterar senha: ${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  // O restante do componente de visualização permanece o mesmo.
  if (loading || !token) {
    // Adicionado verificação de token
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* ... (cabeçalho, Store Information, Security Settings, Current Configuration - Sem alterações) */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground font-montserrat">
          Gerencie as configurações da loja e sua conta
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Store Information */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Informações da Loja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store_name" className="font-montserrat">
                Nome da Loja
              </Label>
              <Input
                id="store_name"
                value={formData.store_name}
                onChange={(e) =>
                  handleInputChange("store_name", e.target.value)
                }
                placeholder="LooksdeHoje"
                className="font-montserrat"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-montserrat">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contato@looksdehoje.com"
                className="font-montserrat"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold font-montserrat flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Links Sociais
              </h3>

              <div className="space-y-2">
                <Label htmlFor="instagram_url" className="font-montserrat">
                  Instagram
                </Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) =>
                    handleInputChange("instagram_url", e.target.value)
                  }
                  placeholder="https://instagram.com/looksdehoje"
                  className="font-montserrat"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_url" className="font-montserrat">
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp_url"
                  value={formData.whatsapp_url}
                  onChange={(e) =>
                    handleInputChange("whatsapp_url", e.target.value)
                  }
                  placeholder="https://wa.me/5511999999999"
                  className="font-montserrat"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={saveStoreInfo}
                disabled={saving}
                className="bg-primary hover:bg-primary-dark font-montserrat"
              >
                {saving ? "Salvando..." : "Salvar Informações"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password" className="font-montserrat">
                Senha Atual
              </Label>
              <Input
                id="current_password"
                type="password"
                value={formData.current_password}
                onChange={(e) =>
                  handleInputChange("current_password", e.target.value)
                }
                placeholder="Digite sua senha atual"
                className="font-montserrat"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password" className="font-montserrat">
                Nova Senha
              </Label>
              <Input
                id="new_password"
                type="password"
                value={formData.new_password}
                onChange={(e) =>
                  handleInputChange("new_password", e.target.value)
                }
                placeholder="Digite a nova senha"
                className="font-montserrat"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="font-montserrat">
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) =>
                  handleInputChange("confirm_password", e.target.value)
                }
                placeholder="Confirme a nova senha"
                className="font-montserrat"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={changePassword}
                disabled={saving}
                variant="outline"
                className="font-montserrat"
              >
                {saving ? "Alterando..." : "Alterar Senha"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Configuration */}
        <Card className="luxury-card border-muted">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-muted-foreground" />
              Configuração Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground font-montserrat space-y-2">
            <p>
              <strong>Senha padrão:</strong> admin123
            </p>
            <p>
              <strong>Usuário padrão:</strong> admin
            </p>
            <p className="text-amber-600">
              ⚠️ Recomendamos alterar a senha padrão por segurança
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
