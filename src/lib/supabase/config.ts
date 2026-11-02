export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    '';

  const isConfigured =
    Boolean(url) &&
    Boolean(publishableKey) &&
    !url.includes('YOUR_PROJECT.supabase.co') &&
    publishableKey !== 'YOUR_PUBLIC_KEY';

  return {
    url,
    publishableKey,
    isConfigured,
  };
}

