export type Locale = 'en' | 'fr' | 'ar';

export type ServiceStatus = 'draft' | 'published' | 'archived';

export type AccessType = 'Primary' | 'Secondary' | null;

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  whatsapp_number?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CategoryTranslationRow {
  category_id: string;
  locale: Locale;
  name: string;
  description: string | null;
}

export interface ServiceRow {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover_image_path: string | null;
  gallery_paths: string[];
  status: ServiceStatus;
  is_featured: boolean;
  sort_order: number;
  terms_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceTranslationRow {
  service_id: string;
  locale: Locale;
  name: string;
  short_description: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  image_alt: string | null;
}

export interface ServiceVariantRow {
  id: string;
  service_id: string;
  sku: string | null;
  label: string;
  platform: string | null;
  edition: string | null;
  tier: string | null;
  duration_months: number | null;
  access_type: AccessType;
  price_mad: number;
  sale_price_mad: number | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingRow {
  key: string;
  value: unknown;
  is_public: boolean;
  updated_at: string;
}

export interface AdminUserRow {
  user_id: string;
  created_at: string;
}

export interface ServiceReviewRow {
  id: string;
  service_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}


