import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PRODUCTS, LOOKS } from '@/lib/data';

function resolveItemImage(item) {
  const pId = String(item.product_id || item.id || '').toLowerCase().trim();
  const pName = String(item.product_name || item.name || '').toLowerCase().trim();

  // 1. Match in catalog PRODUCTS
  const product = PRODUCTS.find(p =>
    p.id.toLowerCase() === pId ||
    p.name.toLowerCase() === pName ||
    (pId && p.id.toLowerCase().includes(pId)) ||
    (pName && p.name.toLowerCase().includes(pName)) ||
    (pName && pName.includes(p.name.toLowerCase()))
  );
  if (product && product.img) return product.img;

  // 2. Match in catalog LOOKS
  const look = LOOKS.find(l =>
    l.id.toLowerCase() === pId ||
    l.title.toLowerCase().includes(pName) ||
    pName.includes(l.id.toLowerCase())
  );
  if (look && look.img) return look.img;

  // 3. Fallback to provided URL if not pointing to non-existent file
  if (item.image_url && typeof item.image_url === 'string' && item.image_url.trim()) {
    return item.image_url;
  }

  return '/photos/158-solum/pick-2.jpg';
}

export async function GET(request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (email) {
    query = query.ilike('guest_email', email.trim());
  }

  const { data: rawOrders, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // Format orders to be compatible with ANGADI client store
  const orders = (rawOrders || []).map(order => {
    const rawStatus = order.status || 'pending';
    const statusMap = {
      placed: 'Pending',
      pending: 'Pending',
      confirmed: 'Processing',
      processing: 'Processing',
      packing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };
    const formattedStatus = statusMap[rawStatus.toLowerCase()] || 'Pending';

    return {
      id: order.id,
      createdAt: order.created_at,
      customer: {
        name: order.guest_name || 'Customer',
        email: order.guest_email || ''
      },
      address: order.shipping_address || {},
      lines: (order.order_items || []).map(item => ({
        id: item.product_id,
        name: item.product_name,
        size: item.size,
        qty: item.qty,
        price: Number(item.price),
        img: resolveItemImage(item)
      })),
      subtotal: Number(order.subtotal || 0),
      shipping: Number(order.shipping || 0),
      total: Number(order.total || 0),
      status: formattedStatus,
      payment: {
        brand: order.payment_method || 'Card',
        last4: order.transaction_id ? order.transaction_id.slice(-4) : '4242'
      },
      source: 'cloud'
    };
  });

  return NextResponse.json({
    success: true,
    count: orders.length,
    orders
  });
}
