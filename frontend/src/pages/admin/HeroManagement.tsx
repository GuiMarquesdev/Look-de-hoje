// src/pages/admin/HeroManagement.tsx
import React, { useState, useEffect } from "react";
// REMOVER: import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// ... (outros imports)
import { toast } from "@/hooks/use-toast";
import { Plus, X, Upload, Eye, GripVertical } from "lucide-react";
import { ImageFramingTool } from "@/components/admin/ImageFramingTool";

// Defina a URL base da API
const API_URL = "http://localhost:3000/api/hero"; // Endpoint específico para Hero

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  image_fit?: "cover" | "contain" | "fill" | "none";
  image_position?: string;
  image_position_x?: number; // 0-100 percentage
  image_position_y?: number; // 0-100 percentage
  image_zoom?: number; // 100-200 percentage
}

const HeroManagement = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      setLoading(true);
      // NOVA CHAMADA: Busca as configurações do Hero na sua nova API
      const response = await fetch(API_URL);

      if (!response.ok) throw new Error("Erro ao buscar configurações.");

      const data = await response.json();

      if (data && data.slides && Array.isArray(data.slides)) {
        setSlides(data.slides as HeroSlide[]);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações do hero:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações do hero",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveHeroSettings = async () => {
    setSaving(true);
    try {
      // NOVA CHAMADA: Salva as configurações via POST na sua nova API
      const response = await fetch(API_URL, {
        method: "POST", // POST ou PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro desconhecido ao salvar.");
      }

      toast({
        title: "Sucesso",
        description: "Alterações aplicadas com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar alterações",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSlideUpdate = (
    index: number,
    field: keyof HeroSlide,
    value: string
  ) => {
    const updatedSlides = slides.map((slide, i) => {
      if (i === index) {
        // Handle numeric fields
        if (
          field === "image_position_x" ||
          field === "image_position_y" ||
          field === "image_zoom"
        ) {
          return {
            ...slide,
            [field]: parseFloat(value),
          };
        }
        return {
          ...slide,
          [field]: value,
        };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const addSlide = () => {
    // ... (lógica existente permanece)
  };

  const removeSlide = (index: number) => {
    // ... (lógica existente permanece)
  };

  const moveSlide = (fromIndex: number, toIndex: number) => {
    // ... (lógica existente permanece)
  };

  // ATENÇÃO: ESTE MÉTODO DE UPLOAD DE IMAGEM PRECISA SER REESCRITO.
  // Como o Supabase Storage foi removido, o upload deve ser feito para um novo
  // serviço (S3, Cloudflare R2, etc.).
  // Este é um fluxo complexo que envolve: Frontend -> API Express -> S3.
  // Por agora, vamos simplificar e APENAS obter a URL do arquivo para salvar na peça.

  const uploadImage = async (file: File, slideIndex: number) => {
    if (!file) return;

    // ... (validações de arquivo permanecem)

    setUploadingIndex(slideIndex);
    try {
      // --- FLUXO MOCK/SIMPLIFICADO DE UPLOAD PARA API ---

      // 1. O ideal é criar um endpoint no Express que receba o arquivo
      // e o envie para o S3, retornando a URL.
      const UPLOAD_URL = "http://localhost:3000/api/upload/hero-image"; // ENDPOINT A SER IMPLEMENTADO

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(UPLOAD_URL, {
        method: "POST",
        // Não defina Content-Type, o fetch/browser faz isso automaticamente com FormData
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || "Falha no upload");
      }

      const { publicUrl } = await uploadResponse.json();

      // --- FIM DO FLUXO MOCK/SIMPLIFICADO ---

      handleSlideUpdate(slideIndex, "image_url", publicUrl);
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar imagem",
        variant: "destructive",
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 font-montserrat">
      {/* ... (renderização do componente) */}
    </div>
  );
};
export default HeroManagement;
