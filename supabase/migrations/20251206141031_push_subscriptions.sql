create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

-- User can only insert/select their own subscriptions
create policy "Users can insert own subscriptions"
on public.push_subscriptions
for insert
with check (auth.uid() = user_id);

create policy "Users can select own subscriptions"
on public.push_subscriptions
for select
using (auth.uid() = user_id);