'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const STEPS = [
  { id: 'Pending', label: 'Order placed', desc: 'We have received your order' },
  { id: 'Processing', label: 'Packing', desc: 'Being packed at our studio' },
  { id: 'Shipped', label: 'On its way', desc: 'Dispatched with carrier' },
  { id: 'Delivered', label: 'Delivered', desc: 'Delivered to your address' }
];

function mapDbStatus(s) {
  const str = String(s || '').toLowerCase();
  if (str === 'placed' || str === 'confirmed' || str === 'pending') return 'Pending';
  if (str === 'packing' || str === 'processing') return 'Processing';
  if (str === 'shipped') return 'Shipped';
  if (str === 'delivered') return 'Delivered';
  if (str === 'cancelled') return 'Cancelled';
  return 'Pending';
}

function getStepIndex(status) {
  const norm = mapDbStatus(status);
  const idx = STEPS.findIndex(s => s.id === norm);
  return idx !== -1 ? idx : 0;
}

export default function OrderTrackingClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('id');
  const isNew = searchParams?.get('new') === '1';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch order from API / localStorage
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function loadOrder() {
      setLoading(true);
      setError('');

      try {
        // 1. Fetch live order from backend
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        const data = await res.json();

        if (data.success && data.order) {
          const dbO = data.order;
          const mapped = {
            id: dbO.id,
            createdAt: dbO.created_at,
            customer: {
              name: dbO.guest_name || 'Customer',
              email: dbO.guest_email || ''
            },
            address: dbO.shipping_address || {},
            lines: (dbO.order_items || []).map(i => ({
              id: i.product_id,
              name: i.product_name,
              size: i.size,
              qty: i.qty,
              price: Number(i.price),
              img: i.image_url || '/photos/158-solum/trail-main.jpg'
            })),
            subtotal: Number(dbO.subtotal || 0),
            discount: dbO.discount ? Number(dbO.discount) : 0,
            shipping: Number(dbO.shipping || 0),
            tax: Number(dbO.tax || 0),
            total: Number(dbO.total || 0),
            status: mapDbStatus(dbO.status),
            history: (dbO.order_timeline || [{ status: dbO.status, created_at: dbO.created_at }]).map(t => ({
              status: mapDbStatus(t.status),
              at: t.created_at
            })),
            method: 'standard',
            payment: { brand: dbO.payment_method || 'Test Card', last4: '4242' }
          };

          // If subtotal + shipping doesn't match total, deduce tax/discount
          if (mapped.tax === 0 && mapped.total > (mapped.subtotal + mapped.shipping)) {
            mapped.tax = Math.round((mapped.total - mapped.subtotal - mapped.shipping) * 100) / 100;
          }

          setOrder(mapped);
          setLoading(false);
          return;
        }

        // 2. Fallback to localStorage
        const stored = JSON.parse(localStorage.getItem('angadi:orders') || '[]');
        const local = stored.find(o => o.id === orderId);
        if (local) {
          setOrder(local);
          setLoading(false);
          return;
        }

        setError(`We couldn't find order ${orderId}.`);
      } catch (err) {
        console.error('Order load error:', err);
        // Fallback to local
        const stored = JSON.parse(localStorage.getItem('angadi:orders') || '[]');
        const local = stored.find(o => o.id === orderId);
        if (local) {
          setOrder(local);
        } else {
          setError('Failed to load order details.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  // Realtime Supabase Subscription for status updates
  useEffect(() => {
    if (!orderId) return;

    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`live_order_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          const newStatus = payload.new.status;
          const mappedStatus = mapDbStatus(newStatus);
          setOrder(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              status: mappedStatus,
              history: [
                { status: mappedStatus, at: new Date().toISOString() },
                ...(prev.history || [])
              ]
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #2e3a2f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#576255', fontSize: '15px' }}>Loading your order tracking...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: '60px 20px', maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-display, inherit)', marginBottom: '12px' }}>Find your order</h1>
        <p style={{ color: '#576255', marginBottom: '24px' }}>{error || 'Enter your order ID to track its real-time progress.'}</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            const id = e.target.elements.lookupId.value.trim();
            if (id) window.location.href = `/order?id=${encodeURIComponent(id)}`;
          }}
          style={{ display: 'flex', gap: '8px' }}
        >
          <input
            name="lookupId"
            defaultValue={orderId || ''}
            placeholder="e.g. ANG-2026-7116"
            style={{ flex: 1, height: '46px', padding: '0 16px', borderRadius: '999px', border: '1px solid #dcd7ce' }}
          />
          <button type="submit" className="pill pill--ink" style={{ height: '46px', padding: '0 24px' }}>
            Track
          </button>
        </form>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(order.status);
  const firstName = order.customer?.name?.split(' ')[0] || 'Runner';

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '20px 20px 80px' }}>
      
      {/* ══ CELEBRATION BANNER (Shown when new=1) ══ */}
      {isNew ? (
        <section
          style={{
            textAlign: 'center',
            padding: '40px 20px 32px',
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid #e7e2d9',
            marginBottom: '32px',
            boxShadow: '0 12px 32px rgba(46,58,47,0.06)'
          }}
        >
          {/* Animated Checkmark */}
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: '#243025',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 8px 24px rgba(36,48,37,0.22)'
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 3vw, 2.6rem)',
              fontFamily: 'var(--font-display, inherit)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 10px',
              color: '#1a231b'
            }}
          >
            Thank you, {firstName}!
          </h1>

          <p style={{ fontSize: '15px', color: '#576255', margin: '0 auto 24px', maxWidth: '520px', lineHeight: '1.5' }}>
            Your order <strong>{order.id}</strong> has been successfully placed and authorized. A live receipt has been sent to <strong>{order.customer?.email}</strong>.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a className="pill pill--ink" href="/shop" style={{ padding: '0 24px', height: '46px', display: 'inline-flex', alignItems: 'center' }}>
              Keep Exploring the Shop
            </a>
            <a className="pill pill--light" href="/account" style={{ padding: '0 24px', height: '46px', display: 'inline-flex', alignItems: 'center' }}>
              View Account & Orders
            </a>
          </div>
        </section>
      ) : (
        <header style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <nav style={{ fontSize: '13px', color: '#717d6f', marginBottom: '6px' }}>
              <a href="/account" style={{ color: 'inherit', textDecoration: 'none' }}>Account</a> &rsaquo; <span>{order.id}</span>
            </nav>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, inherit)' }}>
              Order {order.id}
            </h1>
          </div>
          <span style={{ fontSize: '13px', color: '#717d6f' }}>
            Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </header>
      )}

      {/* ══ INTERACTIVE LIVE TRACKER STEPPER ══ */}
      <section
        style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '28px 32px',
          border: '1px solid #e7e2d9',
          marginBottom: '28px',
          boxShadow: '0 8px 24px rgba(46,58,47,0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#b5562f' }}>
              Real-Time Fulfillment
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0' }}>Order Tracking Status</h2>
          </div>

          <span
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: order.status === 'Delivered' ? '#e8f5e9' : order.status === 'Shipped' ? '#e3f2fd' : '#fef3e2',
              color: order.status === 'Delivered' ? '#2e7d32' : order.status === 'Shipped' ? '#1565c0' : '#b5562f'
            }}
          >
            ● {order.status}
          </span>
        </div>

        {/* 4 Steps Timeline */}
        <div style={{ position: 'relative', margin: '20px 0' }}>
          {/* Background Track Line */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '5%',
              right: '5%',
              height: '3px',
              background: '#e7e2d9',
              zIndex: 0
            }}
          >
            {/* Active Progress Fill */}
            <div
              style={{
                height: '100%',
                width: `${(currentStepIdx / 3) * 100}%`,
                background: '#243025',
                transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            />
          </div>

          <div className="order-step-tracker" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
            {STEPS.map((step, idx) => {
              const isDone = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isDone ? '#243025' : '#fff',
                      color: isDone ? '#fff' : '#717d6f',
                      border: isDone ? '2px solid #243025' : '2px solid #dcd7ce',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      marginBottom: '10px',
                      transition: 'all 0.3s',
                      boxShadow: isCurrent ? '0 0 0 5px rgba(36,48,37,0.15)' : 'none'
                    }}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <strong style={{ fontSize: '13px', color: isDone ? '#1a231b' : '#717d6f' }}>
                    {step.label}
                  </strong>
                  <small className="tracker-step-desc" style={{ fontSize: '11px', color: '#919b8f', marginTop: '2px' }}>
                    {step.desc}
                  </small>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 2-COLUMN ORDER DETAILS GRID (Responsive) ══ */}
      <div className="order-responsive-grid" style={{ gap: '24px' }}>
        
        {/* LEFT COLUMN: ORDER ITEMS & FINANCIAL SUMMARY */}
        <section
          className="order-card"
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #e7e2d9',
            boxShadow: '0 8px 24px rgba(46,58,47,0.04)'
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 18px', borderBottom: '1px solid #e7e2d9', paddingBottom: '12px' }}>
            Items in This Order ({order.lines?.reduce((s, i) => s + (i.qty || 1), 0) || 0})
          </h2>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            {(order.lines || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f4f0e9', paddingBottom: '14px' }}>
                <div style={{ position: 'relative', width: '64px', height: '80px', borderRadius: '10px', overflow: 'hidden', background: '#f4f0e9', flexShrink: 0 }}>
                  <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '999px'
                    }}
                  >
                    x{item.qty}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#1a231b' }}>{item.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#717d6f' }}>
                    Size {item.size || 'M'} · ₹{Number(item.price).toFixed(2)} each
                  </p>
                </div>

                <strong style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                  ₹{(Number(item.price) * Number(item.qty || 1)).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          {/* Canonical Totals Breakdown */}
          <dl className="sum" style={{ borderTop: '1px solid #e7e2d9', paddingTop: '16px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <dt style={{ color: '#576255' }}>Subtotal</dt>
              <dd style={{ fontWeight: 600 }}>₹{order.subtotal.toFixed(2)}</dd>
            </div>

            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#2e7d32' }}>
                <dt>Promo Discount</dt>
                <dd style={{ fontWeight: 700 }}>-₹{order.discount.toFixed(2)}</dd>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <dt style={{ color: '#576255' }}>Shipping ({order.shipping === 0 ? 'Free Shipping' : 'Standard Trail'})</dt>
              <dd style={{ fontWeight: 600, color: order.shipping === 0 ? '#2e7d32' : 'inherit' }}>
                {order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}
              </dd>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '13px' }}>
              <dt style={{ color: '#576255' }}>Estimated Tax (8%)</dt>
              <dd style={{ fontWeight: 600 }}>₹{order.tax.toFixed(2)}</dd>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '2px solid #243025',
                fontSize: '18px',
                fontWeight: 800,
                color: '#1a231b'
              }}
            >
              <dt>Total Paid</dt>
              <dd>₹{order.total.toFixed(2)}</dd>
            </div>
          </dl>
        </section>

        {/* RIGHT COLUMN: DELIVERY & PAYMENT & ACTIVITY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Shipping Address */}
          <section
            className="order-card"
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid #e7e2d9',
              boxShadow: '0 8px 24px rgba(46,58,47,0.04)'
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 12px' }}>Delivery Address</h3>
            <address style={{ fontStyle: 'normal', fontSize: '13px', lineHeight: '1.6', color: '#576255' }}>
              <strong style={{ color: '#1a231b' }}>{order.customer?.name}</strong><br />
              {order.address?.line1}<br />
              {order.address?.line2 && <>{order.address.line2}<br /></>}
              {order.address?.city}, {order.address?.region} {order.address?.postal}<br />
              {order.address?.country === 'IN' || !order.address?.country ? 'India' : order.address.country}
            </address>
            <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#b5562f', fontWeight: 600 }}>
              Standard Trail Ground (3–5 Business Days)
            </p>
          </section>

          {/* Payment Method */}
          <section
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid #e7e2d9',
              boxShadow: '0 8px 24px rgba(46,58,47,0.04)'
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 12px' }}>Payment Authorized</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#576255', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#2e7d32', fontWeight: 700 }}>✓ PAID</span>
              <span>· {order.payment?.brand || 'Test Card'}</span>
            </p>
          </section>

          {/* Live Activity History */}
          <section
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid #e7e2d9',
              boxShadow: '0 8px 24px rgba(46,58,47,0.04)'
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 14px' }}>Activity Log</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              {(order.history || [{ status: order.status, at: order.createdAt }]).map((h, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#576255' }}>
                  <strong style={{ color: '#1a231b' }}>{h.status}</strong>
                  <span>{new Date(h.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>

      </div>

    </div>
  );
}
