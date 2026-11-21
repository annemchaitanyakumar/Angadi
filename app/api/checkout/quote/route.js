import { NextResponse } from 'next/server';
import { PRODUCTS, LOOKS } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { getStoreSettings, validatePromo, getDiscountedProductPrice } from '@/lib/settings';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items = [], promoCode = '', shippingMethod = 'standard' } = body;

    const settings = getStoreSettings();
    const taxRate = settings.taxes.enabled ? Number(settings.taxes.rate || 0.08) : 0;
    const freeShippingThreshold = Number(settings.shipping.freeThreshold || 150);
    const standardShippingPrice = Number(settings.shipping.standard || 8.00);
    const expressShippingPrice = Number(settings.shipping.express || 18.00);

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: true,
        quote: {
          items: [],
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          promo: null,
          freeShipLeft: freeShippingThreshold,
          shippingMethod
        }
      });
    }

    // Try fetching live product prices from Supabase, fallback to canonical lib/data.js
    let dbProducts = null;
    try {
      const supabase = await createClient();
      if (supabase) {
        const productIds = items.map(i => i.id).filter(Boolean);
        const { data } = await supabase.from('products').select('*').in('id', productIds);
        if (data && data.length) {
          dbProducts = new Map(data.map(p => [p.id, p]));
        }
      }
    } catch (e) {
      // Non-fatal, fallback to PRODUCTS
    }

    // Calculate item prices from authoritative server source + check Flash Sales & Discounts
    const verifiedItems = items.map(item => {
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
        const dbP = dbProducts?.get(item.id);
        const localP = PRODUCTS.find(p => p.id === item.id);
        const basePrice = dbP ? Number(dbP.price) : (localP ? localP.price : 120);
        
        // Factor in live flash sale / discounted item pricing
        const discounted = getDiscountedProductPrice(item.id, basePrice);
        authoritativePrice = discounted.price;

        if (dbP || localP) {
          name = dbP?.name || localP.name;
          img = dbP?.img || localP.img;
        }
      }

      const qty = Math.max(1, Math.min(20, Number(item.qty || 1)));

      return {
        id: item.id,
        kind: item.kind || 'product',
        name,
        size: item.size || 'M',
        qty,
        price: authoritativePrice,
        itemTotal: Math.round(authoritativePrice * qty * 100) / 100,
        img
      };
    });

    const subtotal = Math.round(verifiedItems.reduce((sum, item) => sum + item.itemTotal, 0) * 100) / 100;

    // Validate promo code against live admin-managed promotions
    let promo = null;
    let discount = 0;
    if (promoCode) {
      const validated = validatePromo(promoCode, subtotal);
      if (validated && !validated.error) {
        discount = Math.round(subtotal * (validated.pct / 100) * 100) / 100;
        promo = { code: validated.code, pct: validated.pct, label: validated.label };
      }
    }

    const discountedSubtotal = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
    const freeShipLeft = Math.max(0, Math.round((freeShippingThreshold - discountedSubtotal) * 100) / 100);

    // Authoritative shipping calculation based on live admin settings
    let shipping = 0;
    if (verifiedItems.length > 0) {
      if (shippingMethod === 'express') {
        shipping = expressShippingPrice;
      } else {
        shipping = freeShipLeft === 0 ? 0 : standardShippingPrice;
      }
    }

    // Authoritative tax calculation based on live admin tax rate
    const tax = Math.round(discountedSubtotal * taxRate * 100) / 100;

    // Authoritative total
    const total = Math.round((discountedSubtotal + shipping + tax) * 100) / 100;

    return NextResponse.json({
      success: true,
      quote: {
        items: verifiedItems,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        promo,
        freeShipLeft,
        shippingMethod,
        taxRate
      }
    });

  } catch (err) {
    console.error('Quote calculation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
