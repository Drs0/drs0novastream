-- ============================================================================
-- NovaStream Seed Data (Multilingual EN / FR / Moroccan Darija AR)
-- ============================================================================

-- 1. Categories
INSERT INTO public.categories (id, name, slug, description, image_path, sort_order, is_active)
VALUES
  ('11111111-1111-4111-8111-111111111101', 'PlayStation Plus', 'playstation-plus', 'PlayStation Plus Essential, Extra, and Premium memberships for PS4 & PS5.', '/images/categories/ps-plus.svg', 1, TRUE),
  ('11111111-1111-4111-8111-111111111102', 'PlayStation Games', 'playstation-games', 'Digital PlayStation 4 and PlayStation 5 games with Primary and Secondary options.', '/images/categories/ps-games.svg', 2, TRUE),
  ('11111111-1111-4111-8111-111111111103', 'Xbox & Game Pass', 'xbox-game-pass', 'Xbox Game Pass Core and Ultimate subscriptions for console and PC.', '/images/categories/xbox.svg', 3, TRUE),
  ('11111111-1111-4111-8111-111111111104', 'Streaming Services', 'streaming-services', 'Entertainment and video streaming subscriptions with flexible durations.', '/images/categories/streaming.svg', 4, TRUE),
  ('11111111-1111-4111-8111-111111111105', 'Music Subscriptions', 'music-subscriptions', 'Ad-free music streaming plans for 1, 3, 6, or 12 months.', '/images/categories/music.svg', 5, TRUE),
  ('11111111-1111-4111-8111-111111111106', 'Other Digital Services', 'other-digital-services', 'Software, creative tools, and digital gift cards.', '/images/categories/digital.svg', 6, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Category Translations
INSERT INTO public.category_translations (category_id, locale, name, description)
VALUES
  -- PlayStation Plus
  ('11111111-1111-4111-8111-111111111101', 'en', 'PlayStation Plus', 'PlayStation Plus Essential, Extra, and Premium memberships for PS4 & PS5.'),
  ('11111111-1111-4111-8111-111111111101', 'fr', 'PlayStation Plus', 'Abonnements PlayStation Plus Essential, Extra et Premium pour PS4 et PS5.'),
  ('11111111-1111-4111-8111-111111111101', 'ar', 'بلايستيشن بلس PlayStation Plus', 'اشتراكات PlayStation Plus Essential و Extra و Premium ديال PS4 و PS5 بأحسن الأثمنة.'),

  -- PlayStation Games
  ('11111111-1111-4111-8111-111111111102', 'en', 'PlayStation Games', 'Digital PS4 and PS5 games with transparent Primary and Secondary options.'),
  ('11111111-1111-4111-8111-111111111102', 'fr', 'Jeux PlayStation', 'Jeux numériques PS4 et PS5 avec options Principal et Secondaire.'),
  ('11111111-1111-4111-8111-111111111102', 'ar', 'ألعاب PlayStation', 'ألعاب PS4 و PS5 رقمية مع الاختيار بين برايمري وسيكندري.'),

  -- Xbox & Game Pass
  ('11111111-1111-4111-8111-111111111103', 'en', 'Xbox & Game Pass', 'Xbox Game Pass subscriptions and Xbox digital services for console and PC.'),
  ('11111111-1111-4111-8111-111111111103', 'fr', 'Xbox & Game Pass', 'Abonnements Xbox Game Pass et services numériques pour console et PC.'),
  ('11111111-1111-4111-8111-111111111103', 'ar', 'إكسبوكس و Game Pass', 'اشتراكات Xbox Game Pass وخدمات إكسبوكس ديال الكونسول والبيسي.'),

  -- Streaming Services
  ('11111111-1111-4111-8111-111111111104', 'en', 'Streaming Services', 'High-definition video and entertainment streaming plans.'),
  ('11111111-1111-4111-8111-111111111104', 'fr', 'Services de Streaming', 'Abonnements de streaming vidéo et divertissement en haute définition.'),
  ('11111111-1111-4111-8111-111111111104', 'ar', 'خدمات الستريمينغ', 'اشتراكات ديال الأفلام والمسلسلات والترفيه بجودة عالية.'),

  -- Music Subscriptions
  ('11111111-1111-4111-8111-111111111105', 'en', 'Music Subscriptions', 'Individual and multi-month music streaming subscriptions.'),
  ('11111111-1111-4111-8111-111111111105', 'fr', 'Abonnements Musique', 'Abonnements de musique en continu individuels sur plusieurs mois.'),
  ('11111111-1111-4111-8111-111111111105', 'ar', 'اشتراكات الموسيقى', 'اشتراكات فردية ديال الموسيقى بلا إعلانات لمدة شهر أو أكثر.'),

  -- Other Digital Services
  ('11111111-1111-4111-8111-111111111106', 'en', 'Other Digital Services', 'Productivity, design, and gaming digital cards.'),
  ('11111111-1111-4111-8111-111111111106', 'fr', 'Autres Services Numériques', 'Outils créatifs, logiciels et cartes numériques.'),
  ('11111111-1111-4111-8111-111111111106', 'ar', 'خدمات رقمية أخرى', 'برامج، أدوات التصميم، وبطاقات رقمية متنوعة.')
ON CONFLICT (category_id, locale) DO NOTHING;

-- 3. Services
INSERT INTO public.services (
  id, category_id, name, slug, short_description, description,
  cover_image_path, gallery_paths, status, is_featured, sort_order, terms_text, seo_title, seo_description
)
VALUES
  (
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111101',
    'PlayStation Plus',
    'playstation-plus',
    'Online multiplayer, monthly games, and catalog access for PS4 & PS5.',
    'Choose your PlayStation Plus tier (Essential, Extra, or Premium), console platform (PS4 or PS5), and access mode (Primary or Secondary) for 12 months. Clear conditions and fast setup assistance via WhatsApp.',
    '/images/services/ps-plus-cover.svg',
    ARRAY['/images/services/ps-plus-cover.svg', '/images/services/ps-plus-gallery-1.svg'],
    'published',
    TRUE,
    1,
    'Subject to PlayStation Network terms of use. Do not modify account credentials or sharing settings without support guidance.',
    'PlayStation Plus Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Compare PlayStation Plus Essential, Extra, and Premium 12-month offers for PS4 and PS5 in Moroccan Dirhams (DH).'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111102',
    'EA Sports Football Pro Edition',
    'ea-sports-football-pro',
    'Full digital football game for PS4 and PS5 with Primary and Secondary access options.',
    'Experience the latest club and national football tournaments on PS4 or PS5. Select your console and preferred access type (Primary to play from your personal profile, or Secondary to play on the dedicated profile).',
    '/images/services/football-game-cover.svg',
    ARRAY['/images/services/football-game-cover.svg'],
    'published',
    TRUE,
    2,
    'Primary access allows playing on your own PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Football Game PS4 & PS5 Morocco — Primary & Secondary Prices | NovaStream',
    'Check PS4 and PS5 Primary and Secondary prices in MAD and contact NovaStream on WhatsApp.'
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111103',
    'Xbox Game Pass Ultimate',
    'xbox-game-pass-ultimate',
    'Hundreds of console and PC games plus online console multiplayer.',
    'Access an extensive library of high-quality games on Xbox Series X|S, Xbox One, and Windows PC. Choose the duration that suits your schedule.',
    '/images/services/game-pass-cover.svg',
    ARRAY['/images/services/game-pass-cover.svg'],
    'published',
    TRUE,
    3,
    'Compatible with Xbox One, Xbox Series X|S, and Windows 10/11 PC.',
    'Xbox Game Pass Ultimate Morocco — Prices in DH | NovaStream',
    'Browse Xbox Game Pass Ultimate 1, 3, and 12 month options in Morocco.'
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    '11111111-1111-4111-8111-111111111105',
    'Premium Music Subscription',
    'premium-music-subscription',
    'Ad-free music streaming with offline listening and high audio quality.',
    'Enjoy uninterrupted music streaming on mobile, desktop, and smart devices. Individual plans available for 1, 3, 6, or 12 months without Primary/Secondary console complexity.',
    '/images/services/music-sub-cover.svg',
    ARRAY['/images/services/music-sub-cover.svg'],
    'published',
    TRUE,
    4,
    'Individual plan for single-user listening. Contact us on WhatsApp to confirm availability before ordering.',
    'Premium Music Subscription Morocco — 1 to 12 Months | NovaStream',
    'Individual music subscription plans in MAD. Order easily via WhatsApp.'
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    '11111111-1111-4111-8111-111111111104',
    '4K Cinema Streaming Pass',
    '4k-cinema-streaming-pass',
    'Ultra HD movies, series, and documentaries for your smart TV or mobile.',
    'Watch your favorite series and movies in crisp resolution. Flexible monthly and quarterly plans tailored for Moroccan viewers.',
    '/images/services/cinema-stream-cover.svg',
    ARRAY['/images/services/cinema-stream-cover.svg'],
    'published',
    FALSE,
    5,
    'Single screen or full plan depending on selected edition. Respect profile guidelines.',
    '4K Cinema Streaming Pass Morocco | NovaStream',
    'Compare 1-month and 3-month streaming plans in Moroccan Dirhams.'
  ),
  (
    '22222222-2222-4222-8222-222222222206',
    '11111111-1111-4111-8111-111111111106',
    'Creative Studio Pro Suite (Draft Example)',
    'creative-studio-pro-suite',
    'Internal draft service used to verify RLS draft protection.',
    'This service is in draft status and must never appear in public storefront queries.',
    '/images/services/creative-cover.svg',
    ARRAY[]::TEXT[],
    'draft',
    FALSE,
    99,
    'Draft terms.',
    'Draft Service',
    'Draft Service Description'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Service Translations
INSERT INTO public.service_translations (
  service_id, locale, name, short_description, description, seo_title, seo_description, image_alt
)
VALUES
  -- PlayStation Plus
  (
    '22222222-2222-4222-8222-222222222201',
    'en',
    'PlayStation Plus',
    'Online multiplayer, monthly games, and catalog access for PS4 & PS5.',
    'Choose your PlayStation Plus tier (Essential, Extra, or Premium), console platform (PS4 or PS5), and access mode (Primary or Secondary) for 12 months. Clear conditions and fast setup assistance via WhatsApp.',
    'PlayStation Plus Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Compare PlayStation Plus Essential, Extra, and Premium 12-month offers for PS4 and PS5 in Moroccan Dirhams (DH).',
    'PlayStation Plus membership cover image'
  ),
  (
    '22222222-2222-4222-8222-222222222201',
    'fr',
    'PlayStation Plus',
    'Multijoueur en ligne, jeux mensuels et catalogue de jeux pour PS4 et PS5.',
    'Choisissez votre palier PlayStation Plus (Essential, Extra ou Premium), votre console (PS4 ou PS5) et le type d''accès (Principal ou Secondaire) pour 12 mois. Conditions claires et assistance rapide sur WhatsApp.',
    'PlayStation Plus Maroc (PS4 & PS5) — Prix en DH | NovaStream',
    'Comparez les offres PlayStation Plus Essential, Extra et Premium 12 mois pour PS4 et PS5 en Dirhams (DH).',
    'Illustration de l''abonnement PlayStation Plus'
  ),
  (
    '22222222-2222-4222-8222-222222222201',
    'ar',
    'PlayStation Plus بلايستيشن بلس',
    'اللعب أونلاين، ألعاب شهرية، وكتالوج عامر بالألعاب ديال PS4 و PS5.',
    'اختار الفئة ديال PlayStation Plus اللي بغيتي (Essential ولا Extra ولا Premium)، البلاط فورم ديالك (PS4 أو PS5)، ونوع الحساب (برايمري ولا سيكندري) لمدة 12 شهر. تفاصيل واضحة ومواكبة سريعة عبر واتساب.',
    'PlayStation Plus المغرب (PS4 و PS5) — الأثمنة بالدرهم | NovaStream',
    'شوف وقارن أثمنة PlayStation Plus Essential و Extra و Premium لمدة 12 شهر لـ PS4 و PS5 بالدرهم المغربي.',
    'صورة اشتراك PlayStation Plus'
  ),

  -- Football Game
  (
    '22222222-2222-4222-8222-222222222202',
    'en',
    'EA Sports Football Pro Edition',
    'Full digital football game for PS4 and PS5 with Primary and Secondary access options.',
    'Experience the latest club and national football tournaments on PS4 or PS5. Select your console and preferred access type (Primary to play from your personal profile, or Secondary to play on the dedicated profile).',
    'Football Game PS4 & PS5 Morocco — Primary & Secondary Prices | NovaStream',
    'Check PS4 and PS5 Primary and Secondary prices in MAD and contact NovaStream on WhatsApp.',
    'Football game digital cover'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'fr',
    'EA Sports Football Édition Pro',
    'Jeu de football numérique complet pour PS4 et PS5 en accès Principal ou Secondaire.',
    'Profitez des plus grandes compétitions de football sur PS4 ou PS5. Sélectionnez votre plateforme et le type d''accès souhaité (Principal pour jouer sur votre propre profil, ou Secondaire sur le profil dédié).',
    'Jeu Football PS4 & PS5 Maroc — Prix Principal & Secondaire | NovaStream',
    'Consultez les tarifs PS4 et PS5 en Dirhams et commandez via WhatsApp chez NovaStream.',
    'Couverture du jeu de football sur PlayStation'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'ar',
    'لعبة كرة القدم EA Sports Football Pro',
    'لعبة كرة القدم رقمية كاملة لـ PS4 و PS5 بخيار برايمري أو سيكندري.',
    'عيش أجواء البطولات العالمية والأندية على PS4 ولا PS5. اختار الجهاز ديالك ونوع الحساب (برايمري باش تلعب فالكوْنط الشخصي ديالك، أو سيكندري باش تلعب فالكوْنط المخصص).',
    'لعبة كرة القدم PS4 و PS5 فالمغرب — أثمنة برايمري وسيكندري | NovaStream',
    'شوف أثمنة PS4 و PS5 برايمري وسيكندري بالدرهم وتواصل معانا عبر واتساب.',
    'صورة لعبة كرة القدم لـ PS4 و PS5'
  ),

  -- Xbox Game Pass Ultimate
  (
    '22222222-2222-4222-8222-222222222203',
    'en',
    'Xbox Game Pass Ultimate',
    'Hundreds of console and PC games plus online console multiplayer.',
    'Access an extensive library of high-quality games on Xbox Series X|S, Xbox One, and Windows PC. Choose the duration that suits your schedule.',
    'Xbox Game Pass Ultimate Morocco — Prices in DH | NovaStream',
    'Browse Xbox Game Pass Ultimate 1, 3, and 12 month options in Morocco.',
    'Xbox Game Pass Ultimate cover'
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    'fr',
    'Xbox Game Pass Ultimate',
    'Des centaines de jeux sur console et PC avec multijoueur en ligne inclus.',
    'Accédez à un large catalogue de jeux sur Xbox Series X|S, Xbox One et PC Windows. Choisissez la durée d''abonnement qui vous convient.',
    'Xbox Game Pass Ultimate Maroc — Prix en DH | NovaStream',
    'Découvrez les formules Xbox Game Pass Ultimate 1, 3 et 12 mois au Maroc.',
    'Couverture Xbox Game Pass Ultimate'
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    'ar',
    'Xbox Game Pass Ultimate إكسبوكس غيم باس',
    'مئات الألعاب فـ Xbox و PC مع اللعب أونلاين داخل فالاشتراك.',
    'ستافد من مكتبة كبيرة ديال الألعاب على Xbox Series X|S و Xbox One و PC Windows. اختار المدة اللي مسلكاك وتواصل معانا فالواتساب.',
    'Xbox Game Pass Ultimate المغرب — الأثمنة بالدرهم | NovaStream',
    'شوف عروض Xbox Game Pass Ultimate لمدة شهر، 3 شهور، و 12 شهر بالدرهم.',
    'صورة اشتراك Xbox Game Pass Ultimate'
  ),

  -- Premium Music Subscription
  (
    '22222222-2222-4222-8222-222222222204',
    'en',
    'Premium Music Subscription',
    'Ad-free music streaming with offline listening and high audio quality.',
    'Enjoy uninterrupted music streaming on mobile, desktop, and smart devices. Individual plans available for 1, 3, 6, or 12 months.',
    'Premium Music Subscription Morocco — 1 to 12 Months | NovaStream',
    'Individual music subscription plans in MAD. Order easily via WhatsApp.',
    'Premium Music Subscription cover'
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    'fr',
    'Abonnement Musique Premium',
    'Musique sans publicité avec écoute hors-ligne et haute qualité audio.',
    'Écoutez votre musique préférée sans interruption sur mobile, ordinateur et appareils connectés. Formules individuelles disponibles pour 1, 3, 6 ou 12 mois.',
    'Abonnement Musique Premium Maroc — 1 à 12 Mois | NovaStream',
    'Formules d''abonnement musical individuel en DH. Contact rapide sur WhatsApp.',
    'Illustration Abonnement Musique Premium'
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    'ar',
    'اشتراك الموسيقى Premium',
    'موسيقى بلا إعلانات مع إمكانية التحميل وجودة صوت عالية.',
    'تصنط للموسيقى اللي كتبغي بلا إشهارات فالتيليفون ولا البيسي. كاينين عروض فردية لمدة شهر، 3 شهور، 6 شهور، أو عام كامل.',
    'اشتراك الموسيقى Premium فالمغرب — من شهر حتى لـ 12 شهر | NovaStream',
    'عروض اشتراك الموسيقى الفردي بالدرهم المغربي. طلب دابا عبر واتساب.',
    'صورة اشتراك الموسيقى'
  ),

  -- 4K Cinema Streaming Pass
  (
    '22222222-2222-4222-8222-222222222205',
    'en',
    '4K Cinema Streaming Pass',
    'Ultra HD movies, series, and documentaries for your smart TV or mobile.',
    'Watch your favorite series and movies in crisp resolution. Flexible monthly and quarterly plans tailored for Moroccan viewers.',
    '4K Cinema Streaming Pass Morocco | NovaStream',
    'Compare 1-month and 3-month streaming plans in Moroccan Dirhams.',
    '4K Cinema Streaming Pass cover'
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    'fr',
    'Pass Streaming Cinéma 4K',
    'Films, séries et documentaires en Ultra HD sur Smart TV, mobile ou PC.',
    'Regardez vos films et séries en haute définition avec des formules flexibles d''un mois ou trois mois.',
    'Pass Streaming Cinéma 4K Maroc | NovaStream',
    'Comparez les formules streaming 1 mois et 3 mois en Dirhams.',
    'Couverture Pass Streaming Cinéma 4K'
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    'ar',
    'اشتراك الستريمينغ والأفلام 4K',
    'أفلام ومسلسلات ووثائقيات بجودة عالية فـ Smart TV ولا التيليفون.',
    'تفرج فالأفلام والمسلسلات المفضلة عندك بجودة 4K UHD. اختار العرض ديال شهر ولا 3 شهور اللي يناسبك.',
    'اشتراك الستريمينغ والأفلام 4K فالمغرب | NovaStream',
    'قارن أثمنة اشتراكات الستريمينغ لشهر أو 3 شهور بالدرهم المغربي.',
    'صورة اشتراك الستريمينغ 4K'
  )
ON CONFLICT (service_id, locale) DO NOTHING;

-- 5. Service Variants (Integer MAD prices, exact pricing logic)
INSERT INTO public.service_variants (
  id, service_id, sku, label, platform, edition, tier, duration_months, access_type, price_mad, sale_price_mad, is_available, sort_order
)
VALUES
  -- PlayStation Plus (Platform + Tier + Access + Duration)
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222201', 'PSP-PS4-ESS-PRI-12', 'PS4 Essential Primary 12M', 'PS4', NULL, 'Essential', 12, 'Primary', 180, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222201', 'PSP-PS4-ESS-SEC-12', 'PS4 Essential Secondary 12M', 'PS4', NULL, 'Essential', 12, 'Secondary', 150, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222201', 'PSP-PS4-EXT-PRI-12', 'PS4 Extra Primary 12M', 'PS4', NULL, 'Extra', 12, 'Primary', 310, 290, TRUE, 3),
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222201', 'PSP-PS5-ESS-PRI-12', 'PS5 Essential Primary 12M', 'PS5', NULL, 'Essential', 12, 'Primary', 220, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222201', 'PSP-PS5-EXT-PRI-12', 'PS5 Extra Primary 12M', 'PS5', NULL, 'Extra', 12, 'Primary', 350, NULL, TRUE, 5),
  ('33333333-3333-4333-8333-333333333306', '22222222-2222-4222-8222-222222222201', 'PSP-PS5-EXT-SEC-12', 'PS5 Extra Secondary 12M', 'PS5', NULL, 'Extra', 12, 'Secondary', 250, NULL, TRUE, 6),
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222201', 'PSP-PS5-PRM-PRI-12', 'PS5 Premium Primary 12M', 'PS5', NULL, 'Premium', 12, 'Primary', 420, 390, TRUE, 7),
  ('33333333-3333-4333-8333-333333333308', '22222222-2222-4222-8222-222222222201', 'PSP-PS5-PRM-SEC-12', 'PS5 Premium Secondary 12M', 'PS5', NULL, 'Premium', 12, 'Secondary', 300, NULL, FALSE, 8),

  -- Football Game (Platform + Edition + Access)
  ('33333333-3333-4333-8333-333333333309', '22222222-2222-4222-8222-222222222202', 'FB-PS4-STD-PRI', 'PS4 Standard Primary', 'PS4', 'Standard', NULL, NULL, 'Primary', 140, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333310', '22222222-2222-4222-8222-222222222202', 'FB-PS4-STD-SEC', 'PS4 Standard Secondary', 'PS4', 'Standard', NULL, NULL, 'Secondary', 100, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333311', '22222222-2222-4222-8222-222222222202', 'FB-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 300, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333312', '22222222-2222-4222-8222-222222222202', 'FB-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 150, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333313', '22222222-2222-4222-8222-222222222202', 'FB-PS5-ULT-PRI', 'PS5 Ultimate Primary', 'PS5', 'Ultimate', NULL, NULL, 'Primary', 420, 380, TRUE, 5),

  -- Xbox Game Pass Ultimate (Platform + Tier + Duration — no Primary/Secondary)
  ('33333333-3333-4333-8333-333333333314', '22222222-2222-4222-8222-222222222203', 'XGP-ULT-1M', 'Xbox & PC Ultimate 1 Month', 'Xbox / PC', NULL, 'Ultimate', 1, NULL, 90, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333315', '22222222-2222-4222-8222-222222222203', 'XGP-ULT-3M', 'Xbox & PC Ultimate 3 Months', 'Xbox / PC', NULL, 'Ultimate', 3, NULL, 240, 220, TRUE, 2),
  ('33333333-3333-4333-8333-333333333316', '22222222-2222-4222-8222-222222222203', 'XGP-ULT-12M', 'Xbox & PC Ultimate 12 Months', 'Xbox / PC', NULL, 'Ultimate', 12, NULL, 750, 690, TRUE, 3),

  -- Music Subscription (Plan/Edition + Duration — no Platform, no Primary/Secondary)
  ('33333333-3333-4333-8333-333333333317', '22222222-2222-4222-8222-222222222204', 'MUS-IND-1M', 'Individual 1 Month', NULL, 'Individual', NULL, 1, NULL, 45, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333318', '22222222-2222-4222-8222-222222222204', 'MUS-IND-3M', 'Individual 3 Months', NULL, 'Individual', NULL, 3, NULL, 120, 110, TRUE, 2),
  ('33333333-3333-4333-8333-333333333319', '22222222-2222-4222-8222-222222222204', 'MUS-IND-12M', 'Individual 12 Months', NULL, 'Individual', NULL, 12, NULL, 390, 350, TRUE, 3),

  -- 4K Cinema Streaming Pass (Edition + Duration)
  ('33333333-3333-4333-8333-333333333320', '22222222-2222-4222-8222-222222222205', 'CIN-1S-1M', '1 Screen 4K - 1 Month', NULL, '1 Screen 4K', NULL, 1, NULL, 55, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333321', '22222222-2222-4222-8222-222222222205', 'CIN-1S-3M', '1 Screen 4K - 3 Months', NULL, '1 Screen 4K', NULL, 3, NULL, 150, 135, TRUE, 2),
  ('33333333-3333-4333-8333-333333333322', '22222222-2222-4222-8222-222222222205', 'CIN-FULL-1M', 'Full Account 4K - 1 Month', NULL, 'Full Account 4K', NULL, 1, NULL, 130, NULL, TRUE, 3)
ON CONFLICT (id) DO NOTHING;

-- 6. Site Settings
INSERT INTO public.site_settings (key, value, is_public)
VALUES
  ('whatsapp_number', '"212600000000"'::JSONB, TRUE),
  ('contact_email', '"contact@novastream.ma"'::JSONB, TRUE),
  ('support_hours', '"10:00 - 23:00 (GMT+1)"'::JSONB, TRUE),
  ('default_locale', '"fr"'::JSONB, TRUE),
  ('social_links', '{"instagram": "https://instagram.com/novastream.ma", "facebook": "https://facebook.com/novastream.ma", "tiktok": "https://tiktok.com/@novastream.ma"}'::JSONB, TRUE),
  ('hero_banner', '{"badge_en": "Morocco Digital Storefront", "badge_fr": "Boutique Numérique au Maroc", "badge_ar": "متجر الخدمات الرقمية فالمغرب"}'::JSONB, TRUE),
  ('internal_admin_notes', '"Remember to verify supplier stock weekly."'::JSONB, FALSE)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- NovaStream Migration 0003: Add 34 Promotional Offers & Localized 1:1 Images
-- ============================================================================

-- 1. Ensure Core Categories Exist
INSERT INTO public.categories (id, name, slug, description, image_path, sort_order, is_active)
VALUES
  ('11111111-1111-4111-8111-111111111101', 'PlayStation Plus', 'playstation-plus', 'PlayStation Plus Essential, Extra, and Premium memberships for PS4 & PS5.', '/images/categories/ps-plus.svg', 1, TRUE),
  ('11111111-1111-4111-8111-111111111102', 'PlayStation Games', 'playstation-games', 'Digital PlayStation 4 and PlayStation 5 games with Primary and Secondary options.', '/images/categories/ps-games.svg', 2, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Update PlayStation Plus 1-Year Offers & Localized 1:1 Images
UPDATE public.services
SET
  cover_image_path = 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/playstation-plus.jpg',
  gallery_paths = ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/playstation-plus.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/playstation-plus.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/playstation-plus.jpg']
WHERE id = '22222222-2222-4222-8222-222222222201';

-- Upsert PlayStation Plus 12-Month Variants from Promotional Offer Table
INSERT INTO public.service_variants (
  id, service_id, sku, label, platform, edition, tier, duration_months, access_type, price_mad, sale_price_mad, is_available, sort_order
) VALUES
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222201', 'PSP-PS4-ESS-PRI-12', 'PS4 Essential Primary 12M', 'PS4', NULL, 'Essential', 12, 'Primary', 180, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222201', 'PSP-PS4-ESS-SEC-12', 'PS4 Essential Secondary 12M', 'PS4', NULL, 'Essential', 12, 'Secondary', 150, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222201', 'PSP-PS4-EXT-PRI-12', 'PS4 Extra Primary 12M', 'PS4', NULL, 'Extra', 12, 'Primary', 310, 250, TRUE, 3),
  ('33333333-3333-4333-8333-333333333323', '22222222-2222-4222-8222-222222222201', 'PSP-PS4-EXT-SEC-12', 'PS4 Extra Secondary 12M', 'PS4', NULL, 'Extra', 12, 'Secondary', 200, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333324', '22222222-2222-4222-8222-222222222201', 'PSP-PS4-PRM-PRI-12', 'PS4 Premium Primary 12M', 'PS4', NULL, 'Premium', 12, 'Primary', 300, NULL, TRUE, 5),
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222201', 'PSP-PS5-ESS-PRI-12', 'PS5 Essential Primary 12M', 'PS5', NULL, 'Essential', 12, 'Primary', 250, NULL, TRUE, 6),
  ('33333333-3333-4333-8333-333333333325', '22222222-2222-4222-8222-222222222201', 'PSP-PS5-ESS-SEC-12', 'PS5 Essential Secondary 12M', 'PS5', NULL, 'Essential', 12, 'Secondary', 200, NULL, TRUE, 7),
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222201', 'PSP-PS5-EXT-PRI-12', 'PS5 Extra Primary 12M', 'PS5', NULL, 'Extra', 12, 'Primary', 350, NULL, TRUE, 8),
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222201', 'PSP-PS5-PRM-PRI-12', 'PS5 Premium Primary 12M', 'PS5', NULL, 'Premium', 12, 'Primary', 450, NULL, TRUE, 9)
ON CONFLICT (id) DO UPDATE SET
  price_mad = EXCLUDED.price_mad,
  sale_price_mad = EXCLUDED.sale_price_mad,
  is_available = EXCLUDED.is_available,
  sort_order = EXCLUDED.sort_order;

-- 3. Insert 33 New PlayStation Game Offers
INSERT INTO public.services (
  id, category_id, name, slug, short_description, description,
  cover_image_path, gallery_paths, status, is_featured, sort_order, terms_text, seo_title, seo_description
) VALUES
  (
    '22222222-2222-4222-8222-222222222207',
    '11111111-1111-4111-8111-111111111102',
    'EA Sports FC 27',
    'ea-sports-fc-27',
    'PS4 & PS5 Standard and Ultimate Edition football offers with Primary and Secondary access.',
    'Experience the next chapter of world football with EA Sports FC 27 on PS4 and PS5. Choose between Standard and Ultimate Editions with Primary or Secondary account options.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/ea-sports-fc-27.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/ea-sports-fc-27.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/ea-sports-fc-27.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/ea-sports-fc-27.jpg'],
    'published',
    TRUE,
    6,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'EA Sports FC 27 Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'PS4 & PS5 Standard and Ultimate Edition football offers with Primary and Secondary access.'
  ),
  (
    '22222222-2222-4222-8222-222222222208',
    '11111111-1111-4111-8111-111111111102',
    'Grand Theft Auto VI (GTA VI)',
    'gta-vi',
    'Return to Vice City on PS5 with Standard and Ultimate Edition account offers.',
    'Pre-order and secure your Grand Theft Auto VI PS5 digital access in Morocco. Choose between Standard Edition and Ultimate Edition in Primary or Secondary mode.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/gta-vi.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/gta-vi.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/gta-vi.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/gta-vi.jpg'],
    'published',
    TRUE,
    7,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Grand Theft Auto VI (GTA VI) Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Return to Vice City on PS5 with Standard and Ultimate Edition account offers.'
  ),
  (
    '22222222-2222-4222-8222-222222222209',
    '11111111-1111-4111-8111-111111111102',
    'Baldur''s Gate 3',
    'baldurs-gate-3',
    'Award-winning Dungeons & Dragons RPG for PS5 with Primary and Secondary options.',
    'Gather your party and return to the Forgotten Realms in Baldur''s Gate 3 on PS5. Available with instant WhatsApp support.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/baldurs-gate-3.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/baldurs-gate-3.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/baldurs-gate-3.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/baldurs-gate-3.jpg'],
    'published',
    TRUE,
    8,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Baldur''s Gate 3 Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Award-winning Dungeons & Dragons RPG for PS5 with Primary and Secondary options.'
  ),
  (
    '22222222-2222-4222-8222-222222222210',
    '11111111-1111-4111-8111-111111111102',
    'Forza Horizon 6',
    'forza-horizon-6',
    'Open-world racing festival on PS5 with Primary and Secondary account offers.',
    'Explore breathtaking roads and cherry blossom landscapes in Forza Horizon 6 on PS5. Available in Primary and Secondary digital accounts.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/forza-horizon-6.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/forza-horizon-6.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/forza-horizon-6.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/forza-horizon-6.jpg'],
    'published',
    TRUE,
    9,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Forza Horizon 6 Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Open-world racing festival on PS5 with Primary and Secondary account offers.'
  ),
  (
    '22222222-2222-4222-8222-222222222211',
    '11111111-1111-4111-8111-111111111102',
    'Phantom Blade Zero',
    'phantom-blade-zero',
    'High-speed kungfupunk action RPG on PS5 with Primary and Secondary offers.',
    'Master lethal martial arts and dark steampunk weaponry in Phantom Blade Zero on PS5. Choose Primary or Secondary account access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/phantom-blade-zero.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/phantom-blade-zero.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/phantom-blade-zero.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/phantom-blade-zero.jpg'],
    'published',
    TRUE,
    10,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Phantom Blade Zero Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'High-speed kungfupunk action RPG on PS5 with Primary and Secondary offers.'
  ),
  (
    '22222222-2222-4222-8222-222222222212',
    '11111111-1111-4111-8111-111111111102',
    'The Last of Us Part I',
    'the-last-of-us-part-1',
    'Standard and Remastered editions of the emotional storytelling masterpiece.',
    'Experience Joel and Ellie''s unforgettable journey across a post-pandemic world. Available in Standard and Remastered editions with Primary or Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/the-last-of-us-part-1.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/the-last-of-us-part-1.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/the-last-of-us-part-1.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/the-last-of-us-part-1.jpg'],
    'published',
    FALSE,
    11,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'The Last of Us Part I Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Standard and Remastered editions of the emotional storytelling masterpiece.'
  ),
  (
    '22222222-2222-4222-8222-222222222213',
    '11111111-1111-4111-8111-111111111102',
    'The Last of Us Part II',
    'the-last-of-us-part-2',
    'Standard and Remastered editions for PS4 & PS5 in Primary and Secondary access.',
    'Confront the devastating physical and emotional repercussions of Ellie''s actions in The Last of Us Part II. Choose Standard or Remastered Edition.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/the-last-of-us-part-2.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/the-last-of-us-part-2.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/the-last-of-us-part-2.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/the-last-of-us-part-2.jpg'],
    'published',
    FALSE,
    12,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'The Last of Us Part II Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Standard and Remastered editions for PS4 & PS5 in Primary and Secondary access.'
  ),
  (
    '22222222-2222-4222-8222-222222222214',
    '11111111-1111-4111-8111-111111111102',
    'Ghost of Yotei',
    'ghost-of-yotei',
    'Epic samurai adventure in northern Japan on PS5 — Standard & Deluxe Editions.',
    'Embark on a cinematic open-world journey around Mount Yotei on PS5. Available in Standard and Deluxe Editions with Primary or Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/ghost-of-yotei.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/ghost-of-yotei.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/ghost-of-yotei.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/ghost-of-yotei.jpg'],
    'published',
    TRUE,
    13,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Ghost of Yotei Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Epic samurai adventure in northern Japan on PS5 — Standard & Deluxe Editions.'
  ),
  (
    '22222222-2222-4222-8222-222222222215',
    '11111111-1111-4111-8111-111111111102',
    'Mortal Shell II',
    'mortal-shell-2',
    'Dark fantasy soulslike action RPG on PS5 with Primary and Secondary accounts.',
    'Test your resilience and tactical combat mastery in Mortal Shell II on PS5. Available with instant WhatsApp delivery.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/mortal-shell-2.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/mortal-shell-2.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/mortal-shell-2.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/mortal-shell-2.jpg'],
    'published',
    FALSE,
    14,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Mortal Shell II Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Dark fantasy soulslike action RPG on PS5 with Primary and Secondary accounts.'
  ),
  (
    '22222222-2222-4222-8222-222222222216',
    '11111111-1111-4111-8111-111111111102',
    'Wo Long: Fallen Dynasty',
    'wo-long-fallen-dynasty',
    'Dark Three Kingdoms action RPG for PS4 & PS5 with Primary and Secondary access.',
    'Fight demons and warlords across a chaotic Three Kingdoms setting in Wo Long: Fallen Dynasty. Available in Primary and Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/wo-long-fallen-dynasty.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/wo-long-fallen-dynasty.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/wo-long-fallen-dynasty.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/wo-long-fallen-dynasty.jpg'],
    'published',
    FALSE,
    15,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Wo Long: Fallen Dynasty Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Dark Three Kingdoms action RPG for PS4 & PS5 with Primary and Secondary access.'
  ),
  (
    '22222222-2222-4222-8222-222222222217',
    '11111111-1111-4111-8111-111111111102',
    'The Witcher 3: Wild Hunt Remastered',
    'the-witcher-3-remastered',
    'Next-gen remastered open-world RPG for PS5 with Primary and Secondary options.',
    'Play as Geralt of Rivia in the remastered next-gen edition of The Witcher 3: Wild Hunt on PS5. Choose Primary or Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/the-witcher-3-remastered.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/the-witcher-3-remastered.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/the-witcher-3-remastered.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/the-witcher-3-remastered.jpg'],
    'published',
    FALSE,
    16,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'The Witcher 3: Wild Hunt Remastered Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Next-gen remastered open-world RPG for PS5 with Primary and Secondary options.'
  ),
  (
    '22222222-2222-4222-8222-222222222218',
    '11111111-1111-4111-8111-111111111102',
    'Palworld',
    'palworld',
    'Open-world creature collection, crafting, and survival game on PS5.',
    'Explore vast islands, capture Pals, build bases, and team up with friends in Palworld Standard Edition on PS5.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/palworld.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/palworld.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/palworld.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/palworld.jpg'],
    'published',
    FALSE,
    17,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Palworld Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Open-world creature collection, crafting, and survival game on PS5.'
  ),
  (
    '22222222-2222-4222-8222-222222222219',
    '11111111-1111-4111-8111-111111111102',
    'Sea of Thieves',
    'sea-of-thieves',
    'Shared-world pirate adventure on PS5 — Standard Edition Primary & Secondary.',
    'Set sail, plunder lost treasures, and battle rival crews on the high seas in Sea of Thieves Standard Edition for PS5.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/sea-of-thieves.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/sea-of-thieves.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/sea-of-thieves.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/sea-of-thieves.jpg'],
    'published',
    FALSE,
    18,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Sea of Thieves Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Shared-world pirate adventure on PS5 — Standard Edition Primary & Secondary.'
  ),
  (
    '22222222-2222-4222-8222-222222222220',
    '11111111-1111-4111-8111-111111111102',
    'Marvel''s Wolverine',
    'marvels-wolverine',
    ' blockbuster PS5 action adventure starring Logan in Primary and Secondary access.',
    'Unleash adamantium claws in Marvel''s Wolverine on PS5. Choose between Primary account access (play on your personal profile) or Secondary account access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/marvels-wolverine.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/marvels-wolverine.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/marvels-wolverine.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/marvels-wolverine.jpg'],
    'published',
    TRUE,
    19,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Marvel''s Wolverine Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    ' blockbuster PS5 action adventure starring Logan in Primary and Secondary access.'
  ),
  (
    '22222222-2222-4222-8222-222222222221',
    '11111111-1111-4111-8111-111111111102',
    'The Blood of Dawnwalker',
    'the-blood-of-dawnwalker',
    'Dark fantasy vampire action RPG for PS5 with Primary and Secondary options.',
    'Step into a dark medieval world of steel and blood magic in The Blood of Dawnwalker on PS5. Available in Primary and Secondary accounts.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/the-blood-of-dawnwalker.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/the-blood-of-dawnwalker.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/the-blood-of-dawnwalker.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/the-blood-of-dawnwalker.jpg'],
    'published',
    FALSE,
    20,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'The Blood of Dawnwalker Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Dark fantasy vampire action RPG for PS5 with Primary and Secondary options.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111102',
    'Flight Simulator 2024',
    'flight-simulator-24',
    'Next-generation aviation simulation with Primary and Secondary account options.',
    'Pursue your aviation career across the globe with a dynamically generated world in Flight Simulator 2024. Choose Primary or Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/flight-simulator-24.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/flight-simulator-24.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/flight-simulator-24.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/flight-simulator-24.jpg'],
    'published',
    FALSE,
    21,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Flight Simulator 2024 Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Next-generation aviation simulation with Primary and Secondary account options.'
  ),
  (
    '22222222-2222-4222-8222-222222222223',
    '11111111-1111-4111-8111-111111111102',
    'Sekiro: Shadows Die Twice',
    'sekiro-shadows-die-twice',
    'Game of the Year shinobi action-adventure for PS4 & PS5.',
    'Carve your own clever path to vengeance in FromSoftware''s acclaimed Sekiro: Shadows Die Twice. Available in Primary and Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/sekiro-shadows-die-twice.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/sekiro-shadows-die-twice.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/sekiro-shadows-die-twice.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/sekiro-shadows-die-twice.jpg'],
    'published',
    FALSE,
    22,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Sekiro: Shadows Die Twice Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Game of the Year shinobi action-adventure for PS4 & PS5.'
  ),
  (
    '22222222-2222-4222-8222-222222222224',
    '11111111-1111-4111-8111-111111111102',
    'Mount & Blade II: Bannerlord',
    'mount-and-blade-2-bannerlord',
    'Medieval combat simulator and strategy RPG for PS4 & PS5.',
    'Raise armies, lead troops into massive medieval battles, and conquer Calradia in Mount & Blade II: Bannerlord.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/mount-and-blade-2-bannerlord.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/mount-and-blade-2-bannerlord.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/mount-and-blade-2-bannerlord.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/mount-and-blade-2-bannerlord.jpg'],
    'published',
    FALSE,
    23,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Mount & Blade II: Bannerlord Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Medieval combat simulator and strategy RPG for PS4 & PS5.'
  ),
  (
    '22222222-2222-4222-8222-222222222225',
    '11111111-1111-4111-8111-111111111102',
    'Alan Wake 2',
    'alan-wake-2',
    'Psychological survival horror masterpiece on PS5 — Standard Edition.',
    'Solve a deadly mystery in the Pacific Northwest across two interwoven stories in Alan Wake 2 Standard Edition for PS5.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/alan-wake-2.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/alan-wake-2.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/alan-wake-2.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/alan-wake-2.jpg'],
    'published',
    FALSE,
    24,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Alan Wake 2 Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Psychological survival horror masterpiece on PS5 — Standard Edition.'
  ),
  (
    '22222222-2222-4222-8222-222222222226',
    '11111111-1111-4111-8111-111111111102',
    'Pragmata',
    'pragmata',
    'Capcom sci-fi action adventure on PS5 with Primary and Secondary accounts.',
    'Explore a dystopian lunar world in Capcom''s breathtaking sci-fi adventure Pragmata on PS5.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/pragmata.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/pragmata.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/pragmata.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/pragmata.jpg'],
    'published',
    FALSE,
    25,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Pragmata Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Capcom sci-fi action adventure on PS5 with Primary and Secondary accounts.'
  ),
  (
    '22222222-2222-4222-8222-222222222227',
    '11111111-1111-4111-8111-111111111102',
    'Assassin''s Creed Shadows',
    'assassins-creed-shadows',
    'Feudal Japan shinobi and samurai epic on PS5 with Primary and Secondary access.',
    'Live the intertwined stories of Naoe, an adept shinobi Assassin, and Yasuke, a powerful legendary samurai, in Assassin''s Creed Shadows on PS5.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/assassins-creed-shadows.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/assassins-creed-shadows.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/assassins-creed-shadows.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/assassins-creed-shadows.jpg'],
    'published',
    TRUE,
    26,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Assassin''s Creed Shadows Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Feudal Japan shinobi and samurai epic on PS5 with Primary and Secondary access.'
  ),
  (
    '22222222-2222-4222-8222-222222222228',
    '11111111-1111-4111-8111-111111111102',
    'Silent Hill: Townfall',
    'silent-hill-townfall',
    'Psychological horror chapter in the Silent Hill universe on PS5.',
    'Enter the fog once more in Silent Hill: Townfall on PS5. Available in Primary and Secondary account options with fast setup.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/silent-hill-townfall.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/silent-hill-townfall.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/silent-hill-townfall.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/silent-hill-townfall.jpg'],
    'published',
    FALSE,
    27,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Silent Hill: Townfall Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Psychological horror chapter in the Silent Hill universe on PS5.'
  ),
  (
    '22222222-2222-4222-8222-222222222229',
    '11111111-1111-4111-8111-111111111102',
    'Assassin''s Creed Black Flag Remake',
    'assassins-creed-black-flag-remake',
    'Next-gen remake of the Golden Age of Piracy classic on PS5.',
    'Command the Jackdaw with Edward Kenway in the rebuilt next-gen Remake of Assassin''s Creed Black Flag on PS5.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/assassins-creed-black-flag-remake.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/assassins-creed-black-flag-remake.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/assassins-creed-black-flag-remake.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/assassins-creed-black-flag-remake.jpg'],
    'published',
    FALSE,
    28,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Assassin''s Creed Black Flag Remake Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Next-gen remake of the Golden Age of Piracy classic on PS5.'
  ),
  (
    '22222222-2222-4222-8222-222222222230',
    '11111111-1111-4111-8111-111111111102',
    '007 First Light',
    '007-first-light',
    'James Bond espionage action adventure on PS5 with Primary & Secondary access.',
    'Earn your 00 status in IO Interactive''s original James Bond espionage thriller 007 First Light on PS5.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/007-first-light.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/007-first-light.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/007-first-light.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/007-first-light.jpg'],
    'published',
    FALSE,
    29,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    '007 First Light Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'James Bond espionage action adventure on PS5 with Primary & Secondary access.'
  ),
  (
    '22222222-2222-4222-8222-222222222231',
    '11111111-1111-4111-8111-111111111102',
    'ARC Raiders',
    'arc-raiders',
    'Sci-fi extraction shooter adventure on PS5 with Primary and Secondary accounts.',
    'Enlist as a Raider and scavenge a lethal mechanized Earth in ARC Raiders on PS5. Available in Primary and Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/arc-raiders.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/arc-raiders.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/arc-raiders.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/arc-raiders.jpg'],
    'published',
    FALSE,
    30,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'ARC Raiders Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Sci-fi extraction shooter adventure on PS5 with Primary and Secondary accounts.'
  ),
  (
    '22222222-2222-4222-8222-222222222232',
    '11111111-1111-4111-8111-111111111102',
    'Resident Evil 4 Remake',
    'resident-evil-4-remake',
    'Survival horror masterpiece for PS4 & PS5 — Standard Edition Primary & Secondary.',
    'Relive Leon S. Kennedy''s harrowing rescue mission in Resident Evil 4 Remake. Available for both PS4 and PS5 with Primary or Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/resident-evil-4-remake.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/resident-evil-4-remake.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/resident-evil-4-remake.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/resident-evil-4-remake.jpg'],
    'published',
    TRUE,
    31,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Resident Evil 4 Remake Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Survival horror masterpiece for PS4 & PS5 — Standard Edition Primary & Secondary.'
  ),
  (
    '22222222-2222-4222-8222-222222222233',
    '11111111-1111-4111-8111-111111111102',
    'Crimson Desert',
    'crimson-desert',
    'Open-world action-adventure across Pywel on PS5 — Standard & Deluxe Editions.',
    'Fight for survival across the vast continent of Pywel in Crimson Desert on PS5. Choose Standard or Deluxe Edition in Primary or Secondary mode.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/crimson-desert.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/crimson-desert.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/crimson-desert.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/crimson-desert.jpg'],
    'published',
    FALSE,
    32,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Crimson Desert Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Open-world action-adventure across Pywel on PS5 — Standard & Deluxe Editions.'
  ),
  (
    '22222222-2222-4222-8222-222222222234',
    '11111111-1111-4111-8111-111111111102',
    'Black Myth: Wukong',
    'black-myth-wukong',
    'Action RPG rooted in Chinese mythology on PS5 — Standard & Deluxe Editions.',
    'Set out as the Destined One in Black Myth: Wukong on PS5. Available in Standard and Deluxe Editions with Primary or Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/black-myth-wukong.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/black-myth-wukong.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/black-myth-wukong.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/black-myth-wukong.jpg'],
    'published',
    TRUE,
    33,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Black Myth: Wukong Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Action RPG rooted in Chinese mythology on PS5 — Standard & Deluxe Editions.'
  ),
  (
    '22222222-2222-4222-8222-222222222235',
    '11111111-1111-4111-8111-111111111102',
    'Rust Console Edition',
    'rust-console-edition',
    'Survive, build, and raid in Rust Console Edition for PS4 & PS5.',
    'Everything wants you to die — overcome thirst, hunger, and other players in Rust Console Edition. Available in Primary and Secondary access.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/rust-console-edition.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/rust-console-edition.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/rust-console-edition.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/rust-console-edition.jpg'],
    'published',
    FALSE,
    34,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Rust Console Edition Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Survive, build, and raid in Rust Console Edition for PS4 & PS5.'
  ),
  (
    '22222222-2222-4222-8222-222222222236',
    '11111111-1111-4111-8111-111111111102',
    'Call of Duty: Modern Warfare 4',
    'cod-modern-warfare-4',
    'Tactical first-person shooter campaign and multiplayer on PS5.',
    'Lock and load for next-generation tactical combat and multiplayer action in Call of Duty: Modern Warfare 4 on PS5.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/cod-modern-warfare-4.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/cod-modern-warfare-4.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/cod-modern-warfare-4.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/cod-modern-warfare-4.jpg'],
    'published',
    TRUE,
    35,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Call of Duty: Modern Warfare 4 Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Tactical first-person shooter campaign and multiplayer on PS5.'
  ),
  (
    '22222222-2222-4222-8222-222222222237',
    '11111111-1111-4111-8111-111111111102',
    'Resident Evil 9: Requiem',
    'resident-evil-9-requiem',
    'Next chapter of survival horror on PS5 — Standard & Deluxe Editions.',
    'Face terrifying new bio-organic threats in Resident Evil 9: Requiem on PS5. Available in Standard and Deluxe Editions.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/resident-evil-9-requiem.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/resident-evil-9-requiem.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/resident-evil-9-requiem.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/resident-evil-9-requiem.jpg'],
    'published',
    TRUE,
    36,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Resident Evil 9: Requiem Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Next chapter of survival horror on PS5 — Standard & Deluxe Editions.'
  ),
  (
    '22222222-2222-4222-8222-222222222238',
    '11111111-1111-4111-8111-111111111102',
    'It Takes Two + A Way Out (2-Game Bundle)',
    'it-takes-two-a-way-out-bundle',
    'Two acclaimed co-op games in a single PS4 & PS5 account (Primary & Secondary).',
    'Get both Hazelight co-op hits — It Takes Two and A Way Out — bundled together in one digital account for PS4 & PS5.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/it-takes-two-a-way-out-bundle.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/it-takes-two-a-way-out-bundle.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/it-takes-two-a-way-out-bundle.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/it-takes-two-a-way-out-bundle.jpg'],
    'published',
    TRUE,
    37,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'It Takes Two + A Way Out (2-Game Bundle) Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Two acclaimed co-op games in a single PS4 & PS5 account (Primary & Secondary).'
  ),
  (
    '22222222-2222-4222-8222-222222222239',
    '11111111-1111-4111-8111-111111111102',
    'Elden Ring',
    'elden-ring',
    'Rise, Tarnished, and claim the Elden Ring on PS4 & PS5 in Primary or Secondary.',
    'Journey through the Lands Between in FromSoftware''s monumental fantasy action-RPG Elden Ring. Available with Primary and Secondary account options.',
    'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/elden-ring.jpg',
    ARRAY['https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/fr/elden-ring.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/en/elden-ring.jpg', 'https://aswgzbvvagjgctesttlv.supabase.co/storage/v1/object/public/service-images/offers/ar/elden-ring.jpg'],
    'published',
    TRUE,
    38,
    'Primary access allows playing from your personal PSN profile. Secondary access requires playing on the provided profile with an active internet connection.',
    'Elden Ring Morocco (PS4 & PS5) — Prices in DH | NovaStream',
    'Rise, Tarnished, and claim the Elden Ring on PS4 & PS5 in Primary or Secondary.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  cover_image_path = EXCLUDED.cover_image_path,
  gallery_paths = EXCLUDED.gallery_paths,
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order;

-- 4. Insert Multilingual Service Translations (EN / FR / AR Moroccan Darija)
INSERT INTO public.service_translations (
  service_id, locale, name, short_description, description, seo_title, seo_description, image_alt
) VALUES
  -- EA Sports FC 27
  ('22222222-2222-4222-8222-222222222207', 'en', 'EA Sports FC 27', 'PS4 & PS5 Standard and Ultimate Edition football offers with Primary and Secondary access.', 'Experience the next chapter of world football with EA Sports FC 27 on PS4 and PS5. Choose between Standard and Ultimate Editions with Primary or Secondary account options.', 'EA Sports FC 27 Morocco — Prices in DH | NovaStream', 'PS4 & PS5 Standard and Ultimate Edition football offers with Primary and Secondary access.', 'EA Sports FC 27 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222207', 'fr', 'EA Sports FC 27', 'Offres PS4 et PS5 Éditions Standard et Ultimate en accès Principal ou Secondaire.', 'Vivez toute l''intensité du football mondial avec EA Sports FC 27 sur PS4 et PS5. Disponible en Édition Standard ou Ultimate avec accès Principal ou Secondaire.', 'EA Sports FC 27 Maroc — Prix en DH | NovaStream', 'Offres PS4 et PS5 Éditions Standard et Ultimate en accès Principal ou Secondaire.', 'EA Sports FC 27 Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222207', 'ar', 'EA Sports FC 27 — فيفا 27', 'لعبة كرة القدم FC 27 لـ PS4 و PS5 بنسخة ستاندارد وألتيميت بخيار برايمري أو سيكندري.', 'عيش حماس الكرة العالمية مع FC 27 على PS4 و PS5. متوفرة بنسخة ستاندارد وألتيميت مع إمكانية الاختيار بين حساب برايمري أو سيكندري والتسليم السريع عبر واتساب.', 'EA Sports FC 27 — فيفا 27 المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة كرة القدم FC 27 لـ PS4 و PS5 بنسخة ستاندارد وألتيميت بخيار برايمري أو سيكندري.', 'صورة عرض EA Sports FC 27 — فيفا 27'),
  -- Grand Theft Auto VI (GTA VI)
  ('22222222-2222-4222-8222-222222222208', 'en', 'Grand Theft Auto VI (GTA VI)', 'Return to Vice City on PS5 with Standard and Ultimate Edition account offers.', 'Pre-order and secure your Grand Theft Auto VI PS5 digital access in Morocco. Choose between Standard Edition and Ultimate Edition in Primary or Secondary mode.', 'Grand Theft Auto VI (GTA VI) Morocco — Prices in DH | NovaStream', 'Return to Vice City on PS5 with Standard and Ultimate Edition account offers.', 'Grand Theft Auto VI (GTA VI) 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222208', 'fr', 'Grand Theft Auto VI (GTA VI)', 'Retrouvez Vice City sur PS5 avec nos offres Édition Standard et Ultimate.', 'Réservez votre accès numérique Grand Theft Auto VI sur PS5 au Maroc. Choisissez entre l''Édition Standard et l''Édition Ultimate en compte Principal ou Secondaire.', 'Grand Theft Auto VI (GTA VI) Maroc — Prix en DH | NovaStream', 'Retrouvez Vice City sur PS5 avec nos offres Édition Standard et Ultimate.', 'Grand Theft Auto VI (GTA VI) Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222208', 'ar', 'Grand Theft Auto VI — قراند 6', 'أقوى عروض لعبة قراند 6 GTA VI على PS5 بنسخة ستاندارد وألتيميت (برايمري وسيكندري).', 'احجز نسختك الرقمية ديال GTA VI على PS5 بأحسن ثمن فالمغرب. اختار بين نسخة ستاندارد أو ألتيميت بحساب برايمري أو سيكندري.', 'Grand Theft Auto VI — قراند 6 المغرب — الأثمنة بالدرهم | NovaStream', 'أقوى عروض لعبة قراند 6 GTA VI على PS5 بنسخة ستاندارد وألتيميت (برايمري وسيكندري).', 'صورة عرض Grand Theft Auto VI — قراند 6'),
  -- Baldur's Gate 3
  ('22222222-2222-4222-8222-222222222209', 'en', 'Baldur''s Gate 3', 'Award-winning Dungeons & Dragons RPG for PS5 with Primary and Secondary options.', 'Gather your party and return to the Forgotten Realms in Baldur''s Gate 3 on PS5. Available with instant WhatsApp support.', 'Baldur''s Gate 3 Morocco — Prices in DH | NovaStream', 'Award-winning Dungeons & Dragons RPG for PS5 with Primary and Secondary options.', 'Baldur''s Gate 3 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222209', 'fr', 'Baldur''s Gate 3', 'Le RPG primé de l''univers Dungeons & Dragons sur PS5 en compte Principal ou Secondaire.', 'Rassemblez votre groupe et retournez dans les Royaumes Oubliés avec Baldur''s Gate 3 sur PS5. Assistance et livraison rapide via WhatsApp.', 'Baldur''s Gate 3 Maroc — Prix en DH | NovaStream', 'Le RPG primé de l''univers Dungeons & Dragons sur PS5 en compte Principal ou Secondaire.', 'Baldur''s Gate 3 Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222209', 'ar', 'Baldur''s Gate 3 — بلدورز غيت 3', 'لعبة الآر بي جي الأسطورية Baldur''s Gate 3 على PS5 بحساب برايمري أو سيكندري.', 'جمع الفريق ديالك وعيش مغامرة ملحمية فلعبة Baldur''s Gate 3 على PS5. متوفرة بحساب برايمري أو سيكندري مع تفعيل سريع عبر واتساب.', 'Baldur''s Gate 3 — بلدورز غيت 3 المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الآر بي جي الأسطورية Baldur''s Gate 3 على PS5 بحساب برايمري أو سيكندري.', 'صورة عرض Baldur''s Gate 3 — بلدورز غيت 3'),
  -- Forza Horizon 6
  ('22222222-2222-4222-8222-222222222210', 'en', 'Forza Horizon 6', 'Open-world racing festival on PS5 with Primary and Secondary account offers.', 'Explore breathtaking roads and cherry blossom landscapes in Forza Horizon 6 on PS5. Available in Primary and Secondary digital accounts.', 'Forza Horizon 6 Morocco — Prices in DH | NovaStream', 'Open-world racing festival on PS5 with Primary and Secondary account offers.', 'Forza Horizon 6 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222210', 'fr', 'Forza Horizon 6', 'Le festival automobile en monde ouvert sur PS5 en accès Principal ou Secondaire.', 'Parcourez des routes spectaculaires dans Forza Horizon 6 sur PS5. Disponible en compte numérique Principal ou Secondaire.', 'Forza Horizon 6 Maroc — Prix en DH | NovaStream', 'Le festival automobile en monde ouvert sur PS5 en accès Principal ou Secondaire.', 'Forza Horizon 6 Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222210', 'ar', 'Forza Horizon 6 — فورزا هورايزن 6', 'سباقات العالم المفتوح Forza Horizon 6 على PS5 بخيار برايمري أو سيكندري.', 'استمتع بأقوى سباقات السيارات فالعالم المفتوح مع Forza Horizon 6 على PS5. اختار حساب برايمري أو سيكندري بأحسن ثمن.', 'Forza Horizon 6 — فورزا هورايزن 6 المغرب — الأثمنة بالدرهم | NovaStream', 'سباقات العالم المفتوح Forza Horizon 6 على PS5 بخيار برايمري أو سيكندري.', 'صورة عرض Forza Horizon 6 — فورزا هورايزن 6'),
  -- Phantom Blade Zero
  ('22222222-2222-4222-8222-222222222211', 'en', 'Phantom Blade Zero', 'High-speed kungfupunk action RPG on PS5 with Primary and Secondary offers.', 'Master lethal martial arts and dark steampunk weaponry in Phantom Blade Zero on PS5. Choose Primary or Secondary account access.', 'Phantom Blade Zero Morocco — Prices in DH | NovaStream', 'High-speed kungfupunk action RPG on PS5 with Primary and Secondary offers.', 'Phantom Blade Zero 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222211', 'fr', 'Phantom Blade Zero', 'Action-RPG kungfupunk ultra-rapide sur PS5 en compte Principal ou Secondaire.', 'Maîtrisez les arts martiaux et des armes redoutables dans Phantom Blade Zero sur PS5. Formules Principal et Secondaire disponibles.', 'Phantom Blade Zero Maroc — Prix en DH | NovaStream', 'Action-RPG kungfupunk ultra-rapide sur PS5 en compte Principal ou Secondaire.', 'Phantom Blade Zero Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222211', 'ar', 'Phantom Blade Zero — فانتوم بليد زيرو', 'لعبة الأكشن والقتال السريع Phantom Blade Zero على PS5 بحساب برايمري أو سيكندري.', 'عش تجربة قتال السيوف والفنون القتالية السريعة فلعبة Phantom Blade Zero على PS5. متوفرة بحساب برايمري وسيكندري.', 'Phantom Blade Zero — فانتوم بليد زيرو المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الأكشن والقتال السريع Phantom Blade Zero على PS5 بحساب برايمري أو سيكندري.', 'صورة عرض Phantom Blade Zero — فانتوم بليد زيرو'),
  -- The Last of Us Part I
  ('22222222-2222-4222-8222-222222222212', 'en', 'The Last of Us Part I', 'Standard and Remastered editions of the emotional storytelling masterpiece.', 'Experience Joel and Ellie''s unforgettable journey across a post-pandemic world. Available in Standard and Remastered editions with Primary or Secondary access.', 'The Last of Us Part I Morocco — Prices in DH | NovaStream', 'Standard and Remastered editions of the emotional storytelling masterpiece.', 'The Last of Us Part I 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222212', 'fr', 'The Last of Us Part I', 'Éditions Standard et Remastered du chef-d''œuvre narratif sur PlayStation.', 'Revivez le voyage inoubliable de Joel et Ellie. Disponible en Édition Standard et Remastered avec accès Principal ou Secondaire.', 'The Last of Us Part I Maroc — Prix en DH | NovaStream', 'Éditions Standard et Remastered du chef-d''œuvre narratif sur PlayStation.', 'The Last of Us Part I Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222212', 'ar', 'The Last of Us Part I — ذا لاست أوف أس 1', 'تحفة القصص والبقاء The Last of Us Part I بنسخة ستاندارد و ريماسترد.', 'عيش القصة المؤثرة ديال جول وإيلي فلعبة The Last of Us Part I. متوفرة بنسخة ستاندارد أو ريماسترد بحساب برايمري أو سيكندري.', 'The Last of Us Part I — ذا لاست أوف أس 1 المغرب — الأثمنة بالدرهم | NovaStream', 'تحفة القصص والبقاء The Last of Us Part I بنسخة ستاندارد و ريماسترد.', 'صورة عرض The Last of Us Part I — ذا لاست أوف أس 1'),
  -- The Last of Us Part II
  ('22222222-2222-4222-8222-222222222213', 'en', 'The Last of Us Part II', 'Standard and Remastered editions for PS4 & PS5 in Primary and Secondary access.', 'Confront the devastating physical and emotional repercussions of Ellie''s actions in The Last of Us Part II. Choose Standard or Remastered Edition.', 'The Last of Us Part II Morocco — Prices in DH | NovaStream', 'Standard and Remastered editions for PS4 & PS5 in Primary and Secondary access.', 'The Last of Us Part II 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222213', 'fr', 'The Last of Us Part II', 'Éditions Standard et Remastered pour PS4 et PS5 en compte Principal ou Secondaire.', 'Découvrez la suite intense des aventures d''Ellie dans The Last of Us Part II en Édition Standard ou Remastered.', 'The Last of Us Part II Maroc — Prix en DH | NovaStream', 'Éditions Standard et Remastered pour PS4 et PS5 en compte Principal ou Secondaire.', 'The Last of Us Part II Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222213', 'ar', 'The Last of Us Part II — ذا لاست أوف أس 2', 'الجزء الثاني The Last of Us Part II بنسخة ستاندارد و ريماسترد لـ PS4 و PS5.', 'كمل المغامرة المشوقة ديال إيلي فـ The Last of Us Part II. اختار نسخة ستاندارد أو ريماسترد بحساب برايمري أو سيكندري.', 'The Last of Us Part II — ذا لاست أوف أس 2 المغرب — الأثمنة بالدرهم | NovaStream', 'الجزء الثاني The Last of Us Part II بنسخة ستاندارد و ريماسترد لـ PS4 و PS5.', 'صورة عرض The Last of Us Part II — ذا لاست أوف أس 2'),
  -- Ghost of Yotei
  ('22222222-2222-4222-8222-222222222214', 'en', 'Ghost of Yotei', 'Epic samurai adventure in northern Japan on PS5 — Standard & Deluxe Editions.', 'Embark on a cinematic open-world journey around Mount Yotei on PS5. Available in Standard and Deluxe Editions with Primary or Secondary access.', 'Ghost of Yotei Morocco — Prices in DH | NovaStream', 'Epic samurai adventure in northern Japan on PS5 — Standard & Deluxe Editions.', 'Ghost of Yotei 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222214', 'fr', 'Ghost of Yotei', 'Aventure samouraï épique au Japon sur PS5 — Éditions Standard et Deluxe.', 'Explorez les terres sauvages autour du mont Yotei sur PS5. Disponible en Édition Standard et Deluxe (Principal ou Secondaire).', 'Ghost of Yotei Maroc — Prix en DH | NovaStream', 'Aventure samouraï épique au Japon sur PS5 — Éditions Standard et Deluxe.', 'Ghost of Yotei Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222214', 'ar', 'Ghost of Yotei — غوست أوف يوتي', 'ملحمة الساموراي Ghost of Yotei على PS5 بنسخة ستاندارد وديلوكس.', 'استكشف عالم الساموراي المفتوح فلعبة Ghost of Yotei على PS5. متوفرة بنسخة ستاندارد وديلوكس بحساب برايمري أو سيكندري.', 'Ghost of Yotei — غوست أوف يوتي المغرب — الأثمنة بالدرهم | NovaStream', 'ملحمة الساموراي Ghost of Yotei على PS5 بنسخة ستاندارد وديلوكس.', 'صورة عرض Ghost of Yotei — غوست أوف يوتي'),
  -- Mortal Shell II
  ('22222222-2222-4222-8222-222222222215', 'en', 'Mortal Shell II', 'Dark fantasy soulslike action RPG on PS5 with Primary and Secondary accounts.', 'Test your resilience and tactical combat mastery in Mortal Shell II on PS5. Available with instant WhatsApp delivery.', 'Mortal Shell II Morocco — Prices in DH | NovaStream', 'Dark fantasy soulslike action RPG on PS5 with Primary and Secondary accounts.', 'Mortal Shell II 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222215', 'fr', 'Mortal Shell II', 'Action-RPG dark fantasy exigeant sur PS5 en compte Principal ou Secondaire.', 'Mettez vos réflexes à l''épreuve dans Mortal Shell II sur PS5. Livraison rapide et support sur WhatsApp.', 'Mortal Shell II Maroc — Prix en DH | NovaStream', 'Action-RPG dark fantasy exigeant sur PS5 en compte Principal ou Secondaire.', 'Mortal Shell II Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222215', 'ar', 'Mortal Shell II — مورتال شيل 2', 'لعبة السولز والأكشن المظلمة Mortal Shell II على PS5 بحساب برايمري أو سيكندري.', 'اختبر المهارات القتالية ديالك فلعبة السولز Mortal Shell II على PS5. متوفرة بحساب برايمري وسيكندري.', 'Mortal Shell II — مورتال شيل 2 المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة السولز والأكشن المظلمة Mortal Shell II على PS5 بحساب برايمري أو سيكندري.', 'صورة عرض Mortal Shell II — مورتال شيل 2'),
  -- Wo Long: Fallen Dynasty
  ('22222222-2222-4222-8222-222222222216', 'en', 'Wo Long: Fallen Dynasty', 'Dark Three Kingdoms action RPG for PS4 & PS5 with Primary and Secondary access.', 'Fight demons and warlords across a chaotic Three Kingdoms setting in Wo Long: Fallen Dynasty. Available in Primary and Secondary access.', 'Wo Long: Fallen Dynasty Morocco — Prices in DH | NovaStream', 'Dark Three Kingdoms action RPG for PS4 & PS5 with Primary and Secondary access.', 'Wo Long: Fallen Dynasty 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222216', 'fr', 'Wo Long: Fallen Dynasty', 'Action-RPG sombre des Trois Royaumes sur PS4 et PS5 en Principal ou Secondaire.', 'Affrontez des démons et des seigneurs de guerre dans Wo Long: Fallen Dynasty. Accès Principal ou Secondaire disponible.', 'Wo Long: Fallen Dynasty Maroc — Prix en DH | NovaStream', 'Action-RPG sombre des Trois Royaumes sur PS4 et PS5 en Principal ou Secondaire.', 'Wo Long: Fallen Dynasty Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222216', 'ar', 'Wo Long: Fallen Dynasty — وو لونغ', 'لعبة الأكشن والأساطير الصينية Wo Long: Fallen Dynasty لـ PS4 و PS5.', 'واجه الوحوش والمحاربين فلعبة الأكشن القوية Wo Long: Fallen Dynasty. متوفرة بحساب برايمري أو سيكندري.', 'Wo Long: Fallen Dynasty — وو لونغ المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الأكشن والأساطير الصينية Wo Long: Fallen Dynasty لـ PS4 و PS5.', 'صورة عرض Wo Long: Fallen Dynasty — وو لونغ'),
  -- The Witcher 3: Wild Hunt Remastered
  ('22222222-2222-4222-8222-222222222217', 'en', 'The Witcher 3: Wild Hunt Remastered', 'Next-gen remastered open-world RPG for PS5 with Primary and Secondary options.', 'Play as Geralt of Rivia in the remastered next-gen edition of The Witcher 3: Wild Hunt on PS5. Choose Primary or Secondary access.', 'The Witcher 3: Wild Hunt Remastered Morocco — Prices in DH | NovaStream', 'Next-gen remastered open-world RPG for PS5 with Primary and Secondary options.', 'The Witcher 3: Wild Hunt Remastered 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222217', 'fr', 'The Witcher 3: Wild Hunt Remastered', 'Le RPG culte en version Remastered nouvelle génération sur PS5.', 'Incarnez Geralt de Riv dans l''édition Remastered de The Witcher 3: Wild Hunt sur PS5 en compte Principal ou Secondaire.', 'The Witcher 3: Wild Hunt Remastered Maroc — Prix en DH | NovaStream', 'Le RPG culte en version Remastered nouvelle génération sur PS5.', 'The Witcher 3: Wild Hunt Remastered Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222217', 'ar', 'The Witcher 3 Remastered — ذا ويتشر 3', 'النسخة المحسنة ديال الأسطورة The Witcher 3: Wild Hunt على PS5.', 'عيش مغامرة جيرالت فنسخة الجيل الجديد المحسنة ديال The Witcher 3: Wild Hunt على PS5 بحساب برايمري أو سيكندري.', 'The Witcher 3 Remastered — ذا ويتشر 3 المغرب — الأثمنة بالدرهم | NovaStream', 'النسخة المحسنة ديال الأسطورة The Witcher 3: Wild Hunt على PS5.', 'صورة عرض The Witcher 3 Remastered — ذا ويتشر 3'),
  -- Palworld
  ('22222222-2222-4222-8222-222222222218', 'en', 'Palworld', 'Open-world creature collection, crafting, and survival game on PS5.', 'Explore vast islands, capture Pals, build bases, and team up with friends in Palworld Standard Edition on PS5.', 'Palworld Morocco — Prices in DH | NovaStream', 'Open-world creature collection, crafting, and survival game on PS5.', 'Palworld 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222218', 'fr', 'Palworld', 'Survie, construction et capture de créatures en monde ouvert sur PS5.', 'Explorez des îles immenses, capturez des Pals et construisez vos bases dans Palworld Édition Standard sur PS5.', 'Palworld Maroc — Prix en DH | NovaStream', 'Survie, construction et capture de créatures en monde ouvert sur PS5.', 'Palworld Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222218', 'ar', 'Palworld — بال وورلد', 'لعبة المغامرة وبناء القواعد وجمع المخلوقات Palworld على PS5.', 'استكشف عالم كبير، جمع الـ Pals وبني القاعدة ديالك فلعبة Palworld على PS5 بخيار برايمري أو سيكندري.', 'Palworld — بال وورلد المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة المغامرة وبناء القواعد وجمع المخلوقات Palworld على PS5.', 'صورة عرض Palworld — بال وورلد'),
  -- Sea of Thieves
  ('22222222-2222-4222-8222-222222222219', 'en', 'Sea of Thieves', 'Shared-world pirate adventure on PS5 — Standard Edition Primary & Secondary.', 'Set sail, plunder lost treasures, and battle rival crews on the high seas in Sea of Thieves Standard Edition for PS5.', 'Sea of Thieves Morocco — Prices in DH | NovaStream', 'Shared-world pirate adventure on PS5 — Standard Edition Primary & Secondary.', 'Sea of Thieves 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222219', 'fr', 'Sea of Thieves', 'L''aventure pirate multijoueur sur PS5 — Édition Standard Principal et Secondaire.', 'Prenez le large, cherchez des trésors et affrontez d''autres équipages dans Sea of Thieves Édition Standard sur PS5.', 'Sea of Thieves Maroc — Prix en DH | NovaStream', 'L''aventure pirate multijoueur sur PS5 — Édition Standard Principal et Secondaire.', 'Sea of Thieves Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222219', 'ar', 'Sea of Thieves — سي أوف ثيفز', 'مغامرات القراصنة والبحار أونلاين Sea of Thieves على PS5.', 'ركب السفينة ديالك وقلب على الكنوز فمغامرة القراصنة Sea of Thieves على PS5 بحساب برايمري أو سيكندري.', 'Sea of Thieves — سي أوف ثيفز المغرب — الأثمنة بالدرهم | NovaStream', 'مغامرات القراصنة والبحار أونلاين Sea of Thieves على PS5.', 'صورة عرض Sea of Thieves — سي أوف ثيفز'),
  -- Marvel's Wolverine
  ('22222222-2222-4222-8222-222222222220', 'en', 'Marvel''s Wolverine', ' blockbuster PS5 action adventure starring Logan in Primary and Secondary access.', 'Unleash adamantium claws in Marvel''s Wolverine on PS5. Choose between Primary account access (play on your personal profile) or Secondary account access.', 'Marvel''s Wolverine Morocco — Prices in DH | NovaStream', ' blockbuster PS5 action adventure starring Logan in Primary and Secondary access.', 'Marvel''s Wolverine 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222220', 'fr', 'Marvel''s Wolverine', 'Le blockbuster d''action exclusif PS5 avec Wolverine en accès Principal ou Secondaire.', 'Déchaînez la fureur de Logan dans Marvel''s Wolverine sur PS5. Disponible en compte Principal ou Secondaire avec livraison rapide.', 'Marvel''s Wolverine Maroc — Prix en DH | NovaStream', 'Le blockbuster d''action exclusif PS5 avec Wolverine en accès Principal ou Secondaire.', 'Marvel''s Wolverine Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222220', 'ar', 'Marvel''s Wolverine — وولفرين', 'لعبة الأكشن الحصرية Marvel''s Wolverine على PS5 بحساب برايمري أو سيكندري.', 'عيش تجربة أكشن خارقة مع لوغان فلعبة Marvel''s Wolverine على PS5. اختار حساب برايمري أو سيكندري وتوصل بيه دابا عبر واتساب.', 'Marvel''s Wolverine — وولفرين المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الأكشن الحصرية Marvel''s Wolverine على PS5 بحساب برايمري أو سيكندري.', 'صورة عرض Marvel''s Wolverine — وولفرين'),
  -- The Blood of Dawnwalker
  ('22222222-2222-4222-8222-222222222221', 'en', 'The Blood of Dawnwalker', 'Dark fantasy vampire action RPG for PS5 with Primary and Secondary options.', 'Step into a dark medieval world of steel and blood magic in The Blood of Dawnwalker on PS5. Available in Primary and Secondary accounts.', 'The Blood of Dawnwalker Morocco — Prices in DH | NovaStream', 'Dark fantasy vampire action RPG for PS5 with Primary and Secondary options.', 'The Blood of Dawnwalker 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222221', 'fr', 'The Blood of Dawnwalker', 'Action-RPG dark fantasy sur PS5 en compte Principal ou Secondaire.', 'Plongez dans un univers médiéval sombre avec The Blood of Dawnwalker sur PS5. Formules Principal et Secondaire disponibles.', 'The Blood of Dawnwalker Maroc — Prix en DH | NovaStream', 'Action-RPG dark fantasy sur PS5 en compte Principal ou Secondaire.', 'The Blood of Dawnwalker Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222221', 'ar', 'The Blood of Dawnwalker — داون ووكر', 'لعبة الفانتازيا المظلمة والأكشن The Blood of Dawnwalker على PS5.', 'اكتشف عالم مظلم عامر بالسحر والقتال فلعبة The Blood of Dawnwalker على PS5 بحساب برايمري أو سيكندري.', 'The Blood of Dawnwalker — داون ووكر المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الفانتازيا المظلمة والأكشن The Blood of Dawnwalker على PS5.', 'صورة عرض The Blood of Dawnwalker — داون ووكر'),
  -- Flight Simulator 2024
  ('22222222-2222-4222-8222-222222222222', 'en', 'Flight Simulator 2024', 'Next-generation aviation simulation with Primary and Secondary account options.', 'Pursue your aviation career across the globe with a dynamically generated world in Flight Simulator 2024. Choose Primary or Secondary access.', 'Flight Simulator 2024 Morocco — Prices in DH | NovaStream', 'Next-generation aviation simulation with Primary and Secondary account options.', 'Flight Simulator 2024 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222222', 'fr', 'Flight Simulator 2024', 'Simulation aérienne de nouvelle génération en compte Principal ou Secondaire.', 'Pilotez des avions d''exception à travers le monde entier dans Flight Simulator 2024. Disponible en accès Principal ou Secondaire.', 'Flight Simulator 2024 Maroc — Prix en DH | NovaStream', 'Simulation aérienne de nouvelle génération en compte Principal ou Secondaire.', 'Flight Simulator 2024 Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222222', 'ar', 'Flight Simulator 24 — محاكي الطيران', 'محاكي الطيران الواقعي Flight Simulator 24 بحساب برايمري أو سيكندري.', 'حلق فالسماء واكتشف العالم كامل بأدق التفاصيل مع Flight Simulator 24. متوفر بحساب برايمري أو سيكندري.', 'Flight Simulator 24 — محاكي الطيران المغرب — الأثمنة بالدرهم | NovaStream', 'محاكي الطيران الواقعي Flight Simulator 24 بحساب برايمري أو سيكندري.', 'صورة عرض Flight Simulator 24 — محاكي الطيران'),
  -- Sekiro: Shadows Die Twice
  ('22222222-2222-4222-8222-222222222223', 'en', 'Sekiro: Shadows Die Twice', 'Game of the Year shinobi action-adventure for PS4 & PS5.', 'Carve your own clever path to vengeance in FromSoftware''s acclaimed Sekiro: Shadows Die Twice. Available in Primary and Secondary access.', 'Sekiro: Shadows Die Twice Morocco — Prices in DH | NovaStream', 'Game of the Year shinobi action-adventure for PS4 & PS5.', 'Sekiro: Shadows Die Twice 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222223', 'fr', 'Sekiro: Shadows Die Twice', 'Le jeu d''action-aventure shinobi primé sur PS4 et PS5.', 'Tracez votre propre voie vers la vengeance dans Sekiro: Shadows Die Twice sur PS4 et PS5 en compte Principal ou Secondaire.', 'Sekiro: Shadows Die Twice Maroc — Prix en DH | NovaStream', 'Le jeu d''action-aventure shinobi primé sur PS4 et PS5.', 'Sekiro: Shadows Die Twice Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222223', 'ar', 'Sekiro: Shadows Die Twice — سيكيرو', 'لعبة الشينوبي والساموراي الشهيرة Sekiro: Shadows Die Twice لـ PS4 و PS5.', 'احترف قتال السيوف والنينجا فلعبة Sekiro: Shadows Die Twice على PS4 و PS5 بحساب برايمري أو سيكندري.', 'Sekiro: Shadows Die Twice — سيكيرو المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الشينوبي والساموراي الشهيرة Sekiro: Shadows Die Twice لـ PS4 و PS5.', 'صورة عرض Sekiro: Shadows Die Twice — سيكيرو'),
  -- Mount & Blade II: Bannerlord
  ('22222222-2222-4222-8222-222222222224', 'en', 'Mount & Blade II: Bannerlord', 'Medieval combat simulator and strategy RPG for PS4 & PS5.', 'Raise armies, lead troops into massive medieval battles, and conquer Calradia in Mount & Blade II: Bannerlord.', 'Mount & Blade II: Bannerlord Morocco — Prices in DH | NovaStream', 'Medieval combat simulator and strategy RPG for PS4 & PS5.', 'Mount & Blade II: Bannerlord 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222224', 'fr', 'Mount & Blade II: Bannerlord', 'RPG stratégique et combats médiévaux épiques sur PS4 et PS5.', 'Dirigez vos troupes dans d''immenses batailles médiévales avec Mount & Blade II: Bannerlord sur PS4 et PS5.', 'Mount & Blade II: Bannerlord Maroc — Prix en DH | NovaStream', 'RPG stratégique et combats médiévaux épiques sur PS4 et PS5.', 'Mount & Blade II: Bannerlord Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222224', 'ar', 'Mount & Blade II: Bannerlord', 'لعبة الحروب الاستراتيجية والقرون الوسطى Mount & Blade II: Bannerlord.', 'قود الجيوش ديالك فالمعارك الكبرى وابني الإمبراطورية ديالك فـ Mount & Blade II: Bannerlord بحساب برايمري أو سيكندري.', 'Mount & Blade II: Bannerlord المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الحروب الاستراتيجية والقرون الوسطى Mount & Blade II: Bannerlord.', 'صورة عرض Mount & Blade II: Bannerlord'),
  -- Alan Wake 2
  ('22222222-2222-4222-8222-222222222225', 'en', 'Alan Wake 2', 'Psychological survival horror masterpiece on PS5 — Standard Edition.', 'Solve a deadly mystery in the Pacific Northwest across two interwoven stories in Alan Wake 2 Standard Edition for PS5.', 'Alan Wake 2 Morocco — Prices in DH | NovaStream', 'Psychological survival horror masterpiece on PS5 — Standard Edition.', 'Alan Wake 2 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222225', 'fr', 'Alan Wake 2', 'Le chef-d''œuvre du survival-horror psychologique sur PS5 — Édition Standard.', 'Résolvez un mystère surnaturel captivant dans Alan Wake 2 Édition Standard sur PS5 en compte Principal ou Secondaire.', 'Alan Wake 2 Maroc — Prix en DH | NovaStream', 'Le chef-d''œuvre du survival-horror psychologique sur PS5 — Édition Standard.', 'Alan Wake 2 Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222225', 'ar', 'Alan Wake 2 — ألان ويك 2', 'لعبة الرعب النفسي والغموض Alan Wake 2 على PS5.', 'عيش تجربة رعب نفسي وتحقيقات غامضة فلعبة Alan Wake 2 على PS5 بحساب برايمري أو سيكندري.', 'Alan Wake 2 — ألان ويك 2 المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الرعب النفسي والغموض Alan Wake 2 على PS5.', 'صورة عرض Alan Wake 2 — ألان ويك 2'),
  -- Pragmata
  ('22222222-2222-4222-8222-222222222226', 'en', 'Pragmata', 'Capcom sci-fi action adventure on PS5 with Primary and Secondary accounts.', 'Explore a dystopian lunar world in Capcom''s breathtaking sci-fi adventure Pragmata on PS5.', 'Pragmata Morocco — Prices in DH | NovaStream', 'Capcom sci-fi action adventure on PS5 with Primary and Secondary accounts.', 'Pragmata 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222226', 'fr', 'Pragmata', 'L''aventure de science-fiction signée Capcom sur PS5 en Principal ou Secondaire.', 'Explorez un monde lunaire dystopique dans l''aventure de science-fiction Pragmata sur PS5.', 'Pragmata Maroc — Prix en DH | NovaStream', 'L''aventure de science-fiction signée Capcom sur PS5 en Principal ou Secondaire.', 'Pragmata Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222226', 'ar', 'Pragmata — براغماتا', 'مغامرة الخيال العلمي والفضاء Pragmata على PS5 بحساب برايمري أو سيكندري.', 'استكشف عالم المستقبل والقمر فلعبة الخيال العلمي Pragmata من Capcom على PS5 بحساب برايمري أو سيكندري.', 'Pragmata — براغماتا المغرب — الأثمنة بالدرهم | NovaStream', 'مغامرة الخيال العلمي والفضاء Pragmata على PS5 بحساب برايمري أو سيكندري.', 'صورة عرض Pragmata — براغماتا'),
  -- Assassin's Creed Shadows
  ('22222222-2222-4222-8222-222222222227', 'en', 'Assassin''s Creed Shadows', 'Feudal Japan shinobi and samurai epic on PS5 with Primary and Secondary access.', 'Live the intertwined stories of Naoe, an adept shinobi Assassin, and Yasuke, a powerful legendary samurai, in Assassin''s Creed Shadows on PS5.', 'Assassin''s Creed Shadows Morocco — Prices in DH | NovaStream', 'Feudal Japan shinobi and samurai epic on PS5 with Primary and Secondary access.', 'Assassin''s Creed Shadows 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222227', 'fr', 'Assassin''s Creed Shadows', 'L''épopée shinobi et samouraï au Japon féodal sur PS5 en Principal ou Secondaire.', 'Incarnez Naoe l''Assassin shinobi et Yasuke le puissant samouraï dans Assassin''s Creed Shadows sur PS5.', 'Assassin''s Creed Shadows Maroc — Prix en DH | NovaStream', 'L''épopée shinobi et samouraï au Japon féodal sur PS5 en Principal ou Secondaire.', 'Assassin''s Creed Shadows Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222227', 'ar', 'Assassin''s Creed Shadows — أساسنز كريد شادوز', 'مغامرة النينجا والساموراي فاليابان Assassin''s Creed Shadows على PS5.', 'عيش قصة الشينوبي ناوي والساموراي ياسوكي فاليابان الإقطاعية مع Assassin''s Creed Shadows على PS5 بحساب برايمري أو سيكندري.', 'Assassin''s Creed Shadows — أساسنز كريد شادوز المغرب — الأثمنة بالدرهم | NovaStream', 'مغامرة النينجا والساموراي فاليابان Assassin''s Creed Shadows على PS5.', 'صورة عرض Assassin''s Creed Shadows — أساسنز كريد شادوز'),
  -- Silent Hill: Townfall
  ('22222222-2222-4222-8222-222222222228', 'en', 'Silent Hill: Townfall', 'Psychological horror chapter in the Silent Hill universe on PS5.', 'Enter the fog once more in Silent Hill: Townfall on PS5. Available in Primary and Secondary account options with fast setup.', 'Silent Hill: Townfall Morocco — Prices in DH | NovaStream', 'Psychological horror chapter in the Silent Hill universe on PS5.', 'Silent Hill: Townfall 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222228', 'fr', 'Silent Hill: Townfall', 'Nouveau chapitre d''horreur psychologique Silent Hill sur PS5.', 'Plongez dans le brouillard avec Silent Hill: Townfall sur PS5 en compte Principal ou Secondaire.', 'Silent Hill: Townfall Maroc — Prix en DH | NovaStream', 'Nouveau chapitre d''horreur psychologique Silent Hill sur PS5.', 'Silent Hill: Townfall Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222228', 'ar', 'Silent Hill: Townfall — سايلنت هيل', 'فصل جديد من الرعب النفسي والضباب فـ Silent Hill: Townfall على PS5.', 'دخل لعالم الضباب والأسرار المرعبة فـ Silent Hill: Townfall على PS5 بحساب برايمري أو سيكندري.', 'Silent Hill: Townfall — سايلنت هيل المغرب — الأثمنة بالدرهم | NovaStream', 'فصل جديد من الرعب النفسي والضباب فـ Silent Hill: Townfall على PS5.', 'صورة عرض Silent Hill: Townfall — سايلنت هيل'),
  -- Assassin's Creed Black Flag Remake
  ('22222222-2222-4222-8222-222222222229', 'en', 'Assassin''s Creed Black Flag Remake', 'Next-gen remake of the Golden Age of Piracy classic on PS5.', 'Command the Jackdaw with Edward Kenway in the rebuilt next-gen Remake of Assassin''s Creed Black Flag on PS5.', 'Assassin''s Creed Black Flag Remake Morocco — Prices in DH | NovaStream', 'Next-gen remake of the Golden Age of Piracy classic on PS5.', 'Assassin''s Creed Black Flag Remake 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222229', 'fr', 'Assassin''s Creed Black Flag Remake', 'Le remake nouvelle génération du classique de la piraterie sur PS5.', 'Prenez la barre du Jackdaw avec Edward Kenway dans Assassin''s Creed Black Flag Remake sur PS5.', 'Assassin''s Creed Black Flag Remake Maroc — Prix en DH | NovaStream', 'Le remake nouvelle génération du classique de la piraterie sur PS5.', 'Assassin''s Creed Black Flag Remake Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222229', 'ar', 'Assassin''s Creed Black Flag Remake', 'ريميك لعبة القراصنة الأسطورية Assassin''s Creed Black Flag على PS5.', 'قود السفينة ديالك مع إدوارد كينواي فنسخة الريميك الجديدة ديال Assassin''s Creed Black Flag على PS5 بحساب برايمري أو سيكندري.', 'Assassin''s Creed Black Flag Remake المغرب — الأثمنة بالدرهم | NovaStream', 'ريميك لعبة القراصنة الأسطورية Assassin''s Creed Black Flag على PS5.', 'صورة عرض Assassin''s Creed Black Flag Remake'),
  -- 007 First Light
  ('22222222-2222-4222-8222-222222222230', 'en', '007 First Light', 'James Bond espionage action adventure on PS5 with Primary & Secondary access.', 'Earn your 00 status in IO Interactive''s original James Bond espionage thriller 007 First Light on PS5.', '007 First Light Morocco — Prices in DH | NovaStream', 'James Bond espionage action adventure on PS5 with Primary & Secondary access.', '007 First Light 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222230', 'fr', '007 First Light', 'L''aventure d''espionnage James Bond 007 sur PS5 en Principal ou Secondaire.', 'Découvrez les origines de l''agent 007 dans 007 First Light sur PS5. Disponible en compte Principal et Secondaire.', '007 First Light Maroc — Prix en DH | NovaStream', 'L''aventure d''espionnage James Bond 007 sur PS5 en Principal ou Secondaire.', '007 First Light Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222230', 'ar', '007 First Light — جيمس بوند 007', 'لعبة الجاسوسية والأكشن جيمس بوند 007 First Light على PS5.', 'عيش مهام التجسس والأكشن مع العميل السري جيمس بوند فـ 007 First Light على PS5 بحساب برايمري أو سيكندري.', '007 First Light — جيمس بوند 007 المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الجاسوسية والأكشن جيمس بوند 007 First Light على PS5.', 'صورة عرض 007 First Light — جيمس بوند 007'),
  -- ARC Raiders
  ('22222222-2222-4222-8222-222222222231', 'en', 'ARC Raiders', 'Sci-fi extraction shooter adventure on PS5 with Primary and Secondary accounts.', 'Enlist as a Raider and scavenge a lethal mechanized Earth in ARC Raiders on PS5. Available in Primary and Secondary access.', 'ARC Raiders Morocco — Prices in DH | NovaStream', 'Sci-fi extraction shooter adventure on PS5 with Primary and Secondary accounts.', 'ARC Raiders 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222231', 'fr', 'ARC Raiders', 'Shooter d''extraction sci-fi sur PS5 en compte Principal ou Secondaire.', 'combattez la menace mécanique ARC en escouade dans ARC Raiders sur PS5. Disponible en compte Principal ou Secondaire.', 'ARC Raiders Maroc — Prix en DH | NovaStream', 'Shooter d''extraction sci-fi sur PS5 en compte Principal ou Secondaire.', 'ARC Raiders Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222231', 'ar', 'ARC Raiders — أرك رايدرز', 'لعبة الشوتر والخيال العلمي الجماعية ARC Raiders على PS5.', 'حارب الآلات العملاقة مع الفريق ديالك فلعبة الشوتر ARC Raiders على PS5 بحساب برايمري أو سيكندري.', 'ARC Raiders — أرك رايدرز المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة الشوتر والخيال العلمي الجماعية ARC Raiders على PS5.', 'صورة عرض ARC Raiders — أرك رايدرز'),
  -- Resident Evil 4 Remake
  ('22222222-2222-4222-8222-222222222232', 'en', 'Resident Evil 4 Remake', 'Survival horror masterpiece for PS4 & PS5 — Standard Edition Primary & Secondary.', 'Relive Leon S. Kennedy''s harrowing rescue mission in Resident Evil 4 Remake. Available for both PS4 and PS5 with Primary or Secondary access.', 'Resident Evil 4 Remake Morocco — Prices in DH | NovaStream', 'Survival horror masterpiece for PS4 & PS5 — Standard Edition Primary & Secondary.', 'Resident Evil 4 Remake 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222232', 'fr', 'Resident Evil 4 Remake', 'Le chef-d''œuvre du survival-horror sur PS4 et PS5 en Principal ou Secondaire.', 'Suivez Leon S. Kennedy dans Resident Evil 4 Remake sur PS4 et PS5. Formules Principal et Secondaire aux meilleurs prix en DH.', 'Resident Evil 4 Remake Maroc — Prix en DH | NovaStream', 'Le chef-d''œuvre du survival-horror sur PS4 et PS5 en Principal ou Secondaire.', 'Resident Evil 4 Remake Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222232', 'ar', 'Resident Evil 4 Remake — ريزدنت إيفل 4', 'أسطورة الرعب والأكشن Resident Evil 4 Remake لـ PS4 و PS5.', 'عيش المهمة الأسطورية ديال ليون كينيدي فـ Resident Evil 4 Remake. متوفرة لـ PS4 و PS5 بحساب برايمري أو سيكندري.', 'Resident Evil 4 Remake — ريزدنت إيفل 4 المغرب — الأثمنة بالدرهم | NovaStream', 'أسطورة الرعب والأكشن Resident Evil 4 Remake لـ PS4 و PS5.', 'صورة عرض Resident Evil 4 Remake — ريزدنت إيفل 4'),
  -- Crimson Desert
  ('22222222-2222-4222-8222-222222222233', 'en', 'Crimson Desert', 'Open-world action-adventure across Pywel on PS5 — Standard & Deluxe Editions.', 'Fight for survival across the vast continent of Pywel in Crimson Desert on PS5. Choose Standard or Deluxe Edition in Primary or Secondary mode.', 'Crimson Desert Morocco — Prices in DH | NovaStream', 'Open-world action-adventure across Pywel on PS5 — Standard & Deluxe Editions.', 'Crimson Desert 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222233', 'fr', 'Crimson Desert', 'Action-aventure en monde ouvert sur PS5 — Éditions Standard et Deluxe.', 'Parcourez le continent déchiré de Pywel dans Crimson Desert sur PS5. Disponible en Édition Standard et Deluxe.', 'Crimson Desert Maroc — Prix en DH | NovaStream', 'Action-aventure en monde ouvert sur PS5 — Éditions Standard et Deluxe.', 'Crimson Desert Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222233', 'ar', 'Crimson Desert — كريمسون ديزرت', 'ملحمة العالم المفتوح والأكشن Crimson Desert على PS5 بنسخة ستاندارد وديلوكس.', 'استكشف قارة بايويل الضخمة وخوض معارك ملحمية فـ Crimson Desert على PS5 بنسخة ستاندارد أو ديلوكس.', 'Crimson Desert — كريمسون ديزرت المغرب — الأثمنة بالدرهم | NovaStream', 'ملحمة العالم المفتوح والأكشن Crimson Desert على PS5 بنسخة ستاندارد وديلوكس.', 'صورة عرض Crimson Desert — كريمسون ديزرت'),
  -- Black Myth: Wukong
  ('22222222-2222-4222-8222-222222222234', 'en', 'Black Myth: Wukong', 'Action RPG rooted in Chinese mythology on PS5 — Standard & Deluxe Editions.', 'Set out as the Destined One in Black Myth: Wukong on PS5. Available in Standard and Deluxe Editions with Primary or Secondary access.', 'Black Myth: Wukong Morocco — Prices in DH | NovaStream', 'Action RPG rooted in Chinese mythology on PS5 — Standard & Deluxe Editions.', 'Black Myth: Wukong 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222234', 'fr', 'Black Myth: Wukong', 'Action-RPG inspiré de la mythologie chinoise sur PS5 — Standard et Deluxe.', 'Incarnez le Prédestiné dans Black Myth: Wukong sur PS5 en Édition Standard ou Deluxe (compte Principal ou Secondaire).', 'Black Myth: Wukong Maroc — Prix en DH | NovaStream', 'Action-RPG inspiré de la mythologie chinoise sur PS5 — Standard et Deluxe.', 'Black Myth: Wukong Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222234', 'ar', 'Black Myth: Wukong — بلاك ميث ووكونغ', 'أسطورة الملك القرد Black Myth: Wukong على PS5 بنسخة ستاندارد وديلوكس.', 'انطلق فمغامرة أسطورية مليئة بالزعماء الأقوياء فلعبة Black Myth: Wukong على PS5 بنسخة ستاندارد أو ديلوكس.', 'Black Myth: Wukong — بلاك ميث ووكونغ المغرب — الأثمنة بالدرهم | NovaStream', 'أسطورة الملك القرد Black Myth: Wukong على PS5 بنسخة ستاندارد وديلوكس.', 'صورة عرض Black Myth: Wukong — بلاك ميث ووكونغ'),
  -- Rust Console Edition
  ('22222222-2222-4222-8222-222222222235', 'en', 'Rust Console Edition', 'Survive, build, and raid in Rust Console Edition for PS4 & PS5.', 'Everything wants you to die — overcome thirst, hunger, and other players in Rust Console Edition. Available in Primary and Secondary access.', 'Rust Console Edition Morocco — Prices in DH | NovaStream', 'Survive, build, and raid in Rust Console Edition for PS4 & PS5.', 'Rust Console Edition 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222235', 'fr', 'Rust Édition Console', 'Survivez, construisez et dominez dans Rust Édition Console sur PS4 et PS5.', 'Bâtissez votre forteresse et survivez face aux autres joueurs dans Rust Édition Console en accès Principal ou Secondaire.', 'Rust Édition Console Maroc — Prix en DH | NovaStream', 'Survivez, construisez et dominez dans Rust Édition Console sur PS4 et PS5.', 'Rust Édition Console Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222235', 'ar', 'Rust Console Edition — راست', 'لعبة البقاء وبناء القواعد الجماعية Rust Console Edition لـ PS4 و PS5.', 'واجه التحديات، بني القاعدة ديالك ودافع عليها فلعبة البقاء الشهيرة Rust Console Edition بحساب برايمري أو سيكندري.', 'Rust Console Edition — راست المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة البقاء وبناء القواعد الجماعية Rust Console Edition لـ PS4 و PS5.', 'صورة عرض Rust Console Edition — راست'),
  -- Call of Duty: Modern Warfare 4
  ('22222222-2222-4222-8222-222222222236', 'en', 'Call of Duty: Modern Warfare 4', 'Tactical first-person shooter campaign and multiplayer on PS5.', 'Lock and load for next-generation tactical combat and multiplayer action in Call of Duty: Modern Warfare 4 on PS5.', 'Call of Duty: Modern Warfare 4 Morocco — Prices in DH | NovaStream', 'Tactical first-person shooter campaign and multiplayer on PS5.', 'Call of Duty: Modern Warfare 4 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222236', 'fr', 'Call of Duty: Modern Warfare 4', 'Campagne intense et multijoueur compétitif Call of Duty sur PS5.', 'Préparez-vous au combat tactique nouvelle génération dans Call of Duty: Modern Warfare 4 sur PS5 en compte Principal ou Secondaire.', 'Call of Duty: Modern Warfare 4 Maroc — Prix en DH | NovaStream', 'Campagne intense et multijoueur compétitif Call of Duty sur PS5.', 'Call of Duty: Modern Warfare 4 Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222236', 'ar', 'Call of Duty: Modern Warfare 4', 'أقوى ألعاب الحروب والأكشن Call of Duty: Modern Warfare 4 على PS5.', 'استعد لأقوى المعارك والطور الجماعي فلعبة Call of Duty: Modern Warfare 4 على PS5 بحساب برايمري أو سيكندري.', 'Call of Duty: Modern Warfare 4 المغرب — الأثمنة بالدرهم | NovaStream', 'أقوى ألعاب الحروب والأكشن Call of Duty: Modern Warfare 4 على PS5.', 'صورة عرض Call of Duty: Modern Warfare 4'),
  -- Resident Evil 9: Requiem
  ('22222222-2222-4222-8222-222222222237', 'en', 'Resident Evil 9: Requiem', 'Next chapter of survival horror on PS5 — Standard & Deluxe Editions.', 'Face terrifying new bio-organic threats in Resident Evil 9: Requiem on PS5. Available in Standard and Deluxe Editions.', 'Resident Evil 9: Requiem Morocco — Prices in DH | NovaStream', 'Next chapter of survival horror on PS5 — Standard & Deluxe Editions.', 'Resident Evil 9: Requiem 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222237', 'fr', 'Resident Evil 9: Requiem', 'Le nouveau chapitre du survival-horror sur PS5 — Éditions Standard et Deluxe.', 'Affrontez l''horreur absolue dans Resident Evil 9: Requiem sur PS5. Disponible en Édition Standard ou Deluxe.', 'Resident Evil 9: Requiem Maroc — Prix en DH | NovaStream', 'Le nouveau chapitre du survival-horror sur PS5 — Éditions Standard et Deluxe.', 'Resident Evil 9: Requiem Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222237', 'ar', 'Resident Evil 9: Requiem — ريزدنت إيفل 9', 'الجزء الجديد ديال الرعب والبقاء Resident Evil 9: Requiem على PS5.', 'واجه رعب غير مسبوق فالإصدار الجديد Resident Evil 9: Requiem على PS5 بنسخة ستاندارد أو ديلوكس (برايمري وسيكندري).', 'Resident Evil 9: Requiem — ريزدنت إيفل 9 المغرب — الأثمنة بالدرهم | NovaStream', 'الجزء الجديد ديال الرعب والبقاء Resident Evil 9: Requiem على PS5.', 'صورة عرض Resident Evil 9: Requiem — ريزدنت إيفل 9'),
  -- It Takes Two + A Way Out (2-Game Bundle)
  ('22222222-2222-4222-8222-222222222238', 'en', 'It Takes Two + A Way Out (2-Game Bundle)', 'Two acclaimed co-op games in a single PS4 & PS5 account (Primary & Secondary).', 'Get both Hazelight co-op hits — It Takes Two and A Way Out — bundled together in one digital account for PS4 & PS5.', 'It Takes Two + A Way Out (2-Game Bundle) Morocco — Prices in DH | NovaStream', 'Two acclaimed co-op games in a single PS4 & PS5 account (Primary & Secondary).', 'It Takes Two + A Way Out (2-Game Bundle) 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222238', 'fr', 'Pack 2 Jeux : It Takes Two + A Way Out', 'Deux jeux coopératifs incontournables dans un seul compte PS4 et PS5.', 'Profitez des deux chefs-d''œuvre coopératifs It Takes Two et A Way Out réunis dans un seul compte pour PS4 et PS5.', 'Pack 2 Jeux : It Takes Two + A Way Out Maroc — Prix en DH | NovaStream', 'Deux jeux coopératifs incontournables dans un seul compte PS4 et PS5.', 'Pack 2 Jeux : It Takes Two + A Way Out Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222238', 'ar', 'جوج ألعاب فحساب واحد: It Takes Two + A Way Out', 'جوج ألعاب تعاونية رائعة فحساب واحد لـ PS4 و PS5 بخيار برايمري أو سيكندري.', 'استافد من جوج ألعاب فحساب واحد (It Takes Two + A Way Out) على PS4 و PS5. أحسن عرض باش تلعب مع صاحبك بحساب برايمري أو سيكندري.', 'جوج ألعاب فحساب واحد: It Takes Two + A Way Out المغرب — الأثمنة بالدرهم | NovaStream', 'جوج ألعاب تعاونية رائعة فحساب واحد لـ PS4 و PS5 بخيار برايمري أو سيكندري.', 'صورة عرض جوج ألعاب فحساب واحد: It Takes Two + A Way Out'),
  -- Elden Ring
  ('22222222-2222-4222-8222-222222222239', 'en', 'Elden Ring', 'Rise, Tarnished, and claim the Elden Ring on PS4 & PS5 in Primary or Secondary.', 'Journey through the Lands Between in FromSoftware''s monumental fantasy action-RPG Elden Ring. Available with Primary and Secondary account options.', 'Elden Ring Morocco — Prices in DH | NovaStream', 'Rise, Tarnished, and claim the Elden Ring on PS4 & PS5 in Primary or Secondary.', 'Elden Ring 1:1 Offer Cover (EN)'),
  ('22222222-2222-4222-8222-222222222239', 'fr', 'Elden Ring', 'Explorez l''Entre-terre dans Elden Ring sur PS4 et PS5 en Principal ou Secondaire.', 'Parcourez l''Entre-terre et devenez Seigneur d''Elden sur PS4 et PS5. Disponible en compte Principal ou Secondaire.', 'Elden Ring Maroc — Prix en DH | NovaStream', 'Explorez l''Entre-terre dans Elden Ring sur PS4 et PS5 en Principal ou Secondaire.', 'Elden Ring Offre 1:1 (FR)'),
  ('22222222-2222-4222-8222-222222222239', 'ar', 'Elden Ring — إلدن رينغ', 'لعبة العالم المفتوح والسولز الأسطورية Elden Ring لـ PS4 و PS5.', 'استكشف عالم الأراضي الوسطى الشاسع فلعبة Elden Ring على PS4 و PS5 بحساب برايمري أو سيكندري وبأحسن ثمن فالمغرب.', 'Elden Ring — إلدن رينغ المغرب — الأثمنة بالدرهم | NovaStream', 'لعبة العالم المفتوح والسولز الأسطورية Elden Ring لـ PS4 و PS5.', 'صورة عرض Elden Ring — إلدن رينغ')
ON CONFLICT (service_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  image_alt = EXCLUDED.image_alt;

-- 5. Insert Service Variants for All 33 New Offers
INSERT INTO public.service_variants (
  id, service_id, sku, label, platform, edition, tier, duration_months, access_type, price_mad, sale_price_mad, is_available, sort_order
) VALUES
  ('33333333-3333-4333-8333-333333333401', '22222222-2222-4222-8222-222222222207', 'FC27-PS4-STD-SEC', 'PS4 Standard Secondary', 'PS4', 'Standard', NULL, NULL, 'Secondary', 100, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333402', '22222222-2222-4222-8222-222222222207', 'FC27-PS4-STD-PRI', 'PS4 Standard Primary', 'PS4', 'Standard', NULL, NULL, 'Primary', 140, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333403', '22222222-2222-4222-8222-222222222207', 'FC27-PS4-ULT-SEC', 'PS4 Ultimate Secondary', 'PS4', 'Ultimate', NULL, NULL, 'Secondary', 120, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333404', '22222222-2222-4222-8222-222222222207', 'FC27-PS4-ULT-PRI', 'PS4 Ultimate Primary', 'PS4', 'Ultimate', NULL, NULL, 'Primary', 150, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333405', '22222222-2222-4222-8222-222222222207', 'FC27-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 150, NULL, TRUE, 5),
  ('33333333-3333-4333-8333-333333333406', '22222222-2222-4222-8222-222222222207', 'FC27-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 300, NULL, TRUE, 6),
  ('33333333-3333-4333-8333-333333333407', '22222222-2222-4222-8222-222222222207', 'FC27-PS5-ULT-SEC', 'PS5 Ultimate Secondary', 'PS5', 'Ultimate', NULL, NULL, 'Secondary', 200, NULL, TRUE, 7),
  ('33333333-3333-4333-8333-333333333408', '22222222-2222-4222-8222-222222222207', 'FC27-PS5-ULT-PRI', 'PS5 Ultimate Primary', 'PS5', 'Ultimate', NULL, NULL, 'Primary', 350, NULL, TRUE, 8),
  ('33333333-3333-4333-8333-333333333409', '22222222-2222-4222-8222-222222222208', 'GTA6-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 400, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333410', '22222222-2222-4222-8222-222222222208', 'GTA6-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 600, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333411', '22222222-2222-4222-8222-222222222208', 'GTA6-PS5-ULT-SEC', 'PS5 Ultimate Secondary', 'PS5', 'Ultimate', NULL, NULL, 'Secondary', 500, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333412', '22222222-2222-4222-8222-222222222208', 'GTA6-PS5-ULT-PRI', 'PS5 Ultimate Primary', 'PS5', 'Ultimate', NULL, NULL, 'Primary', 750, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333413', '22222222-2222-4222-8222-222222222209', 'BG3-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 160, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333414', '22222222-2222-4222-8222-222222222209', 'BG3-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 290, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333415', '22222222-2222-4222-8222-222222222210', 'FH6-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 250, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333416', '22222222-2222-4222-8222-222222222210', 'FH6-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 380, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333417', '22222222-2222-4222-8222-222222222211', 'PBZ-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 250, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333418', '22222222-2222-4222-8222-222222222211', 'PBZ-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 350, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333419', '22222222-2222-4222-8222-222222222211', 'PBZ-PS5-PRE-PRI', 'PS5 Pre-Order Edition Primary', 'PS5', 'Pre-Order', NULL, NULL, 'Primary', 400, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333420', '22222222-2222-4222-8222-222222222212', 'TLOU1-STD-SEC', 'Standard Secondary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Secondary', 100, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333421', '22222222-2222-4222-8222-222222222212', 'TLOU1-STD-PRI', 'Standard Primary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Primary', 170, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333422', '22222222-2222-4222-8222-222222222212', 'TLOU1-REM-SEC', 'Remastered Secondary', 'PS5', 'Remastered', NULL, NULL, 'Secondary', 130, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333423', '22222222-2222-4222-8222-222222222212', 'TLOU1-REM-PRI', 'Remastered Primary', 'PS5', 'Remastered', NULL, NULL, 'Primary', 230, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333424', '22222222-2222-4222-8222-222222222213', 'TLOU2-STD-SEC', 'Standard Secondary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Secondary', 120, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333425', '22222222-2222-4222-8222-222222222213', 'TLOU2-STD-PRI', 'Standard Primary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Primary', 220, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333426', '22222222-2222-4222-8222-222222222213', 'TLOU2-REM-SEC', 'Remastered Secondary', 'PS5', 'Remastered', NULL, NULL, 'Secondary', 140, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333427', '22222222-2222-4222-8222-222222222213', 'TLOU2-REM-PRI', 'Remastered Primary', 'PS5', 'Remastered', NULL, NULL, 'Primary', 240, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333428', '22222222-2222-4222-8222-222222222214', 'GOY-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 120, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333429', '22222222-2222-4222-8222-222222222214', 'GOY-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 220, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333430', '22222222-2222-4222-8222-222222222214', 'GOY-PS5-DLX-SEC', 'PS5 Deluxe Secondary', 'PS5', 'Deluxe', NULL, NULL, 'Secondary', 150, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333431', '22222222-2222-4222-8222-222222222214', 'GOY-PS5-DLX-PRI', 'PS5 Deluxe Primary', 'PS5', 'Deluxe', NULL, NULL, 'Primary', 250, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333432', '22222222-2222-4222-8222-222222222215', 'MS2-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 160, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333433', '22222222-2222-4222-8222-222222222215', 'MS2-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 300, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333434', '22222222-2222-4222-8222-222222222216', 'WL-PS5-STD-SEC', 'PS4 & PS5 Secondary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Secondary', 140, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333435', '22222222-2222-4222-8222-222222222216', 'WL-PS5-STD-PRI', 'PS4 & PS5 Primary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Primary', 240, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333436', '22222222-2222-4222-8222-222222222217', 'TW3-PS5-REM-SEC', 'PS5 Remastered Secondary', 'PS5', 'Remastered', NULL, NULL, 'Secondary', 150, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333437', '22222222-2222-4222-8222-222222222217', 'TW3-PS5-REM-PRI', 'PS5 Remastered Primary', 'PS5', 'Remastered', NULL, NULL, 'Primary', 250, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333438', '22222222-2222-4222-8222-222222222218', 'PAL-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 130, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333439', '22222222-2222-4222-8222-222222222218', 'PAL-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 230, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333440', '22222222-2222-4222-8222-222222222219', 'SOT-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 130, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333441', '22222222-2222-4222-8222-222222222219', 'SOT-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 230, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333442', '22222222-2222-4222-8222-222222222220', 'WLV-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 170, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333443', '22222222-2222-4222-8222-222222222220', 'WLV-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 300, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333444', '22222222-2222-4222-8222-222222222221', 'TBD-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 220, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333445', '22222222-2222-4222-8222-222222222221', 'TBD-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 320, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333446', '22222222-2222-4222-8222-222222222222', 'FS24-STD-SEC', 'Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 230, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333447', '22222222-2222-4222-8222-222222222222', 'FS24-STD-PRI', 'Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 380, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333448', '22222222-2222-4222-8222-222222222223', 'SEK-PS5-STD-SEC', 'PS4 & PS5 Secondary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Secondary', 120, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333449', '22222222-2222-4222-8222-222222222223', 'SEK-PS5-STD-PRI', 'PS4 & PS5 Primary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Primary', 180, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333450', '22222222-2222-4222-8222-222222222224', 'MB2-PS5-STD-SEC', 'PS4 & PS5 Secondary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Secondary', 130, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333451', '22222222-2222-4222-8222-222222222224', 'MB2-PS5-STD-PRI', 'PS4 & PS5 Primary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Primary', 180, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333452', '22222222-2222-4222-8222-222222222225', 'AW2-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 130, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333453', '22222222-2222-4222-8222-222222222225', 'AW2-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 180, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333454', '22222222-2222-4222-8222-222222222226', 'PRG-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 160, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333455', '22222222-2222-4222-8222-222222222226', 'PRG-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 250, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333456', '22222222-2222-4222-8222-222222222227', 'ACS-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 140, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333457', '22222222-2222-4222-8222-222222222227', 'ACS-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 200, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333458', '22222222-2222-4222-8222-222222222228', 'SHT-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 120, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333459', '22222222-2222-4222-8222-222222222228', 'SHT-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 220, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333460', '22222222-2222-4222-8222-222222222229', 'ACBF-PS5-STD-SEC', 'PS5 Remake Secondary', 'PS5', 'Remake', NULL, NULL, 'Secondary', 190, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333461', '22222222-2222-4222-8222-222222222229', 'ACBF-PS5-STD-PRI', 'PS5 Remake Primary', 'PS5', 'Remake', NULL, NULL, 'Primary', 250, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333462', '22222222-2222-4222-8222-222222222230', '007-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 170, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333463', '22222222-2222-4222-8222-222222222230', '007-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 270, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333464', '22222222-2222-4222-8222-222222222231', 'ARC-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 160, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333465', '22222222-2222-4222-8222-222222222231', 'ARC-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 260, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333466', '22222222-2222-4222-8222-222222222232', 'RE4-PS4-STD-SEC', 'PS4 Standard Secondary', 'PS4', 'Standard', NULL, NULL, 'Secondary', 110, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333467', '22222222-2222-4222-8222-222222222232', 'RE4-PS4-STD-PRI', 'PS4 Standard Primary', 'PS4', 'Standard', NULL, NULL, 'Primary', 170, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333468', '22222222-2222-4222-8222-222222222232', 'RE4-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 140, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333469', '22222222-2222-4222-8222-222222222232', 'RE4-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 190, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333470', '22222222-2222-4222-8222-222222222233', 'CD-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 100, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333471', '22222222-2222-4222-8222-222222222233', 'CD-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 180, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333472', '22222222-2222-4222-8222-222222222233', 'CD-PS5-DLX-SEC', 'PS5 Deluxe Secondary', 'PS5', 'Deluxe', NULL, NULL, 'Secondary', 140, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333473', '22222222-2222-4222-8222-222222222233', 'CD-PS5-DLX-PRI', 'PS5 Deluxe Primary', 'PS5', 'Deluxe', NULL, NULL, 'Primary', 230, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333474', '22222222-2222-4222-8222-222222222234', 'BMW-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 120, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333475', '22222222-2222-4222-8222-222222222234', 'BMW-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 170, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333476', '22222222-2222-4222-8222-222222222234', 'BMW-PS5-DLX-SEC', 'PS5 Deluxe Secondary', 'PS5', 'Deluxe', NULL, NULL, 'Secondary', 140, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333477', '22222222-2222-4222-8222-222222222234', 'BMW-PS5-DLX-PRI', 'PS5 Deluxe Primary', 'PS5', 'Deluxe', NULL, NULL, 'Primary', 240, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333478', '22222222-2222-4222-8222-222222222235', 'RST-PS5-STD-SEC', 'Console Secondary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Secondary', 120, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333479', '22222222-2222-4222-8222-222222222235', 'RST-PS5-STD-PRI', 'Console Primary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Primary', 250, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333480', '22222222-2222-4222-8222-222222222236', 'MW4-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 250, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333481', '22222222-2222-4222-8222-222222222236', 'MW4-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 450, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333482', '22222222-2222-4222-8222-222222222237', 'RE9-PS5-STD-SEC', 'PS5 Standard Secondary', 'PS5', 'Standard', NULL, NULL, 'Secondary', 100, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333483', '22222222-2222-4222-8222-222222222237', 'RE9-PS5-STD-PRI', 'PS5 Standard Primary', 'PS5', 'Standard', NULL, NULL, 'Primary', 200, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333484', '22222222-2222-4222-8222-222222222237', 'RE9-PS5-DLX-SEC', 'PS5 Deluxe Secondary', 'PS5', 'Deluxe', NULL, NULL, 'Secondary', 150, NULL, TRUE, 3),
  ('33333333-3333-4333-8333-333333333485', '22222222-2222-4222-8222-222222222237', 'RE9-PS5-DLX-PRI', 'PS5 Deluxe Primary', 'PS5', 'Deluxe', NULL, NULL, 'Primary', 250, NULL, TRUE, 4),
  ('33333333-3333-4333-8333-333333333486', '22222222-2222-4222-8222-222222222238', 'BND-COOP-SEC', 'PS4 & PS5 Bundle Secondary', 'PS4 / PS5', '2-Game Bundle', NULL, NULL, 'Secondary', 150, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333487', '22222222-2222-4222-8222-222222222238', 'BND-COOP-PRI', 'PS4 & PS5 Bundle Primary', 'PS4 / PS5', '2-Game Bundle', NULL, NULL, 'Primary', 250, NULL, TRUE, 2),
  ('33333333-3333-4333-8333-333333333488', '22222222-2222-4222-8222-222222222239', 'ELD-PS5-STD-SEC', 'PS4 & PS5 Secondary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Secondary', 150, NULL, TRUE, 1),
  ('33333333-3333-4333-8333-333333333489', '22222222-2222-4222-8222-222222222239', 'ELD-PS5-STD-PRI', 'PS4 & PS5 Primary', 'PS4 / PS5', 'Standard', NULL, NULL, 'Primary', 250, NULL, TRUE, 2)
ON CONFLICT (id) DO UPDATE SET
  price_mad = EXCLUDED.price_mad,
  sale_price_mad = EXCLUDED.sale_price_mad,
  is_available = EXCLUDED.is_available,
  sort_order = EXCLUDED.sort_order;
