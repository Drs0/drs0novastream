import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';
import type { Locale, ServiceVariantRow } from '@/types/database';
import { buildWhatsAppOrderUrl } from '@/lib/whatsapp';
import styles from './ServiceDetailClient.module.scss';

interface WhatsAppOrderButtonProps {
  phoneNumber: string;
  locale: Locale;
  serviceName: string;
  variant: ServiceVariantRow | null;
}

export function WhatsAppOrderButton({
  phoneNumber,
  locale,
  serviceName,
  variant,
}: WhatsAppOrderButtonProps) {
  const catT = useTranslations('catalog');
  const detailT = useTranslations('serviceDetail');

  const isOrderable = Boolean(variant && variant.is_available);

  if (!isOrderable || !variant) {
    return (
      <div>
        <button type="button" className={styles.whatsappBtn} disabled>
          <MessageCircle size={20} />
          <span>{catT('orderOnWhatsapp')}</span>
        </button>
        <p className={styles.disclaimer} style={{ marginTop: '0.6rem' }}>
          {detailT('whatsappDisclaimer')}
        </p>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppOrderUrl({
    phoneNumber,
    locale,
    serviceName,
    variant,
  });

  return (
    <div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBtn}
      >
        <MessageCircle size={20} />
        <span>{catT('orderOnWhatsapp')}</span>
      </a>
      <p className={styles.disclaimer} style={{ marginTop: '0.6rem' }}>
        {detailT('whatsappDisclaimer')}
      </p>
    </div>
  );
}

