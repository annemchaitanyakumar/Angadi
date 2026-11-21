import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    product
  });
}
