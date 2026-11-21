import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request, { params }) {
  const { id } = await params;
  const { status, note } = await request.json();

  let targetStatus = (status || '').toLowerCase().trim();
  if (targetStatus === 'pending') targetStatus = 'placed';
  if (targetStatus === 'processing') targetStatus = 'packing';

  const validStatuses = ['placed', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(targetStatus)) {
    return NextResponse.json({ success: false, error: `Invalid status: ${status}` }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
  }

  const now = new Date().toISOString();

  // 1. Update orders table
  const { data: updatedOrder, error: updateError } = await supabase
    .from('orders')
    .update({
      status: targetStatus,
      updated_at: now
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
  }

  // 2. Add entry to timeline
  await supabase.from('order_timeline').insert({
    order_id: id,
    status,
    note: note || `Order status updated to ${status}`,
    created_at: now
  });

  return NextResponse.json({
    success: true,
    order: updatedOrder
  });
}
