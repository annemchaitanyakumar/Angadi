-- ════════════════════════════════════════════════════════════════════════════════
-- ANGADI FULL-STACK POSTGRESQL SCHEMA & REALTIME ENGINE (Supabase)
-- ════════════════════════════════════════════════════════════════════════════════

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";

-- 2. User Profiles Table (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Trigger to create public.profile automatically on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    case when new.email = 'chaithunani5@gmail.com' then 'admin' else 'customer' end
  )
  on conflict (id) do update set
    email = EXCLUDED.email,
    full_name = coalesce(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = coalesce(EXCLUDED.avatar_url, public.profiles.avatar_url);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Products Catalog Table
create table if not exists public.products (
  id text primary key, -- e.g. 'mesa', 'ridgeline', 'pinefall'
  sku text unique,
  name text not null,
  tagline text,
  price numeric(10, 2) not null, -- formatted in INR (₹)
  compare_at_price numeric(10, 2),
  category text not null, -- 'Fleece & Hoodies', 'Jackets', 'Tops', 'Pants', 'Vests & Packs'
  gender text not null default 'Unisex' check (gender in ('Men', 'Women', 'Unisex')),
  terrain text, -- 'Desert', 'Forest', 'Alpine', 'Trail'
  color_name text,
  color_hex text,
  img text not null,
  gallery jsonb default '[]'::jsonb,
  alt text,
  blurb text,
  description text,
  features jsonb default '[]'::jsonb,
  materials text,
  weight text,
  rating numeric(3, 1) default 4.8,
  reviews integer default 0,
  is_new boolean default false,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Product Variants (Real-Time Inventory by Size)
create table if not exists public.product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id text references public.products(id) on delete cascade not null,
  size text not null check (size in ('XS', 'S', 'M', 'L', 'XL', 'One Size')),
  stock integer default 10 not null check (stock >= 0),
  sku text unique,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  unique (product_id, size)
);

-- 5. Customer Addresses
create table if not exists public.addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  full_name text not null,
  phone text,
  line1 text not null,
  line2 text,
  city text not null,
  region text not null,
  postal text not null,
  country text default 'India' not null,
  is_default boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 6. Orders Table
create table if not exists public.orders (
  id text primary key, -- e.g. 'ANG-2026-9281'
  user_id uuid references public.profiles(id) on delete set null,
  guest_email text,
  guest_name text,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) default 0.00 not null,
  total numeric(10, 2) not null,
  currency text default 'INR' not null,
  status text default 'placed' check (status in ('placed', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled')),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  payment_method text default 'razorpay_test',
  transaction_id text,
  shipping_address jsonb not null,
  notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 7. Order Line Items
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) not null,
  product_name text not null,
  size text not null,
  price numeric(10, 2) not null,
  qty integer not null check (qty > 0),
  image_url text
);

-- 8. Real-Time Order Activity Timeline
create table if not exists public.order_timeline (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  status text not null,
  note text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 9. Atomic Inventory Stock Decrement Function
create or replace function public.decrement_inventory(p_order_id text)
returns void as $$
declare
  item record;
begin
  for item in
    select product_id, size, qty
    from public.order_items
    where order_id = p_order_id
  loop
    update public.product_variants
    set stock = greatest(0, stock - item.qty)
    where product_id = item.product_id and size = item.size;
  end loop;
end;
$$ language plpgsql security definer;

-- ════════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ════════════════════════════════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_timeline enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Products Policies (Publicly readable by all users)
create policy "Products are publicly readable" on public.products
  for select using (is_active = true);

create policy "Admins can manage products" on public.products
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Product Variants Policies (Publicly readable for live stock)
create policy "Variants are publicly readable" on public.product_variants
  for select using (true);

create policy "Admins can manage variants" on public.product_variants
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Addresses Policies
create policy "Users can view own addresses" on public.addresses
  for select using (auth.uid() = user_id);

create policy "Users can insert own addresses" on public.addresses
  for insert with check (auth.uid() = user_id);

create policy "Users can update own addresses" on public.addresses
  for update using (auth.uid() = user_id);

create policy "Users can delete own addresses" on public.addresses
  for delete using (auth.uid() = user_id);

-- Orders Policies
create policy "Users can view own orders" on public.orders
  for select using (
    auth.uid() = user_id
    or guest_email = coalesce(auth.jwt()->>'email', '')
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Anyone can create orders" on public.orders
  for insert with check (true);

create policy "Admins can update orders" on public.orders
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Order Items Policies
create policy "Users can view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or orders.guest_email = coalesce(auth.jwt()->>'email', '') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
    )
  );

create policy "Anyone can insert order items" on public.order_items
  for insert with check (true);

-- Order Timeline Policies
create policy "Anyone can view timeline for their order" on public.order_timeline
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_timeline.order_id
      and (orders.user_id = auth.uid() or orders.guest_email = coalesce(auth.jwt()->>'email', '') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
    )
  );

create policy "Admins can insert timeline events" on public.order_timeline
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ════════════════════════════════════════════════════════════════════════════════
-- REALTIME SUBSCRIPTIONS REPLICATION
-- ════════════════════════════════════════════════════════════════════════════════
-- Enable Supabase Realtime broadcast for inventory updates and order tracking
begin;
  -- Add tables to realtime publication (ignore if already added)
  alter publication supabase_realtime add table public.product_variants;
  alter publication supabase_realtime add table public.orders;
  alter publication supabase_realtime add table public.order_timeline;
commit;
