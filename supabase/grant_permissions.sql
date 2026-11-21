-- Grant PostgREST API access to anon and authenticated roles
grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_variants to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant select, insert on public.orders to anon, authenticated;
grant select, insert on public.order_items to anon, authenticated;
grant select, insert on public.order_timeline to anon, authenticated;
grant select, insert, update, delete on public.addresses to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
