import NextLink from 'next/link';
import { redirect as nextRedirect } from 'next/navigation';
import type { Locale } from '@/types/database';

export const routing = {
  locales: ['en', 'fr', 'ar'] as Locale[],
  defaultLocale: 'fr' as Locale,
};

export const Link = NextLink;
export const redirect = nextRedirect;
