create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    name text not null,
    age smallint not null check (age between 18 and 100),
    gender text not null check (gender in ('female', 'male', 'non_binary')),
    height_cm numeric(5, 1) not null check (height_cm between 100 and 250),
    weight_kg numeric(5, 1) not null check (weight_kg between 30 and 350),
    goal text not null check (goal in ('fat_loss', 'muscle_gain', 'maintain')),
    diet text not null check (diet in ('omnivore', 'vegetarian', 'vegan', 'halal', 'pescatarian')),
    activity_level text not null check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    location text not null default '',
    allergies text not null default '',
    calories integer not null check (calories between 800 and 10000),
    protein integer not null check (protein between 0 and 1000),
    carbs integer not null check (carbs between 0 and 1500),
    fats integer not null check (fats between 0 and 1000),
    target_explanation text not null default '',
    onboarding_complete boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.meal_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    meal_date date not null,
    name text not null check (length(name) between 1 and 200),
    portion text not null default '',
    calories numeric(8, 1) not null check (calories >= 0),
    protein numeric(8, 1) not null default 0 check (protein >= 0),
    carbs numeric(8, 1) not null default 0 check (carbs >= 0),
    fats numeric(8, 1) not null default 0 check (fats >= 0),
    created_at timestamptz not null default now()
);

create index meal_logs_user_date_idx on public.meal_logs (user_id, meal_date);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger profiles_set_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();

revoke all on public.profiles, public.meal_logs from anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.meal_logs to authenticated;

alter table public.profiles enable row level security;
alter table public.meal_logs enable row level security;

create policy "Users can read their own profile"
    on public.profiles for select
    to authenticated
    using ((select auth.uid()) = id);

create policy "Users can create their own profile"
    on public.profiles for insert
    to authenticated
    with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
    on public.profiles for update
    to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);

create policy "Users can read their own meal logs"
    on public.meal_logs for select
    to authenticated
    using ((select auth.uid()) = user_id);

create policy "Users can create their own meal logs"
    on public.meal_logs for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

create policy "Users can update their own meal logs"
    on public.meal_logs for update
    to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "Users can delete their own meal logs"
    on public.meal_logs for delete
    to authenticated
    using ((select auth.uid()) = user_id);
