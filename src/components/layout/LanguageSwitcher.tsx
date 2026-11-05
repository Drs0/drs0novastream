'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { Locale } from '@/types/database';
import { setLocaleCookieAction } from '@/i18n/actions';
import styles from './LanguageSwitcher.module.scss';

const LANGUAGE_OPTIONS: { locale: Locale; label: string }[] = [
  { locale: 'en', label: 'English' },
  { locale: 'fr', label: 'Français' },
  { locale: 'ar', label: 'الدارجة' },
];

function FlagIcon({ locale }: { locale: Locale }) {
  if (locale === 'en') {
    // US Flag
    return (
      <svg
        viewBox="0 0 28 20"
        className={styles.flagSvg}
        aria-hidden="true"
      >
        <rect width="28" height="20" rx="2" fill="#ffffff" />
        <path
          d="M0 0h28v1.54H0V0zm0 3.08h28v1.54H0V3.08zm0 3.08h28v1.54H0V6.16zm0 3.08h28v1.54H0V9.24zm0 3.08h28v1.54H0v-1.54zm0 3.08h28v1.54H0V15.4zm0 3.08h28V20H0v-1.52z"
          fill="#b22234"
        />
        <rect width="12" height="10.78" rx="1" fill="#3c3b6e" />
        <g fill="#ffffff">
          <circle cx="2.2" cy="2" r="0.65" />
          <circle cx="4.7" cy="2" r="0.65" />
          <circle cx="7.2" cy="2" r="0.65" />
          <circle cx="9.7" cy="2" r="0.65" />
          <circle cx="3.45" cy="3.7" r="0.65" />
          <circle cx="5.95" cy="3.7" r="0.65" />
          <circle cx="8.45" cy="3.7" r="0.65" />
          <circle cx="2.2" cy="5.4" r="0.65" />
          <circle cx="4.7" cy="5.4" r="0.65" />
          <circle cx="7.2" cy="5.4" r="0.65" />
          <circle cx="9.7" cy="5.4" r="0.65" />
          <circle cx="3.45" cy="7.1" r="0.65" />
          <circle cx="5.95" cy="7.1" r="0.65" />
          <circle cx="8.45" cy="7.1" r="0.65" />
          <circle cx="2.2" cy="8.8" r="0.65" />
          <circle cx="4.7" cy="8.8" r="0.65" />
          <circle cx="7.2" cy="8.8" r="0.65" />
          <circle cx="9.7" cy="8.8" r="0.65" />
        </g>
      </svg>
    );
  }

  if (locale === 'fr') {
    // France Flag
    return (
      <svg
        viewBox="0 0 28 20"
        className={styles.flagSvg}
        aria-hidden="true"
      >
        <rect width="28" height="20" rx="2" fill="#ffffff" />
        <rect width="9.33" height="20" fill="#002395" />
        <rect x="18.67" width="9.33" height="20" fill="#ed2939" />
      </svg>
    );
  }

  // Morocco Flag ('ar' / Darija)
  return (
    <svg
      viewBox="0 0 28 20"
      className={styles.flagSvg}
      aria-hidden="true"
    >
      <rect width="28" height="20" rx="2" fill="#c1272d" />
      <path
        d="M14 5.2l1.24 3.82h4.02l-3.25 2.36 1.24 3.82L14 12.84l-3.25 2.36 1.24-3.82-3.25-2.36h4.02z"
        fill="none"
        stroke="#006233"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations('nav');
  const [isPending, startTransition] = useTransition();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownMounted, setDropdownMounted] = useState(dropdownOpen);
  const [dropdownClosing, setDropdownClosing] = useState(false);

  useEffect(() => {
    if (dropdownOpen) {
      setDropdownMounted(true);
      setDropdownClosing(false);
    } else if (dropdownMounted) {
      setDropdownClosing(true);
      const timer = setTimeout(() => {
        setDropdownMounted(false);
        setDropdownClosing(false);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [dropdownOpen, dropdownMounted]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function handleSelectLocale(nextLocale: Locale) {
    setDropdownOpen(false);
    if (nextLocale === currentLocale) return;
    startTransition(async () => {
      await setLocaleCookieAction(nextLocale);
      router.refresh();
    });
  }

  const activeOption =
    LANGUAGE_OPTIONS.find((o) => o.locale === currentLocale) ??
    LANGUAGE_OPTIONS[0];

  return (
    <>
      {/* Desktop Pill Switcher (Text only) */}
      <div
        className={styles.desktopSwitcher}
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

      {/* Mobile Flag Dropdown */}
      <div className={styles.mobileDropdown} ref={dropdownRef}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setDropdownOpen((prev) => !prev)}
          className={styles.mobileTriggerBtn}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          aria-label={`${t('languageSelectorLabel')}: ${activeOption.label}`}
          title={activeOption.label}
        >
          <FlagIcon locale={currentLocale} />
          <ChevronDown
            size={14}
            className={`${styles.chevron} ${
              dropdownOpen ? styles.chevronOpen : ''
            }`}
          />
        </button>

        {dropdownMounted && (
          <div
            className={`${styles.dropdownMenu} ${
              dropdownClosing ? styles.dropdownMenuClosing : ''
            }`}
            role="listbox"
            aria-label={t('languageSelectorLabel')}
          >
            {LANGUAGE_OPTIONS.map((opt) => {
              const isActive = opt.locale === currentLocale;
              return (
                <button
                  key={opt.locale}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-label={opt.label}
                  title={opt.label}
                  disabled={isPending}
                  onClick={() => handleSelectLocale(opt.locale)}
                  className={`${styles.dropdownItem} ${
                    isActive ? styles.dropdownItemActive : ''
                  }`}
                >
                  <FlagIcon locale={opt.locale} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
