-- ============================================================
-- Supabase SQL Schema for Lesquel Portfolio
-- Execute this in the Supabase SQL Editor
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES & MIGRATIONS (FIRST: Create/update tables)
-- ============================================================

-- Add missing columns to existing skills table (migration for recent updates)
alter table if exists public.skills
  add column if not exists slug text unique,
  add column if not exists description jsonb,
  add column if not exists display_order int default 0;

-- Add missing columns to existing projects table
alter table if exists public.projects
  add column if not exists display_order int default 0;

-- Add missing columns to existing profile table FIRST (before is_admin function)
alter table if exists public.profile
  add column if not exists cv_url text,
  add column if not exists cv_url_en text,
  add column if not exists user_id uuid,
  add column if not exists created_at timestamptz default now();

-- Create hobbies table if it doesn't exist (new entity)
create table if not exists public.hobbies (
  id uuid default uuid_generate_v4() primary key,
  name jsonb not null,
  description jsonb,
  icon_url text,
  display_order int default 0,
  created_at timestamptz default now() not null
);

-- Create courses table if it doesn't exist (new entity)
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  name jsonb not null,
  institution jsonb,
  description jsonb,
  certificate_url text,
  completion_date date,
  display_order int default 0,
  created_at timestamptz default now() not null
);

-- 2. Categories table
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name jsonb not null,  -- {"es": "Desarrollo Web", "en": "Web Development"}
  slug text unique not null,
  created_at timestamptz default now() not null
);

-- 3. Skills (Technologies) table
create table if not exists public.skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique,
  icon_url text,
  description jsonb,    -- {"es": "...", "en": "..."} for dedicated detail page
  type text not null check (type in ('frontend', 'backend', 'tool', 'other')),
  is_featured boolean default false,
  display_order int default 0,
  created_at timestamptz default now() not null
);

-- 4. Projects table (core)
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title jsonb not null,         -- {"es": "Mi Proyecto", "en": "My Project"}
  description jsonb not null,   -- {"es": "...", "en": "..."}
  content jsonb,                -- Long description / rich text per language
  image_url text,
  gallery_urls text[],
  demo_url text,
  repo_url text,
  is_published boolean default true,
  display_order int default 0,
  created_at timestamptz default now() not null
);

-- 5. Project <-> Skills pivot table (many-to-many)
create table if not exists public.project_skills (
  project_id uuid references public.projects(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  primary key (project_id, skill_id)
);

-- 6. Contact Messages table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text not null check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  content text not null,
  is_read boolean default false,
  created_at timestamptz default now() not null
);

