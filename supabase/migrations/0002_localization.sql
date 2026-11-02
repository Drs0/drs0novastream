-- ============================================================================
-- NovaStream Migration 0002: Multilingual Translation Tables & RLS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.category_translations (
  category_id UUID NOT NULL
    REFERENCES public.categories(id) ON DELETE CASCADE,

  locale TEXT NOT NULL
    CHECK (locale IN ('en', 'fr', 'ar')),

  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
  description TEXT,

  PRIMARY KEY (category_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_category_translations_locale
  ON public.category_translations(locale);

CREATE TABLE IF NOT EXISTS public.service_translations (
  service_id UUID NOT NULL
    REFERENCES public.services(id) ON DELETE CASCADE,

  locale TEXT NOT NULL
    CHECK (locale IN ('en', 'fr', 'ar')),

  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
  short_description TEXT,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  image_alt TEXT,

  PRIMARY KEY (service_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_service_translations_locale
  ON public.service_translations(locale);

-- Enable Row Level Security
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_translations ENABLE ROW LEVEL SECURITY;

-- Guests may read translations only for visible (active) categories
CREATE POLICY "Public can read translations of active categories"
  ON public.category_translations
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.categories c
      WHERE c.id = category_translations.category_id
        AND c.is_active = TRUE
    )
    OR public.is_admin()
  );

CREATE POLICY "Admins can insert category_translations"
  ON public.category_translations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update category_translations"
  ON public.category_translations
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete category_translations"
  ON public.category_translations
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Guests may read translations only for published services in active categories
CREATE POLICY "Public can read translations of published services"
  ON public.service_translations
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.services s
      JOIN public.categories c ON c.id = s.category_id
      WHERE s.id = service_translations.service_id
        AND s.status = 'published'
        AND c.is_active = TRUE
    )
    OR public.is_admin()
  );

CREATE POLICY "Admins can insert service_translations"
  ON public.service_translations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update service_translations"
  ON public.service_translations
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete service_translations"
  ON public.service_translations
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

