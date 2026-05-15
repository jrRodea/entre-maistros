-- Entre Maistros - Supabase Schema
-- Run this in the Supabase SQL editor

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text not null,
  description text not null default ''
);

-- Worker profiles
create table if not exists worker_profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  name text not null,
  slug text unique not null,
  bio text not null default '',
  age int,
  experience_years int not null default 0,
  location text not null default 'Tepeji del Río',
  whatsapp_number text not null,
  avatar_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Worker <-> Category (many-to-many)
create table if not exists worker_categories (
  worker_id uuid not null references worker_profiles(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (worker_id, category_id)
);

-- Worker skills
create table if not exists worker_skills (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references worker_profiles(id) on delete cascade,
  skill text not null
);

-- Work photos
create table if not exists work_photos (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references worker_profiles(id) on delete cascade,
  photo_url text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);

-- Reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references worker_profiles(id) on delete cascade,
  reviewer_clerk_id text not null,
  reviewer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (worker_id, reviewer_clerk_id)
);

-- View: workers with aggregate stats and categories
create or replace view workers_with_stats as
select
  wp.*,
  coalesce(avg(r.rating), 0)::numeric(3,1) as avg_rating,
  count(distinct r.id) as review_count,
  coalesce(
    json_agg(
      distinct jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'slug', c.slug,
        'icon', c.icon
      )
    ) filter (where c.id is not null),
    '[]'
  ) as categories
from worker_profiles wp
left join reviews r on r.worker_id = wp.id
left join worker_categories wc on wc.worker_id = wp.id
left join categories c on c.id = wc.category_id
group by wp.id;

-- RLS Policies

alter table categories enable row level security;
alter table worker_profiles enable row level security;
alter table worker_categories enable row level security;
alter table worker_skills enable row level security;
alter table work_photos enable row level security;
alter table reviews enable row level security;

-- Categories: public read
create policy "categories_public_read" on categories for select using (true);

-- Worker profiles: public read (published only for anon)
create policy "worker_profiles_public_read" on worker_profiles
  for select using (is_published = true);

-- Worker categories: public read
create policy "worker_categories_public_read" on worker_categories for select using (true);

-- Worker skills: public read
create policy "worker_skills_public_read" on worker_skills for select using (true);

-- Work photos: public read
create policy "work_photos_public_read" on work_photos for select using (true);

-- Reviews: public read
create policy "reviews_public_read" on reviews for select using (true);

-- Storage bucket for work photos
insert into storage.buckets (id, name, public)
values ('work-photos', 'work-photos', true)
on conflict (id) do nothing;

create policy "work_photos_storage_public_read" on storage.objects
  for select using (bucket_id = 'work-photos');

create policy "work_photos_storage_upload" on storage.objects
  for insert with check (bucket_id = 'work-photos');

-- Seed categories
insert into categories (name, slug, icon, description) values
  ('Plomero', 'plomero', '🔧', 'Instalación y reparación de tuberías, fugas y sanitarios'),
  ('Electricista', 'electricista', '⚡', 'Instalaciones eléctricas, cableado y reparaciones'),
  ('Albañil', 'albanil', '🧱', 'Construcción, remodelación y obra civil'),
  ('Mecánico', 'mecanico', '🔩', 'Reparación y mantenimiento de vehículos'),
  ('Jardinero', 'jardinero', '🌿', 'Diseño, mantenimiento y poda de jardines'),
  ('Carpintero', 'carpintero', '🪚', 'Muebles, puertas, ventanas y trabajos en madera'),
  ('Pintor', 'pintor', '🖌️', 'Pintura interior, exterior y acabados decorativos'),
  ('Cerrajero', 'cerrajero', '🔑', 'Apertura, cambio y reparación de cerraduras'),
  ('Técnico en electrodomésticos', 'tecnico-electrodomesticos', '🔌', 'Reparación de lavadoras, refrigeradores y más'),
  ('Limpieza del hogar', 'limpieza-hogar', '🧹', 'Limpieza general, profunda y mantenimiento del hogar')
on conflict (slug) do nothing;
