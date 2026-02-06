-- ============================================================
-- Supabase SQL Schema for Lesquel Portfolio
-- Execute this in the Supabase SQL Editor
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

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
  icon_url text,
  type text not null check (type in ('frontend', 'backend', 'tool', 'other')),
  is_featured boolean default false,
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
  full_name text not null default '',
  headline jsonb default '{"es": "", "en": ""}',
  bio jsonb default '{"es": "", "en": ""}',
  avatar_url text,
  social_github text,
  social_linkedin text,
  social_twitter text,
  social_website text,
  updated_at timestamptz default now() not null
);

-- ============================================================
-- Indexes for performance
-- ============================================================
create index if not exists idx_projects_published on public.projects(is_published, display_order);
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_skills_featured on public.skills(is_featured);
create index if not exists idx_projects_title_gin on public.projects using gin(title);
create index if not exists idx_projects_description_gin on public.projects using gin(description);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.categories enable row level security;
alter table public.messages enable row level security;
alter table public.project_skills enable row level security;
alter table public.profile enable row level security;

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

-- Anyone can insert a contact message
drop policy if exists "Public: insert messages" on public.messages;
create policy "Public: insert messages"
  on public.messages for insert with check (true);

-- ─── Admin: full access for authenticated users ───
-- Projects (admin can read ALL projects, not just published)
drop policy if exists "Admin: full read projects" on public.projects;
create policy "Admin: full read projects"
  on public.projects for select using (auth.role() = 'authenticated');

drop policy if exists "Admin: insert projects" on public.projects;
create policy "Admin: insert projects"
  on public.projects for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admin: update projects" on public.projects;
create policy "Admin: update projects"
  on public.projects for update using (auth.role() = 'authenticated');

drop policy if exists "Admin: delete projects" on public.projects;
create policy "Admin: delete projects"
  on public.projects for delete using (auth.role() = 'authenticated');

-- Skills
drop policy if exists "Admin: insert skills" on public.skills;
create policy "Admin: insert skills"
  on public.skills for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admin: update skills" on public.skills;
create policy "Admin: update skills"
  on public.skills for update using (auth.role() = 'authenticated');

drop policy if exists "Admin: delete skills" on public.skills;
create policy "Admin: delete skills"
  on public.skills for delete using (auth.role() = 'authenticated');

-- Project Skills
drop policy if exists "Admin: insert project_skills" on public.project_skills;
create policy "Admin: insert project_skills"
  on public.project_skills for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admin: delete project_skills" on public.project_skills;
create policy "Admin: delete project_skills"
  on public.project_skills for delete using (auth.role() = 'authenticated');

-- Messages (admin can read, update, delete)
drop policy if exists "Admin: read messages" on public.messages;
create policy "Admin: read messages"
  on public.messages for select using (auth.role() = 'authenticated');

drop policy if exists "Admin: update messages" on public.messages;
create policy "Admin: update messages"
  on public.messages for update using (auth.role() = 'authenticated');

drop policy if exists "Admin: delete messages" on public.messages;
create policy "Admin: delete messages"
  on public.messages for delete using (auth.role() = 'authenticated');

-- Profile (admin can insert, update)
drop policy if exists "Admin: insert profile" on public.profile;
create policy "Admin: insert profile"
  on public.profile for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admin: update profile" on public.profile;
create policy "Admin: update profile"
  on public.profile for update using (auth.role() = 'authenticated');

-- Categories
drop policy if exists "Admin: insert categories" on public.categories;
create policy "Admin: insert categories"
  on public.categories for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admin: update categories" on public.categories;
create policy "Admin: update categories"
  on public.categories for update using (auth.role() = 'authenticated');

drop policy if exists "Admin: delete categories" on public.categories;
create policy "Admin: delete categories"
  on public.categories for delete using (auth.role() = 'authenticated');

-- ============================================================
-- Sample seed data (optional — remove in production)
-- ============================================================
insert into public.skills (name, type, is_featured) values
  ('Angular', 'frontend', true),
  ('TypeScript', 'frontend', true),
  ('Tailwind CSS', 'frontend', true),
  ('Supabase', 'backend', true),
  ('PostgreSQL', 'backend', true),
  ('Node.js', 'backend', true),
  ('GSAP', 'frontend', true),
  ('RxJS', 'frontend', true),
  ('Git', 'tool', true),
  ('Docker', 'tool', true),
  ('Figma', 'tool', true),
  ('HTML5', 'frontend', true);
