'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import {
  DEMO_ADMIN_COOKIE,
  DEMO_ADMIN_EMAIL,
  getAdminSessionStatus,
} from '@/lib/supabase/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { getMockStore } from '@/lib/catalog/repository';
import {
  categoryUpsertSchema,
  serviceUpsertSchema,
  siteSettingsUpdateSchema,
  type CategoryUpsertInput,
  type ServiceUpsertInput,
} from '@/lib/validations/catalog';
import type { Locale } from '@/types/database';

async function requireAuthorizedAdmin() {
  const session = await getAdminSessionStatus();
  if (!session.isAuthenticated || !session.isAuthorizedAdmin) {
    throw new Error('Unauthorized: Admin allowlist permission required.');
  }
  return session;
}

export async function loginAdminAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    // Clearly labeled local development fallback when Supabase env vars are not yet configured
    if (
      email.toLowerCase() === DEMO_ADMIN_EMAIL &&
      password === 'NovaStreamAdmin2026!'
    ) {
      const cookieStore = await cookies();
      cookieStore.set(DEMO_ADMIN_COOKIE, 'authorized_admin', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 12,
      });
      return { success: true };
    }
    return {
      success: false,
      error:
        'Invalid credentials or user is not in the admin_users allowlist.',
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, error: 'Supabase client unavailable.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message || 'Invalid login credentials.',
    };
  }

  // Verify explicit allowlist membership in `admin_users`
  const { data: allowlistRow } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (!allowlistRow?.user_id) {
    await supabase.auth.signOut();
    return {
      success: false,
      error:
        'Access denied: Your account is not authorized in the admin_users allowlist.',
    };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function logoutAdminAction(): Promise<void> {
  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    const cookieStore = await cookies();
    cookieStore.delete(DEMO_ADMIN_COOKIE);
    revalidatePath('/admin');
    return;
  }

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath('/admin');
}

