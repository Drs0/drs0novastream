import type {
  AccessType,
  CategoryRow,
  CategoryTranslationRow,
  Locale,
  ServiceRow,
  ServiceStatus,
  ServiceTranslationRow,
  ServiceVariantRow,
} from './database';

export interface LocalizedCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imagePath: string | null;
  sortOrder: number;
  isActive: boolean;
  resolvedLocale: Locale;
  missingLocales: Locale[];
  raw: CategoryRow;
  translations: Record<Locale, CategoryTranslationRow | undefined>;
}

export interface PriceSummary {
  minPriceMad: number | null;
  maxPriceMad: number | null;
  hasSingleVariant: boolean;
  hasDiscount: boolean;
  availableCount: number;
  totalCount: number;
}

export interface LocalizedService {
  id: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  coverImagePath: string | null;
  galleryPaths: string[];
  imageAlt: string;
  status: ServiceStatus;
  isFeatured: boolean;
  sortOrder: number;
  termsText: string | null;
  seoTitle: string;
  seoDescription: string;
  resolvedLocale: Locale;
  missingLocales: Locale[];
  variants: ServiceVariantRow[];
  priceSummary: PriceSummary;
  raw: ServiceRow;
  translations: Record<Locale, ServiceTranslationRow | undefined>;
}

export interface VariantSelectionState {
  platform?: string | null;
  edition?: string | null;
  tier?: string | null;
  duration_months?: number | null;
  access_type?: AccessType;
}

export interface CartItem {
  variantId: string;
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  coverImagePath: string | null;
  variant: ServiceVariantRow;
  quantity: number;
}

export interface PublicSiteSettings {
  whatsappNumber: string;
  contactEmail: string;
  supportHours: string;
  defaultLocale: Locale;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  heroBanner?: {
    badge_en?: string;
    badge_fr?: string;
    badge_ar?: string;
  };
}

export interface AdminDashboardStats {
  totalServices: number;
  publishedServices: number;
  draftServices: number;
  archivedServices: number;
  totalCategories: number;
  unavailableVariants: number;
  featuredServices: number;
  servicesMissingTranslations: number;
  isMockMode: boolean;
}

