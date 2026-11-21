import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({
      configured: false,
      status: 'pending_env',
      message: 'Supabase credentials not yet configured in .env.local',
      requiredKeys: [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
      ]
    }, { status: 200 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({
      configured: false,
      status: 'client_initialization_failed',
    }, { status: 500 });
  }

  const start = Date.now();
  try {
    const [productsRes, variantsRes] = await Promise.all([
      supabase.from('products').select('id, name, price', { count: 'exact' }),
      supabase.from('product_variants').select('id, size, stock', { count: 'exact' })
    ]);

    const latencyMs = Date.now() - start;

    return NextResponse.json({
      configured: true,
      status: 'connected',
      latencyMs,
      tables: {
        products: {
          count: productsRes.count ?? productsRes.data?.length ?? 0,
          error: productsRes.error?.message || null,
        },
        product_variants: {
          count: variantsRes.count ?? variantsRes.data?.length ?? 0,
          error: variantsRes.error?.message || null,
        }
      },
      hasServiceKey: !!serviceKey,
    });
  } catch (err) {
    return NextResponse.json({
      configured: true,
      status: 'error',
      error: err.message
    }, { status: 500 });
  }
}