export async function saveServiceAction(
  rawInput: ServiceUpsertInput
): Promise<{ success: boolean; serviceId?: string; error?: string }> {
  try {
    await requireAuthorizedAdmin();
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unauthorized',
    };
  }

  const parsed = serviceUpsertSchema.safeParse(rawInput);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue
        ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
        : 'Validation failed',
    };
  }

  const data = parsed.data;
  const { isConfigured } = getSupabaseEnv();

  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return { success: false, error: 'Database connection unavailable.' };
    }

    const servicePayload = {
      category_id: data.category_id,
      name: data.name,
      slug: data.slug,
      short_description: data.short_description ?? null,
      description: data.description ?? null,
      cover_image_path: data.cover_image_path ?? null,
      gallery_paths: data.gallery_paths ?? [],
      status: data.status,
      is_featured: data.is_featured,
      sort_order: data.sort_order,
      terms_text: data.terms_text ?? null,
      seo_title: data.seo_title ?? null,
      seo_description: data.seo_description ?? null,
    };

    let serviceId = data.id;

    if (serviceId) {
      const { error: updateErr } = await supabase
        .from('services')
        .update(servicePayload)
        .eq('id', serviceId);
      if (updateErr) {
        return { success: false, error: updateErr.message };
      }
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from('services')
        .insert(servicePayload)
        .select('id')
        .single();
      if (insertErr || !inserted) {
        return {
          success: false,
          error: insertErr?.message ?? 'Failed to create service',
        };
      }
      serviceId = inserted.id;
    }

    // Upsert translations
    const locales: Locale[] = ['en', 'fr', 'ar'];
    for (const loc of locales) {
      const tr = data.translations[loc];
      if (tr && tr.name.trim()) {
        const { error: trErr } = await supabase
          .from('service_translations')
          .upsert({
            service_id: serviceId,
            locale: loc,
            name: tr.name.trim(),
            short_description: tr.short_description ?? null,
            description: tr.description ?? null,
            seo_title: tr.seo_title ?? null,
            seo_description: tr.seo_description ?? null,
            image_alt: tr.image_alt ?? null,
          });
        if (trErr) {
          return { success: false, error: trErr.message };
        }
      }
    }

    // Replace variants for this service
    await supabase.from('service_variants').delete().eq('service_id', serviceId);
    if (data.variants.length > 0) {
      const variantsToInsert = data.variants.map((v, idx) => ({
        service_id: serviceId,
        sku: v.sku ?? null,
        label: v.label,
        platform: v.platform ?? null,
        edition: v.edition ?? null,
        tier: v.tier ?? null,
        duration_months: v.duration_months ?? null,
        access_type: v.access_type ?? null,
        price_mad: v.price_mad,
        sale_price_mad: v.sale_price_mad ?? null,
        is_available: v.is_available,
        sort_order: v.sort_order ?? idx + 1,
      }));
      const { error: varErr } = await supabase
        .from('service_variants')
        .insert(variantsToInsert);
      if (varErr) {
        return { success: false, error: varErr.message };
      }
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, serviceId };
  }

  // Mock Store mutation when running in local seed mode
  const store = getMockStore();
  const now = new Date().toISOString();
  const serviceId = data.id || crypto.randomUUID();

  const existingIdx = store.services.findIndex((s) => s.id === serviceId);
  const serviceRow = {
    id: serviceId,
    category_id: data.category_id,
    name: data.name,
    slug: data.slug,
    short_description: data.short_description ?? null,
    description: data.description ?? null,
    cover_image_path: data.cover_image_path ?? null,
    gallery_paths: data.gallery_paths ?? [],
    status: data.status,
    is_featured: data.is_featured,
    sort_order: data.sort_order,
    terms_text: data.terms_text ?? null,
    seo_title: data.seo_title ?? null,
    seo_description: data.seo_description ?? null,
    created_at:
      existingIdx >= 0 ? store.services[existingIdx].created_at : now,
    updated_at: now,
  };

  if (existingIdx >= 0) {
    store.services[existingIdx] = serviceRow;
  } else {
    store.services.push(serviceRow);
  }

  // Update translations
  store.serviceTranslations = store.serviceTranslations.filter(
    (t) => t.service_id !== serviceId
  );
  (['en', 'fr', 'ar'] as Locale[]).forEach((loc) => {
    const tr = data.translations[loc];
    if (tr && tr.name.trim()) {
      store.serviceTranslations.push({
        service_id: serviceId,
        locale: loc,
        name: tr.name.trim(),
        short_description: tr.short_description ?? null,
        description: tr.description ?? null,
        seo_title: tr.seo_title ?? null,
        seo_description: tr.seo_description ?? null,
        image_alt: tr.image_alt ?? null,
      });
    }
  });

  // Update variants
  store.variants = store.variants.filter((v) => v.service_id !== serviceId);
  data.variants.forEach((v, idx) => {
    store.variants.push({
      id: v.id || crypto.randomUUID(),
      service_id: serviceId,
      sku: v.sku ?? null,
      label: v.label,
      platform: v.platform ?? null,
      edition: v.edition ?? null,
      tier: v.tier ?? null,
      duration_months: v.duration_months ?? null,
      access_type: v.access_type ?? null,
      price_mad: v.price_mad,
      sale_price_mad: v.sale_price_mad ?? null,
      is_available: v.is_available,
      sort_order: v.sort_order ?? idx + 1,
      created_at: now,
      updated_at: now,
    });
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, serviceId };
}

