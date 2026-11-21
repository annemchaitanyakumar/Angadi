'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function mapStatusToStepIndex(status) {
  const s = String(status).toLowerCase();
  if (s === 'placed' || s === 'confirmed' || s === 'pending') return 0;
  if (s === 'packing' || s === 'processing') return 1;
  if (s === 'shipped') return 2;
  if (s === 'delivered') return 3;
  return 0;
}

function mapStatusToLabel(status) {
  const s = String(status).toLowerCase();
  if (s === 'placed' || s === 'confirmed' || s === 'pending') return 'Pending';
  if (s === 'packing' || s === 'processing') return 'Processing';
  if (s === 'shipped') return 'Shipped';
  if (s === 'delivered') return 'Delivered';
  if (s === 'cancelled') return 'Cancelled';
  return status;
}

export default function OrderRealtimeListener() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('id');

  // 1. Sync order from Supabase API if missing locally
  useEffect(() => {
    if (!orderId) return;

    async function syncOrderIfMissing() {
      try {
        const stored = JSON.parse(localStorage.getItem('angadi:orders') || '[]');
        const exists = stored.some(o => o.id === orderId);
        if (!exists) {
          const res = await fetch(`/api/orders/${orderId}`);
          const data = await res.json();
          if (data.success && data.order) {
            const dbOrder = data.order;
            const mappedOrder = {
              id: dbOrder.id,
              createdAt: dbOrder.created_at,
              customer: {
                name: dbOrder.guest_name,
                email: dbOrder.guest_email
              },
              address: dbOrder.shipping_address || {},
              lines: (dbOrder.order_items || []).map(item => ({
                id: item.product_id,
                name: item.product_name,
                size: item.size,
                qty: item.qty,
                price: item.price,
                img: item.image_url
              })),
              subtotal: dbOrder.subtotal,
              discount: 0,
              shipping: dbOrder.shipping,
              tax: 0,
              total: dbOrder.total,
              status: mapStatusToLabel(dbOrder.status),
              history: (dbOrder.order_timeline || [{ status: dbOrder.status, created_at: dbOrder.created_at }]).map(t => ({
                status: mapStatusToLabel(t.status),
                at: t.created_at
              })),
              method: 'standard',
              payment: { brand: dbOrder.payment_method || 'UPI', last4: '4242' },
              source: 'store'
            };
            sessionStorage.setItem(`angadi:unlocked:${dbOrder.id}`, '1');
            sessionStorage.setItem('angadi:last-order', dbOrder.id);
            localStorage.setItem('angadi:orders', JSON.stringify([...stored, mappedOrder]));
            window.location.reload();
          }
        }
      } catch (err) {
        console.warn('Sync order error:', err);
      }
    }

    syncOrderIfMissing();
  }, [orderId]);

  // 2. Realtime WebSocket listener for order status changes
  useEffect(() => {
    if (!orderId) return;

    const supabase = createClient();
    if (!supabase) return;

    console.log(`[OrderTracker] Subscribing to realtime updates for order: ${orderId}`);

    const channel = supabase
      .channel(`order_tracker:${orderId}`)
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
          const label = mapStatusToLabel(newStatus);
          const stepIndex = mapStatusToStepIndex(newStatus);

          console.log(`[Realtime Order Update] Status changed to: ${newStatus} (${label})`);

          // Update status badge
          const statusBadge = document.querySelector('.track__head .status');
          if (statusBadge) {
            statusBadge.textContent = label;
            statusBadge.className = `status status--${label}`;
          }

          // Update 4 step dots
          const stepElements = document.querySelectorAll('.tstep');
          stepElements.forEach((el, idx) => {
            if (idx <= stepIndex) {
              el.classList.add('is-done');
            } else {
              el.classList.remove('is-done');
            }

            if (idx === stepIndex) {
              el.classList.add('is-now');
              el.setAttribute('aria-current', 'step');
            } else {
              el.classList.remove('is-now');
              el.removeAttribute('aria-current');
            }
          });

          // Update progress line
          const trackFill = document.querySelector('[data-track-fill]');
          if (trackFill) {
            const isMobile = window.matchMedia('(max-width: 820px)').matches;
            const progress = stepIndex / 3;
            trackFill.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
            if (isMobile) {
              trackFill.style.transform = `scaleY(${progress})`;
            } else {
              trackFill.style.transform = `scaleX(${progress})`;
            }
          }

          // Add history entry to <ol class="hist">
          const histList = document.querySelector('[data-hist]');
          if (histList) {
            const li = document.createElement('li');
            const now = new Date();
            const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
            li.innerHTML = `<div><strong>${label}</strong><time datetime="${now.toISOString()}">${timeStr}</time></div>`;
            histList.prepend(li);
          }

          // Sync to local order edits
          try {
            const edits = JSON.parse(localStorage.getItem('angadi:order-edits') || '{}');
            const existingHist = edits[orderId]?.history || [];
            edits[orderId] = {
              status: label,
              history: [...existingHist, { status: label, at: new Date().toISOString() }]
            };
            localStorage.setItem('angadi:order-edits', JSON.stringify(edits));
          } catch {}

          // Show floating toast
          let toast = document.querySelector('.live-order-toast');
          if (!toast) {
            toast = document.createElement('div');
            toast.className = 'live-order-toast';
            toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#161514;color:#f3efe9;padding:12px 24px;border-radius:999px;font-size:14px;box-shadow:0 12px 36px rgba(0,0,0,0.3);z-index:9999;transition:all 0.35s ease;display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,0.1);';
            document.body.appendChild(toast);
          }
          toast.innerHTML = `<span style="font-size:16px;">⚡</span> <strong>Order Update:</strong> Status changed to <strong>${label}</strong>`;
          toast.style.opacity = '1';
          toast.style.transform = 'translateX(-50%) translateY(0)';

          setTimeout(() => {
            if (toast) {
              toast.style.opacity = '0';
              toast.style.transform = 'translateX(-50%) translateY(12px)';
            }
          }, 4500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return null;
}