-- 7. Profile table (single row — your personal info)
create table if not exists public.profile (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid,  -- Link to auth.users for RLS security
  full_name text not null default '',
  headline jsonb default '{"es": "", "en": ""}',
  bio jsonb default '{"es": "", "en": ""}',
  avatar_url text,
  cv_url text,           -- URL to the main CV/resume PDF
  cv_url_en text,        -- URL to the English CV/resume PDF
  social_github text,
  social_linkedin text,
  social_twitter text,
  social_website text,
  updated_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

-- ============================================================
-- Helper function: checks if current user is the admin
-- Since only one user exists in Supabase Auth (the admin),
-- any authenticated request is the admin by definition.
-- Using (select auth.uid()) avoids per-row re-evaluation in RLS.
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select (select auth.uid()) is not null
$$;

-- ============================================================
-- Indexes for performance
-- ============================================================
create index if not exists idx_projects_published on public.projects(is_published, display_order);
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_skills_featured on public.skills(is_featured);
create index if not exists idx_skills_slug on public.skills(slug);
create index if not exists idx_projects_title_gin on public.projects using gin(title);
create index if not exists idx_projects_description_gin on public.projects using gin(description);
create index if not exists idx_hobbies_order on public.hobbies(display_order);
create index if not exists idx_courses_order on public.courses(display_order);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.categories enable row level security;
alter table public.messages enable row level security;
alter table public.project_skills enable row level security;
alter table public.profile enable row level security;
alter table public.hobbies enable row level security;
alter table public.courses enable row level security;

-- ─── Public read access ───
drop policy if exists "Public: read published projects" on public.projects;
create policy "Public: read published projects"
  on public.projects for select using (is_published = true);

drop policy if exists "Public: read all skills" on public.skills;
create policy "Public: read all skills"
  on public.skills for select using (true);

drop policy if exists "Public: read all categories" on public.categories;
create policy "Public: read all categories"
  on public.categories for select using (true);

drop policy if exists "Public: read project_skills" on public.project_skills;
create policy "Public: read project_skills"
  on public.project_skills for select using (true);

drop policy if exists "Public: read profile" on public.profile;
create policy "Public: read profile"
  on public.profile for select using (true);

drop policy if exists "Public: read hobbies" on public.hobbies;
create policy "Public: read hobbies"
  on public.hobbies for select using (true);

drop policy if exists "Public: read courses" on public.courses;
create policy "Public: read courses"
  on public.courses for select using (true);

-- Anyone can insert a contact message
drop policy if exists "Public: insert messages" on public.messages;
create policy "Public: insert messages"
  on public.messages for insert with check (true);

-- ─── Admin: full access for authenticated users ───
-- Uses is_admin() which checks (select auth.uid()) IS NOT NULL
-- This avoids the per-row re-evaluation bug that causes 42501 errors

-- Projects (admin can read ALL projects, not just published)
drop policy if exists "Admin: full read projects" on public.projects;
create policy "Admin: full read projects"
  on public.projects for select using (is_admin());

drop policy if exists "Admin: insert projects" on public.projects;
create policy "Admin: insert projects"
  on public.projects for insert with check (is_admin());

drop policy if exists "Admin: update projects" on public.projects;
create policy "Admin: update projects"
  on public.projects for update using (is_admin());

drop policy if exists "Admin: delete projects" on public.projects;
create policy "Admin: delete projects"
  on public.projects for delete using (is_admin());

-- Skills
drop policy if exists "Admin: insert skills" on public.skills;
create policy "Admin: insert skills"
  on public.skills for insert with check (is_admin());

drop policy if exists "Admin: update skills" on public.skills;
create policy "Admin: update skills"
  on public.skills for update using (is_admin());

drop policy if exists "Admin: delete skills" on public.skills;
create policy "Admin: delete skills"
  on public.skills for delete using (is_admin());

-- Project Skills
drop policy if exists "Admin: insert project_skills" on public.project_skills;
create policy "Admin: insert project_skills"
  on public.project_skills for insert with check (is_admin());

drop policy if exists "Admin: delete project_skills" on public.project_skills;
create policy "Admin: delete project_skills"
  on public.project_skills for delete using (is_admin());

-- Messages (admin can read, update, delete)
drop policy if exists "Admin: read messages" on public.messages;
create policy "Admin: read messages"
  on public.messages for select using (is_admin());

drop policy if exists "Admin: update messages" on public.messages;
create policy "Admin: update messages"
  on public.messages for update using (is_admin());

drop policy if exists "Admin: delete messages" on public.messages;
create policy "Admin: delete messages"
  on public.messages for delete using (is_admin());

-- Profile (admin can insert, update)
drop policy if exists "Admin: insert profile" on public.profile;
create policy "Admin: insert profile"
  on public.profile for insert with check ((select auth.uid()) is not null);

drop policy if exists "Admin: update profile" on public.profile;
create policy "Admin: update profile"
  on public.profile for update using (is_admin());

-- Categories
drop policy if exists "Admin: insert categories" on public.categories;
create policy "Admin: insert categories"
  on public.categories for insert with check (is_admin());

drop policy if exists "Admin: update categories" on public.categories;
create policy "Admin: update categories"
  on public.categories for update using (is_admin());

drop policy if exists "Admin: delete categories" on public.categories;
create policy "Admin: delete categories"
  on public.categories for delete using (is_admin());

-- Hobbies
drop policy if exists "Admin: insert hobbies" on public.hobbies;
create policy "Admin: insert hobbies"
  on public.hobbies for insert with check (is_admin());

drop policy if exists "Admin: update hobbies" on public.hobbies;
create policy "Admin: update hobbies"
  on public.hobbies for update using (is_admin());

drop policy if exists "Admin: delete hobbies" on public.hobbies;
create policy "Admin: delete hobbies"
  on public.hobbies for delete using (is_admin());

-- Courses
drop policy if exists "Admin: insert courses" on public.courses;
create policy "Admin: insert courses"
  on public.courses for insert with check (is_admin());

drop policy if exists "Admin: update courses" on public.courses;
create policy "Admin: update courses"
  on public.courses for update using (is_admin());

drop policy if exists "Admin: delete courses" on public.courses;
create policy "Admin: delete courses"
  on public.courses for delete using (is_admin());

-- ============================================================
-- Storage buckets
-- ============================================================
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Storage RLS: anyone can read, only admin can upload/delete
drop policy if exists "Public read portfolio" on storage.objects;
create policy "Public read portfolio"
  on storage.objects for select using (bucket_id = 'portfolio');

drop policy if exists "Admin upload portfolio" on storage.objects;
create policy "Admin upload portfolio"
  on storage.objects for insert with check (bucket_id = 'portfolio' and (select auth.uid()) is not null);

drop policy if exists "Admin update portfolio" on storage.objects;
create policy "Admin update portfolio"
  on storage.objects for update using (bucket_id = 'portfolio' and (select auth.uid()) is not null);

drop policy if exists "Admin delete portfolio" on storage.objects;
create policy "Admin delete portfolio"
  on storage.objects for delete using (bucket_id = 'portfolio' and (select auth.uid()) is not null);

-- ============================================================
-- Schema migrations for detail pages
-- ============================================================
-- Hobbies: add slug, content, image_url, gallery_urls
alter table if exists public.hobbies
  add column if not exists slug text unique,
  add column if not exists content jsonb,
  add column if not exists image_url text,
  add column if not exists gallery_urls text[];

-- Courses: add slug
alter table if exists public.courses
  add column if not exists slug text unique;

-- Indexes for new slugs
create index if not exists idx_hobbies_slug on public.hobbies(slug);
create index if not exists idx_courses_slug on public.courses(slug);

-- ============================================================
-- Sample seed data (optional — remove in production)
-- ============================================================
insert into public.skills (name, slug, type, is_featured) values
  ('Angular', 'angular', 'frontend', true),
  ('TypeScript', 'typescript', 'frontend', true),
  ('Tailwind CSS', 'tailwind-css', 'frontend', true),
  ('Supabase', 'supabase', 'backend', true),
  ('PostgreSQL', 'postgresql', 'backend', true),
  ('Node.js', 'nodejs', 'backend', true),
  ('GSAP', 'gsap', 'frontend', true),
  ('RxJS', 'rxjs', 'frontend', true),
  ('Git', 'git', 'tool', true),
  ('Docker', 'docker', 'tool', true),
  ('Figma', 'figma', 'tool', true),
  ('HTML5', 'html5', 'frontend', true)
on conflict (slug) do nothing;
