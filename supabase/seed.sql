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
