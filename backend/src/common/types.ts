export interface Piece {
  id: string;
  name: string;
  category_id: string;
  status: "available" | "rented";
  image_url?: string | null;
  images?: any; // JSON/any para o array de imagens
  image_position_x?: number | null;
  image_position_y?: number | null;
  image_zoom?: number | null;
  description?: string | null;
  measurements?: any; // JSON/any para medidas
  created_at: Date;
  updated_at: Date;
  category?: { name: string } | null;
}

// Interface simplificada das configurações
export interface StoreSetting {
  id: string;
  admin_password: string;
  store_name: string;
  instagram_url?: string | null;
  whatsapp_url?: string | null;
  email?: string | null;
}

export interface Category {
  id: string;
  name: string;
  piece_count?: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  image_fit?: "cover" | "contain" | "fill" | "none";
  image_position?: string;
  image_position_x?: number;
  image_position_y?: number;
  image_zoom?: number;
}

export interface HeroSettings {
  id: string;
  slides: HeroSlide[];
}
