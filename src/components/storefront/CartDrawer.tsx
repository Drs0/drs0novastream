'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import {
  formatAccessType,
  formatDurationMonths,
  formatMadPrice,
  localizeOfferImagePath,
} from '@/lib/formatters';
import { getEffectiveVariantPriceMad } from '@/lib/catalog/pricing';
import { buildWhatsAppCartOrderUrl } from '@/lib/whatsapp';
import { useCart } from './CartContext';
import styles from './CartDrawer.module.scss';

export function CartDrawer() {
  const {
    items,
    totalItems,
    totalPriceMad,
    isOpen,
    whatsappNumber,
    locale,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const t = useTranslations('cart');

  const [mounted, setMounted] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setIsClosing(false);
    } else if (mounted) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setMounted(false);
        setIsClosing(false);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted || isClosing) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeCart();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mounted, isClosing, closeCart]);

  if (!mounted) {
    return null;
  }

  const effectiveCartWhatsapp =
    items.find((item) => item.whatsappNumber?.trim())?.whatsappNumber?.trim() ||
    whatsappNumber;

  const whatsappCheckoutUrl = buildWhatsAppCartOrderUrl({
    phoneNumber: effectiveCartWhatsapp,
    locale,
    items: items.map((item) => ({
      serviceName: item.serviceName,
      variant: item.variant,
      quantity: item.quantity,
    })),
  });

  return (
    <div
      className={`${styles.backdrop} ${isClosing ? styles.backdropClosing : ''}`}
      onClick={() => !isClosing && closeCart()}
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
    >
      <aside
        className={`${styles.drawer} ${isClosing ? styles.drawerClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <ShoppingCart size={20} />
            <h2 className={styles.title}>{t('title')}</h2>
            {totalItems > 0 && (
              <span className={styles.countBadge}>{totalItems}</span>
            )}
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label={t('closeCart')}
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.emptyWrap}>
              <ShoppingCart size={44} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>{t('emptyTitle')}</p>
              <p className={styles.emptyDesc}>{t('emptyDescription')}</p>
            </div>
          ) : (
            items.map((item) => {
              const unitPrice = getEffectiveVariantPriceMad(item.variant);
              const lineTotal = unitPrice * item.quantity;
              const imgSrc =
                localizeOfferImagePath(item.coverImagePath, locale) ||
                '/images/services/ps-plus-cover.svg';

              const specs: string[] = [];
              if (item.variant.platform) specs.push(item.variant.platform);
              if (item.variant.edition) specs.push(item.variant.edition);
              if (item.variant.tier) specs.push(item.variant.tier);
              if (item.variant.duration_months) {
                specs.push(
                  formatDurationMonths(item.variant.duration_months, locale)
                );
              }
              if (item.variant.access_type) {
                const accessLabel = formatAccessType(
                  item.variant.access_type,
                  locale
                );
                if (accessLabel) specs.push(accessLabel);
              }

              return (
                <div key={item.variantId} className={styles.itemCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={item.serviceName}
                    className={styles.itemThumb}
                    loading="lazy"
                    width={68}
                    height={68}
                  />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTopRow}>
                      <Link
                        href={`/services/${item.serviceSlug}`}
                        className={styles.itemTitle}
                        onClick={closeCart}
                      >
                        {item.serviceName}
                      </Link>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.variantId)}
                        aria-label={t('removeItem')}
                        title={t('removeItem')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {specs.length > 0 && (
                      <div className={styles.specsRow}>
                        {specs.map((spec) => (
                          <span key={spec} className={styles.specPill}>
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={styles.itemBottomRow}>
                      <div className={styles.qtyControls}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          aria-label={t('decreaseQty')}
                        >
                          <Minus size={13} />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          aria-label={t('increaseQty')}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className={styles.itemPrice}>
                        {formatMadPrice(lineTotal, locale)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{t('totalLabel')}</span>
              <span className={styles.summaryTotal}>
                {formatMadPrice(totalPriceMad, locale)}
              </span>
            </div>

            <a
              href={whatsappCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappCheckoutBtn}
            >
              <MessageCircle size={20} />
              <span>{t('orderCartOnWhatsapp')}</span>
            </a>

            <div className={styles.footerActionsRow}>
              <p className={styles.disclaimer}>{t('cartDisclaimer')}</p>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={clearCart}
              >
                {t('clearCart')}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

