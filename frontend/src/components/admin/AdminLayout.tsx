// frontend/src/components/admin/AdminLayout.tsx

import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar.tsx";
import { useAdmin } from "@/contexts/AdminContext";
import { Loader2 } from "lucide-react";

const AdminLayout: React.FC = () => {
  // CORRIGIDO: O hook precisa ser importado e chamado
  const { isAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    // Tela de carregamento enquanto o contexto verifica o token no localStorage
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para o login se não estiver autenticado
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Componente de navegação */}
      <AdminSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-4 sm:p-6 lg:p-8">
          {/* O Outlet renderiza os componentes filhos das rotas (Dashboard, Settings, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
