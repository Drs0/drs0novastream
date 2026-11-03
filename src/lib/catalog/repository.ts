import type {
  AdminDashboardStats,
  LocalizedCategory,
  LocalizedService,
  PublicSiteSettings,
} from '@/types/catalog';
import type {
  CategoryRow,
  CategoryTranslationRow,
  Locale,
  ServiceRow,
  ServiceTranslationRow,
  ServiceVariantRow,
  SiteSettingRow,
} from '@/types/database';
import { getTranslationFallbackOrder } from '@/lib/formatters';
import { computeServicePriceSummary } from './pricing';
import {
  SEED_CATEGORIES,
  SEED_CATEGORY_TRANSLATIONS,
  SEED_SERVICES,
  SEED_SERVICE_TRANSLATIONS,
  SEED_SITE_SETTINGS,
  SEED_VARIANTS,
} from './seed-data';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/config';

const ALL_LOCALES: Locale[] = ['en', 'fr', 'ar'];

// In-memory store for fallback development mode when Supabase credentials are not yet set
interface MockCatalogStore {
  categories: CategoryRow[];
  categoryTranslations: CategoryTranslationRow[];
  services: ServiceRow[];
  serviceTranslations: ServiceTranslationRow[];
  variants: ServiceVariantRow[];
  siteSettings: SiteSettingRow[];
}

const globalForMock = globalThis as unknown as {
  __novastreamMockStore?: MockCatalogStore;
};

function getMockStore(): MockCatalogStore {
  if (!globalForMock.__novastreamMockStore) {
    globalForMock.__novastreamMockStore = {
      categories: structuredClone(SEED_CATEGORIES),
      categoryTranslations: structuredClone(SEED_CATEGORY_TRANSLATIONS),
      services: structuredClone(SEED_SERVICES),
      serviceTranslations: structuredClone(SEED_SERVICE_TRANSLATIONS),
      variants: structuredClone(SEED_VARIANTS),
      siteSettings: structuredClone(SEED_SITE_SETTINGS),
    };
  }
  return globalForMock.__novastreamMockStore;
}

/**
 * Resolves a category's localized text according to fallback order:
 * 1. Requested locale
 * 2. French ('fr')
 * 3. English ('en')
 */
export function resolveLocalizedCategory(
  category: CategoryRow,
  translations: CategoryTranslationRow[],
  requestedLocale: Locale
): LocalizedCategory {
  const byLocale: Record<Locale, CategoryTranslationRow | undefined> = {
    en: translations.find((t) => t.locale === 'en'),
    fr: translations.find((t) => t.locale === 'fr'),
    ar: translations.find((t) => t.locale === 'ar'),
  };

  const missingLocales = ALL_LOCALES.filter(
    (loc) => !byLocale[loc] || !byLocale[loc]?.name?.trim()
  );

  const fallbackOrder = getTranslationFallbackOrder(requestedLocale);
  let resolvedLocale: Locale = 'en';
  let chosen: CategoryTranslationRow | undefined;

  for (const loc of fallbackOrder) {
    if (byLocale[loc] && byLocale[loc]?.name?.trim()) {
      chosen = byLocale[loc];
      resolvedLocale = loc;
      break;
    }
  }

  return {
    id: category.id,
    slug: category.slug,
    name: chosen?.name ?? category.name,
    description: chosen?.description ?? category.description,
    imagePath: category.image_path,
    sortOrder: category.sort_order,
    isActive: category.is_active,
    resolvedLocale,
    missingLocales,
    raw: category,
    translations: byLocale,
  };
}

/**
 * Resolves a service's localized text according to fallback order:
 * 1. Requested locale
 * 2. French ('fr')
 * 3. English ('en')
 */
