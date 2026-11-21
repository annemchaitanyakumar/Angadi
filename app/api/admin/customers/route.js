import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLocalAccounts, updateLocalAccount, deleteLocalAccount } from '@/lib/auth';

export async function GET() {
  try {
    const customersMap = new Map();

    // 1. Fetch from Supabase profiles
    const supabase = await createClient();
    if (supabase) {
      try {
        const { data: profiles } = await supabase.from('profiles').select('*');
        if (profiles) {
          profiles.forEach(p => {
            customersMap.set(p.email.toLowerCase(), {
              id: p.id,
              email: p.email,
              name: p.full_name || p.email.split('@')[0],
              phone: p.phone || '',
              role: p.role || 'customer',
              source: 'supabase',
              createdAt: p.created_at,
              totalOrders: 0,
              totalSpent: 0
            });
          });
        }
      } catch (err) {
        console.warn('Profiles fetch warning:', err.message);
      }
    }

    // 2. Fetch from local accounts
    const localAccounts = getLocalAccounts();
    localAccounts.forEach(acc => {
      const email = acc.email.toLowerCase();
      if (!customersMap.has(email)) {
        customersMap.set(email, {
          id: acc.id,
          email: acc.email,
          name: acc.name || acc.email.split('@')[0],
          phone: '',
          role: 'customer',
          source: 'local',
          createdAt: acc.createdAt,
          totalOrders: 0,
          totalSpent: 0
        });
      }
    });

    // 3. Enrich with order statistics
    if (supabase) {
      try {
        const { data: orders } = await supabase.from('orders').select('*');
        if (orders) {
          orders.forEach(o => {
            const email = (o.guest_email || '').toLowerCase().trim();
            if (!email) return;

            let customer = customersMap.get(email);
            if (!customer) {
              customer = {
                id: `guest_${email}`,
                email,
                name: o.guest_name || email.split('@')[0],
                phone: o.shipping_address?.phone || '',
                role: 'guest',
                source: 'order_guest',
                createdAt: o.created_at,
                totalOrders: 0,
                totalSpent: 0
              };
              customersMap.set(email, customer);
            }

            customer.totalOrders += 1;
            customer.totalSpent += Number(o.total || 0);
            customer.lastOrderAt = o.created_at;
            if (!customer.phone && o.shipping_address?.phone) {
              customer.phone = o.shipping_address.phone;
            }
          });
        }
      } catch (err) {
        console.warn('Orders fetch warning in customers API:', err.message);
      }
    }

    const customers = Array.from(customersMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    return NextResponse.json({ success: true, customers });
  } catch (err) {
    console.error('Customer fetch error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, name, phone, role } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required to update customer' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Update in Supabase profiles
    const supabase = await createClient();
    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: name,
            phone: phone || null,
            role: role || 'customer',
            updated_at: new Date().toISOString()
          })
          .eq('email', normalizedEmail);
      } catch (err) {
        console.warn('Supabase profile update warning:', err.message);
      }
    }

    // 2. Update in local accounts if present
    updateLocalAccount(normalizedEmail, { name });

    // 3. Update orders guest name for consistency
    if (supabase && name) {
      try {
        await supabase
          .from('orders')
          .update({ guest_name: name })
          .eq('guest_email', normalizedEmail);
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: `Customer ${email} updated successfully`,
      customer: { email: normalizedEmail, name, phone, role }
    });
  } catch (err) {
    console.error('Customer update error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email parameter required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Delete from Supabase profiles
    const supabase = await createClient();
    if (supabase) {
      try {
        await supabase.from('profiles').delete().eq('email', normalizedEmail);
      } catch (err) {
        console.warn('Supabase profile delete warning:', err.message);
      }
    }

    // 2. Delete from local accounts
    deleteLocalAccount(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: `Customer ${normalizedEmail} successfully deleted from the store.`
    });
  } catch (err) {
    console.error('Customer delete error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
