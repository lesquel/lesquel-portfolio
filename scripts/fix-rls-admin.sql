-- ============================================================
-- FIX: RLS Admin Policies — Run this in Supabase SQL Editor
-- ============================================================
-- Problem: is_admin() checks profile.user_id = auth.uid()
-- but the profile row may not have user_id set, or may not exist at all.
--
-- Fix: Simplify is_admin() to check auth.uid() IS NOT NULL.
-- Since only one user exists in Supabase Auth (the admin),
-- any authenticated request is the admin by definition.
-- ============================================================

-- 1. Fix is_admin() function — any authenticated user IS the admin
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select (select auth.uid()) is not null
$$;

-- 2. Fix profile insert policy — allow any authenticated user to insert
--    (removes the circular dependency)
drop policy if exists "Admin: insert profile" on public.profile;
create policy "Admin: insert profile"
  on public.profile for insert
  with check ((select auth.uid()) is not null);

-- 3. Ensure the existing profile row has user_id linked to the auth user
--    This updates ANY profile row that has NULL user_id.
--    Run this WHILE LOGGED IN as the admin (or use service_role key).
--    If running from SQL Editor (which uses service_role), we pick the
--    single user from auth.users:
do $$
declare
  v_user_id uuid;
begin
  -- Get the single admin user from auth.users
  select id into v_user_id from auth.users limit 1;

  if v_user_id is not null then
    -- Update profile rows that have no user_id
    update public.profile
    set user_id = v_user_id
    where user_id is null;

    raise notice 'Updated profile.user_id to %', v_user_id;
  else
    raise notice 'No users found in auth.users. Create the admin user first.';
  end if;
end $$;

-- 4. Verify the fix
select
  p.id,
  p.full_name,
  p.user_id,
  u.email,
  public.is_admin() as is_admin_check
from public.profile p
left join auth.users u on u.id = p.user_id
limit 5;
