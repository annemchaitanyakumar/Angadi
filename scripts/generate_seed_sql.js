import { PRODUCTS } from '../lib/data.js';
import fs from 'fs';
import path from 'path';

let sql = `-- ════════════════════════════════════════════════════════════════════════════════
-- ANGADI SEED DATA (All 10 Trail Products & Inventory Variants)
-- ════════════════════════════════════════════════════════════════════════════════

-- 1. Insert Products
INSERT INTO public.products (
  id, sku, name, tagline, price, category, gender, terrain, color_name, color_hex,
  img, gallery, alt, blurb, description, features, materials, weight, rating, reviews,
  is_new, is_featured, is_active, created_at
) VALUES
`;

const productValues = PRODUCTS.map(p => {
  const esc = (str) => str ? "'" + str.replace(/'/g, "''") + "'" : "NULL";
  const jsonEsc = (obj) => "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
  return `(
  ${esc(p.id)},
  ${esc(p.sku)},
  ${esc(p.name)},
  ${esc(p.blurb)},
  ${p.price.toFixed(2)},
  ${esc(p.category)},
  ${esc(p.gender)},
  ${esc(p.terrain)},
  ${esc(p.color?.name)},
  ${esc(p.color?.hex)},
  ${esc(p.img)},
  ${jsonEsc(p.gallery || [p.img])},
  ${esc(p.alt)},
  ${esc(p.blurb)},
  ${esc(p.description)},
  ${jsonEsc(p.features || [])},
  ${esc(p.materials)},
  ${esc(p.weight)},
  ${p.rating || 4.8},
  ${p.reviews || 100},
  ${p.isNew ? 'true' : 'false'},
  ${['mesa', 'pinefall', 'ridgeline', 'traverse'].includes(p.id) ? 'true' : 'false'},
  true,
  '${p.createdAt ? p.createdAt + 'T00:00:00Z' : '2026-09-01T00:00:00Z'}'
)`;
}).join(',\n');

sql += productValues + `
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
`;

const variantValues = [];
PRODUCTS.forEach(p => {
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  sizes.forEach(size => {
    const stockQty = p.stock?.[size] ?? 10;
    const variantSku = `${p.sku}-${size}`;
    variantValues.push(`('${p.id}', '${size}', ${stockQty}, '${variantSku}')`);
  });
});

sql += variantValues.join(',\n') + `
ON CONFLICT (product_id, size) DO UPDATE SET
  stock = EXCLUDED.stock,
  sku = EXCLUDED.sku;
`;

const outDir = path.resolve('supabase');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'seed.sql'), sql, 'utf8');
console.log('Successfully generated supabase/seed.sql with', PRODUCTS.length, 'products and', variantValues.length, 'variants.');
