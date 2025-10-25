// backend/src/common/types.ts

// DTO para as informações de configuração da loja
export interface StoreSettingsDTO {
  store_name: string;
  instagram_url?: string;
  whatsapp_url?: string;
  email?: string;
}

// DTO para a alteração de senha
export interface ChangePasswordDTO {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// DTO para a criação de uma nova peça (Todos os campos obrigatórios para criação)
export interface CreatePieceDTO {
  title: string;
  description?: string;
  price: number;
  is_available: boolean;
  category_id: string;
  // A URL/key da imagem será salva, não o arquivo em si
  image_urls: string[];
}

// DTO para atualizar uma peça existente (Todos os campos são opcionais para atualização)
export interface UpdatePieceDTO {
  title?: string;
  description?: string;
  price?: number;
  is_available?: boolean;
  category_id?: string;
  image_urls?: string[];
}

// DTO para a criação de Categoria
export interface CreateCategoryDTO {
  name: string;
  slug: string;
  is_active: boolean;
}

// DTO para a atualização de Categoria
export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  is_active?: boolean;
}

// DTO para a criação/atualização das configurações do Hero (banner)
export interface HeroSettingsDTO {
  id: string;
  title?: string;
  subtitle?: string;
  cta_text?: string;
  cta_link?: string;
  background_image_url: string; // URL da imagem principal do Hero
  is_active: boolean;
}
