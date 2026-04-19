-- Seed: categories
insert into public.categories (id, slug, name, type, sort_order, is_active) values
  ('a1000000-0000-0000-0000-000000000001', 'perfume', 'Perfume', 'perfume', 1, true),
  ('a1000000-0000-0000-0000-000000000002', 'eau-de-parfum', 'Eau de Parfum', 'perfume', 2, true),
  ('a1000000-0000-0000-0000-000000000003', 'extrait', 'Extrait de Parfum', 'perfume', 3, true),
  ('a1000000-0000-0000-0000-000000000004', 'clothing', 'Clothing', 'clothing', 1, true),
  ('a1000000-0000-0000-0000-000000000005', 'tops', 'Tops', 'clothing', 2, true),
  ('a1000000-0000-0000-0000-000000000006', 'bottoms', 'Bottoms', 'clothing', 3, true),
  ('a1000000-0000-0000-0000-000000000007', 'outerwear', 'Outerwear', 'clothing', 4, true)
on conflict (slug) do nothing;

-- Seed: perfumes
insert into public.products (id, slug, name, description, brand, category_id, base_price, currency, is_published, featured) values
  ('b1000000-0000-0000-0000-000000000001', 'oud-rose-absolute', 'Oud Rose Absolute',
   '<p>A rich tapestry of Bulgarian rose absolute and aged oud wood. Opens with fresh spice before settling into a warm, resinous heart. Long-lasting on both skin and fabric.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000001', 195.00, 'USD', true, true),
  ('b1000000-0000-0000-0000-000000000002', 'coastal-vetiver', 'Coastal Vetiver',
   '<p>Sea air and roasted vetiver root — unexpected companions that form a deeply grounding fragrance. Hints of driftwood and salt.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000001', 165.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000003', 'amber-silence', 'Amber Silence',
   '<p>A meditation on warmth. Labdanum, vanilla absolute, and musks build into something that feels less like perfume and more like memory.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000002', 210.00, 'USD', true, true),
  ('b1000000-0000-0000-0000-000000000004', 'white-iris-musk', 'White Iris & Musk',
   '<p>Fresh orris butter and powdery musk — effortless and elegant. The kind of fragrance that becomes a signature.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000002', 155.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000005', 'bergamot-cedar', 'Bergamot & Cedar',
   '<p>A bright citrus opening gives way to warm cedar heartwood. Clean, structured, and deeply wearable.</p>',
   'Maison Atelier', 'a1000000-0000-0000-0000-000000000001', 140.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000006', 'saffron-smoke', 'Saffron & Smoke',
   '<p>The warmth of saffron meets birch tar smoke in this provocative oriental. A conversation starter that lingers.</p>',
   'Maison Atelier', 'a1000000-0000-0000-0000-000000000003', 280.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000007', 'green-neroli', 'Green Neroli',
   '<p>Italian neroli blossoms over a green herb accord. Airy and Mediterranean — made for warm skin.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000002', 148.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000008', 'dark-amber-oud', 'Dark Amber Oud',
   '<p>Extrait concentration — maximum sillage and longevity. A deep, smoky oud anchored by ambergris and dark resins.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000003', 340.00, 'USD', true, true),
  ('b1000000-0000-0000-0000-000000000009', 'hinoki-forest', 'Hinoki Forest',
   '<p>Japanese cypress (hinoki) at its most precise — the scent of a forest after rain, captured and refined.</p>',
   'Maison Atelier', 'a1000000-0000-0000-0000-000000000001', 175.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000010', 'tuberose-night', 'Tuberose Night',
   '<p>Heady, narcotic tuberose tempered by crisp green jasmine leaves. For evenings where presence matters.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000002', 185.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000011', 'patchouli-sandalwood', 'Patchouli & Sandalwood',
   '<p>Earth-rooted and warm — dark patchouli balanced by Mysore sandalwood''s sweet creaminess.</p>',
   'Maison Atelier', 'a1000000-0000-0000-0000-000000000002', 160.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000012', 'black-pepper-leather', 'Black Pepper & Leather',
   '<p>A modern leather — the raw spice of black pepper over mineral suede. Masculine, precise, unforgettable.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000003', 295.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000013', 'peony-cashmere', 'Peony & Cashmere',
   '<p>Fresh, pillowy peony over a base of warm cashmere musk. Effortlessly romantic.</p>',
   'Maison Atelier', 'a1000000-0000-0000-0000-000000000002', 145.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000014', 'frankincense-myrrh', 'Frankincense & Myrrh',
   '<p>Sacred resins distilled to their essence. Ancient, contemplative, and strangely modern.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000003', 260.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000015', 'aqua-neroli-cedar', 'Aqua, Neroli & Cedar',
   '<p>Sheer and fresh — an aquatic neroli that dries to clean cedar. Perfect for layering.</p>',
   'Maison Atelier', 'a1000000-0000-0000-0000-000000000001', 128.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000016', 'cardamom-tobacco', 'Cardamom & Tobacco',
   '<p>Warm spice and cured tobacco leaf — aromatic and richly addictive.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000002', 198.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000017', 'rose-oud-saffron', 'Rose Oud Saffron',
   '<p>An oriental triptych — saffron, damask rose, and aged oud in perfect proportion.</p>',
   'Maison Atelier', 'a1000000-0000-0000-0000-000000000003', 320.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000018', 'violet-leaf-vetiver', 'Violet Leaf & Vetiver',
   '<p>Sharp violet leaf over smoky Haitian vetiver. Green, earthy, and contemporary.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000001', 152.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000019', 'champaca-magnolia', 'Champaca & Magnolia',
   '<p>Two exotic white flowers — champaca''s tea-spice and magnolia''s green freshness entwined.</p>',
   'Maison Atelier', 'a1000000-0000-0000-0000-000000000002', 168.00, 'USD', true, false),
  ('b1000000-0000-0000-0000-000000000020', 'cedarwood-grey-musk', 'Cedarwood & Grey Musk',
   '<p>Clean, skin-close woods and ultra-fine grey musk. Restrained luxury at its best.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000002', 142.00, 'USD', true, false)
