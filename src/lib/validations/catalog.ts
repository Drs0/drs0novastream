import { z } from 'zod';

export const localeSchema = z.enum(['en', 'fr', 'ar']);

export const slugSchema = z
  .string()
  .trim()
  .min(2, 'Slug must be at least 2 characters')
  .max(120, 'Slug is too long')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

export const accessTypeSchema = z
  .union([z.literal('Primary'), z.literal('Secondary'), z.null()])
  .optional()
  .transform((val) => val ?? null);

export const serviceVariantInputSchema = z
  .object({
    id: z.string().uuid().optional(),
    sku: z
      .string()
      .trim()
      .max(64)
      .nullable()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    label: z.string().trim().min(1, 'Variant label is required').max(120),
    platform: z
      .string()
      .trim()
      .max(60)
      .nullable()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    edition: z
      .string()
      .trim()
      .max(60)
      .nullable()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    tier: z
      .string()
      .trim()
      .max(60)
      .nullable()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    duration_months: z
      .number()
      .int('Duration must be a whole number of months')
      .positive('Duration must be positive if specified')
      .nullable()
      .optional()
      .transform((v) => v ?? null),
    access_type: accessTypeSchema,
    price_mad: z
      .number()
      .int('Price must be an integer MAD value')
      .min(0, 'Price cannot be negative'),
    sale_price_mad: z
      .number()
      .int('Sale price must be an integer MAD value')
      .min(0, 'Sale price cannot be negative')
      .nullable()
      .optional()
      .transform((v) => v ?? null),
    is_available: z.boolean().default(true),
    sort_order: z.number().int().default(0),
  })
  .refine(
    (data) => data.sale_price_mad === null || data.sale_price_mad < data.price_mad,
    {
      message: 'Sale price must be strictly lower than regular price',
      path: ['sale_price_mad'],
    }
  );

export type ServiceVariantInput = z.infer<typeof serviceVariantInputSchema>;

export function buildVariantCombinationKey(v: {
  platform?: string | null;
  edition?: string | null;
  tier?: string | null;
  duration_months?: number | null;
  access_type?: string | null;
  label?: string | null;
}): string {
  const hasStructuredAttrs = Boolean(
    v.platform || v.edition || v.tier || v.duration_months || v.access_type
  );
  return [
    (v.platform ?? '').trim().toLowerCase(),
    (v.edition ?? '').trim().toLowerCase(),
    (v.tier ?? '').trim().toLowerCase(),
    v.duration_months ? String(v.duration_months) : '',
    (v.access_type ?? '').trim().toLowerCase(),
    hasStructuredAttrs ? '' : (v.label ?? '').trim().toLowerCase(),
  ].join('|');
}

export const serviceTranslationInputSchema = z.object({
  locale: localeSchema,
  name: z.string().trim().min(1, 'Translated service name is required').max(160),
  short_description: z.string().trim().max(320).nullable().optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  seo_title: z.string().trim().max(160).nullable().optional(),
  seo_description: z.string().trim().max(320).nullable().optional(),
  image_alt: z.string().trim().max(200).nullable().optional(),
});

export const serviceUpsertSchema = z
  .object({
    id: z.string().uuid().optional(),
    category_id: z.string().uuid('Valid category is required'),
    name: z.string().trim().min(1, 'Service name is required').max(160),
    slug: slugSchema,
    short_description: z.string().trim().max(320).nullable().optional(),
    description: z.string().trim().max(5000).nullable().optional(),
    cover_image_path: z.string().trim().max(500).nullable().optional(),
    gallery_paths: z.array(z.string().trim().max(500)).default([]),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    is_featured: z.boolean().default(false),
    sort_order: z.number().int().default(0),
    terms_text: z.string().trim().max(2000).nullable().optional(),
    seo_title: z.string().trim().max(160).nullable().optional(),
    seo_description: z.string().trim().max(320).nullable().optional(),
    translations: z.object({
      en: serviceTranslationInputSchema.optional(),
      fr: serviceTranslationInputSchema.optional(),
      ar: serviceTranslationInputSchema.optional(),
    }),
    variants: z.array(serviceVariantInputSchema),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'published' && data.variants.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one valid variant is required before publishing a service',
        path: ['variants'],
      });
    }

    const seenKeys = new Set<string>();
    data.variants.forEach((variant, index) => {
      const key = buildVariantCombinationKey(variant);
      if (seenKeys.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duplicate variant option combination is forbidden',
          path: ['variants', index, 'label'],
        });
      }
      seenKeys.add(key);
    });
  });

export type ServiceUpsertInput = z.infer<typeof serviceUpsertSchema>;

export const categoryTranslationInputSchema = z.object({
  locale: localeSchema,
  name: z.string().trim().min(1, 'Category name is required').max(120),
  description: z.string().trim().max(600).nullable().optional(),
});

export const categoryUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'Category name is required').max(120),
  slug: slugSchema,
  description: z.string().trim().max(600).nullable().optional(),
  image_path: z.string().trim().max(500).nullable().optional(),
  whatsapp_number: z
    .string()
    .trim()
    .max(30)
    .nullable()
    .optional()
    .transform((v) => {
      if (!v) return null;
      const digits = v.replace(/[^0-9]/g, '');
      return digits.length > 0 ? digits : null;
    })
    .refine(
      (v) => v === null || /^[1-9][0-9]{7,14}$/.test(v),
      'WhatsApp number must be in international format (e.g. 212600000000) or left empty'
    ),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  translations: z.object({
    en: categoryTranslationInputSchema.optional(),
    fr: categoryTranslationInputSchema.optional(),
    ar: categoryTranslationInputSchema.optional(),
  }),
});

export type CategoryUpsertInput = z.infer<typeof categoryUpsertSchema>;

export const siteSettingsUpdateSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{7,14}$/, 'WhatsApp number must be in international format without + (e.g. 212600000000)'),
  contactEmail: z.string().trim().email('Valid contact email is required'),
  supportHours: z.string().trim().min(2).max(120),
  defaultLocale: localeSchema,
  socialLinks: z.object({
    instagram: z.string().trim().url().or(z.literal('')).optional(),
    facebook: z.string().trim().url().or(z.literal('')).optional(),
    tiktok: z.string().trim().url().or(z.literal('')).optional(),
  }),
});

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/webp',
  'image/avif',
  'image/png',
  'image/jpeg',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['webp', 'avif', 'png', 'jpg', 'jpeg'] as const;

export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateImageUpload(file: {
  name: string;
  type: string;
  size: number;
}): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return {
      valid: false,
      error: 'Unsupported image MIME type. Allowed: WebP, AVIF, PNG, JPEG.',
    };
  }

  if (file.size <= 0 || file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Image size must be between 1 byte and 5 MB.',
    };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext as (typeof ALLOWED_IMAGE_EXTENSIONS)[number])) {
    return {
      valid: false,
      error: 'Invalid file extension. Allowed: .webp, .avif, .png, .jpg, .jpeg.',
    };
  }

  return { valid: true };
}

export const serviceReviewInputSchema = z.object({
  service_id: z.string().uuid('Valid service ID is required'),
  reviewer_name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(80, 'Name must be 80 characters or fewer'),
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Minimum rating is 1 star')
    .max(5, 'Maximum rating is 5 stars'),
  comment: z
    .string()
    .trim()
    .min(2, 'Review message is required')
    .max(600, 'Review message must be 600 characters or fewer'),
});

export type ServiceReviewInput = z.infer<typeof serviceReviewInputSchema>;


