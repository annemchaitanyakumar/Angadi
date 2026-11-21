import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../lib/data.js';
import fs from 'fs';
import path from 'path';

// Load .env.local if present
const envLocalPath = path.resolve('.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length) {
        process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('\n❌ Missing Supabase credentials!');
  console.log('Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env.local file.\n');
  process.exit(1);
}

const supabase = createClient(url, key);

async function runSeed() {
  console.log(`\n🌱 Seeding ANGADI catalog to Supabase (${url})...\n`);

  // 1. Seed Products
  const productsToInsert = PRODUCTS.map(p => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    tagline: p.blurb,
    price: p.price,
    category: p.category,
    gender: p.gender,
    terrain: p.terrain,
    color_name: p.color?.name,
    color_hex: p.color?.hex,
    img: p.img,
    gallery: p.gallery || [p.img],
    alt: p.alt,
    blurb: p.blurb,
    description: p.description,
    features: p.features || [],
    materials: p.materials,
    weight: p.weight,
    rating: p.rating || 4.8,
    reviews: p.reviews || 100,
    is_new: !!p.isNew,
    is_featured: ['mesa', 'pinefall', 'ridgeline', 'traverse'].includes(p.id),
    is_active: true,
  }));

  const { data: pData, error: pError } = await supabase
    .from('products')
    .upsert(productsToInsert, { onConflict: 'id' })
    .select('id');

  if (pError) {
    console.error('❌ Error seeding products:', pError.message);
    process.exit(1);
  }
  console.log(`✅ Upserted ${productsToInsert.length} products successfully.`);

  // 2. Seed Variants (XS, S, M, L, XL)
  const variantsToInsert = [];
  PRODUCTS.forEach(p => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    sizes.forEach(size => {
      const stockQty = p.stock?.[size] ?? 10;
      variantsToInsert.push({
        product_id: p.id,
        size,
        stock: stockQty,
        sku: `${p.sku}-${size}`
      });
    });
  });

  const { data: vData, error: vError } = await supabase
    .from('product_variants')
    .upsert(variantsToInsert, { onConflict: 'product_id,size' })
    .select('id');

  if (vError) {
    console.error('❌ Error seeding variants:', vError.message);
    process.exit(1);
  }
  console.log(`✅ Upserted ${variantsToInsert.length} product variants with live stocks.\n`);
  console.log('🎉 Supabase database seeding complete!\n');
}

runSeed();
