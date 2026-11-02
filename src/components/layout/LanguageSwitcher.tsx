'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/types/database';
import { setLocaleCookieAction } from '@/i18n/actions';
import styles from './LanguageSwitcher.module.scss';

const LANGUAGE_OPTIONS: { locale: Locale; label: string }[] = [
  { locale: 'en', label: 'English' },
  { locale: 'fr', label: 'Français' },
  { locale: 'ar', label: 'الدارجة' },
];

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations('nav');
  const [isPending, startTransition] = useTransition();

  function handleSelectLocale(nextLocale: Locale) {
    if (nextLocale === currentLocale) return;
    startTransition(async () => {
      await setLocaleCookieAction(nextLocale);
      router.refresh();
    });
  }

  return (
    <div
      className={styles.switcher}
      role="group"
      aria-label={t('languageSelectorLabel')}
    >
      {LANGUAGE_OPTIONS.map((opt) => {
        const isActive = opt.locale === currentLocale;
        return (
          <button
            key={opt.locale}
            type="button"
            disabled={isPending}
            onClick={() => handleSelectLocale(opt.locale)}
            className={`${styles.langBtn} ${isActive ? styles.active : ''}`}
            aria-pressed={isActive}
            lang={opt.locale}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
