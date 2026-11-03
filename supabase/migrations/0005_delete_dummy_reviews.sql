-- ============================================================================
-- NovaStream Migration 0005: Fix service_reviews Permissions (42501) & Clean Dummy Reviews
-- ============================================================================

-- 1. Grant explicit table permissions to anon and authenticated roles (fixes error 42501)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.service_reviews TO anon, authenticated;
GRANT DELETE ON TABLE public.service_reviews TO authenticated;
GRANT ALL ON TABLE public.service_reviews TO service_role;

-- 2. Ensure clean, non-blocking RLS policies on public.service_reviews
ALTER TABLE public.service_reviews ENABLE ROW LEVEL SECURITY;

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

-- 3. Remove any seeded dummy reviews
DELETE FROM public.service_reviews
WHERE id IN (
  '44444444-4444-4444-8444-444444444401',
  '44444444-4444-4444-8444-444444444402',
  '44444444-4444-4444-8444-444444444403',
  '44444444-4444-4444-8444-444444444404',
  '44444444-4444-4444-8444-444444444405',
  '44444444-4444-4444-8444-444444444406',
  '44444444-4444-4444-8444-444444444407',
  '44444444-4444-4444-8444-444444444408',
  '44444444-4444-4444-8444-444444444409'
);

