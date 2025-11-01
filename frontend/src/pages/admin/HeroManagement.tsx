// src/pages/admin/HeroManagement.tsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Settings, Image } from "lucide-react";
import { API_URL } from "@/config/api";
import {
  MultipleImageUpload,
  ProductImage,
} from "@/components/admin/MultipleImageUpload";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // 🚨 ADICIONADO: Componente Switch para is_active

// Interfaces baseadas no modelo Prisma
interface HeroSlide {
  id?: string; // Permitir que novos slides não tenham ID
  image_url: string;
  alt_text?: string;
  link_url?: string;
  order: number;
}

interface HeroSetting {
  id: string;
  is_active: boolean;
  interval_ms: number;
  // Campos de texto adicionados
  title?: string;
  subtitle?: string;
  cta_text?: string;
  cta_link?: string;
  background_image_url?: string;
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

  // Estados Locais para Campos de Configuração
  const [is_active, setIsActive] = useState(false);
  const [interval_ms, setIntervalMs] = useState(5000);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [cta_text, setCtaText] = useState("");
  const [cta_link, setCtaLink] = useState("");
  const [background_image_url, setBackgroundImageUrl] = useState("");

  // Estado para gerenciar as imagens no componente de upload
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  // ------------------------------------------
  // LÓGICA DE BUSCA DE DADOS (GET)
  // ------------------------------------------
  const fetchHeroSettings = async () => {
    setLoading(true);
    setError(null);
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

      // 🚨 ATUALIZAÇÃO DOS ESTADOS LOCAIS APÓS O FETCH
      setIsActive(data.settings.is_active);
      setIntervalMs(data.settings.interval_ms);
      setTitle(data.settings.title || "");
      setSubtitle(data.settings.subtitle || "");
      setCtaText(data.settings.cta_text || "");
      setCtaLink(data.settings.cta_link || "");
      setBackgroundImageUrl(data.settings.background_image_url || "");

      // Inicializa o estado de imagens com os slides do backend
      setProductImages(
        data.slides.map((slide) => ({
          url: slide.image_url,
          order: slide.order,
          file: undefined,
          isNew: false,
        }))
      );

      toast.success("Configurações do Hero carregadas com sucesso.");
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error("Error fetching hero settings:", errorMessage);
      setError(errorMessage);
      toast.error(`Erro ao carregar configurações do Hero: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  // ------------------------------------------
  // LÓGICA DE ATUALIZAÇÃO (PUT)
  // ------------------------------------------
  const handleSaveSettings = async () => {
    if (!heroData) return;
    setIsSaving(true);

    try {
      // O payload agora inclui os campos de texto e as configurações gerais
      const payload = {
        is_active: is_active,
        interval_ms: interval_ms,
        title: title,
        subtitle: subtitle,
        cta_text: cta_text,
        cta_link: cta_link,
        background_image_url: background_image_url,
        slides: productImages.map((img) => ({
          image_url: img.url,
          order: img.order,
          id: img.id,
        })),
      };

      const response = await fetch(`${API_URL}/hero`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao salvar no servidor.");
      }

      toast.success("Configurações do Hero atualizadas com sucesso!");
      fetchHeroSettings(); // Recarrega os dados
    } catch (e) {
      toast.error("Erro ao salvar configurações.");
      console.error("Erro ao salvar:", e);
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

  // TRATAMENTO DE ERRO
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

  // Fallback
  if (!heroData || !heroData.settings) {
    // ... (código de fallback) ...
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
        {/* 🚨 RESTAURADO: Card de Configurações Gerais */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Campo Ativo/Inativo (usando Switch) */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-base font-montserrat">Status</label>
                <p className="text-sm text-muted-foreground font-montserrat">
                  {is_active
                    ? "HeroSection visível na página inicial."
                    : "HeroSection oculta."}
                </p>
              </div>
              <Switch checked={is_active} onCheckedChange={setIsActive} />
            </div>

            {/* Campo Intervalo de Transição */}
            <div className="space-y-2">
              <label className="font-montserrat text-sm">
                Intervalo de Transição (em milissegundos)
              </label>
              <Input
                type="number"
                value={interval_ms}
                onChange={(e) => setIntervalMs(Number(e.target.value))}
                min={1000}
                step={500}
              />
              <p className="text-xs text-muted-foreground">
                Duração de cada slide: {interval_ms / 1000} segundos
              </p>
            </div>

            {/* Campos de Texto */}
            <h3 className="font-playfair text-lg font-semibold mt-6">
              Conteúdo de Texto (Fallback)
            </h3>
            <Input
              placeholder="Título (ex: Elegância em Cada Ocasião)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Subtítulo (ex: Alugue looks exclusivos)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
            <Input
              placeholder="Texto do CTA (ex: Ver Coleção)"
              value={cta_text}
              onChange={(e) => setCtaText(e.target.value)}
            />
            <Input
              placeholder="Link do CTA (ex: /colecao)"
              value={cta_link}
              onChange={(e) => setCtaLink(e.target.value)}
            />
            <Input
              placeholder="URL da Imagem de Fundo (Fallback)"
              value={background_image_url}
              onChange={(e) => setBackgroundImageUrl(e.target.value)}
            />

            <div className="flex justify-end mt-4 pt-4 border-t">
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

        {/* Card de Gestão de Slides (limpo) */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              Slides do Carrossel ({productImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultipleImageUpload
              images={productImages}
              onChange={setProductImages}
              maxImages={10}
            />
            {productImages.length === 0 && (
              <p className="text-sm text-muted-foreground font-montserrat text-center pt-8">
                Nenhum slide encontrado. Use o botão "Adicionar Fotos" acima
                para enviar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroManagement;
