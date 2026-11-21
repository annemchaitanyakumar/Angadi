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


-- ════════════════════════════════════════════════════════════════════════════════
-- ANGADI SEED DATA (Products & Size Inventory Variants)
-- ════════════════════════════════════════════════════════════════════════════════

-- ════════════════════════════════════════════════════════════════════════════════
-- ANGADI SEED DATA (All 10 Trail Products & Inventory Variants)
-- ════════════════════════════════════════════════════════════════════════════════

-- 1. Insert Products
INSERT INTO public.products (
  id, sku, name, tagline, price, category, gender, terrain, color_name, color_hex,
  img, gallery, alt, blurb, description, features, materials, weight, rating, reviews,
  is_new, is_featured, is_active, created_at
) VALUES
(
  'ridgeline',
  'AG-JK-101',
  'Ridgeline Hooded Fleece',
  'A grid fleece that breathes on the climb and holds warmth at the top.',
  128.00,
  'Fleece & Hoodies',
  'Men',
  'Desert',
  'Charcoal',
  '#3a3b38',
  '/photos/158-solum/new-1.jpg',
  '["/photos/158-solum/new-1.jpg","/photos/158-solum/detail-ridgeline.jpg"]'::jsonb,
  'Runner on a red-rock trail in a charcoal hooded fleece',
  'A grid fleece that breathes on the climb and holds warmth at the top.',
  'Ridgeline is the layer you forget you are wearing until the wind turns. A brushed grid fleece traps warm air in the channels and dumps heat through the thin walls between them, so it stays comfortable from a cold start to the summit push.',
  '["Grid fleece that breathes when you work hard","Scuba hood that stays put under a shell","Zipped chest pocket sized for a phone","Thumb loops and a dropped back hem"]'::jsonb,
  '92% recycled polyester, 8% elastane. Bluesign approved.',
  '310 g',
  4.8,
  214,
  true,
  true,
  true,
  '2026-09-02T00:00:00Z'
),
(
  'mesa',
  'AG-HD-102',
  'Mesa Oversized Hoodie',
  'Heavyweight loopback for camp, the drive home and every cold morning.',
  96.00,
  'Fleece & Hoodies',
  'Women',
  'Desert',
  'Clay rose',
  '#c58a78',
  '/photos/158-solum/new-2.jpg',
  '["/photos/158-solum/new-2.jpg","/photos/158-solum/detail-mesa.jpg"]'::jsonb,
  'Runner in a clay-pink hoodie beside a dirt bike in the desert',
  'Heavyweight loopback for camp, the drive home and every cold morning.',
  'Mesa is cut wide and dropped at the shoulder, in a heavy loopback cotton that softens with every wash. It is the hoodie for the hour after the run, when the sun is down and the stove is on.',
  '["420 gsm organic loopback cotton","Double-layer hood","Kangaroo pocket with a hidden key loop","Garment-dyed for a lived-in colour"]'::jsonb,
  '100% organic cotton. Garment dyed.',
  '640 g',
  4.7,
  168,
  true,
  true,
  true,
  '2026-09-10T00:00:00Z'
),
(
  'pinefall',
  'AG-JK-103',
  'Pinefall Storm Shell',
  'A three-layer waterproof that packs into its own chest pocket.',
  214.00,
  'Jackets',
  'Men',
  'Forest',
  'Moss',
  '#4a5a44',
  '/photos/158-solum/new-3.jpg',
  '["/photos/158-solum/new-3.jpg","/photos/158-solum/detail-pinefall.jpg"]'::jsonb,
  'Runner in a moss-green shell in a misty pine forest',
  'A three-layer waterproof that packs into its own chest pocket.',
  'Pinefall is the shell for the day the forecast was wrong. A three-layer membrane keeps sustained rain out while letting sweat escape, and the whole jacket stuffs into its chest pocket when the sky clears.',
  '["20,000 mm waterproof, 20,000 g breathable","Fully taped seams","Packs into its own chest pocket","Adjustable hood with a laminated brim"]'::jsonb,
  '3L recycled nylon with a PFC-free DWR finish.',
  '265 g',
  4.9,
  302,
  true,
  true,
  true,
  '2026-08-21T00:00:00Z'
),
(
  'hollow',
  'AG-VS-104',
  'Hollow Quilted Vest',
  'Synthetic insulation that keeps your core warm and your arms free.',
  142.00,
  'Vests & Packs',
  'Women',
  'Forest',
  'Bone',
  '#e6dfd2',
  '/photos/158-solum/new-4.jpg',
  '["/photos/158-solum/new-4.jpg","/photos/158-solum/detail-hollow.jpg"]'::jsonb,
  'Runner in a bone-white quilted vest in a pine forest',
  'Synthetic insulation that keeps your core warm and your arms free.',
  'Hollow puts warmth where it counts and nowhere else. Synthetic fill stays warm when damp, and the slim baffles sit flat under a shell or over a base layer for cold starts.',
  '["60 g recycled synthetic fill","Warm when wet","Two zipped hand pockets","Packs into its own pocket"]'::jsonb,
  'Shell: 100% recycled nylon. Fill: 100% recycled polyester.',
  '220 g',
  4.6,
  97,
  true,
  false,
  true,
  '2026-09-14T00:00:00Z'
),
(
  'scree',
  'AG-JK-105',
  'Scree Windbreaker',
  'A 90-gram wind shell for ridgelines and fast descents.',
  158.00,
  'Jackets',
  'Men',
  'Alpine',
  'Sand',
  '#cdb894',
  '/photos/158-solum/new-5.jpg',
  '["/photos/158-solum/new-5.jpg","/photos/158-solum/detail-scree.jpg"]'::jsonb,
  'Runner in a sand windbreaker on alpine scree',
  'A 90-gram wind shell for ridgelines and fast descents.',
  'Scree blocks the wind that strips heat on an exposed ridge, then disappears into a pocket the size of a fist. The ripstop face shrugs off light showers and scrapes against rock.',
  '["Weighs 90 g","Ripstop face with a DWR finish","Laser-cut vents across the back","Reflective trims for early starts"]'::jsonb,
  '100% recycled nylon ripstop.',
  '90 g',
  4.7,
  156,
  true,
  false,
  true,
  '2026-09-18T00:00:00Z'
),
(
  'col',
  'AG-JK-106',
  'Col Puffer Jacket',
  'Responsibly sourced down for alpine starts and summit waits.',
  236.00,
  'Jackets',
  'Women',
  'Alpine',
  'Charcoal',
  '#34352f',
  '/photos/158-solum/new-6.jpg',
  '["/photos/158-solum/new-6.jpg","/photos/158-solum/detail-col.jpg"]'::jsonb,
  'Runner in a charcoal puffer below a rocky ridge',
  'Responsibly sourced down for alpine starts and summit waits.',
  'Col is the warm layer for standing still in the cold: summit waits, aid stations, belays. 800-fill down is boxed into narrow baffles so the warmth stays even, and a stretch hood fits under a helmet.',
  '["800-fill RDS-certified down","Box-wall baffles across the core","Helmet-compatible stretch hood","Two-way front zip"]'::jsonb,
  'Shell: recycled nylon. Fill: 800-fill RDS down.',
  '380 g',
  4.9,
  241,
  true,
  false,
  true,
  '2026-09-25T00:00:00Z'
),
(
  'underpass',
  'AG-TP-107',
  'Underpass Half-Zip',
  'A midweight half-zip for city loops and cool evening runs.',
  88.00,
  'Tops',
  'Men',
  'City',
  'Stone',
  '#8f8b82',
  '/photos/158-solum/new-7.jpg',
  '["/photos/158-solum/new-7.jpg","/photos/158-solum/detail-underpass.jpg"]'::jsonb,
  'Runner in a stone-grey half-zip under a concrete underpass',
  'A midweight half-zip for city loops and cool evening runs.',
  'Underpass is a midweight knit with a brushed back, cut slim so it rides under a shell without bunching. The deep zip vents fast when the pace picks up.',
  '["Brushed-back midweight knit","Deep 30 cm zip for venting","Flatlock seams that never chafe","Odour control that lasts"]'::jsonb,
  '88% recycled polyester, 12% elastane.',
  '240 g',
  4.5,
  88,
  true,
  false,
  true,
  '2026-10-01T00:00:00Z'
),
(
  'drift',
  'AG-JK-108',
  'Drift Camo Anorak',
  'A pullover anorak with a kangaroo pocket that fits a whole day.',
  174.00,
  'Jackets',
  'Women',
  'City',
  'Olive camo',
  '#6b6a4a',
  '/photos/158-solum/new-8.jpg',
  '["/photos/158-solum/new-8.jpg","/photos/158-solum/detail-drift.jpg"]'::jsonb,
  'Runner in an olive camo anorak under a concrete underpass',
  'A pullover anorak with a kangaroo pocket that fits a whole day.',
  'Drift is an overhead anorak in a soft, quiet woven that resists wind and light rain. The big kangaroo pocket holds gloves, a buff and a snack, and side zips make it easy to pull on over a pack strap.',
  '["Wind- and shower-resistant woven","Kangaroo pocket with a storm flap","Side zips for easy on and off","Adjustable hem and cuffs"]'::jsonb,
  '100% recycled polyester with a PFC-free DWR.',
  '330 g',
  4.6,
  74,
  true,
  false,
  true,
  '2026-10-06T00:00:00Z'
),
(
  'butte',
  'AG-JK-109',
  'Butte Anorak',
  'Our top pick: a technical anorak with room for a pack strap.',
  186.00,
  'Jackets',
  'Men',
  'Alpine',
  'Olive',
  '#5c6145',
  '/photos/158-solum/pick-1.jpg',
  '["/photos/158-solum/pick-1.jpg","/photos/158-solum/detail-butte.jpg"]'::jsonb,
  'Runner from behind in an olive anorak with a sand sling pack',
  'Our top pick: a technical anorak with room for a pack strap.',
  'Butte is the anorak our team wears most. Articulated sleeves, a cut that clears a pack strap, and a two-way hood that cinches down in a headwind.',
  '["Stretch woven that moves with you","Two-way adjustable hood","Pit zips for venting","Pack-strap friendly cut"]'::jsonb,
  '94% recycled nylon, 6% elastane.',
  '290 g',
  4.8,
  189,
  false,
  false,
  true,
  '2026-06-12T00:00:00Z'
),
(
  'talus',
  'AG-JK-110',
  'Talus Half-Zip Shell',
  'New for harder weather: a light shell with a clay zip pull.',
  198.00,
  'Jackets',
  'Women',
  'Alpine',
  'Graphite',
  '#3d3e3c',
  '/photos/158-solum/pick-2.jpg',
  '["/photos/158-solum/pick-2.jpg","/photos/158-solum/detail-talus.jpg"]'::jsonb,
  'Runner in a graphite half-zip shell with a clay zip pull',
  'New for harder weather: a light shell with a clay zip pull.',
  'Talus is a half-zip waterproof built for runners who hate rustle. A soft two-and-a-half-layer face keeps weather out quietly, and reflective trims light up in headlamp beams.',
  '["2.5L waterproof, quiet face fabric","Half zip with a clay pull","Reflective trims front and back","Elastic cuffs"]'::jsonb,
  '2.5L recycled nylon, PFC-free DWR.',
  '210 g',
  4.7,
  133,
  false,
  false,
  true,
  '2026-07-03T00:00:00Z'
),
(
  'arroyo',
  'AG-VS-111',
  'Arroyo Running Vest 8L',
  'An 8-litre vest that carries a long day without a bounce.',
  132.00,
  'Vests & Packs',
  'Men',
  'Desert',
  'Clay',
  '#b5562f',
  '/photos/158-solum/trail-left.jpg',
  '["/photos/158-solum/trail-left.jpg","/photos/158-solum/detail-arroyo.jpg"]'::jsonb,
  'Hands tightening the straps of a clay-orange running vest',
  'An 8-litre vest that carries a long day without a bounce.',
  'Arroyo hugs the body like a shirt and holds a long day of kit: two soft flasks up front, a shell and food behind, poles on the side. Twin sternum straps slide to fit any chest.',
  '["8 L capacity","Two 500 ml soft flasks included","Sliding twin sternum straps","Pole carry on both sides"]'::jsonb,
  'Stretch mesh body, recycled nylon pockets.',
  '240 g',
  4.8,
  121,
  false,
  false,
  true,
  '2026-05-20T00:00:00Z'
),
(
  'cairn',
  'AG-AC-112',
  'Cairn Liner Gloves',
  'Thin, warm and touchscreen-ready for cold starts.',
  38.00,
  'Accessories',
  'Women',
  'Forest',
  'Black',
  '#1f201e',
  '/photos/158-solum/trail-right.jpg',
  '["/photos/158-solum/trail-right.jpg","/photos/158-solum/detail-cairn.jpg"]'::jsonb,
  'A gloved hand resting on charcoal trail shorts',
  'Thin, warm and touchscreen-ready for cold starts.',
  'Cairn is a thin merino-blend liner for the first cold mile. Conductive fingertips work your watch and phone, and a silicone palm keeps a grip on poles.',
  '["Merino-blend knit","Touchscreen fingertips","Silicone grip palm","Fits under a shell mitt"]'::jsonb,
  '55% merino wool, 40% nylon, 5% elastane.',
  '40 g',
  4.5,
  62,
  false,
  false,
  true,
  '2026-04-28T00:00:00Z'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender,
  terrain = EXCLUDED.terrain,
  img = EXCLUDED.img,
  gallery = EXCLUDED.gallery,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  materials = EXCLUDED.materials,
  weight = EXCLUDED.weight,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  is_new = EXCLUDED.is_new,
  is_featured = EXCLUDED.is_featured;

-- 2. Insert Product Variants (Inventory by Size)
INSERT INTO public.product_variants (product_id, size, stock, sku) VALUES
('ridgeline', 'XS', 4, 'AG-JK-101-XS'),
('ridgeline', 'S', 12, 'AG-JK-101-S'),
('ridgeline', 'M', 18, 'AG-JK-101-M'),
('ridgeline', 'L', 9, 'AG-JK-101-L'),
('ridgeline', 'XL', 3, 'AG-JK-101-XL'),
('mesa', 'XS', 6, 'AG-HD-102-XS'),
('mesa', 'S', 10, 'AG-HD-102-S'),
('mesa', 'M', 2, 'AG-HD-102-M'),
('mesa', 'L', 0, 'AG-HD-102-L'),
('mesa', 'XL', 5, 'AG-HD-102-XL'),
('pinefall', 'XS', 3, 'AG-JK-103-XS'),
('pinefall', 'S', 8, 'AG-JK-103-S'),
('pinefall', 'M', 14, 'AG-JK-103-M'),
('pinefall', 'L', 11, 'AG-JK-103-L'),
('pinefall', 'XL', 6, 'AG-JK-103-XL'),
('hollow', 'XS', 5, 'AG-VS-104-XS'),
('hollow', 'S', 9, 'AG-VS-104-S'),
('hollow', 'M', 7, 'AG-VS-104-M'),
('hollow', 'L', 4, 'AG-VS-104-L'),
('hollow', 'XL', 1, 'AG-VS-104-XL'),
('scree', 'XS', 2, 'AG-JK-105-XS'),
('scree', 'S', 6, 'AG-JK-105-S'),
('scree', 'M', 10, 'AG-JK-105-M'),
('scree', 'L', 8, 'AG-JK-105-L'),
('scree', 'XL', 4, 'AG-JK-105-XL'),
('col', 'XS', 3, 'AG-JK-106-XS'),
('col', 'S', 5, 'AG-JK-106-S'),
('col', 'M', 0, 'AG-JK-106-M'),
('col', 'L', 2, 'AG-JK-106-L'),
('col', 'XL', 2, 'AG-JK-106-XL'),
('underpass', 'XS', 8, 'AG-TP-107-XS'),
('underpass', 'S', 14, 'AG-TP-107-S'),
('underpass', 'M', 20, 'AG-TP-107-M'),
('underpass', 'L', 16, 'AG-TP-107-L'),
('underpass', 'XL', 9, 'AG-TP-107-XL'),
('drift', 'XS', 4, 'AG-JK-108-XS'),
('drift', 'S', 7, 'AG-JK-108-S'),
('drift', 'M', 9, 'AG-JK-108-M'),
('drift', 'L', 3, 'AG-JK-108-L'),
('drift', 'XL', 0, 'AG-JK-108-XL'),
('butte', 'XS', 2, 'AG-JK-109-XS'),
('butte', 'S', 6, 'AG-JK-109-S'),
('butte', 'M', 11, 'AG-JK-109-M'),
('butte', 'L', 8, 'AG-JK-109-L'),
('butte', 'XL', 5, 'AG-JK-109-XL'),
('talus', 'XS', 5, 'AG-JK-110-XS'),
('talus', 'S', 8, 'AG-JK-110-S'),
('talus', 'M', 12, 'AG-JK-110-M'),
('talus', 'L', 6, 'AG-JK-110-L'),
('talus', 'XL', 3, 'AG-JK-110-XL'),
('arroyo', 'XS', 10, 'AG-VS-111-XS'),
('arroyo', 'S', 6, 'AG-VS-111-S'),
('arroyo', 'M', 9, 'AG-VS-111-M'),
('arroyo', 'L', 4, 'AG-VS-111-L'),
('arroyo', 'XL', 10, 'AG-VS-111-XL'),
('cairn', 'XS', 10, 'AG-AC-112-XS'),
('cairn', 'S', 12, 'AG-AC-112-S'),
('cairn', 'M', 20, 'AG-AC-112-M'),
('cairn', 'L', 15, 'AG-AC-112-L'),
('cairn', 'XL', 10, 'AG-AC-112-XL')
ON CONFLICT (product_id, size) DO UPDATE SET
  stock = EXCLUDED.stock,
  sku = EXCLUDED.sku;

