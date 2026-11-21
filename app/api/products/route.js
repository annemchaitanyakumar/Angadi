import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const gender = searchParams.get('gender') || undefined;
  const terrain = searchParams.get('terrain') || undefined;

  const products = await getProducts({ category, gender, terrain });
  return NextResponse.json({
    success: true,
    count: products.length,
    products
  });
}
