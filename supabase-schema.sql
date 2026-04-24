-- Run this in your Supabase SQL editor
-- Safe to re-run multiple times

-- Create table
create table if not exists public.portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  slug text unique not null,
  portfolio_json jsonb not null default '{}',
  bg_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  live_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.portfolios enable row level security;

-- Drop and recreate policies (safe to re-run)
drop policy if exists "Users can manage their own portfolios" on public.portfolios;
create policy "Users can manage their own portfolios"
  on public.portfolios for all
  using (auth.uid() = user_id);

drop policy if exists "Published portfolios are publicly viewable" on public.portfolios;
create policy "Published portfolios are publicly viewable"
  on public.portfolios for select
  using (status = 'published');

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists portfolios_updated_at on public.portfolios;
create trigger portfolios_updated_at
  before update on public.portfolios
  for each row execute function update_updated_at();
