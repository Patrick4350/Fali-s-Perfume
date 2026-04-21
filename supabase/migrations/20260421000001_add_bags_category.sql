-- Add bags to category_type enum
alter type category_type add value if not exists 'bags';

-- Seed default categories
insert into public.categories (slug, name, type, description, sort_order) values
  ('perfume',          'Perfume',          'perfume',  'Artisanal fragrances and eau de parfum',           1),
  ('eau-de-toilette',  'Eau de Toilette',  'perfume',  'Lighter fragrance concentrations',                 2),
  ('extrait',          'Extrait de Parfum','perfume',  'Highest concentration, purest expression',         3),
  ('clothing',         'Clothing',         'clothing', 'Refined garments crafted from natural fabrics',    4),
  ('tops',             'Tops',             'clothing', 'Shirts, blouses, and knitwear',                    5),
  ('bottoms',          'Bottoms',          'clothing', 'Trousers, skirts, and shorts',                     6),
  ('outerwear',        'Outerwear',        'clothing', 'Coats, jackets, and layers',                       7),
  ('bags',             'Bags',             'bags',     'Handcrafted bags and accessories',                  8),
  ('tote-bags',        'Tote Bags',        'bags',     'Everyday carry totes',                             9),
  ('crossbody-bags',   'Crossbody Bags',   'bags',     'Hands-free crossbody styles',                      10),
  ('clutches',         'Clutches',         'bags',     'Evening and occasion clutches',                    11)
on conflict (slug) do nothing;
