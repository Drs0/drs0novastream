import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import type { Locale } from '@/types/database';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'fr', 'ar'];
export const DEFAULT_LOCALE: Locale = 'fr';
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export async function getActiveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  if (saved && SUPPORTED_LOCALES.includes(saved as Locale)) {
    return saved as Locale;
  }
  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const locale = await getActiveLocale();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
