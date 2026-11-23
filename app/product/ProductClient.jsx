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

    // Mobile In-Button Quantity Stepper Handler
    const handleMobileStepper = (e) => {
      if (!window.matchMedia('(max-width: 1000px)').matches) return;

      const decBtn = e.target.closest('[data-q-mobile="-1"]');
      const incBtn = e.target.closest('[data-q-mobile="1"]');
      const addBtn = e.target.closest('.pd__buy [data-pd-add]');

      // 1. Tapping + or - inside the button
      if (decBtn || incBtn) {
        e.preventDefault();
        e.stopPropagation();
        const delta = incBtn ? 1 : -1;
        const sizeInput = document.querySelector('input[name="size"]:checked');
        const currentSize = sizeInput ? sizeInput.value : null;
        if (!currentSize) return;

        try {
          const raw = localStorage.getItem('angadi:bag2');
          let bag = raw ? JSON.parse(raw) : [];
          const key = `${productId}:${currentSize}`;
          const existing = bag.find(item => item.key === key);
          const currentQty = existing ? existing.qty : 1;
          const nextQty = currentQty + delta;

          if (nextQty <= 0) {
            bag = bag.filter(item => item.key !== key);
            localStorage.setItem('angadi:bag2', JSON.stringify(bag));
            try {
              window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'bag' }));
            } catch {}

            const mainAdd = document.querySelector('.pd__buy [data-pd-add]');
            if (mainAdd) {
              mainAdd.classList.remove('has-stepper');
              const qtyOut = mainAdd.querySelector('[data-qty-mobile]');
              if (qtyOut) qtyOut.textContent = '1';
            }
          } else {
            if (existing) {
              existing.qty = nextQty;
            } else {
              bag.push({ key, kind: 'product', id: productId, size: currentSize, qty: nextQty });
            }
            localStorage.setItem('angadi:bag2', JSON.stringify(bag));
            try {
              window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'bag' }));
            } catch {}

            const mainAdd = document.querySelector('.pd__buy [data-pd-add]');
            if (mainAdd) {
              const qtyOut = mainAdd.querySelector('[data-qty-mobile]');
              if (qtyOut) qtyOut.textContent = String(nextQty);
            }
          }
        } catch (err) {
          console.error(err);
        }
        return;
      }

      // 2. Tapping center of button while in stepper mode -> open bag drawer
      if (addBtn && addBtn.classList.contains('has-stepper')) {
        e.preventDefault();
        const bagDrawerBtn = document.querySelector('[data-open-bag]');
        if (bagDrawerBtn) bagDrawerBtn.click();
        return;
      }

      // 3. Tapping "Butta lo Vey" normally on mobile -> add to bag & switch to stepper
      if (addBtn && !addBtn.classList.contains('has-stepper')) {
        const sizeInput = document.querySelector('input[name="size"]:checked');
        if (sizeInput && !addBtn.disabled) {
          setTimeout(() => {
            addBtn.classList.add('has-stepper');
            const qtyOut = addBtn.querySelector('[data-qty-mobile]');
            if (qtyOut) qtyOut.textContent = '1';
          }, 60);
        }
      }
    };

    const handleMobileSizeChange = (e) => {
      if (!window.matchMedia('(max-width: 1000px)').matches) return;
      if (e.target && e.target.name === 'size') {
        const size = e.target.value;
        const mainAdd = document.querySelector('.pd__buy [data-pd-add]');
        if (!mainAdd) return;
        try {
          const raw = localStorage.getItem('angadi:bag2');
          const bag = raw ? JSON.parse(raw) : [];
          const existing = bag.find(item => item.key === `${productId}:${size}`);
          const qtyOut = mainAdd.querySelector('[data-qty-mobile]');
          if (existing && existing.qty > 0) {
            mainAdd.classList.add('has-stepper');
            if (qtyOut) qtyOut.textContent = String(existing.qty);
          } else {
            mainAdd.classList.remove('has-stepper');
            if (qtyOut) qtyOut.textContent = '1';
          }
        } catch {}
      }
    };

    const syncInitialMobileStepper = () => {
      if (!window.matchMedia('(max-width: 1000px)').matches) return;
      const sizeInput = document.querySelector('input[name="size"]:checked');
      if (!sizeInput) return;
      const mainAdd = document.querySelector('.pd__buy [data-pd-add]');
      if (!mainAdd) return;
      try {
        const raw = localStorage.getItem('angadi:bag2');
        const bag = raw ? JSON.parse(raw) : [];
        const existing = bag.find(item => item.key === `${productId}:${sizeInput.value}`);
        const qtyOut = mainAdd.querySelector('[data-qty-mobile]');
        if (existing && existing.qty > 0) {
          mainAdd.classList.add('has-stepper');
          if (qtyOut) qtyOut.textContent = String(existing.qty);
        } else {
          mainAdd.classList.remove('has-stepper');
          if (qtyOut) qtyOut.textContent = '1';
        }
      } catch {}
    };

    syncInitialMobileStepper();
    setTimeout(syncInitialMobileStepper, 120);
    setTimeout(syncInitialMobileStepper, 400);
    document.addEventListener('click', handleMobileStepper, true);
    document.addEventListener('change', handleMobileSizeChange, true);
    window.addEventListener('storage', syncInitialMobileStepper);
    window.addEventListener('angadi:store', syncInitialMobileStepper);

    return () => {
      document.removeEventListener('click', handleMobileStepper, true);
      document.removeEventListener('change', handleMobileSizeChange, true);
      window.removeEventListener('storage', syncInitialMobileStepper);
      window.removeEventListener('angadi:store', syncInitialMobileStepper);
      script.remove();
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [productId]);

  return null;
}