export function resolveLocalizedService(
  service: ServiceRow,
  translations: ServiceTranslationRow[],
  variants: ServiceVariantRow[],
  category: LocalizedCategory | undefined,
  requestedLocale: Locale
): LocalizedService {
  const byLocale: Record<Locale, ServiceTranslationRow | undefined> = {
    en: translations.find((t) => t.locale === 'en'),
    fr: translations.find((t) => t.locale === 'fr'),
    ar: translations.find((t) => t.locale === 'ar'),
  };

  const missingLocales = ALL_LOCALES.filter(
    (loc) => !byLocale[loc] || !byLocale[loc]?.name?.trim()
  );

  const fallbackOrder = getTranslationFallbackOrder(requestedLocale);
  let resolvedLocale: Locale = 'en';
  let chosen: ServiceTranslationRow | undefined;

  for (const loc of fallbackOrder) {
    if (byLocale[loc] && byLocale[loc]?.name?.trim()) {
      chosen = byLocale[loc];
      resolvedLocale = loc;
      break;
    }
  }

  const sortedVariants = [...variants].sort((a, b) => a.sort_order - b.sort_order);
  const priceSummary = computeServicePriceSummary(sortedVariants);

  const resolvedName = chosen?.name ?? service.name;
  const resolvedShortDesc = chosen?.short_description ?? service.short_description;

  return {
    id: service.id,
    categoryId: service.category_id,
    categorySlug: category?.slug ?? 'general',
    categoryName: category?.name ?? 'Digital Services',
    slug: service.slug,
    name: resolvedName,
    shortDescription: resolvedShortDesc,
    description: chosen?.description ?? service.description,
    coverImagePath: service.cover_image_path,
    galleryPaths: service.gallery_paths ?? [],
    imageAlt: chosen?.image_alt ?? resolvedName,
    status: service.status,
    isFeatured: service.is_featured,
    sortOrder: service.sort_order,
    termsText: service.terms_text,
    seoTitle: chosen?.seo_title ?? service.seo_title ?? `${resolvedName} | NovaStream`,
    seoDescription:
      chosen?.seo_description ??
      service.seo_description ??
      resolvedShortDesc ??
      resolvedName,
    resolvedLocale,
    missingLocales,
    variants: sortedVariants,
    priceSummary,
    raw: service,
    translations: byLocale,
  };
}

// ============================================================================
// Public Storefront Queries (Only active categories & published services)
// ============================================================================

export async function getPublicCategories(locale: Locale): Promise<LocalizedCategory[]> {
  const { isConfigured } = getSupabaseEnv();

  if (isConfigured) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const [{ data: cats }, { data: trans }] = await Promise.all([
          supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase.from('category_translations').select('*'),
        ]);

        if (cats) {
          const allTrans = (trans ?? []) as CategoryTranslationRow[];
          return (cats as CategoryRow[]).map((c) =>
            resolveLocalizedCategory(
              c,
              allTrans.filter((t) => t.category_id === c.id),
              locale
            )
          );
        }
      }
    } catch {
      // Gracefully fall back if Supabase connection encounters an error
    }
  }

  const store = getMockStore();
  return store.categories
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) =>
      resolveLocalizedCategory(
        c,
        store.categoryTranslations.filter((t) => t.category_id === c.id),
        locale
      )
    );
}

export async function getPublicCategoryBySlug(
  slug: string,
  locale: Locale
): Promise<LocalizedCategory | null> {
  const categories = await getPublicCategories(locale);
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getPublicServices(locale: Locale): Promise<LocalizedService[]> {
  const categories = await getPublicCategories(locale);
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const { isConfigured } = getSupabaseEnv();

  if (isConfigured) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const [{ data: svcs }, { data: trans }, { data: vars }] = await Promise.all([
          supabase
            .from('services')
            .select('*')
            .eq('status', 'published')
            .order('sort_order', { ascending: true }),
          supabase.from('service_translations').select('*'),
          supabase
            .from('service_variants')
            .select('*')
            .order('sort_order', { ascending: true }),
        ]);

        if (svcs) {
          const allTrans = (trans ?? []) as ServiceTranslationRow[];
          const allVars = (vars ?? []) as ServiceVariantRow[];

          return (svcs as ServiceRow[])
            .filter((s) => s.status === 'published' && categoryMap.has(s.category_id))
            .map((s) =>
              resolveLocalizedService(
                s,
                allTrans.filter((t) => t.service_id === s.id),
                allVars.filter((v) => v.service_id === s.id),
                categoryMap.get(s.category_id),
                locale
              )
            );
        }
      }
    } catch {
      // Fall back gracefully
    }
  }

  const store = getMockStore();
  return store.services
    .filter((s) => s.status === 'published' && categoryMap.has(s.category_id))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) =>
      resolveLocalizedService(
        s,
        store.serviceTranslations.filter((t) => t.service_id === s.id),
        store.variants.filter((v) => v.service_id === s.id),
        categoryMap.get(s.category_id),
        locale
      )
    );
}

