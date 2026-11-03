import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Cairo, Inter } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.scss';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
  },
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  let locale = 'fr';
  try {
    locale = await getLocale();
  } catch {
    locale = 'fr';
  }

  const isRtl = locale === 'ar';

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
