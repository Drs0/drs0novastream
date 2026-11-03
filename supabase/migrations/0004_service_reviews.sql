-- ============================================================================
-- NovaStream Migration 0004: Game & Service Reviews (Name + Star Rating + Message)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.service_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL CHECK (char_length(trim(reviewer_name)) BETWEEN 1 AND 80),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL DEFAULT '' CHECK (char_length(trim(comment)) <= 600),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure comment column exists if table was created before adding message support
ALTER TABLE public.service_reviews
  ADD COLUMN IF NOT EXISTS comment TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_service_reviews_service_id
  ON public.service_reviews(service_id, created_at DESC);

ALTER TABLE public.service_reviews ENABLE ROW LEVEL SECURITY;

-- Explicitly grant table-level permissions to anon & authenticated roles (fixes PostgreSQL 42501)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.service_reviews TO anon, authenticated;
GRANT DELETE ON TABLE public.service_reviews TO authenticated;
GRANT ALL ON TABLE public.service_reviews TO service_role;

DROP POLICY IF EXISTS "Public can read service_reviews" ON public.service_reviews;
CREATE POLICY "Public can read service_reviews"
  ON public.service_reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can insert service_reviews" ON public.service_reviews;
CREATE POLICY "Public can insert service_reviews"
  ON public.service_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(reviewer_name)) BETWEEN 1 AND 80
    AND rating BETWEEN 1 AND 5
    AND char_length(trim(comment)) BETWEEN 2 AND 600
  );

DROP POLICY IF EXISTS "Admins can delete service_reviews" ON public.service_reviews;
CREATE POLICY "Admins can delete service_reviews"
  ON public.service_reviews
  FOR DELETE
  TO authenticated
  USING (public.is_admin());
