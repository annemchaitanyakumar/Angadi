import { createClient } from '@/lib/supabase/server';
import { PRODUCTS } from '@/lib/data';

/**
 * Fetch all active products with real-time variants and stock from Supabase
 * Falls back seamlessly to lib/data.js if Supabase is offline
 */
export async function getProducts({ category, gender, terrain } = {}) {
  try {
    const supabase = await createClient();
    if (!supabase) return filterLocalProducts(PRODUCTS, { category, gender, terrain });

    let query = supabase
      .from('products')
      .select(`
        *,
        product_variants (
          size,
          stock,
          sku
        )
      `)
      .eq('is_active', true);

    if (category) query = query.eq('category', category);
    if (gender && gender !== 'All') query = query.eq('gender', gender);
    if (terrain && terrain !== 'All') query = query.eq('terrain', terrain);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return filterLocalProducts(PRODUCTS, { category, gender, terrain });
    }

    // Format products with normalized stock maps
    return data.map(formatDbProduct);
  } catch (err) {
    console.error('getProducts fallback error:', err);
    return filterLocalProducts(PRODUCTS, { category, gender, terrain });
  }
}

/**
 * Fetch a single product by ID with its live variants
 */
export async function getProduct(id) {
  try {
    const supabase = await createClient();
    if (!supabase) return PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants (
          size,
          stock,
          sku
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
    }

    return formatDbProduct(data);
  } catch (err) {
    console.error('getProduct fallback error:', err);
    return PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  }
}

function formatDbProduct(p) {
  const stockMap = { XS: 0, S: 0, M: 0, L: 0, XL: 0 };
  if (p.product_variants && Array.isArray(p.product_variants)) {
    p.product_variants.forEach(v => {
      stockMap[v.size] = v.stock;
    });
  }

  return {
    id: p.id,
    sku: p.sku || `AG-${p.id.toUpperCase()}`,
    name: p.name,
    price: Number(p.price),
    compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
    gender: p.gender,
    terrain: p.terrain,
    category: p.category,
    color: {
      name: p.color_name || 'Natural',
      hex: p.color_hex || '#3a3b38'
    },
    img: p.img,
    gallery: p.gallery || [p.img],
    alt: p.alt || p.name,
    blurb: p.blurb || p.tagline,
    description: p.description,
    features: p.features || [],
    materials: p.materials,
    weight: p.weight,
    rating: Number(p.rating || 4.8),
    reviews: p.reviews || 0,
    stock: stockMap,
    isNew: p.is_new,
    isFeatured: p.is_featured,
    createdAt: p.created_at
  };
}

function filterLocalProducts(list, { category, gender, terrain } = {}) {
  return list.filter(p => {
    if (category && p.category !== category) return false;
    if (gender && gender !== 'All' && p.gender !== gender) return false;
    if (terrain && terrain !== 'All' && p.terrain !== terrain) return false;
    return true;
  });
}
