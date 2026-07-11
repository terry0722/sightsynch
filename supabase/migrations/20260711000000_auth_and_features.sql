-- 1. profiles table and RLS policies
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'profiles_select_all' and tablename = 'profiles') then
    create policy "profiles_select_all" on public.profiles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'profiles_update_own' and tablename = 'profiles') then
    create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'profiles_insert_own' and tablename = 'profiles') then
    create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
  end if;
end $$;

-- Trigger to automatically create profiles for new auth users
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
          new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- 2. bookmarks table and RLS policies
create table if not exists public.bookmarks (
  user_id uuid references auth.users(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, article_id)
);
alter table public.bookmarks enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'bookmarks_manage_own' and tablename = 'bookmarks') then
    create policy "bookmarks_manage_own" on public.bookmarks
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- 3. article_likes table and RLS policies
create table if not exists public.article_likes (
  user_id uuid references auth.users(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, article_id)
);
alter table public.article_likes enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'likes_select_all' and tablename = 'article_likes') then
    create policy "likes_select_all" on public.article_likes for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'likes_manage_own' and tablename = 'article_likes') then
    create policy "likes_manage_own" on public.article_likes
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- 4. subscribers (newsletter) table and RLS policies
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);
alter table public.subscribers enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'subscribers_insert_anyone' and tablename = 'subscribers') then
    create policy "subscribers_insert_anyone" on public.subscribers
      for insert with check (true);
  end if;
end $$;

-- 5. Add view_count to articles table
alter table public.articles add column if not exists view_count integer default 0;
