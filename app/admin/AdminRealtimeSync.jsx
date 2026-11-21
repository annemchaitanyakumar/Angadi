'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import AdminSettingsDrawer from '@/components/AdminSettingsDrawer';

function mapDbStatusToStore(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'placed' || s === 'confirmed' || s === 'pending') return 'Pending';
  if (s === 'packing' || s === 'processing') return 'Processing';
  if (s === 'shipped') return 'Shipped';
  if (s === 'delivered') return 'Delivered';
  if (s === 'cancelled') return 'Cancelled';
  return status || 'Pending';
}

function sanitizeOrder(o) {
  const createdAt = o.createdAt || o.created_at || new Date().toISOString();
  const customer = o.customer && o.customer.email ? o.customer : {
    name: o.guest_name || 'Customer',
    email: o.guest_email || 'guest@example.com'
  };
  const rawLines = Array.isArray(o.lines) && o.lines.length > 0 ? o.lines : (o.order_items || []);
  const lines = rawLines.map(i => ({
    id: i.id || i.product_id || 'talus',
    name: i.name || i.product_name || 'Talus Wind Shell',
    size: i.size || 'M',
    qty: Number(i.qty) || 1,
    price: Number(i.price) || 0,
    img: i.img || i.image_url || '/photos/158-solum/pick-2.jpg'
  }));

  const addr = o.address || o.shipping_address || {};

  return {
    id: String(o.id || `SOL-${Date.now()}`),
    createdAt: String(createdAt),
    customer: {
      name: String(customer.name || 'Customer'),
      email: String(customer.email || 'customer@example.com')
    },
    address: {
      line1: addr.line1 || 'Trail Route',
      city: addr.city || 'Hyderabad',
      region: addr.region || 'Telangana',
      postal: addr.postal || '500081',
      country: addr.country || 'IN'
    },
    lines: lines.length > 0 ? lines : [{
      id: 'talus',
      name: 'Talus Shell',
      size: 'M',
      qty: 1,
      price: Number(o.total) || 198,
      img: '/photos/158-solum/pick-2.jpg'
    }],
    subtotal: Number(o.subtotal || o.total || 0),
    discount: Number(o.discount || 0),
    shipping: Number(o.shipping || 0),
    tax: Number(o.tax || 0),
    total: Number(o.total || 0),
    status: mapDbStatusToStore(o.status),
    history: Array.isArray(o.history) && o.history.length > 0 ? o.history : [
      { status: mapDbStatusToStore(o.status), at: String(createdAt) }
    ],
    method: o.method || 'standard',
    payment: o.payment || { brand: o.payment_method || 'UPI', last4: '4242' },
    source: o.source || 'store'
  };
}

