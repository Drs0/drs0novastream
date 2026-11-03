import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getActiveLocale } from '@/i18n/request';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { LocaleDocumentSync } from '@/components/layout/LocaleDocumentSync';
import { CartProvider } from '@/components/storefront/CartContext';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { getPublicSiteSettings } from '@/lib/catalog/repository';

export default async function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, messages, settings] = await Promise.all([
    getActiveLocale(),
    getMessages(),
    getPublicSiteSettings(),
  ]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartProvider whatsappNumber={settings.whatsappNumber} locale={locale}>
        <LocaleDocumentSync locale={locale} />
        <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter settings={settings} />
          <CartDrawer />
        </div>
      </CartProvider>
    </NextIntlClientProvider>
  );
}

