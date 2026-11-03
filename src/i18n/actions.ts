'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { Locale } from '@/types/database';
import { LOCALE_COOKIE_NAME, SUPPORTED_LOCALES } from './request';

export async function setLocaleCookieAction(nextLocale: Locale): Promise<void> {
  if (!SUPPORTED_LOCALES.includes(nextLocale)) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, nextLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year first-party cookie
    sameSite: 'lax',
  });

  revalidatePath('/', 'layout');
}

