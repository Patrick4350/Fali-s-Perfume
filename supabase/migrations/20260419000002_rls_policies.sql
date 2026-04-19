-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_media enable row level security;
alter table public.product_attributes enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlists enable row level security;
alter table public.audit_log enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- CATEGORIES (public read, admin write)
create policy "Anyone can read active categories"
  on public.categories for select
  using (is_active = true);

create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_admin());

-- PRODUCTS (public read when published, admin write)
create policy "Anyone can read published products"
  on public.products for select
  using (is_published = true);

create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin());

-- PRODUCT_VARIANTS
create policy "Anyone can read variants of published products"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products
      where id = product_variants.product_id
      and is_published = true
    )
  );

create policy "Admins can manage variants"
  on public.product_variants for all
  using (public.is_admin());

-- PRODUCT_MEDIA
create policy "Anyone can read media of published products"
  on public.product_media for select
  using (
    exists (
      select 1 from public.products
      where id = product_media.product_id
      and is_published = true
    )
  );

create policy "Admins can manage media"
  on public.product_media for all
  using (public.is_admin());

-- PRODUCT_ATTRIBUTES
create policy "Anyone can read attributes of published products"
  on public.product_attributes for select
  using (
    exists (
      select 1 from public.products
      where id = product_attributes.product_id
      and is_published = true
    )
  );

create policy "Admins can manage attributes"
  on public.product_attributes for all
  using (public.is_admin());

-- CARTS (own cart only)
create policy "Users can manage own cart"
  on public.carts for all
  using (
    (auth.uid() is not null and auth.uid() = user_id) or
    (auth.uid() is null and session_id is not null)
  );

create policy "Admins can read all carts"
  on public.carts for select
  using (public.is_admin());

-- CART_ITEMS
create policy "Users can manage own cart items"
  on public.cart_items for all
  using (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id
      and (user_id = auth.uid() or session_id is not null)
    )
  );

create policy "Admins can read all cart items"
  on public.cart_items for select
  using (public.is_admin());

-- ORDERS (own orders only)
create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Service role can insert orders"
  on public.orders for insert
  with check (true);

create policy "Admins can manage all orders"
  on public.orders for all
  using (public.is_admin());

-- ORDER_ITEMS
create policy "Users can read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_items.order_id
      and user_id = auth.uid()
    )
  );

create policy "Admins can manage all order items"
  on public.order_items for all
  using (public.is_admin());

-- ADDRESSES
create policy "Users can manage own addresses"
  on public.addresses for all
  using (auth.uid() = user_id);

create policy "Admins can read all addresses"
  on public.addresses for select
  using (public.is_admin());

-- WISHLISTS
create policy "Users can manage own wishlist"
  on public.wishlists for all
  using (auth.uid() = user_id);

-- AUDIT_LOG (admin read-only; insert via service role)
create policy "Admins can read audit log"
  on public.audit_log for select
  using (public.is_admin());

create policy "Service role can insert audit log"
  on public.audit_log for insert
  with check (true);
