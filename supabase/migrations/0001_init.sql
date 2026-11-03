-- ============================================================================
-- NovaStream Migration 0001: Core Catalog, Variants, Settings, Admin & RLS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Updated Timestamp Trigger Function
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 2. Admin Allowlist Table & Non-Recursive Security Helper
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Non-recursive SECURITY DEFINER helper to check if current session is allowlisted admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- Only allowlisted admins can read the admin allowlist; users cannot self-register
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Prevent authenticated non-admins from inserting/updating/deleting admin_users
CREATE POLICY "Only existing admins can manage admin_users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. Categories Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description TEXT,
  image_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON public.categories(is_active, sort_order);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active categories"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can insert categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. Services Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description TEXT,
  description TEXT,
  cover_image_path TEXT,
  gallery_paths TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  terms_text TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_status_featured_sort ON public.services(status, is_featured, sort_order);

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published services only"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (
    (
      status = 'published'
      AND EXISTS (
        SELECT 1 FROM public.categories c
        WHERE c.id = services.category_id AND c.is_active = TRUE
      )
    )
    OR public.is_admin()
  );

CREATE POLICY "Admins can insert services"
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update services"
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete services"
  ON public.services
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. Service Variants Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  sku TEXT,
  label TEXT NOT NULL CHECK (char_length(trim(label)) > 0),
  platform TEXT,
  edition TEXT,
  tier TEXT,
  duration_months INTEGER CHECK (duration_months IS NULL OR duration_months > 0),
  access_type TEXT CHECK (access_type IS NULL OR access_type IN ('Primary', 'Secondary')),
  price_mad INTEGER NOT NULL CHECK (price_mad >= 0),
  sale_price_mad INTEGER CHECK (sale_price_mad IS NULL OR (sale_price_mad >= 0 AND sale_price_mad < price_mad)),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_service_variant_combination UNIQUE NULLS NOT DISTINCT (
    service_id,
    platform,
    edition,
    tier,
    duration_months,
    access_type,
    label
  )
);

CREATE INDEX IF NOT EXISTS idx_service_variants_service_id ON public.service_variants(service_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_service_variants_platform ON public.service_variants(platform) WHERE platform IS NOT NULL;

CREATE TRIGGER trg_service_variants_updated_at
  BEFORE UPDATE ON public.service_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.service_variants ENABLE ROW LEVEL SECURITY;

-- Variants belonging to draft/archived services are strictly hidden from public
CREATE POLICY "Public can read variants of published services only"
  ON public.service_variants
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.services s
      JOIN public.categories c ON c.id = s.category_id
      WHERE s.id = service_variants.service_id
        AND s.status = 'published'
        AND c.is_active = TRUE
    )
    OR public.is_admin()
  );

CREATE POLICY "Admins can insert service_variants"
  ON public.service_variants
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update service_variants"
  ON public.service_variants
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete service_variants"
  ON public.service_variants
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. Site Settings Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY CHECK (char_length(trim(key)) > 0),
  value JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can only read explicitly public settings keys
CREATE POLICY "Public can read approved public site_settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_public = TRUE OR public.is_admin());

CREATE POLICY "Admins can insert site_settings"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update site_settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete site_settings"
  ON public.site_settings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7. Supabase Storage Bucket & Policies (service-images)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'service-images',
  'service-images',
  TRUE,
  5242880, -- 5 MB max
  ARRAY['image/webp', 'image/avif', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public can view service-images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload service-images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'service-images'
    AND public.is_admin()
  );

CREATE POLICY "Admins can update service-images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'service-images'
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'service-images'
    AND public.is_admin()
  );

CREATE POLICY "Admins can delete service-images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'service-images'
    AND public.is_admin()
  );

