-- La Cave — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor (step 3 of the deployment guide)

create table if not exists app_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default now()
);

-- Allow the app to read and write freely (this is a private family app)
alter table app_data enable row level security;

create policy "Allow all access" on app_data
  for all
  using (true)
  with check (true);
