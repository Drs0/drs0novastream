'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, Edit2, Trash2, Search, X } from 'lucide-react';
import type { LocalizedCategory } from '@/types/catalog';
import type { Locale } from '@/types/database';
import { slugify } from '@/lib/formatters';
import {
  deleteCategoryAction,
  saveCategoryAction,
} from '@/app/admin/actions';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Toast } from '@/components/common/Toast';
import styles from './AdminUI.module.scss';

interface CategoryManagerClientProps {
  categories: LocalizedCategory[];
}

export function CategoryManagerClient({
  categories,
}: CategoryManagerClientProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [slug, setSlug] = useState('');
  const [imagePath, setImagePath] = useState('/images/categories/ps-plus.svg');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sortOrder, setSortOrder] = useState(categories.length + 1);
  const [isActive, setIsActive] = useState(true);
  const [activeTab, setActiveTab] = useState<Locale>('fr');
  const [categorySearch, setCategorySearch] = useState('');

  const filteredCategories = useMemo(() => {
    const term = categorySearch.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(term);
      const matchSlug = cat.slug.toLowerCase().includes(term);
      const matchFr = cat.translations.fr?.name?.toLowerCase().includes(term);
      const matchAr = cat.translations.ar?.name?.toLowerCase().includes(term);
      const matchPhone = cat.whatsappNumber && cat.whatsappNumber.includes(term);
      return matchName || matchSlug || matchFr || matchAr || matchPhone;
    });
  }, [categories, categorySearch]);

  const [translations, setTranslations] = useState<
    Record<Locale, { name: string; description: string }>
  >({
    en: { name: '', description: '' },
    fr: { name: '', description: '' },
    ar: { name: '', description: '' },
  });

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LocalizedCategory | null>(
    null
  );

  async function handleConfirmDeleteCategory() {
    if (!deleteTarget) return;
    const res = await deleteCategoryAction(deleteTarget.id);
    setDeleteTarget(null);
    if (!res.success) {
      setToast({
        message: res.error ?? 'Failed to delete category.',
        type: 'error',
      });
      return;
    }
    setToast({ message: 'Category deleted.', type: 'success' });
    router.refresh();
  }

  function handleSelectForEdit(cat: LocalizedCategory) {
    setEditingId(cat.id);
    setSlug(cat.slug);
    setImagePath(cat.imagePath ?? '/images/categories/digital.svg');
    setWhatsappNumber(cat.whatsappNumber ?? '');
    setSortOrder(cat.sortOrder);
    setIsActive(cat.isActive);
    setTranslations({
      en: {
        name: cat.translations.en?.name ?? cat.raw.name,
        description: cat.translations.en?.description ?? '',
      },
      fr: {
        name: cat.translations.fr?.name ?? '',
        description: cat.translations.fr?.description ?? '',
      },
      ar: {
        name: cat.translations.ar?.name ?? '',
        description: cat.translations.ar?.description ?? '',
      },
    });
  }

  function handleResetForm() {
    setEditingId(undefined);
    setSlug('');
    setImagePath('/images/categories/digital.svg');
    setWhatsappNumber('');
    setSortOrder(categories.length + 1);
    setIsActive(true);
    setTranslations({
      en: { name: '', description: '' },
      fr: { name: '', description: '' },
      ar: { name: '', description: '' },
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const canonicalName =
      translations.fr.name.trim() ||
      translations.en.name.trim() ||
      translations.ar.name.trim();

    const res = await saveCategoryAction({
      id: editingId,
      name: canonicalName,
      slug: slug.trim() || slugify(canonicalName),
      description:
        translations.fr.description || translations.en.description || null,
      image_path: imagePath.trim() || null,
      whatsapp_number: whatsappNumber.trim() || null,
      sort_order: sortOrder,
      is_active: isActive,
      translations: {
        en: translations.en.name.trim()
          ? { locale: 'en', ...translations.en }
          : undefined,
        fr: translations.fr.name.trim()
          ? { locale: 'fr', ...translations.fr }
          : undefined,
        ar: translations.ar.name.trim()
          ? { locale: 'ar', ...translations.ar }
          : undefined,
      },
    });

    if (!res.success) {
      setToast({
        message: res.error ?? 'Failed to save category.',
        type: 'error',
      });
      return;
    }

    setToast({ message: 'Category saved!', type: 'success' });
    handleResetForm();
    router.refresh();
  }

  const isRtl = activeTab === 'ar';

  return (
    <div>
      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleResetForm}
              className={styles.secondaryBtn}
            >
              <Plus size={16} />
              <span>New Category Mode</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.tabsBar}>
            {(['en', 'fr', 'ar'] as Locale[]).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveTab(loc)}
                className={`${styles.tabBtn} ${
                  activeTab === loc ? styles.tabBtnActive : ''
                }`}
              >
                {loc === 'en'
                  ? 'English'
                  : loc === 'fr'
                  ? 'Français'
                  : 'الدارجة'}
              </button>
            ))}
          </div>

          <div className={styles.formGrid} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className={styles.field}>
              <label className={styles.label}>
                Category Name ({activeTab.toUpperCase()}) *
              </label>
              <input
                type="text"
                value={translations[activeTab].name}
                onChange={(e) => {
                  const val = e.target.value;
                  setTranslations((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], name: val },
                  }));
                  if (!slug && !editingId) setSlug(slugify(val));
                }}
                className={`${styles.input} ${isRtl ? styles.rtlInput : ''}`}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Description ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={translations[activeTab].description}
                onChange={(e) =>
                  setTranslations((prev) => ({
                    ...prev,
                    [activeTab]: {
                      ...prev[activeTab],
                      description: e.target.value,
                    },
                  }))
                }
                className={`${styles.input} ${isRtl ? styles.rtlInput : ''}`}
              />
            </div>
          </div>

          <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
            <div className={styles.field}>
              <label className={styles.label}>Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Icon / Image Path</label>
              <input
                type="text"
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                WhatsApp Number (Optional — uses Site Settings if empty)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 212600000000"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(parseInt(e.target.value || '0', 10))
                }
                className={styles.input}
              />
            </div>

            <div className={styles.field} style={{ justifyContent: 'flex-end' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                }}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Active on Public Storefront</span>
              </label>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button type="submit" className={styles.primaryBtn}>
              <Save size={16} />
              <span>{editingId ? 'Update Category' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <div>
            <h3 className={styles.panelTitle}>Existing Categories</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Showing {filteredCategories.length} of {categories.length} categories
            </span>
          </div>

          <div className={styles.searchBox} style={{ maxWidth: '20rem' }}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search categories..."
              className={styles.searchInput}
            />
            {categorySearch && (
              <button
                type="button"
                onClick={() => setCategorySearch('')}
                className={styles.clearSearchBtn}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.tableWrap}>
          {filteredCategories.length === 0 ? (
            <div className={styles.emptyTable}>
              <p>No categories match your search.</p>
              <button
                type="button"
                onClick={() => setCategorySearch('')}
                className={styles.secondaryBtn}
                style={{ marginTop: '0.75rem' }}
              >
                Clear search
              </button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name (EN / FR / AR)</th>
                  <th>Slug</th>
                  <th>WhatsApp</th>
                  <th>Status</th>
                  <th>Translations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.sortOrder}</td>
                    <td>
                      <strong>{cat.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        FR: {cat.translations.fr?.name ?? '—'} | AR:{' '}
                        {cat.translations.ar?.name ?? '—'}
                      </div>
                    </td>
                    <td>
                      <code>{cat.slug}</code>
                    </td>
                    <td>
                      {cat.whatsappNumber ? (
                        <code>+{cat.whatsappNumber}</code>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Site Default
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          cat.isActive
                            ? styles.badgePublished
                            : styles.badgeArchived
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {cat.missingLocales.length === 0 ? (
                        <span
                          className={`${styles.badge} ${styles.badgePublished}`}
                        >
                          EN • FR • AR
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeMissing}`}>
                          Missing: {cat.missingLocales.join(', ').toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleSelectForEdit(cat)}
                          className={styles.secondaryBtn}
                          style={{
                            minHeight: '2.1rem',
                            padding: '0.25rem 0.65rem',
                          }}
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(cat)}
                          className={styles.dangerBtn}
                          style={{
                            minHeight: '2.1rem',
                            padding: '0.25rem 0.65rem',
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name ?? ''}"?`}
        confirmLabel="Delete Category"
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast
        message={toast?.message ?? null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

