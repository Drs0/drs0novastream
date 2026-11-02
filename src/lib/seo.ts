import type { Metadata } from 'next';
import type { Locale } from '@/types/database';

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

export function buildLocalizedMetadata({
  locale,
  pathname,
  title,
  description,
  imagePath,
}: {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  imagePath?: string | null;
}): Metadata {
  const siteUrl = getSiteUrl();
  const cleanPath = pathname === '/' ? '' : pathname;
  const canonicalUrl = `${siteUrl}${cleanPath || '/'}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'NovaStream',
      locale: locale === 'ar' ? 'ar_MA' : locale === 'fr' ? 'fr_MA' : 'en_US',
      type: 'website',
      images: imagePath ? [{ url: imagePath }] : undefined,
    },
  };
}
