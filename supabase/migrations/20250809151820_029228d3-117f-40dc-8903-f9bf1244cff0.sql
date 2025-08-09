-- 1) Create profiles table for Supabase Auth users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy if not exists "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy if not exists "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy if not exists "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Timestamp trigger function already exists: public.update_updated_at_column()
create or replace trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- 2) Optional helper function to get current user profile (security definer, read-only)
create or replace function public.get_my_profile()
returns public.profiles
language sql
stable
security definer
as $$
  select * from public.profiles where id = auth.uid();
$$;