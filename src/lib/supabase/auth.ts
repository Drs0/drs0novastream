import { cookies } from 'next/headers';
import { createSupabaseServerClient } from './server';
import { getSupabaseEnv } from './config';

export const DEMO_ADMIN_COOKIE = 'novastream_demo_admin';
export const DEMO_ADMIN_EMAIL = 'admin@novastream.ma';

export interface AdminSessionStatus {
  isAuthenticated: boolean;
  isAuthorizedAdmin: boolean;
  email: string | null;
  userId: string | null;
  isMockMode: boolean;
}

/**
 * Verifies both authentication AND explicit admin_users allowlist authorization.
 * Simply being authenticated never grants admin access unless the user's UUID is in `admin_users`.
 */
export async function getAdminSessionStatus(): Promise<AdminSessionStatus> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    const cookieStore = await cookies();
    const demoSession = cookieStore.get(DEMO_ADMIN_COOKIE)?.value;
    if (demoSession === 'authorized_admin') {
      return {
        isAuthenticated: true,
        isAuthorizedAdmin: true,
        email: DEMO_ADMIN_EMAIL,
        userId: '00000000-0000-4000-8000-000000000001',
        isMockMode: true,
      };
    }
    return {
      isAuthenticated: false,
      isAuthorizedAdmin: false,
      email: null,
      userId: null,
      isMockMode: true,
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      isAuthenticated: false,
      isAuthorizedAdmin: false,
      email: null,
      userId: null,
      isMockMode: true,
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      isAuthenticated: false,
      isAuthorizedAdmin: false,
      email: null,
      userId: null,
      isMockMode: false,
    };
  }

  // Check explicit allowlist in `admin_users`
  const { data: allowlistEntry, error: allowlistError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const isAuthorizedAdmin = !allowlistError && Boolean(allowlistEntry?.user_id);

  return {
    isAuthenticated: true,
    isAuthorizedAdmin,
    email: user.email ?? null,
    userId: user.id,
    isMockMode: false,
  };
}

