'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2 } from 'lucide-react';
import type { LocalizedCategory, LocalizedService } from '@/types/catalog';
import type { Locale, ServiceStatus } from '@/types/database';
import type { ServiceVariantInput } from '@/lib/validations/catalog';
import { slugify } from '@/lib/formatters';
import {
  deleteServiceAction,
  saveServiceAction,
} from '@/app/admin/actions';
import { ImageUploader } from './ImageUploader';
import { VariantEditor } from './VariantEditor';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Toast } from '@/components/common/Toast';
import styles from './AdminUI.module.scss';

interface ServiceEditorProps {
  categories: LocalizedCategory[];
  initialService?: LocalizedService | null;
}

interface LocaleFields {
  name: string;
  short_description: string;
  description: string;
  seo_title: string;
  seo_description: string;
  image_alt: string;
}

const LANGUAGE_TABS: { locale: Locale; label: string }[] = [
  { locale: 'en', label: 'English' },
  { locale: 'fr', label: 'Français' },
  { locale: 'ar', label: 'الدارجة' },
];

export function ServiceEditor({
  categories,
  initialService,
}: ServiceEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Locale>('fr');
  const [categoryId, setCategoryId] = useState(
    initialService?.categoryId ?? categories[0]?.id ?? ''
  );
  const [slug, setSlug] = useState(initialService?.slug ?? '');
  const [status, setStatus] = useState<ServiceStatus>(
    initialService?.status ?? 'draft'
  );
  const [isFeatured, setIsFeatured] = useState(
    initialService?.isFeatured ?? false
  );
  const [sortOrder, setSortOrder] = useState(initialService?.sortOrder ?? 1);
  const [termsText, setTermsText] = useState(initialService?.termsText ?? '');
  const [coverImagePath, setCoverImagePath] = useState(
    initialService?.coverImagePath ?? '/images/services/ps-plus-cover.svg'
  );
  const [galleryPaths, setGalleryPaths] = useState<string[]>(
    initialService?.galleryPaths ?? []
  );

  const [translations, setTranslations] = useState<Record<Locale, LocaleFields>>({
    en: {
      name: initialService?.translations.en?.name ?? initialService?.raw.name ?? '',
      short_description:
        initialService?.translations.en?.short_description ??
        initialService?.raw.short_description ??
        '',
      description:
        initialService?.translations.en?.description ??
        initialService?.raw.description ??
        '',
      seo_title: initialService?.translations.en?.seo_title ?? '',
      seo_description: initialService?.translations.en?.seo_description ?? '',
      image_alt: initialService?.translations.en?.image_alt ?? '',
    },
    fr: {
      name: initialService?.translations.fr?.name ?? '',
      short_description:
        initialService?.translations.fr?.short_description ?? '',
      description: initialService?.translations.fr?.description ?? '',
      seo_title: initialService?.translations.fr?.seo_title ?? '',
      seo_description: initialService?.translations.fr?.seo_description ?? '',
      image_alt: initialService?.translations.fr?.image_alt ?? '',
    },
    ar: {
      name: initialService?.translations.ar?.name ?? '',
      short_description:
        initialService?.translations.ar?.short_description ?? '',
      description: initialService?.translations.ar?.description ?? '',
      seo_title: initialService?.translations.ar?.seo_title ?? '',
      seo_description: initialService?.translations.ar?.seo_description ?? '',
      image_alt: initialService?.translations.ar?.image_alt ?? '',
    },
  });

  const [variants, setVariants] = useState<ServiceVariantInput[]>(() =>
    initialService?.variants.length
      ? initialService.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          label: v.label,
          platform: v.platform,
          edition: v.edition,
          tier: v.tier,
          duration_months: v.duration_months,
          access_type: v.access_type,
          price_mad: v.price_mad,
          sale_price_mad: v.sale_price_mad,
          is_available: v.is_available,
          sort_order: v.sort_order,
        }))
      : [
          {
            label: 'Standard Offer',
            sku: null,
            platform: 'PS5',
            edition: null,
            tier: null,
            duration_months: 12,
            access_type: 'Primary',
            price_mad: 250,
            sale_price_mad: null,
            is_available: true,
            sort_order: 1,
          },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  function updateLocaleField(
    loc: Locale,
    field: keyof LocaleFields,
    value: string
  ) {
    setTranslations((prev) => ({
      ...prev,
      [loc]: {
        ...prev[loc],
        [field]: value,
      },
    }));

    if (field === 'name' && !slug && !initialService) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    const canonicalName =
      translations.fr.name.trim() ||
      translations.en.name.trim() ||
      translations.ar.name.trim();

    const payload = {
      id: initialService?.id,
      category_id: categoryId,
      name: canonicalName,
      slug: slug.trim(),
      short_description:
        translations.fr.short_description ||
        translations.en.short_description ||
        null,
      description:
        translations.fr.description || translations.en.description || null,
      cover_image_path: coverImagePath.trim() || null,
      gallery_paths: galleryPaths,
      status,
      is_featured: isFeatured,
      sort_order: sortOrder,
      terms_text: termsText.trim() || null,
      seo_title: translations.fr.seo_title || translations.en.seo_title || null,
      seo_description:
        translations.fr.seo_description ||
        translations.en.seo_description ||
        null,
      translations: {
        en: translations.en.name.trim()
          ? { locale: 'en' as const, ...translations.en }
          : undefined,
        fr: translations.fr.name.trim()
          ? { locale: 'fr' as const, ...translations.fr }
          : undefined,
        ar: translations.ar.name.trim()
          ? { locale: 'ar' as const, ...translations.ar }
          : undefined,
      },
      variants,
    };

    const res = await saveServiceAction(payload);
    setSaving(false);

    if (!res.success) {
      setToast({
        message: res.error ?? 'Failed to save service.',
        type: 'error',
      });
      return;
    }

    setToast({
      message: 'Service saved successfully!',
      type: 'success',
    });

    if (!initialService && res.serviceId) {
      router.push(`/admin/services/${res.serviceId}/edit`);
    } else {
      router.refresh();
    }
  }

  async function handleConfirmDelete() {
    if (!initialService) return;
    const res = await deleteServiceAction(initialService.id);
    setConfirmDeleteOpen(false);
    if (res.success) {
      router.push('/admin');
      router.refresh();
    } else {
      setToast({
        message: res.error ?? 'Failed to delete service.',
        type: 'error',
      });
    }
  }

  const currentTabFields = translations[activeTab];
  const isRtlTab = activeTab === 'ar';

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>
            {initialService
              ? `Edit Service: ${initialService.name}`
              : 'Create New Multilingual Service'}
          </h2>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {initialService && (
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(true)}
                className={styles.dangerBtn}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className={styles.primaryBtn}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Service'}</span>
            </button>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={styles.select}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Canonical URL Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="playstation-plus"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Publication Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ServiceStatus)}
              className={styles.select}
            >
              <option value="draft">Draft (Private)</option>
              <option value="published">Published (Public Storefront)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value || '0', 10))}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldFull}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span>Feature this service on the Homepage</span>
            </label>
          </div>

          <div className={styles.fieldFull}>
            <label className={styles.label}>
              Terms, Conditions &amp; Usage Notes
            </label>
            <textarea
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              placeholder="Usage rules, Primary vs Secondary conditions..."
              className={styles.textarea}
            />
          </div>
        </div>
      </div>

      {/* Multilingual Content Editor Tabs: English | Français | الدارجة */}
      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <div>
            <h3 className={styles.panelTitle}>
              Multilingual Content Editor (English | Français | الدارجة)
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '0.2rem' }}>
              For الدارجة (ar), use natural Moroccan Darija in Arabic script (not formal Modern Standard Arabic).
            </p>
          </div>
        </div>

        <div className={styles.tabsBar} role="tablist">
          {LANGUAGE_TABS.map((tab) => {
            const isMissing = !translations[tab.locale].name.trim();
            return (
              <button
                key={tab.locale}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.locale}
                onClick={() => setActiveTab(tab.locale)}
                className={`${styles.tabBtn} ${
                  activeTab === tab.locale ? styles.tabBtnActive : ''
                }`}
              >
                <span>{tab.label}</span>
                {isMissing ? (
                  <span className={`${styles.badge} ${styles.badgeMissing}`}>
                    Missing
                  </span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgePublished}`}>
                    Ready
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className={styles.formGrid} dir={isRtlTab ? 'rtl' : 'ltr'}>
          <div className={styles.field}>
            <label className={styles.label}>
              Service Name ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={currentTabFields.name}
              onChange={(e) =>
                updateLocaleField(activeTab, 'name', e.target.value)
              }
              className={`${styles.input} ${isRtlTab ? styles.rtlInput : ''}`}
              placeholder={
                isRtlTab
                  ? 'مثال: PlayStation Plus بلايستيشن بلس'
                  : 'e.g. PlayStation Plus'
              }
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Image Alt Text ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={currentTabFields.image_alt}
              onChange={(e) =>
                updateLocaleField(activeTab, 'image_alt', e.target.value)
              }
              className={`${styles.input} ${isRtlTab ? styles.rtlInput : ''}`}
            />
          </div>

          <div className={styles.fieldFull}>
            <label className={styles.label}>
              Short Description ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={currentTabFields.short_description}
              onChange={(e) =>
                updateLocaleField(
                  activeTab,
                  'short_description',
                  e.target.value
                )
              }
              className={`${styles.input} ${isRtlTab ? styles.rtlInput : ''}`}
            />
          </div>

          <div className={styles.fieldFull}>
            <label className={styles.label}>
              Full Description ({activeTab.toUpperCase()})
            </label>
            <textarea
              value={currentTabFields.description}
              onChange={(e) =>
                updateLocaleField(activeTab, 'description', e.target.value)
              }
              className={`${styles.textarea} ${
                isRtlTab ? styles.rtlInput : ''
              }`}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              SEO Title ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={currentTabFields.seo_title}
              onChange={(e) =>
                updateLocaleField(activeTab, 'seo_title', e.target.value)
              }
              className={`${styles.input} ${isRtlTab ? styles.rtlInput : ''}`}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              SEO Description ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={currentTabFields.seo_description}
              onChange={(e) =>
                updateLocaleField(activeTab, 'seo_description', e.target.value)
              }
              className={`${styles.input} ${isRtlTab ? styles.rtlInput : ''}`}
            />
          </div>
        </div>
      </div>

      <ImageUploader
        coverImagePath={coverImagePath}
        galleryPaths={galleryPaths}
        onChangeCover={setCoverImagePath}
        onChangeGallery={setGalleryPaths}
      />

      <VariantEditor variants={variants} onChange={setVariants} />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete Service"
        message="Are you sure you want to permanently delete this service and all its variants and translations?"
        confirmLabel="Delete Service"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />

      <Toast
        message={toast?.message ?? null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </form>
  );
}

