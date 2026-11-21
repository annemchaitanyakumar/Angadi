'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ProductClient({ productId }) {
  useEffect(() => {
    document.documentElement.classList.add('js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('rm');
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = `/assets/product-nfrmIRU5.js?v=${Date.now()}`;
    document.body.appendChild(script);

    // Real-Time Inventory WebSocket Listener
    const supabase = createClient();
    let channel = null;

    if (supabase && productId) {
      channel = supabase
        .channel(`inventory:${productId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'product_variants',
            filter: `product_id=eq.${productId}`
          },
          (payload) => {
            const { size, stock } = payload.new;
            console.log(`[Realtime Stock Update] ${productId} Size ${size}: ${stock}`);

            // 1. Update radio input state
            const radio = document.querySelector(`input[name="size"][value="${size}"]`);
            if (radio) {
              if (stock <= 0) {
                radio.disabled = true;
                radio.parentElement?.classList.add('is-disabled');
              } else {
                radio.disabled = false;
                radio.parentElement?.classList.remove('is-disabled');
              }
            }

            // 2. Visual live inventory toast alert
            const toast = document.querySelector('.toast');
            if (toast) {
              toast.textContent = `⚡ Live Stock Updated: Size ${size} — ${stock > 0 ? stock + ' left' : 'Sold out'}`;
              toast.style.opacity = '1';
              toast.style.transform = 'translateY(0)';
              setTimeout(() => {
                toast.style.opacity = '0';
              }, 3200);
            }
          }
        )
        .subscribe();
    }

    return () => {
      script.remove();
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [productId]);

  return null;
}
