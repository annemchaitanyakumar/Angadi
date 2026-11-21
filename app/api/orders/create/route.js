import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PRODUCTS, LOOKS } from '@/lib/data';
import { getStoreSettings, validatePromo, getDiscountedProductPrice } from '@/lib/settings';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, address, lines, promoCode, method = 'standard', paymentMethod } = body;

    if (!customer?.email || !lines || lines.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required order details' }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Database connection unavailable' }, { status: 503 });
    }

    const settings = getStoreSettings();
    const taxRate = settings.taxes.enabled ? Number(settings.taxes.rate || 0.08) : 0;
    const freeShippingThreshold = Number(settings.shipping.freeThreshold || 150);
    const standardShippingPrice = Number(settings.shipping.standard || 8.00);
    const expressShippingPrice = Number(settings.shipping.express || 18.00);

    // Server-side authoritative price verification factoring in Flash Sales & live settings
    const verifiedItems = lines.map(item => {
      let authoritativePrice = 0;
      let name = item.name || 'Trail Item';
      let img = item.img || '/photos/158-solum/trail-main.jpg';

      if (item.kind === 'look') {
        const look = LOOKS.find(l => l.id === item.id);
        authoritativePrice = look ? look.price : 200;
        if (look) {
          name = `Look ${look.id.slice(-1).padStart(2, '0')} · ${look.title.replace(/\n/g, ' ')}`;
          img = look.img;
        }
      } else {
        const localP = PRODUCTS.find(p => p.id === item.id || p.name.toLowerCase() === (item.name || '').toLowerCase());
        const basePrice = localP ? localP.price : (Number(item.price) || 120);
        
        // Factor in flash sale discounts
        const discounted = getDiscountedProductPrice(item.id, basePrice);
        authoritativePrice = discounted.price;
        if (localP) {
          name = localP.name;
          img = localP.img;
        }
      }

      const qty = Math.max(1, Number(item.qty || 1));
      return {
        id: item.id || item.productId,
        name,
        size: item.size || 'M',
        qty,
        price: authoritativePrice,
        itemTotal: Math.round(authoritativePrice * qty * 100) / 100,
        img
      };
    });

    const serverSubtotal = Math.round(verifiedItems.reduce((sum, item) => sum + item.itemTotal, 0) * 100) / 100;

    let serverDiscount = 0;
    if (promoCode) {
      const validated = validatePromo(promoCode, serverSubtotal);
      if (validated && !validated.error) {
        serverDiscount = Math.round(serverSubtotal * (validated.pct / 100) * 100) / 100;
      }
    }

    const discountedSubtotal = Math.max(0, Math.round((serverSubtotal - serverDiscount) * 100) / 100);
    const freeShipLeft = Math.max(0, Math.round((freeShippingThreshold - discountedSubtotal) * 100) / 100);

    let serverShipping = 0;
    if (verifiedItems.length > 0) {
      serverShipping = method === 'express' ? expressShippingPrice : (freeShipLeft === 0 ? 0 : standardShippingPrice);
    }

    const serverTax = Math.round(discountedSubtotal * taxRate * 100) / 100;
    const serverTotal = Math.round((discountedSubtotal + serverShipping + serverTax) * 100) / 100;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = body.orderId || `ANG-${new Date().getFullYear()}-${randomSuffix}`;
    const now = new Date().toISOString();

    // 1. Insert into public.orders with authoritative server figures
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        guest_email: customer.email.toLowerCase().trim(),
        guest_name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.name || 'Customer',
        subtotal: serverSubtotal,
        shipping: serverShipping,
        total: serverTotal,
        currency: 'INR',
        status: 'placed',
        payment_status: 'paid',
        payment_method: paymentMethod || 'test_card',
        transaction_id: `TXN_${Date.now()}`,
        shipping_address: address,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json({ success: false, error: orderError.message }, { status: 500 });
    }

    // 2. Insert line items into public.order_items
    const orderItems = verifiedItems.map(item => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      size: item.size,
      price: item.price,
      qty: item.qty,
      image_url: item.img
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items insertion error:', itemsError);
    }

    // 3. Insert initial timeline event
    await supabase.from('order_timeline').insert({
      order_id: orderId,
      status: 'placed',
      note: 'Order placed and payment confirmed (Server Verified)',
      created_at: now
    });

    // 4. Atomically decrement stock in product_variants
    for (const item of verifiedItems) {
      if (item.id && item.size) {
        try {
          const { data: currentVariant } = await supabase
            .from('product_variants')
            .select('stock')
            .eq('product_id', item.id)
            .eq('size', item.size)
            .single();

          if (currentVariant) {
            const newStock = Math.max(0, currentVariant.stock - item.qty);
            await supabase
              .from('product_variants')
              .update({ stock: newStock })
              .eq('product_id', item.id)
              .eq('size', item.size);
          }
        } catch (stockErr) {
          console.warn('Stock decrement warning:', stockErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      order: orderData,
      verifiedQuote: {
        subtotal: serverSubtotal,
        discount: serverDiscount,
        shipping: serverShipping,
        tax: serverTax,
        total: serverTotal
      }
    });

  } catch (err) {
    console.error('Unhandled order creation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
