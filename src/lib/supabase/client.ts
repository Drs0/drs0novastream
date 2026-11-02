import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from './config';

export function createSupabaseBrowserClient() {
  const { url, publishableKey, isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return null;
  }
  return createBrowserClient(url, publishableKey);
}

