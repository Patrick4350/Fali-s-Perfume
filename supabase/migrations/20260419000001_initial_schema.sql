-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Enums
create type user_role as enum ('customer', 'admin');
create type category_type as enum ('perfume', 'clothing');
create type media_type as enum ('image', 'video');
create type order_status as enum (
  'pending', 'paid', 'fulfilled', 'shipped', 'delivered', 'cancelled', 'refunded'
);

-- Profiles (extends auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        user_role not null default 'customer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Categories
create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  name        text not null,
  description text,
  parent_id   uuid references public.categories(id) on delete set null,
  type        category_type not null,
  image_url   text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index categories_type_idx on public.categories(type);
create index categories_parent_id_idx on public.categories(parent_id);

-- Products
create table public.products (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  name            text not null,
  description     text,
  brand           text not null,
  category_id     uuid not null references public.categories(id) on delete restrict,
  base_price      numeric(10,2) not null check (base_price >= 0),
  currency        char(3) not null default 'USD',
  is_published    boolean not null default false,
  featured        boolean not null default false,
  search_vector   tsvector,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);
create index products_is_published_idx on public.products(is_published);
create index products_featured_idx on public.products(featured);
create index products_brand_idx on public.products(brand);
create index products_search_vector_idx on public.products using gin(search_vector);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Auto-build search_vector
create or replace function public.update_product_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.brand, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'C');
  return new;
end;
$$;

create trigger products_search_vector_update
  before insert or update on public.products
  for each row execute function public.update_product_search_vector();

-- Product variants
create table public.product_variants (
  id              uuid primary key default uuid_generate_v4(),
  product_id      uuid not null references public.products(id) on delete cascade,
  sku             text not null unique,
  size            text,
  color           text,
  price_override  numeric(10,2) check (price_override >= 0),
  stock_quantity  integer not null default 0 check (stock_quantity >= 0),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index product_variants_product_id_idx on public.product_variants(product_id);
create index product_variants_sku_idx on public.product_variants(sku);

create trigger product_variants_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- Product media
create table public.product_media (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  url         text not null,
  type        media_type not null default 'image',
  sort_order  integer not null default 0,
  alt_text    text,
  created_at  timestamptz not null default now()
);

create index product_media_product_id_idx on public.product_media(product_id);
create index product_media_sort_order_idx on public.product_media(product_id, sort_order);

-- Product attributes (flexible key/value)
create table public.product_attributes (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  key         text not null,
  value       text not null,
  created_at  timestamptz not null default now()
);

create index product_attributes_product_id_idx on public.product_attributes(product_id);

-- Carts
create table public.carts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade,
  session_id  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint carts_user_or_session check (user_id is not null or session_id is not null)
);

create index carts_user_id_idx on public.carts(user_id);
create index carts_session_id_idx on public.carts(session_id);

create trigger carts_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

-- Cart items
create table public.cart_items (
  id          uuid primary key default uuid_generate_v4(),
  cart_id     uuid not null references public.carts(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  variant_id  uuid not null references public.product_variants(id) on delete cascade,
  quantity    integer not null default 1 check (quantity > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create index cart_items_cart_id_idx on public.cart_items(cart_id);

create trigger cart_items_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

-- Orders
create table public.orders (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid references public.profiles(id) on delete set null,
  status                  order_status not null default 'pending',
  stripe_session_id       text unique,
  stripe_payment_intent_id text unique,
  subtotal                numeric(10,2) not null check (subtotal >= 0),
  shipping                numeric(10,2) not null default 0 check (shipping >= 0),
  tax                     numeric(10,2) not null default 0 check (tax >= 0),
  total                   numeric(10,2) not null check (total >= 0),
  currency                char(3) not null default 'USD',
  shipping_address        jsonb,
  billing_address         jsonb,
  email                   text not null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index orders_user_id_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);
create index orders_stripe_session_id_idx on public.orders(stripe_session_id);
create index orders_created_at_idx on public.orders(created_at desc);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Order items (snapshot at purchase time)
create table public.order_items (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  product_id      uuid not null references public.products(id) on delete restrict,
  variant_id      uuid not null references public.product_variants(id) on delete restrict,
  product_name    text not null,
  variant_sku     text not null,
  variant_size    text,
  variant_color   text,
  quantity        integer not null check (quantity > 0),
  unit_price      numeric(10,2) not null check (unit_price >= 0),
  total_price     numeric(10,2) not null check (total_price >= 0),
  created_at      timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items(order_id);

-- Stock decrement trigger on order confirmation
create or replace function public.decrement_stock_on_order()
returns trigger language plpgsql as $$
declare
  v_stock integer;
begin
  -- Only act when status changes to 'paid'
  if old.status != 'paid' and new.status = 'paid' then
    for r in select variant_id, quantity from public.order_items where order_id = new.id
    loop
      select stock_quantity into v_stock
      from public.product_variants
      where id = r.variant_id
      for update;

      if v_stock < r.quantity then
        raise exception 'Insufficient stock for variant %', r.variant_id;
      end if;

      update public.product_variants
      set stock_quantity = stock_quantity - r.quantity,
          updated_at = now()
      where id = r.variant_id;
    end loop;
  end if;
  return new;
end;
$$;

create trigger orders_decrement_stock
  after update on public.orders
  for each row execute function public.decrement_stock_on_order();

-- Addresses
create table public.addresses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  label       text,
  full_name   text not null,
  line1       text not null,
  line2       text,
  city        text not null,
  state       text not null,
  postal_code text not null,
  country     char(2) not null default 'US',
  phone       text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index addresses_user_id_idx on public.addresses(user_id);

-- Wishlists
create table public.wishlists (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

create index wishlists_user_id_idx on public.wishlists(user_id);

-- Audit log
create table public.audit_log (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete set null,
  action      text not null,
  table_name  text not null,
  record_id   uuid,
  before_data jsonb,
  after_data  jsonb,
  ip_address  inet,
  created_at  timestamptz not null default now()
);

create index audit_log_user_id_idx on public.audit_log(user_id);
create index audit_log_table_name_idx on public.audit_log(table_name);
create index audit_log_created_at_idx on public.audit_log(created_at desc);
