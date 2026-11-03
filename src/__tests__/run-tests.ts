import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import enMessages from '../i18n/messages/en.json';
import frMessages from '../i18n/messages/fr.json';
import arMessages from '../i18n/messages/ar.json';
import {
  formatAccessType,
  formatDurationMonths,
  formatMadPrice,
  getTranslationFallbackOrder,
  localizeOfferImagePath,
} from '../lib/formatters';
import {
  checkOptionCompatibility,
  computeServicePriceSummary,
  extractServiceVariantDimensions,
  getEffectiveVariantPriceMad,
  resolveExactVariant,
} from '../lib/catalog/pricing';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
} from '../lib/whatsapp';
import {
  serviceUpsertSchema,
  serviceVariantInputSchema,
  validateImageUpload,
} from '../lib/validations/catalog';
import {
  getPublicServices,
  getPublicSiteSettings,
  resolveLocalizedService,
} from '../lib/catalog/repository';
import { SEED_SERVICES, SEED_VARIANTS } from '../lib/catalog/seed-data';

function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...collectKeys(v as Record<string, unknown>, full));
    } else {
      keys.push(full);
    }
  }
  return keys.sort();
}

async function runAllTests() {
  let passed = 0;
  function test(name: string, fn: () => void | Promise<void>) {
    return Promise.resolve(fn()).then(() => {
      passed++;
      console.log(`  ✓ ${name}`);
    });
  }

  console.log('=== NovaStream Automated Test Suite ===\n');

  // 1. Localization & Moroccan Darija Tests
  await test('1. Localization files (en, fr, ar) have 100% identical key structure', () => {
    const enKeys = collectKeys(enMessages);
    const frKeys = collectKeys(frMessages);
    const arKeys = collectKeys(arMessages);
    assert.deepEqual(enKeys, frKeys, 'EN and FR keys must match');
    assert.deepEqual(enKeys, arKeys, 'EN and AR keys must match');
  });

  await test('2. Moroccan Darija (ar) uses authentic Moroccan Darija phrases in Arabic script', () => {
    assert.equal(arMessages.hero.badge, 'مرحبا بيك فـ NovaStream');
    assert.equal(arMessages.hero.primaryCta, 'شوف الخدمات');
    assert.equal(arMessages.catalog.orderOnWhatsapp, 'طلب عبر واتساب');
    assert.equal(arMessages.catalog.viewDetails, 'شوف التفاصيل');
    assert.equal(arMessages.catalog.searchPlaceholder, 'قلّب على شي خدمة');
    assert.equal(arMessages.catalog.available, 'متوفر');
    assert.equal(arMessages.catalog.unavailable, 'ما متوفرش دابا');
    assert.equal(arMessages.serviceDetail.primary, 'برايمري');
    assert.equal(arMessages.serviceDetail.secondary, 'سيكندري');
    assert.equal(arMessages.nav.contact, 'تواصل معانا');
    assert.equal(arMessages.serviceDetail.choosePlatform, 'اختار البلاط فورم ديالك');
    assert.equal(arMessages.catalog.emptyTitle, 'ما لقيناش هاد الخدمة');
  });

  await test('3. Translation fallback order prioritizes Requested -> French -> English and flags missing locales', () => {
    assert.deepEqual(getTranslationFallbackOrder('ar'), ['ar', 'fr', 'en']);
    assert.deepEqual(getTranslationFallbackOrder('fr'), ['fr', 'en']);
    assert.deepEqual(getTranslationFallbackOrder('en'), ['en', 'fr']);

    const draftService = SEED_SERVICES.find(
      (s) => s.slug === 'creative-studio-pro-suite'
    )!;
    const resolved = resolveLocalizedService(
      draftService,
      [
        {
          service_id: draftService.id,
          locale: 'en',
          name: 'Draft English Only',
          short_description: null,
          description: null,
          seo_title: null,
          seo_description: null,
          image_alt: null,
        },
      ],
      [],
      undefined,
      'ar'
    );
    assert.equal(resolved.resolvedLocale, 'en');
    assert.deepEqual(resolved.missingLocales, ['fr', 'ar']);
  });

  // 2. Dynamic Variant Pricing & Selector Logic Tests
  await test('4. Dynamic variant dimensions omit Primary/Secondary when irrelevant (e.g. Music Subscription)', () => {
    const musicVariants = SEED_VARIANTS.filter(
      (v) => v.service_id === '22222222-2222-4222-8222-222222222204'
    );
    const dims = extractServiceVariantDimensions(musicVariants);
    assert.equal(dims.accessTypes.length, 0, 'Music subscription must not show Primary/Secondary');
    assert.equal(dims.platforms.length, 0, 'Music subscription must not show console platforms');
    assert.deepEqual(dims.editions, ['Individual']);
    assert.deepEqual(dims.durations, [1, 3, 12]);
  });

  await test('5. PlayStation Plus variants resolve exact MAD prices and never fabricate invalid combinations', () => {
    const psPlusVariants = SEED_VARIANTS.filter(
      (v) => v.service_id === '22222222-2222-4222-8222-222222222201'
    );
    const dims = extractServiceVariantDimensions(psPlusVariants);

    // Valid PS5 Extra Primary 12M -> 350 DH
    const validMatch = resolveExactVariant(
      psPlusVariants,
      {
        platform: 'PS5',
        tier: 'Extra',
        duration_months: 12,
        access_type: 'Primary',
      },
      dims
    );
    assert.ok(validMatch, 'Valid combination must resolve');
    assert.equal(getEffectiveVariantPriceMad(validMatch), 350);

    // Invalid combination (PS4 Premium does not exist in seed) -> must return null, never fabricate price
    const invalidMatch = resolveExactVariant(
      psPlusVariants,
      {
        platform: 'PS4',
        tier: 'Premium',
        duration_months: 12,
        access_type: 'Primary',
      },
      dims
    );
    assert.equal(invalidMatch, null, 'Invalid combination must return null');

    const compat = checkOptionCompatibility(
      psPlusVariants,
      { platform: 'PS4' },
      'tier',
      'Premium'
    );
    assert.equal(compat.exists, false, 'PS4 + Premium must be marked incompatible');
  });

  await test('6. Unavailable variants are detected and price summaries work accurately', () => {
    const psPlusVariants = SEED_VARIANTS.filter(
      (v) => v.service_id === '22222222-2222-4222-8222-222222222201'
    );
    const summary = computeServicePriceSummary(psPlusVariants);
    assert.equal(summary.minPriceMad, 150);
    assert.equal(summary.maxPriceMad, 390);
    assert.equal(summary.hasDiscount, true);
    assert.equal(summary.availableCount, 7);
    assert.equal(summary.totalCount, 8);
  });

  // 3. WhatsApp Ordering Message Tests
  await test('7. WhatsApp message generator formats English, French, and Moroccan Darija inquiries accurately', () => {
    const ps5ExtraPrimary = SEED_VARIANTS.find(
      (v) => v.id === '33333333-3333-4333-8333-333333333305'
    )!;

    const msgEn = buildWhatsAppOrderMessage({
      locale: 'en',
      serviceName: 'PlayStation Plus',
      variant: ps5ExtraPrimary,
    });
    assert.ok(msgEn.includes("Hello NovaStream! I'm interested in PlayStation Plus Extra, PS5, Primary, 12 months, listed at 350 DH"));

    const msgFr = buildWhatsAppOrderMessage({
      locale: 'fr',
      serviceName: 'PlayStation Plus',
      variant: ps5ExtraPrimary,
    });
    assert.ok(msgFr.includes('Bonjour NovaStream ! Je suis intéressé(e) par PlayStation Plus Extra, PS5, Principal, 12 mois, à 350 DH'));

    const msgAr = buildWhatsAppOrderMessage({
      locale: 'ar',
      serviceName: 'PlayStation Plus',
      variant: ps5ExtraPrimary,
    });
    assert.ok(msgAr.includes('سلام NovaStream، بغيت نسول على PlayStation Plus Extra'));
    assert.ok(msgAr.includes('ديال PS5، برايمري، لمدة 12 شهر، بثمن 350 درهم'));

    const waUrl = buildWhatsAppOrderUrl({
      phoneNumber: '+212 600-000000',
      locale: 'ar',
      serviceName: 'PlayStation Plus',
      variant: ps5ExtraPrimary,
    });
    assert.ok(waUrl.startsWith('https://wa.me/212600000000?text='));
  });

  // 4. Security, Validation & RLS Verification Tests
  await test('8. Zod validation enforces integer MAD prices, sale_price < price, no duplicate variants, and >=1 variant to publish', () => {
    // Reject negative price
    assert.equal(
      serviceVariantInputSchema.safeParse({
        label: 'Test',
        price_mad: -10,
      }).success,
      false
    );

    // Reject floating point MAD price
    assert.equal(
      serviceVariantInputSchema.safeParse({
        label: 'Test',
        price_mad: 99.5,
      }).success,
      false
    );

    // Reject sale_price_mad >= price_mad
    assert.equal(
      serviceVariantInputSchema.safeParse({
        label: 'Test',
        price_mad: 100,
        sale_price_mad: 100,
      }).success,
      false
    );

    // Reject publishing service with 0 variants
    const zeroVarPublish = serviceUpsertSchema.safeParse({
      category_id: '11111111-1111-4111-8111-111111111101',
      name: 'Test Service',
      slug: 'test-service',
      status: 'published',
      translations: {},
      variants: [],
    });
    assert.equal(zeroVarPublish.success, false);

    // Reject duplicate variant option combinations
    const dupVar = serviceUpsertSchema.safeParse({
      category_id: '11111111-1111-4111-8111-111111111101',
      name: 'Test Service',
      slug: 'test-service',
      status: 'published',
      translations: {},
      variants: [
        {
          label: 'PS5 Primary',
          platform: 'PS5',
          access_type: 'Primary',
          price_mad: 200,
          is_available: true,
          sort_order: 1,
        },
        {
          label: 'PS5 Primary Duplicate',
          platform: 'PS5',
          access_type: 'Primary',
          price_mad: 220,
          is_available: true,
          sort_order: 2,
        },
      ],
    });
    assert.equal(dupVar.success, false);
  });

  await test('9. Image upload validator checks MIME type, file size <= 5MB, and extension', () => {
    assert.equal(
      validateImageUpload({
        name: 'cover.webp',
        type: 'image/webp',
        size: 500_000,
      }).valid,
      true
    );
    assert.equal(
      validateImageUpload({
        name: 'malicious.svg',
        type: 'image/svg+xml',
        size: 10_000,
      }).valid,
      false
    );
    assert.equal(
      validateImageUpload({
        name: 'huge.png',
        type: 'image/png',
        size: 8 * 1024 * 1024,
      }).valid,
      false
    );
  });

  await test('10. Public catalog queries strictly hide draft services and private site_settings', async () => {
    const publicServices = await getPublicServices('fr');
    const hasDraft = publicServices.some(
      (s) => s.status !== 'published' || s.slug === 'creative-studio-pro-suite'
    );
    assert.equal(hasDraft, false, 'Draft services must never appear in public queries');

    const publicSettings = await getPublicSiteSettings();
    assert.equal(
      'internal_admin_notes' in (publicSettings as unknown as Record<string, unknown>),
      false,
      'Private site_settings must never be exposed publicly'
    );
  });

  await test('11. Supabase SQL migrations enable RLS on all 7 tables and never expose privileged keys', () => {
    const mig1 = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/0001_init.sql'),
      'utf8'
    );
    const mig2 = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/0002_localization.sql'),
      'utf8'
    );
    const combinedSql = `${mig1}\n${mig2}`;

    const requiredTables = [
      'admin_users',
      'categories',
      'services',
      'service_variants',
      'site_settings',
      'category_translations',
      'service_translations',
    ];

    for (const tbl of requiredTables) {
      assert.ok(
        combinedSql.includes(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY;`),
        `RLS must be enabled on public.${tbl}`
      );
    }

    assert.ok(
      combinedSql.includes('CREATE OR REPLACE FUNCTION public.is_admin()'),
      'Non-recursive is_admin() function must exist'
    );

    const envExample = fs.readFileSync(
      path.join(process.cwd(), '.env.example'),
      'utf8'
    );
    assert.equal(
      envExample.includes('SERVICE_ROLE'),
      false,
      '.env.example must never expose SERVICE_ROLE keys'
    );
  });

  await test('12. Currency and duration formatters render accurately for EN, FR, and AR (Moroccan Darija)', () => {
    assert.equal(formatMadPrice(350, 'en'), '350 DH');
    assert.equal(formatMadPrice(350, 'fr'), '350 DH');
    assert.equal(formatMadPrice(350, 'ar'), '350 درهم');

    assert.equal(formatDurationMonths(12, 'ar'), '12 شهر');
    assert.equal(formatDurationMonths(3, 'ar'), '3 شهور');
    assert.equal(formatAccessType('Primary', 'ar'), 'برايمري');
    assert.equal(formatAccessType('Secondary', 'ar'), 'سيكندري');
  });

  await test('13. Migration 0003 and localized 1:1 offer images (EN, FR, AR) exist and resolve per locale', async () => {
    const mig3Path = path.join(
      process.cwd(),
      'supabase/migrations/0003_offers_catalog.sql'
    );
    assert.ok(fs.existsSync(mig3Path), '0003_offers_catalog.sql must exist');
    const mig3Sql = fs.readFileSync(mig3Path, 'utf8');
    assert.ok(mig3Sql.includes('gta-vi'), 'Migration must include GTA VI offer');
    assert.ok(mig3Sql.includes('ea-sports-fc-27'), 'Migration must include EA Sports FC 27 offer');
    assert.ok(mig3Sql.includes('elden-ring'), 'Migration must include Elden Ring offer');

    for (const loc of ['en', 'fr', 'ar'] as const) {
      const imgPath = path.join(
        process.cwd(),
        `public/images/offers/${loc}/gta-vi.jpg`
      );
      assert.ok(fs.existsSync(imgPath), `Localized 1:1 image must exist for ${loc}`);
      const stat = fs.statSync(imgPath);
      assert.ok(
        stat.size > 10_000 && stat.size < 300_000,
        `Image for ${loc} must be web-optimized (<300KB)`
      );
    }

    assert.equal(
      localizeOfferImagePath('/images/offers/fr/gta-vi.jpg', 'ar'),
      '/images/offers/ar/gta-vi.jpg'
    );
    assert.equal(
      localizeOfferImagePath('/images/offers/fr/gta-vi.jpg', 'en'),
      '/images/offers/en/gta-vi.jpg'
    );

    const arServices = await getPublicServices('ar');
    const gtaAr = arServices.find((s) => s.slug === 'gta-vi');
    assert.ok(gtaAr, 'GTA VI must be returned in public services');
    assert.equal(gtaAr.coverImagePath, '/images/offers/ar/gta-vi.jpg');
  });

  console.log(`\nAll ${passed} test suites passed successfully!`);
}

runAllTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

