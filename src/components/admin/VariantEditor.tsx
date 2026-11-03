'use client';

import { Copy, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { ServiceVariantInput } from '@/lib/validations/catalog';
import styles from './AdminUI.module.scss';

interface VariantEditorProps {
  variants: ServiceVariantInput[];
  onChange: (variants: ServiceVariantInput[]) => void;
}

export function VariantEditor({ variants, onChange }: VariantEditorProps) {
  function handleAddVariant() {
    const nextSort = variants.length + 1;
    onChange([
      ...variants,
      {
        label: `Option ${nextSort}`,
        sku: null,
        platform: null,
        edition: null,
        tier: null,
        duration_months: null,
        access_type: null,
        price_mad: 100,
        sale_price_mad: null,
        is_available: true,
        sort_order: nextSort,
      },
    ]);
  }

  function handleUpdateVariant(
    index: number,
    patch: Partial<ServiceVariantInput>
  ) {
    const next = variants.map((v, i) => (i === index ? { ...v, ...patch } : v));
    onChange(next);
  }

  function handleDuplicateVariant(index: number) {
    const target = variants[index];
    if (!target) return;
    const copy: ServiceVariantInput = {
      ...target,
      id: undefined,
      label: `${target.label} (Copy)`,
      sku: target.sku ? `${target.sku}-COPY` : null,
      sort_order: variants.length + 1,
    };
    onChange([...variants, copy]);
  }

  function handleDeleteVariant(index: number) {
    onChange(
      variants
        .filter((_, i) => i !== index)
        .map((v, idx) => ({ ...v, sort_order: idx + 1 }))
    );
  }

  function handleMove(index: number, direction: -1 | 1) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= variants.length) return;
    const copy = [...variants];
    const [item] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, item);
    onChange(copy.map((v, idx) => ({ ...v, sort_order: idx + 1 })));
  }

  return (
    <div className={styles.panelCard}>
      <div className={styles.panelHeader}>
        <div>
          <h3 className={styles.panelTitle}>
            Dynamic Service Variants &amp; MAD Pricing
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '0.2rem' }}>
            Leave irrelevant attributes (such as Platform or Primary/Secondary) empty when not applicable. Prices must be integer MAD values.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddVariant}
          className={styles.primaryBtn}
        >
          <Plus size={16} />
          <span>Add Variant</span>
        </button>
      </div>

      {variants.length === 0 ? (
        <p style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
          No variants yet. Add at least one variant before publishing this service.
        </p>
      ) : (
        variants.map((variant, idx) => (
          <div key={variant.id ?? idx} className={styles.variantRowCard}>
            <div className={styles.variantGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Label *</label>
                <input
                  type="text"
                  value={variant.label}
                  onChange={(e) =>
                    handleUpdateVariant(idx, { label: e.target.value })
                  }
                  placeholder="PS5 Extra Primary 12M"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>SKU</label>
                <input
                  type="text"
                  value={variant.sku ?? ''}
                  onChange={(e) =>
                    handleUpdateVariant(idx, {
                      sku: e.target.value || null,
                    })
                  }
                  placeholder="PSP-PS5-EXT"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Platform</label>
                <input
                  type="text"
                  value={variant.platform ?? ''}
                  onChange={(e) =>
                    handleUpdateVariant(idx, {
                      platform: e.target.value || null,
                    })
                  }
                  placeholder="PS4, PS5, Xbox, PC"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Edition / Plan</label>
                <input
                  type="text"
                  value={variant.edition ?? ''}
                  onChange={(e) =>
                    handleUpdateVariant(idx, {
                      edition: e.target.value || null,
                    })
                  }
                  placeholder="Standard, Individual..."
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Tier</label>
                <input
                  type="text"
                  value={variant.tier ?? ''}
                  onChange={(e) =>
                    handleUpdateVariant(idx, {
                      tier: e.target.value || null,
                    })
                  }
                  placeholder="Essential, Extra..."
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Duration (Months)</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={variant.duration_months ?? ''}
                  onChange={(e) =>
                    handleUpdateVariant(idx, {
                      duration_months: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    })
                  }
                  placeholder="e.g. 12"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Access Type</label>
                <select
                  value={variant.access_type ?? ''}
                  onChange={(e) =>
                    handleUpdateVariant(idx, {
                      access_type:
                        e.target.value === 'Primary' ||
                        e.target.value === 'Secondary'
                          ? e.target.value
                          : null,
                    })
                  }
                  className={styles.select}
                >
                  <option value="">Not Applicable</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Price (MAD) *</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={variant.price_mad}
                  onChange={(e) =>
                    handleUpdateVariant(idx, {
                      price_mad: parseInt(e.target.value || '0', 10),
                    })
                  }
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Sale Price (MAD)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={variant.sale_price_mad ?? ''}
                  onChange={(e) =>
                    handleUpdateVariant(idx, {
                      sale_price_mad: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    })
                  }
                  placeholder="Optional < Price"
                  className={styles.input}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginTop: '0.85rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(148,163,184,0.12)',
              }}
            >
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={variant.is_available}
                  onChange={(e) =>
                    handleUpdateVariant(idx, {
                      is_available: e.target.checked,
                    })
                  }
                />
                <span>Available for WhatsApp Ordering</span>
              </label>

              <div style={{ display: 'flex', gap: '0.45rem' }}>
                <button
                  type="button"
                  onClick={() => handleMove(idx, -1)}
                  disabled={idx === 0}
                  className={styles.secondaryBtn}
                  style={{ minHeight: '2.1rem', padding: '0.25rem 0.6rem' }}
                  title="Move up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 1)}
                  disabled={idx === variants.length - 1}
                  className={styles.secondaryBtn}
                  style={{ minHeight: '2.1rem', padding: '0.25rem 0.6rem' }}
                  title="Move down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicateVariant(idx)}
                  className={styles.secondaryBtn}
                  style={{ minHeight: '2.1rem', padding: '0.25rem 0.65rem' }}
                  title="Duplicate variant"
                >
                  <Copy size={14} />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteVariant(idx)}
                  className={styles.dangerBtn}
                  style={{ minHeight: '2.1rem', padding: '0.25rem 0.65rem' }}
                  title="Delete variant"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

