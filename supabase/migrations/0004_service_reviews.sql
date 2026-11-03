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

DROP POLICY IF EXISTS "Public can read service_reviews" ON public.service_reviews;
CREATE POLICY "Public can read service_reviews"
  ON public.service_reviews
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.services s
      WHERE s.id = service_reviews.service_id
        AND s.status = 'published'
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Public can insert service_reviews" ON public.service_reviews;
CREATE POLICY "Public can insert service_reviews"
  ON public.service_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(reviewer_name)) BETWEEN 1 AND 80
    AND rating BETWEEN 1 AND 5
    AND char_length(trim(comment)) BETWEEN 2 AND 600
    AND EXISTS (
      SELECT 1
      FROM public.services s
      WHERE s.id = service_reviews.service_id
        AND s.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Admins can delete service_reviews" ON public.service_reviews;
CREATE POLICY "Admins can delete service_reviews"
  ON public.service_reviews
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Seed Initial Customer Reviews (Name + Star Rating + Message)
INSERT INTO public.service_reviews (id, service_id, reviewer_name, rating, comment, created_at)
VALUES
  ('44444444-4444-4444-8444-444444444401', '22222222-2222-4222-8222-222222222201', 'Youssef M.', 5, 'Service rapide sur WhatsApp, activation PS Plus Extra en 5 minutes !', '2026-11-01T14:20:00Z'),
  ('44444444-4444-4444-8444-444444444402', '22222222-2222-4222-8222-222222222201', 'Amine K.', 5, 'أحسن ثمن فالمغرب وتعامل نقي بزاف، شكراً NovaStream.', '2026-11-02T18:10:00Z'),
  ('44444444-4444-4444-8444-444444444403', '22222222-2222-4222-8222-222222222207', 'Hamza B.', 5, 'Compte Principal PS5 reçu immédiatement, fonctionne nickel.', '2026-11-02T19:00:00Z'),
  ('44444444-4444-4444-8444-444444444404', '22222222-2222-4222-8222-222222222207', 'Mehdi R.', 5, 'خديت فيفا 27 برايمري، التفعيل داز فالحين والخدمة فالمنستوى.', '2026-11-03T11:30:00Z'),
  ('44444444-4444-4444-8444-444444444405', '22222222-2222-4222-8222-222222222208', 'Oussama T.', 5, 'Fast support and clear instructions on WhatsApp. Highly recommended!', '2026-11-03T12:15:00Z'),
  ('44444444-4444-4444-8444-444444444406', '22222222-2222-4222-8222-222222222208', 'Zakaria E.', 5, 'Top service au Maroc, réponse rapide et prix imbattable.', '2026-11-03T13:05:00Z'),
  ('44444444-4444-4444-8444-444444444407', '22222222-2222-4222-8222-222222222209', 'Anas L.', 5, 'Jeu incroyable, livraison rapide et explications très claires.', '2026-11-03T13:40:00Z'),
  ('44444444-4444-4444-8444-444444444408', '22222222-2222-4222-8222-222222222210', 'Karim S.', 5, 'ثقة وسرعة فالتجاوب عبر واتساب، الله ييسر ليكم.', '2026-11-03T14:00:00Z'),
  ('44444444-4444-4444-8444-444444444409', '22222222-2222-4222-8222-222222222239', 'Soufiane A.', 5, 'Elden Ring sur PS5 en compte Principal au top, merci !', '2026-11-03T14:30:00Z')
ON CONFLICT (id) DO UPDATE SET
  comment = EXCLUDED.comment,
  rating = EXCLUDED.rating,
  reviewer_name = EXCLUDED.reviewer_name;