on conflict (slug) do nothing;

-- Seed: clothing
insert into public.products (id, slug, name, description, brand, category_id, base_price, currency, is_published, featured) values
  ('c1000000-0000-0000-0000-000000000001', 'linen-overshirt-natural', 'Linen Overshirt',
   '<p>Portuguese linen, medium-weight and stonewashed for immediate softness. Oversized fit, works as both shirt and light layer.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 145.00, 'USD', true, true),
  ('c1000000-0000-0000-0000-000000000002', 'merino-knit-turtleneck', 'Merino Turtleneck',
   '<p>Extra-fine 17.5-micron merino. Rolls at the neck, slim-but-not-tight fit. Guaranteed no itch.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 195.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000003', 'wide-leg-linen-trousers', 'Wide-Leg Linen Trousers',
   '<p>Relaxed, wide-leg cut in Italian linen. Elastic back waist, no belt required. Pairs with everything.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000006', 165.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000004', 'raw-edge-cotton-tee', 'Raw-Edge Cotton Tee',
   '<p>100% Pima cotton, pre-washed, with raw-cut edges that don''t fray. A foundational piece that improves with age.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 65.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000005', 'wool-bomber-jacket', 'Wool Bomber',
   '<p>Boiled Italian wool, structured but light. Ribbed collar and cuffs. An outerwear staple that transitions effortlessly.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000007', 395.00, 'USD', true, true),
  ('c1000000-0000-0000-0000-000000000006', 'silk-bias-slip', 'Silk Bias Slip',
   '<p>Charmeuse silk cut on the bias — fluid, elegant, and more versatile than expected. Wear layered or alone.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 225.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000007', 'canvas-chore-coat', 'Canvas Chore Coat',
   '<p>Japanese selvedge canvas, pre-aged in a salt bath. Four large patch pockets. Gets better every season.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000007', 285.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000008', 'ribbed-knit-cardigan', 'Ribbed Knit Cardigan',
   '<p>Fine ribbed cotton-cashmere blend. Relaxed open front, falls to the hip. Suitable across seasons.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 185.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000009', 'pleated-wool-trousers', 'Pleated Wool Trousers',
   '<p>Single forward pleat, Italian wool-blend. Tailored through the hip, straight leg. The most elegant trouser we''ve made.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000006', 295.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000010', 'organic-cotton-hoodie', 'Organic Cotton Hoodie',
   '<p>400gsm organic French terry. No compromise on weight — substantial, warm, lasting.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 135.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000011', 'poplin-band-collar-shirt', 'Poplin Band-Collar Shirt',
   '<p>Egyptian cotton poplin, 120-thread count. Minimal band collar, mother-of-pearl buttons. Dress it up or down.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 115.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000012', 'linen-shorts', 'Linen Shorts',
   '<p>Irish linen, mid-thigh length. Side seam pockets, back welt pocket. The summer essential.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000006', 95.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000013', 'merino-vest', 'Merino Vest',
   '<p>Lightweight merino in a ribbed-knit construction. V-neck, slim fit, no lining. A layering essential.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000005', 125.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000014', 'denim-work-jacket', 'Denim Work Jacket',
   '<p>Selvedge denim, 12.5oz. Raw hem, copper rivets. One of those pieces that earns its keep over years.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000007', 265.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000015', 'cashmere-crewneck', 'Cashmere Crewneck',
   '<p>Grade-A Mongolian cashmere, 2-ply construction. Classic fit, reinforced shoulders. The investment sweater.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 340.00, 'USD', true, true),
  ('c1000000-0000-0000-0000-000000000016', 'drawstring-jogger', 'Drawstring Jogger',
   '<p>Heavyweight French terry with tapered fit. Sits at the natural waist, ankle cuff. For off-duty ease.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000006', 110.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000017', 'silk-bomber', 'Silk Bomber',
   '<p>Washed silk charmeuse in an oversized bomber silhouette. Minimal, quiet, and distinctly contemporary.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000007', 445.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000018', 'cotton-canvas-trousers', 'Canvas Trousers',
   '<p>Washed Japanese cotton canvas. Five pockets, straight fit. The workwear trouser done right.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000006', 175.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000019', 'fleece-overshirt', 'Fleece Overshirt',
   '<p>Sherpa fleece, oversized fit. Snap buttons throughout. More style than expected from a fabric this practical.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000007', 185.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000020', 'woven-stripe-top', 'Woven Stripe Top',
   '<p>Italian linen-cotton blend in a fine multi-stripe. Loose fit, boat neck. Made for summer.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 85.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000021', 'tailored-blazer', 'Tailored Blazer',
   '<p>Italian wool-cashmere, unstructured. Two-button, notch lapel. Effortlessly crosses the formal-casual divide.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000007', 485.00, 'USD', true, true),
  ('c1000000-0000-0000-0000-000000000022', 'boxy-linen-tee', 'Boxy Linen Tee',
   '<p>Washed Irish linen, boxy cut. Drops past the hip. Naturally wrinkled — that''s the point.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 75.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000023', 'wool-midi-coat', 'Wool Midi Coat',
   '<p>Double-faced wool, falls to below the knee. Single button, clean lapels. A coat that lasts decades.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000007', 595.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000024', 'utility-cargo-pant', 'Utility Cargo Pant',
   '<p>Ripstop cotton canvas, straight leg with clean cargo pockets that don''t add bulk. Function and form.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000006', 148.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000025', 'cotton-knit-polo', 'Cotton Knit Polo',
   '<p>Fine-gauge Pima cotton, a classic polo re-proportioned for a modern frame. Slim fit, subtle branding.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 95.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000026', 'striped-linen-shorts', 'Striped Linen Shorts',
   '<p>Yarn-dyed striped linen, mid-thigh. Concealed elastic waist, clean front. A summer essential with character.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000006', 105.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000027', 'nylon-track-jacket', 'Nylon Track Jacket',
   '<p>Recycled nylon shell, minimal branding. Full zip, packs into its own pocket. Light protection, maximum range of motion.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000007', 215.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000028', 'merino-long-sleeve', 'Merino Long-Sleeve',
   '<p>Lightweight extra-fine merino, crewneck. The all-season base layer that never looks like a base layer.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000005', 115.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000029', 'relaxed-chinos', 'Relaxed Chinos',
   '<p>Washed stretch-cotton twill, relaxed through the thigh with a tapered ankle. The chino, reconsidered.</p>',
   'Atelier Studio', 'a1000000-0000-0000-0000-000000000006', 155.00, 'USD', true, false),
  ('c1000000-0000-0000-0000-000000000030', 'linen-coach-jacket', 'Linen Coach Jacket',
   '<p>Washed linen shell in a classic coach silhouette. Lined in cotton, front patch pockets. The warm-weather layer.</p>',
   'Fali''s', 'a1000000-0000-0000-0000-000000000007', 195.00, 'USD', true, false)
on conflict (slug) do nothing;

-- Seed: perfume variants (sizes: 30ml, 50ml, 100ml)
do $$
declare
  p record;
  sizes text[] := array['30ml', '50ml', '100ml'];
  multipliers numeric[] := array[0.6, 0.85, 1.0];
  s text;
  m numeric;
  i integer;
begin
  for p in select id, base_price from public.products where category_id in (
    'a1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000003'
  )
  loop
    for i in 1..3 loop
      s := sizes[i];
      m := multipliers[i];
      insert into public.product_variants (product_id, sku, size, price_override, stock_quantity)
      values (
        p.id,
        p.id::text || '-' || replace(s, 'ml', 'ML'),
        s,
        round(p.base_price * m / 5) * 5,
        floor(random() * 30 + 5)::integer
      ) on conflict (sku) do nothing;
    end loop;
  end loop;
end $$;

-- Seed: clothing variants
do $$
declare
  p record;
  sizes text[] := array['XS', 'S', 'M', 'L', 'XL'];
  s text;
begin
  for p in select id from public.products where category_id in (
    'a1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000006',
    'a1000000-0000-0000-0000-000000000007'
  )
  loop
    foreach s in array sizes loop
      insert into public.product_variants (product_id, sku, size, stock_quantity)
      values (
        p.id,
        p.id::text || '-' || s,
        s,
        floor(random() * 20 + 2)::integer
      ) on conflict (sku) do nothing;
    end loop;
  end loop;
end $$;

-- Seed: product media (Unsplash images)
insert into public.product_media (product_id, url, type, sort_order, alt_text) values
  ('b1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Oud Rose Absolute perfume bottle'),
  ('b1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop&q=80', 'image', 1, 'Oud Rose Absolute detail'),
  ('b1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Coastal Vetiver fragrance'),
  ('b1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Amber Silence bottle'),
  ('b1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop&q=80', 'image', 0, 'White Iris Musk perfume'),
  ('b1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1583946099379-f9c9cb8bc030?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Bergamot Cedar bottle'),
  ('b1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1562159278-1253a58da141?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Saffron Smoke fragrance'),
  ('b1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Green Neroli bottle'),
  ('b1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Dark Amber Oud extrait'),
  ('b1000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1583946099379-f9c9cb8bc030?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Hinoki Forest bottle'),
  ('b1000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Tuberose Night fragrance'),
  -- Clothing
  ('c1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Linen Overshirt front'),
  ('c1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80', 'image', 1, 'Linen Overshirt detail'),
  ('c1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Merino Turtleneck'),
  ('c1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Wide Leg Linen Trousers'),
  ('c1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Raw-Edge Cotton Tee'),
  ('c1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Wool Bomber Jacket'),
  ('c1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Silk Bias Slip'),
  ('c1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Canvas Chore Coat'),
  ('c1000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Cashmere Crewneck'),
  ('c1000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Tailored Blazer'),
  ('c1000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80', 'image', 0, 'Wool Midi Coat')
on conflict do nothing;

-- Seed: perfume attributes
insert into public.product_attributes (product_id, key, value) values
  ('b1000000-0000-0000-0000-000000000001', 'Notes', 'Bulgarian rose, aged oud, saffron, amber, patchouli'),
  ('b1000000-0000-0000-0000-000000000001', 'Concentration', 'Eau de Parfum'),
  ('b1000000-0000-0000-0000-000000000002', 'Notes', 'Sea salt, Haitian vetiver, driftwood, musk'),
  ('b1000000-0000-0000-0000-000000000002', 'Concentration', 'Eau de Parfum'),
  ('b1000000-0000-0000-0000-000000000003', 'Notes', 'Labdanum, vanilla absolute, benzoin, white musk'),
  ('b1000000-0000-0000-0000-000000000003', 'Concentration', 'Eau de Parfum'),
  -- Clothing attributes
  ('c1000000-0000-0000-0000-000000000001', 'Material', '100% Portuguese linen'),
  ('c1000000-0000-0000-0000-000000000001', 'Care', 'Machine wash cold, lay flat to dry'),
  ('c1000000-0000-0000-0000-000000000002', 'Material', '100% extra-fine 17.5-micron merino wool'),
  ('c1000000-0000-0000-0000-000000000002', 'Care', 'Hand wash or dry clean'),
  ('c1000000-0000-0000-0000-000000000015', 'Material', '100% Grade-A Mongolian cashmere, 2-ply'),
  ('c1000000-0000-0000-0000-000000000015', 'Care', 'Dry clean or hand wash in cold water')
on conflict do nothing;
