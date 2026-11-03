'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ShoppingCart } from 'lucide-react';
import type { ServiceVariantRow } from '@/types/database';
import { useCart } from './CartContext';
import styles from './ServiceCard.module.scss';

interface QuickAddToCartButtonProps {
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  coverImagePath: string | null;
  defaultVariant: ServiceVariantRow | null;
}

export function QuickAddToCartButton({
  serviceId,
  serviceSlug,
  serviceName,
  coverImagePath,
  defaultVariant,
}: QuickAddToCartButtonProps) {
  const t = useTranslations('cart');
  const { addItem, getItemQuantity } = useCart();
  const [added, setAdded] = useState(false);

  if (!defaultVariant || !defaultVariant.is_available) {
    return null;
  }

  const qty = getItemQuantity(defaultVariant.id);

  function handleQuickAdd() {
    if (!defaultVariant) return;
    addItem({
      variantId: defaultVariant.id,
      serviceId,
      serviceSlug,
      serviceName,
      coverImagePath,
      variant: defaultVariant,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleQuickAdd}
      className={`${styles.quickCartBtn} ${added ? styles.quickCartAdded : ''}`}
      aria-label={t('addToCart')}
      title={t('addToCart')}
    >
      {added ? <Check size={16} /> : <ShoppingCart size={16} />}
      {qty > 0 && !added && <span className={styles.quickCartQty}>{qty}</span>}
    </button>
  );
}

