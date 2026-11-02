import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getActiveLocale } from '@/i18n/request';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { LocaleDocumentSync } from '@/components/layout/LocaleDocumentSync';
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
      <LocaleDocumentSync locale={locale} />
      <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter settings={settings} />
      </div>
    </NextIntlClientProvider>
  );
}