export async function getPublicServiceBySlug(
  slug: string,
  locale: Locale
): Promise<LocalizedService | null> {
  const services = await getPublicServices(locale);
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const { isConfigured } = getSupabaseEnv();
  let rows: SiteSettingRow[] = [];

  if (isConfigured) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .eq('is_public', true);
        if (data) {
          rows = data as SiteSettingRow[];
        }
      }
    } catch {
      // Fall back gracefully
    }
  }

  if (rows.length === 0) {
    rows = getMockStore().siteSettings.filter((s) => s.is_public);
  }

  const getVal = <T,>(key: string, fallback: T): T => {
    const found = rows.find((r) => r.key === key && r.is_public);
    return (found?.value as T) ?? fallback;
  };

  return {
    whatsappNumber: String(getVal('whatsapp_number', '212600000000')),
    contactEmail: String(getVal('contact_email', 'contact@novastream.ma')),
    supportHours: String(getVal('support_hours', '10:00 - 23:00 (GMT+1)')),
    defaultLocale: getVal<Locale>('default_locale', 'fr'),
    socialLinks: getVal('social_links', {
      instagram: 'https://instagram.com/novastream.ma',
      facebook: 'https://facebook.com/novastream.ma',
      tiktok: 'https://tiktok.com/@novastream.ma',
    }),
    heroBanner: getVal('hero_banner', {}),
  };
}

// ============================================================================
// Admin Queries & Mutations (Includes drafts, archived, and missing locales)
// ============================================================================

export async function getAdminCategories(locale: Locale = 'en'): Promise<LocalizedCategory[]> {
  const { isConfigured } = getSupabaseEnv();

  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const [{ data: cats }, { data: trans }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('category_translations').select('*'),
      ]);
      if (cats) {
        const allTrans = (trans ?? []) as CategoryTranslationRow[];
        return (cats as CategoryRow[]).map((c) =>
          resolveLocalizedCategory(
            c,
            allTrans.filter((t) => t.category_id === c.id),
            locale
          )
        );
      }
    }
  }

  const store = getMockStore();
  return [...store.categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) =>
      resolveLocalizedCategory(
        c,
        store.categoryTranslations.filter((t) => t.category_id === c.id),
        locale
      )
    );
}

export async function getAdminServices(locale: Locale = 'en'): Promise<LocalizedService[]> {
  const categories = await getAdminCategories(locale);
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const { isConfigured } = getSupabaseEnv();

  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const [{ data: svcs }, { data: trans }, { data: vars }] = await Promise.all([
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('service_translations').select('*'),
        supabase.from('service_variants').select('*').order('sort_order', { ascending: true }),
      ]);
      if (svcs) {
        const allTrans = (trans ?? []) as ServiceTranslationRow[];
        const allVars = (vars ?? []) as ServiceVariantRow[];
        return (svcs as ServiceRow[]).map((s) =>
          resolveLocalizedService(
            s,
            allTrans.filter((t) => t.service_id === s.id),
            allVars.filter((v) => v.service_id === s.id),
            categoryMap.get(s.category_id),
            locale
          )
        );
      }
    }
  }

  const store = getMockStore();
  return [...store.services]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) =>
      resolveLocalizedService(
        s,
        store.serviceTranslations.filter((t) => t.service_id === s.id),
        store.variants.filter((v) => v.service_id === s.id),
        categoryMap.get(s.category_id),
        locale
      )
    );
}

export async function getAdminServiceById(id: string): Promise<LocalizedService | null> {
  const all = await getAdminServices('en');
  return all.find((s) => s.id === id) ?? null;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { isConfigured } = getSupabaseEnv();
  const [services, categories] = await Promise.all([
    getAdminServices('en'),
    getAdminCategories('en'),
  ]);

  const unavailableVariants = services.reduce(
    (acc, s) => acc + s.variants.filter((v) => !v.is_available).length,
    0
  );

  return {
    totalServices: services.length,
    publishedServices: services.filter((s) => s.status === 'published').length,
    draftServices: services.filter((s) => s.status === 'draft').length,
    archivedServices: services.filter((s) => s.status === 'archived').length,
    totalCategories: categories.length,
    unavailableVariants,
    featuredServices: services.filter((s) => s.isFeatured).length,
    servicesMissingTranslations: services.filter((s) => s.missingLocales.length > 0).length,
    isMockMode: !isConfigured,
  };
}

export { getMockStore };