export default function AdminRealtimeSync() {
  const [liveStatus, setLiveStatus] = useState('connecting');
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const adminSessionKey = 'angadi:admin-session';

    // ══ 1. PERSISTENT ADMIN SESSION ENGINE ══
    // Admin stays logged in permanently across refreshes and tab reopens until clicking sign out
    try {
      const persisted = localStorage.getItem(adminSessionKey);
      if (persisted === 'true') {
        sessionStorage.setItem(adminSessionKey, 'true');
        const signinEl = document.getElementById('signin');
        const shellEl = document.getElementById('shell');
        if (signinEl && shellEl) {
          signinEl.hidden = true;
          shellEl.hidden = false;
          document.documentElement.classList.add('signed-in');
        }
      }

      // Intercept sign-in form submission
      const signinForm = document.getElementById('signin-form');
      if (signinForm) {
        signinForm.addEventListener('submit', () => {
          localStorage.setItem(adminSessionKey, 'true');
          sessionStorage.setItem(adminSessionKey, 'true');
        });
      }

      // Intercept sign-out button
      const signOutBtn = document.getElementById('sign-out');
      if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
          localStorage.removeItem(adminSessionKey);
          sessionStorage.removeItem(adminSessionKey);
          localStorage.removeItem('angadi:admin_session');
          const signinEl = document.getElementById('signin');
          const shellEl = document.getElementById('shell');
          if (signinEl && shellEl) {
            shellEl.hidden = true;
            signinEl.hidden = false;
            document.documentElement.classList.remove('signed-in');
          }
        });
      }
    } catch (sessionErr) {
      console.warn('[AdminRealtimeSync] Session init warning:', sessionErr);
    }

    // ══ 2. SANITIZE STORED ORDERS & SYNC SUPABASE ORDERS ══
    async function syncAndSanitizeOrders() {
      try {
        // Read and sanitize existing local orders to prevent da() from crashing
        let currentStored = [];
        try {
          const raw = localStorage.getItem('angadi:orders');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              currentStored = parsed.map(sanitizeOrder);
            }
          }
        } catch {}

        // Fetch authoritative database orders
        const res = await fetch('/api/orders');
        const data = await res.json();

        if (data.success && Array.isArray(data.orders)) {
          const existingIds = new Set(currentStored.map(o => o.id));
          let hasUpdates = false;

          for (const dbOrder of data.orders) {
            const clean = sanitizeOrder(dbOrder);
            if (!existingIds.has(clean.id)) {
              currentStored.unshift(clean);
              existingIds.add(clean.id);
              hasUpdates = true;
            }
          }

          // Sort descending by createdAt
          currentStored.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          localStorage.setItem('angadi:orders', JSON.stringify(currentStored));

          if (hasUpdates) {
            window.dispatchEvent(new StorageEvent('storage', { key: 'angadi:orders' }));
          }
        } else if (currentStored.length > 0) {
          localStorage.setItem('angadi:orders', JSON.stringify(currentStored));
        }
      } catch (err) {
        console.warn('[AdminRealtimeSync] Order sync error:', err);
      }
    }

    syncAndSanitizeOrders();

    // ══ 3. SUPABASE REALTIME WEBSOCKET SUBSCRIPTION ══
    const supabase = createClient();
    if (!supabase) {
      setLiveStatus('offline');
      return;
    }

    const channel = supabase
      .channel('admin_orders_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newDbOrder = payload.new;
          console.log('[AdminRealtimeSync] New order inserted:', newDbOrder.id);

          setNewOrderAlert({
            id: newDbOrder.id,
            total: newDbOrder.total,
            name: newDbOrder.guest_name || 'Customer'
          });

          try {
            const raw = localStorage.getItem('angadi:orders');
            let stored = raw ? JSON.parse(raw) : [];
            const clean = sanitizeOrder(newDbOrder);

            if (!stored.some(o => o.id === clean.id)) {
              stored.unshift(clean);
              stored.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
              localStorage.setItem('angadi:orders', JSON.stringify(stored));
              window.dispatchEvent(new StorageEvent('storage', { key: 'angadi:orders' }));
            }
          } catch (e) {
            console.error('[AdminRealtimeSync] LocalStorage insert update error:', e);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new;
          console.log('[AdminRealtimeSync] Order updated:', updated.id, updated.status);
          const storeStatus = mapDbStatusToStore(updated.status);

          try {
            const edits = JSON.parse(localStorage.getItem('angadi:order-edits') || '{}');
            const prevHist = edits[updated.id]?.history || [];
            edits[updated.id] = {
              status: storeStatus,
              history: [...prevHist, { status: storeStatus, at: new Date().toISOString() }]
            };
            localStorage.setItem('angadi:order-edits', JSON.stringify(edits));
            window.dispatchEvent(new StorageEvent('storage', { key: 'angadi:order-edits' }));
          } catch {}
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setLiveStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setLiveStatus('error');
        }
      });

    // ══ 4. INTERCEPT STATUS BUTTON CLICKS FOR INSTANT BACKEND DISPATCH ══
    function handleDocumentClick(e) {
      const button = e.target.closest('button, [data-action], .btn');
      if (!button) return;

      const hash = window.location.hash;
      const orderMatch = hash.match(/#\/orders\/([A-Za-z0-9_-]+)/);
      if (!orderMatch) return;

      const orderId = orderMatch[1];
      const text = (button.textContent || '').trim().toLowerCase();

      let targetStatus = null;
      if (text.includes('pack') || text.includes('process')) targetStatus = 'packing';
      else if (text.includes('ship')) targetStatus = 'shipped';
      else if (text.includes('deliver')) targetStatus = 'delivered';
      else if (text.includes('cancel')) targetStatus = 'cancelled';

      if (targetStatus) {
        console.log(`[AdminRealtimeSync] Dispatching status update for ${orderId} -> ${targetStatus}`);
        fetch(`/api/orders/${orderId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: targetStatus })
        }).catch(err => console.error('[AdminRealtimeSync] Status update API error:', err));
      }
    }

    document.addEventListener('click', handleDocumentClick);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <>
      {/* ══ TOPBAR CONTROLS: NATIVE ICON BUTTON ══ */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {/* Store Settings & Promotions Trigger (Native Icon Button Style) */}
        <button
          type="button"
          className="iconbtn"
          id="btn-store-settings"
          title="Store Settings & Promotions"
          aria-label="Store Settings & Promotions"
          onClick={() => setIsSettingsOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
        </button>
      </div>

      {/* Floating Incoming Order Notification (Minimalist Luxury Styling) */}
      {newOrderAlert && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--moss, #2e3a2f)',
            color: 'var(--cream, #f4efe6)',
            padding: '16px 20px',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 9999,
            minWidth: '280px',
            animation: 'slideUp 0.35s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--clay-soft, #e9a27d)' }}>
              New Order Received
            </span>
            <button
              type="button"
              onClick={() => setNewOrderAlert(null)}
              style={{ background: 'none', border: 'none', color: '#cfcbbf', cursor: 'pointer', fontSize: '16px', padding: 0 }}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#f4efe6' }}>
            Order <strong>{newOrderAlert.id}</strong> by {newOrderAlert.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#f6e6bf' }}>
              ₹{Number(newOrderAlert.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <a
              href={`#/orders/${newOrderAlert.id}`}
              onClick={() => setNewOrderAlert(null)}
              style={{
                fontSize: '12px',
                padding: '6px 14px',
                background: 'var(--cream, #f4efe6)',
                color: 'var(--moss, #2e3a2f)',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              View Order
            </a>
          </div>
        </div>
      )}

      {/* ══ Promos, Taxes, Flash Sales & Customer Directory Governance Panel ══ */}
      <AdminSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
