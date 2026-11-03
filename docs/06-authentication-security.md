# 06 — Authentication and Security

[← 05 — Database](./05-database.md) | [Back to Index](./README.md) | [Next: 07 — Services & Pricing →](./07-services-pricing.md)

---

## 1. Authentication vs. Authorization (What is the Difference?)

Many beginners confuse these two words, so let's define them clearly:

- **Authentication ("Who are you?"):** Proving your identity by logging in with an email and password through **Supabase Auth**.
- **Authorization ("What are you allowed to do?"):** Checking whether your logged-in account has permission to access `/admin` and edit the database.

In NovaStream, **simply logging in is NOT enough to become an admin**. Even if an authenticated user exists in `auth.users`, they have **zero admin permissions** unless their `user_id` UUID is also explicitly listed in the `public.admin_users` allowlist table.

---

## 2. How Admin Login and Sessions Work

### Step-by-Step Login Flow

1. The admin visits `/admin/login` ([`src/app/admin/login/page.tsx`](../src/app/admin/login/page.tsx)) and enters their email and password.
2. Submitting the form calls the Server Action [`loginAdminAction`](../src/app/admin/actions.ts).
3. In **Live Supabase Mode**:
   ```typescript
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password,
   });
   ```
   - Supabase Auth verifies the email and password.
   - Next, `loginAdminAction` checks if `data.user.id` exists in `public.admin_users`:
     ```typescript
     const { data: allowlistRow } = await supabase
       .from('admin_users')
       .select('user_id')
       .eq('user_id', data.user.id)
       .maybeSingle();

     if (!allowlistRow?.user_id) {
       await supabase.auth.signOut();
       return {
         success: false,
         error: 'Access denied: Your account is not authorized in the admin_users allowlist.',
       };
     }
     ```
   - If the user is not in `admin_users`, they are immediately signed out and denied entry.
4. In **Local Seed / Demo Mode** (when `.env.local` has placeholder Supabase credentials):
   - `loginAdminAction` checks against the local demo account (`admin@novastream.ma`) and sets an `httpOnly` cookie named `novastream_demo_admin`.

---

## 3. How Protected Routes Work (`/admin`)

Every admin page (except `/admin/login`) is wrapped inside the Server Component [`AdminProtectedShell`](../src/components/admin/AdminProtectedShell.tsx):

```typescript
export async function AdminProtectedShell({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSessionStatus();

  if (!session.isAuthenticated || !session.isAuthorizedAdmin) {
    redirect('/admin/login');
  }

  return (
    <div className={styles.adminShell} dir="ltr" lang="en">
      <AdminSidebar />
      <div className={styles.mainArea}>
        <AdminHeader email={session.email} isMockMode={session.isMockMode} />
        <div className={styles.contentPad}>{children}</div>
      </div>
    </div>
  );
}
```

And every Server Action that modifies data (`saveServiceAction`, `deleteServiceAction`, `saveCategoryAction`, `deleteCategoryAction`, `saveSiteSettingsAction`) calls `requireAuthorizedAdmin()` on the server before doing anything else.

---

## 4. Row Level Security (RLS) Explained Simply

### What is RLS?
Normally, if browser code has a database connection URL and public key, anyone could open browser DevTools and try to run `supabase.from('services').delete()`.

**Row Level Security (RLS)** is a built-in PostgreSQL firewall that checks every single `SELECT`, `INSERT`, `UPDATE`, and `DELETE` query inside the database engine itself. If a query violates the policy, PostgreSQL rejects it—even if an attacker crafts a custom HTTP request.

### The Non-Recursive `public.is_admin()` Helper
In [`0001_init.sql`](../supabase/migrations/0001_init.sql), we define a special SQL function:

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;
```

- **Why `SECURITY DEFINER`?** If an RLS policy on `admin_users` queries `admin_users` directly, PostgreSQL can enter an infinite loop (recursion). Marking `public.is_admin()` as `SECURITY DEFINER` with a locked `search_path = public` allows PostgreSQL to safely check whether the current user's JWT ID (`auth.uid()`) is in `public.admin_users` without recursion.

### Summary of RLS Policies Across All 7 Tables

| Table | Anonymous / Public Visitors (`anon`) | Logged-in Non-Admin (`authenticated`) | Allowlisted Admin (`public.is_admin() = TRUE`) |
|---|---|---|---|
| `admin_users` | No access (`0 rows`) | Cannot read or self-insert (`0 rows`) | Can `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `categories` | Can `SELECT` only rows where `is_active = TRUE` | Same as public | Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `category_translations` | Can `SELECT` only for active categories | Same as public | Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `services` | Can `SELECT` only where `status = 'published'` and category is active | Same as public | Full `SELECT` (including drafts) & CRUD |
| `service_translations` | Can `SELECT` only for published services in active categories | Same as public | Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `service_variants` | Can `SELECT` only variants belonging to published services | Same as public | Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `site_settings` | Can `SELECT` only rows where `is_public = TRUE` | Same as public | Full `SELECT` (including private notes) & CRUD |

---

## 5. Supabase Keys Security Rule

Supabase provides two types of API keys in your project dashboard:
1. **Publishable / `anon` key:** Safe to put in `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` because every request made with this key is restricted by the Row Level Security policies above.
2. **`service_role` secret key:** Bypasses all RLS policies completely. **Never** put a `service_role` key in `.env.local` under `NEXT_PUBLIC_*` or anywhere in browser code. Automated test #11 in [`src/__tests__/run-tests.ts`](../src/__tests__/run-tests.ts) explicitly verifies that `.env.example` never contains a `SERVICE_ROLE` variable.

---

## 6. Input Validation with Zod

In addition to PostgreSQL constraints, [`src/lib/validations/catalog.ts`](../src/lib/validations/catalog.ts) validates all user inputs using **Zod**:
- Slugs must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- Prices (`price_mad`, `sale_price_mad`) must be non-negative integers (`z.number().int().min(0)`).
- `sale_price_mad` must be strictly less than `price_mad`.
- A service cannot be set to `status = 'published'` if its `variants` array is empty.
- Duplicate variant option combinations within the same service are rejected.
- WhatsApp numbers must match `^[1-9][0-9]{7,14}$` (international format without `+`).
- Uploaded images must be `image/webp`, `image/avif`, `image/png`, or `image/jpeg` and `<= 5 MB`.

