-- ==============================================================================
-- ANGADI Full-Stack: Fix RLS Policies for Orders, Items, Timeline, & Realtime
-- ==============================================================================

-- 1. Grant table privileges to anon and authenticated roles
grant usage on schema public to anon, authenticated;
grant all on public.products to anon, authenticated;
grant all on public.product_variants to anon, authenticated;
grant all on public.orders to anon, authenticated;
grant all on public.order_items to anon, authenticated;
grant all on public.order_timeline to anon, authenticated;
grant all on public.profiles to anon, authenticated;
grant all on public.addresses to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- 2. Allow guest checkout and order viewing
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Anyone can create orders" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;
drop policy if exists "Allow viewing orders" on public.orders;
drop policy if exists "Allow updating orders" on public.orders;

create policy "Allow viewing orders" on public.orders for select using (true);
create policy "Anyone can create orders" on public.orders for insert with check (true);
create policy "Allow updating orders" on public.orders for update using (true);

-- 3. Order items policies
drop policy if exists "Users can view order items" on public.order_items;
drop policy if exists "Anyone can insert order items" on public.order_items;
drop policy if exists "Allow viewing order items" on public.order_items;

create policy "Allow viewing order items" on public.order_items for select using (true);
create policy "Anyone can insert order items" on public.order_items for insert with check (true);

-- 4. Order timeline policies
drop policy if exists "Users can view order timeline" on public.order_timeline;
drop policy if exists "Anyone can insert timeline" on public.order_timeline;
drop policy if exists "Allow viewing timeline" on public.order_timeline;

create policy "Allow viewing timeline" on public.order_timeline for select using (true);
create policy "Anyone can insert timeline" on public.order_timeline for insert with check (true);

-- 5. Product variants stock updates (decrements stock on checkout)
drop policy if exists "Allow updating variant stock" on public.product_variants;
create policy "Allow updating variant stock" on public.product_variants for update using (true);
