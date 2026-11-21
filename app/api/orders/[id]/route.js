import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing order ID' }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
  }

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        order_timeline (*)
      `)
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
