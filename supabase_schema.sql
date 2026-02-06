-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  phone text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for Products
create table products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  price numeric not null,
  currency text default 'NGN',
  file_url text, -- For digital products
  image_url text,
  is_active boolean default true,
  stock integer default 0 -- For physical products
);

-- Enable RLS for Products
alter table products enable row level security;

create policy "Products are viewable by everyone."
  on products for select
  using ( true );

create policy "Users can create products."
  on products for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own products."
  on products for update
  using ( auth.uid() = user_id );

-- Storage Bucket Policy
-- Run this in your Supabase SQL Editor to create the bucket and policies

-- 1. Create the 'products' bucket (Public)
insert into storage.buckets (id, name, public)
values ('products', 'products', true);

-- 2. Allow Public Read Access (so people can see product images)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- 3. Allow Authenticated Users to Upload (Sellers)
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- 4. Allow Users to Update/Delete their own files
create policy "Users can update own files"
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'products' );

create policy "Users can delete own files"
  on storage.objects for delete
  using ( auth.uid() = owner );

-- Create a table for Orders
create table orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_id uuid references products not null,
  seller_id uuid references auth.users not null,
  buyer_email text,
  amount numeric not null,
  reference text unique, -- Paystack reference
  status text default 'paid'
);

-- Enable RLS for Orders
alter table orders enable row level security;

create policy "Sellers can view their own sales."
  on orders for select
  using ( auth.uid() = seller_id );

-- Public/Buyers can insert orders (usually via server-side or trusted client flow, 
-- but for this MVP client-side insert is acceptable with caution)
create policy "Anyone can create orders"
  on orders for insert
  with check ( true ); 

-- ALTER TABLES for Phase 5 (Run these if you have existing tables)

-- 1. Add Delivery Options to Products
-- delivery_type: 'download', 'key_access', 'view_only'
alter table products add column if not exists delivery_type text default 'download';
alter table products add column if not exists delivery_key text; -- For static keys/links

-- 2. Add Access Key to Orders (For View Only protection)
alter table orders add column if not exists access_key text;

-- 3. Add Multi-Image and Delivery Info (For Physical Products)
alter table products add column if not exists images text[]; -- Array of image URLs
alter table products add column if not exists delivery_info jsonb; -- { pickup: { enabled, address }, delivery: { enabled, fee } }


-- 4. Add Reviews Feature
alter table profiles add column if not exists reviews_enabled boolean default true;

create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_id uuid references products not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  reviewer_name text
);

-- Enable RLS for Reviews
alter table reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on reviews for select
  using ( true );

create policy "Anyone can create reviews"
  on reviews for insert
  with check ( true );
