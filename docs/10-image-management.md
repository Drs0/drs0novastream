# 10 — Image Management

[← 09 — Admin Dashboard](./09-admin-dashboard.md) | [Back to Index](./README.md) | [Next: 11 — WhatsApp Integration →](./11-whatsapp-integration.md)

---

## 1. How Images Are Stored in NovaStream

NovaStream supports two ways of serving product and category images:

1. **Local Static Assets (`public/images/`):**
   - Stored inside the Git repository under `public/images/categories/` and `public/images/services/`.
   - Used by default for the seeded categories and services (for example, `/images/services/ps-plus-cover.svg`), as well as the extracted neon brand logo (`/logo.png` and `/favicon.ico`).
2. **Supabase Storage Bucket (`service-images`):**
   - When connected to a live Supabase project, admins can upload custom product photos (WebP, AVIF, PNG, JPEG) directly from `/admin/services/new` or `/admin/services/[id]/edit` using [`ImageUploader.tsx`](../src/components/admin/ImageUploader.tsx).

---

## 2. Supabase Storage Bucket Configuration (`service-images`)

In [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql), the `service-images` bucket is created automatically with strict limits:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'service-images',
  'service-images',
  TRUE,
  5242880, -- 5 MB max (5 * 1024 * 1024 bytes)
  ARRAY['image/webp', 'image/avif', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
```

### Storage Security Policies (`storage.objects`)
Even though the bucket is marked `public = TRUE` (so customers can view product images without logging in), **write access is locked down by Row Level Security**:
- **`SELECT` (View):** Allowed for `anon` and `authenticated` where `bucket_id = 'service-images'`.
- **`INSERT` (Upload):** Allowed **only** for `authenticated` users where `bucket_id = 'service-images' AND public.is_admin()`.
- **`UPDATE` (Modify):** Allowed **only** where `bucket_id = 'service-images' AND public.is_admin()`.
- **`DELETE` (Remove):** Allowed **only** where `bucket_id = 'service-images' AND public.is_admin()`.

---

## 3. Application-Level Image Validation

Before an image is even sent over the network to Supabase Storage, [`validateImageUpload`](../src/lib/validations/catalog.ts) checks three rules in the browser:

```typescript
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/webp',
  'image/avif',
  'image/png',
  'image/jpeg',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['webp', 'avif', 'png', 'jpg', 'jpeg'] as const;

export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
```

1. **MIME Type Check:** Rejects unsupported or potentially dangerous file types (such as `.svg` uploads from untrusted files, `.exe`, or `.html`).
2. **File Size Check:** Rejects empty (`0 byte`) files or files larger than `5 MB`.
3. **File Extension Check:** Ensures the filename ends in `.webp`, `.avif`, `.png`, `.jpg`, or `.jpeg`.

---

## 4. Step-by-Step Upload Flow (`ImageUploader.tsx`)

Let's look at how [`handleFileSelect`](../src/components/admin/ImageUploader.tsx) uploads a file and generates a unique storage path:

```typescript
const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
const safeFolder = 'services';
const uniqueName = `${safeFolder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

const { error } = await supabase.storage
  .from('service-images')
  .upload(uniqueName, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
```

**Why this works well:**
1. Instead of using the user's original filename (which might contain spaces, Arabic characters, or overwrite an existing file with the same name), it generates a predictable folder and unique filename: `services/1793630000000-550e8400-e29b-41d4-a716-446655440000.webp`.
2. `upsert: false` prevents accidentally overwriting an existing image.
3. After uploading, `supabase.storage.from('service-images').getPublicUrl(uniqueName)` retrieves the public HTTPS URL and automatically fills in the **Cover Image Path** and adds it to the **Gallery Images** list.
4. When you click **Save Service**, those URLs are stored in `services.cover_image_path` and `services.gallery_paths`.

---

## 5. How to Replace or Remove Images

- **Replacing a Cover Image:** In `/admin/services/[id]/edit`, either upload a new image file (which updates the Cover Image field automatically), click one of the preset buttons, or paste a new image URL into **Cover Image Path or URL**, then click **Save Service**.
- **Removing a Gallery Image:** Click the red trash icon next to any path under **Gallery Images**, then click **Save Service**.
  - *(Note: As mentioned in [01 — Project Overview](./01-project-overview.md), clicking the trash icon removes the image URL from the service's `gallery_paths` array in PostgreSQL, but does not delete the file object from the Supabase Storage bucket itself. You can delete unused files manually from the Supabase Dashboard → Storage → `service-images`.)*

