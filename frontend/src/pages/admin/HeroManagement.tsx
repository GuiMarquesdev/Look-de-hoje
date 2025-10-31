// src/pages/admin/HeroManagement.tsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Settings, Plus, Image } from "lucide-react";
import { API_URL } from "@/config/api"; // Assumindo que API_URL está definido
import {
  MultipleImageUpload,
  ProductImage,
} from "@/components/admin/MultipleImageUpload";

// Interfaces baseadas no modelo Prisma
interface HeroSlide {
  id: string;
  image_url: string;
  alt_text: string;
  link_url: string;
  order: number;
}

interface HeroSetting {
  id: string;
  is_active: boolean;
  interval_ms: number;
}

interface HeroData {
  settings: HeroSetting;
  slides: HeroSlide[];
}

const HeroManagement = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ------------------------------------------
  // LÓGICA DE BUSCA DE DADOS (GET)
  // ------------------------------------------
  const fetchHeroSettings = async () => {
    setLoading(true);
    setError(null); // Limpa erros anteriores
    try {
      const response = await fetch(`${API_URL}/hero`);

      if (!response.ok) {
        let errorDetail = "Erro desconhecido ao carregar configurações.";
        try {
          const errorJson = await response.json();
          errorDetail = errorJson.message || errorDetail;
        } catch {
          errorDetail = response.statusText || `Status: ${response.status}`;
        }
        throw new Error(errorDetail);
      }

      const data: HeroData = await response.json();
      setHeroData(data);
      toast.success("Configurações do Hero carregadas com sucesso.");
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error("Error fetching hero settings:", errorMessage);
      setError(errorMessage);
      // 🚨 Alerta de erro na tela
      toast.error(`Erro ao carregar configurações do Hero: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (!heroData) return;
    setIsSaving(true);

    try {
      toast.info(
        "Lógica de atualização de configurações do Hero ainda não implementada."
      );
    } catch (e) {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="font-montserrat text-muted-foreground">
          Carregando configurações do Hero...
        </p>
      </div>
    );
  }

  // 🚨 TRATAMENTO DE ERRO: Exibe um card de erro se a requisição falhar
  if (error) {
    return (
      <div className="p-6 text-center space-y-4">
        <Card className="border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="text-xl font-playfair text-red-700">
              Erro ao Carregar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-montserrat text-red-600 mb-4">
              **Erro ao carregar configurações do hero:** {error}
            </p>
            <Button
              onClick={fetchHeroSettings}
              className="mt-4"
              variant="outline"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Caso o dado não seja carregado (nunca deveria acontecer se o loading/error funcionar, mas é um bom fallback)
  if (!heroData || !heroData.settings) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-playfair font-bold">
          Gerenciar HeroSection
        </h1>
        <Card className="mt-4">
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              O HeroSetting não foi encontrado. Verifique se o registro inicial
              existe na base de dados.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-foreground">
          Gerenciar HeroSection
        </h1>
        <p className="text-muted-foreground font-montserrat">
          Configure o carrossel de destaque da página inicial.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Card de Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-montserrat text-sm text-muted-foreground">
              Status Atual: {heroData.settings.is_active ? "Ativo" : "Inativo"}
            </p>
            <p className="font-montserrat text-sm text-muted-foreground">
              Intervalo de Transição: {heroData.settings.interval_ms / 1000}{" "}
              segundos
            </p>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="font-montserrat"
              >
                {isSaving ? "Salvando..." : "Atualizar Configurações"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card de Gestão de Slides */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-playfair flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              Slides do Carrossel ({heroData.slides.length})
            </CardTitle>
            <Button
              variant="outline"
              className="font-montserrat flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Slide
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 🚨 Este componente precisa ser funcional */}
            <MultipleImageUpload
              images={[]}
              onChange={function (images: ProductImage[]): void {
                throw new Error("Function not implemented.");
              }} // imageURLs={heroData.slides.map(s => s.image_url)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {heroData.slides.map((slide) => (
                <div key={slide.id} className="border p-4 rounded-lg space-y-2">
                  <img
                    src={slide.image_url}
                    alt={slide.alt_text}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="text-sm font-montserrat">
                    Ordem: {slide.order}
                  </p>
                  <p className="text-xs font-montserrat text-muted-foreground truncate">
                    Link: {slide.link_url}
                  </p>
                  {/* Botões de Ação para o Slide (Editar/Deletar) */}
                </div>
              ))}
              {heroData.slides.length === 0 && (
                <p className="text-sm text-muted-foreground font-montserrat col-span-full">
                  Nenhum slide encontrado. Adicione um novo para começar.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroManagement;