export async function deleteServiceAction(
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuthorizedAdmin();
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unauthorized',
    };
  }

  const { isConfigured } = getSupabaseEnv();
  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: 'Database unavailable' };
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);
    if (error) return { success: false, error: error.message };
  } else {
    const store = getMockStore();
    store.services = store.services.filter((s) => s.id !== serviceId);
    store.serviceTranslations = store.serviceTranslations.filter(
      (t) => t.service_id !== serviceId
    );
    store.variants = store.variants.filter((v) => v.service_id !== serviceId);
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function saveCategoryAction(
  rawInput: CategoryUpsertInput
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuthorizedAdmin();
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unauthorized',
    };
  }

  const parsed = categoryUpsertSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid category data',
    };
  }

  const data = parsed.data;
  const { isConfigured } = getSupabaseEnv();

  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: 'Database unavailable' };

    let categoryId = data.id;
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      image_path: data.image_path ?? null,
      whatsapp_number: data.whatsapp_number ?? null,
      sort_order: data.sort_order,
      is_active: data.is_active,
    };

    if (categoryId) {
      const { error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', categoryId);
      if (error) return { success: false, error: error.message };
    } else {
      const { data: inserted, error } = await supabase
        .from('categories')
        .insert(payload)
        .select('id')
        .single();
      if (error || !inserted) {
        return {
          success: false,
          error: error?.message ?? 'Failed to create category',
        };
      }
      categoryId = inserted.id;
    }

    for (const loc of ['en', 'fr', 'ar'] as Locale[]) {
      const tr = data.translations[loc];
      if (tr && tr.name.trim()) {
        await supabase.from('category_translations').upsert({
          category_id: categoryId,
          locale: loc,
          name: tr.name.trim(),
          description: tr.description ?? null,
        });
      }
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  }

  const store = getMockStore();
  const categoryId = data.id || crypto.randomUUID();
  const existingIdx = store.categories.findIndex((c) => c.id === categoryId);

  const row = {
    id: categoryId,
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    image_path: data.image_path ?? null,
    whatsapp_number: data.whatsapp_number ?? null,
    sort_order: data.sort_order,
    is_active: data.is_active,
    created_at:
      existingIdx >= 0
        ? store.categories[existingIdx].created_at
        : new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    store.categories[existingIdx] = row;
  } else {
    store.categories.push(row);
  }

  store.categoryTranslations = store.categoryTranslations.filter(
    (t) => t.category_id !== categoryId
  );
  (['en', 'fr', 'ar'] as Locale[]).forEach((loc) => {
    const tr = data.translations[loc];
    if (tr && tr.name.trim()) {
      store.categoryTranslations.push({
        category_id: categoryId,
        locale: loc,
        name: tr.name.trim(),
        description: tr.description ?? null,
      });
    }
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuthorizedAdmin();
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unauthorized',
    };
  }

  const { isConfigured } = getSupabaseEnv();
  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: 'Database unavailable' };
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
    if (error) {
      return {
        success: false,
        error:
          'Cannot delete category while services are still assigned to it.',
      };
    }
  } else {
    const store = getMockStore();
    const hasServices = store.services.some((s) => s.category_id === categoryId);
    if (hasServices) {
      return {
        success: false,
        error:
          'Cannot delete category while services are still assigned to it.',
      };
    }
    store.categories = store.categories.filter((c) => c.id !== categoryId);
    store.categoryTranslations = store.categoryTranslations.filter(
      (t) => t.category_id !== categoryId
    );
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function saveSiteSettingsAction(
  rawInput: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuthorizedAdmin();
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unauthorized',
    };
  }

  const parsed = siteSettingsUpdateSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid settings input',
    };
  }

  const data = parsed.data;
  const entries: { key: string; value: unknown; is_public: boolean }[] = [
    { key: 'whatsapp_number', value: data.whatsappNumber, is_public: true },
    { key: 'contact_email', value: data.contactEmail, is_public: true },
    { key: 'support_hours', value: data.supportHours, is_public: true },
    { key: 'default_locale', value: data.defaultLocale, is_public: true },
    { key: 'social_links', value: data.socialLinks, is_public: true },
  ];

  const { isConfigured } = getSupabaseEnv();
  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: 'Database unavailable' };

    for (const item of entries) {
      const { error } = await supabase.from('site_settings').upsert(item);
      if (error) return { success: false, error: error.message };
    }
  } else {
    const store = getMockStore();
    const now = new Date().toISOString();
    for (const item of entries) {
      const idx = store.siteSettings.findIndex((s) => s.key === item.key);
      if (idx >= 0) {
        store.siteSettings[idx] = { ...item, updated_at: now };
      } else {
        store.siteSettings.push({ ...item, updated_at: now });
      }
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

