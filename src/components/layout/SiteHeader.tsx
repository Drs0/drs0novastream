'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/components/storefront/CartContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './SiteHeader.module.scss';

export function SiteHeader() {
  const t = useTranslations('nav');
  const cartT = useTranslations('cart');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  const [menuMounted, setMenuMounted] = useState(mobileOpen);
  const [menuClosing, setMenuClosing] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      setMenuMounted(true);
      setMenuClosing(false);
    } else if (menuMounted) {
      setMenuClosing(true);
      const timer = setTimeout(() => {
        setMenuMounted(false);
        setMenuClosing(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [mobileOpen, menuMounted]);

  const links = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('services') },
    { href: '/categories', label: t('categories') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            className={styles.logoMark}
          />
          <span className="ltrInline">
            Nova<span className={styles.brandAccent}>Stream</span>
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {links.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cartBtn}
            onClick={openCart}
            aria-label={cartT('openCart')}
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </button>
          <LanguageSwitcher />
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuMounted && (
        <nav
          className={`${styles.mobileDrawer} ${
            menuClosing ? styles.mobileDrawerClosing : ''
          }`}
          aria-label="Mobile navigation"
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

