-- Full-text product search RPC
create or replace function public.search_products(
  query         text,
  category_filter text default null,
  min_price     numeric default null,
  max_price     numeric default null
)
returns table (
  id          uuid,
  slug        text,
  name        text,
  brand       text,
  base_price  numeric,
  category_id uuid,
  rank        real
)
language sql stable security definer set search_path = '' as $$
  select
    p.id,
    p.slug,
    p.name,
    p.brand,
    p.base_price,
    p.category_id,
    ts_rank(p.search_vector, websearch_to_tsquery('english', query)) as rank
  from public.products p
  join public.categories c on c.id = p.category_id
  where
    p.is_published = true
    and p.search_vector @@ websearch_to_tsquery('english', query)
    and (category_filter is null or c.type::text = category_filter)
    and (min_price is null or p.base_price >= min_price)
    and (max_price is null or p.base_price <= max_price)
  order by rank desc
  limit 50;
$$;

-- Storage setup (run after storage buckets are created in Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('product-media', 'product-media', true);
-- insert into storage.buckets (id, name, public) values ('admin-uploads', 'admin-uploads', false);
