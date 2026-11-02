'use client';

import { useEffect } from 'react';
import type { Locale } from '@/types/database';

export function LocaleDocumentSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return null;
}

