'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, LOOKS, PROMO_CODES, SHIPPING_OPTIONS, TAX_RATE, FREE_SHIPPING_THRESHOLD } from '@/lib/data';

const StoreContext = createContext(null);

const STORAGE_KEYS = {
  bag: 'angadi:bag',
  saved: 'angadi:saved',
  promo: 'angadi:promo',
  orders: 'angadi:orders',
  account: 'angadi:account'
};

export function StoreProvider({ children }) {
  const [bag, setBag] = useState([]);
  const [saved, setSaved] = useState([]);
  const [promo, setPromo] = useState(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedBag = localStorage.getItem(STORAGE_KEYS.bag);
      if (storedBag) setBag(JSON.parse(storedBag));

      const storedSaved = localStorage.getItem(STORAGE_KEYS.saved);
      if (storedSaved) setSaved(JSON.parse(storedSaved));

      const storedPromo = localStorage.getItem(STORAGE_KEYS.promo);
      if (storedPromo) setPromo(JSON.parse(storedPromo));
    } catch (e) {
      console.warn('Failed to load localStorage', e);
    }
    setMounted(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.bag, JSON.stringify(bag));
    } catch (e) {}
  }, [bag, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(saved));
    } catch (e) {}
  }, [saved, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (promo) {
        localStorage.setItem(STORAGE_KEYS.promo, JSON.stringify(promo));
      } else {
        localStorage.removeItem(STORAGE_KEYS.promo);
      }
    } catch (e) {}
  }, [promo, mounted]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addToBag = (productId, size = 'M', qty = 1) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return false;

    const available = product.stock[size] ?? 5;
    const key = `${productId}:${size}`;

    setBag((prev) => {
      const existing = prev.find((item) => item.key === key);
      const currentQty = existing ? existing.qty : 0;
      if (currentQty + qty > available) {
        showToast(`Only ${available} available in size ${size}`);
        return prev;
      }

      showToast(`Added ${product.name} to bag`);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [
        ...prev,
        {
          key,
          kind: 'product',
          id: productId,
          name: product.name,
          price: product.price,
          size,
          img: product.img,
          max: available,
          qty
        }
      ];
    });

    setIsBagOpen(true);
    return true;
  };

  const addLookToBag = (lookId) => {
    const look = LOOKS.find((l) => l.id === lookId);
    if (!look) return;

    const key = `look:${lookId}`;
    setBag((prev) => {
      const existing = prev.find((item) => item.key === key);
      showToast(`Added ${look.title.replace(/\n/g, ' ')} to bag`);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          key,
          kind: 'look',
          id: lookId,
          name: `Look ${lookId.slice(-1).padStart(2, '0')} · ${look.title.replace(/\n/g, ' ')}`,
          price: look.price,
          img: look.img,
          max: 9,
          qty: 1
        }
      ];
    });
    setIsBagOpen(true);
  };

  const updateQty = (key, qty) => {
    if (qty <= 0) {
      removeFromBag(key);
      return;
    }
    setBag((prev) =>
      prev.map((item) => (item.key === key ? { ...item, qty } : item))
    );
  };

  const removeFromBag = (key) => {
    setBag((prev) => prev.filter((item) => item.key !== key));
  };

  const clearBag = () => {
    setBag([]);
  };

  const toggleSave = (productId) => {
    setSaved((prev) => {
      const exists = prev.includes(productId);
      const next = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      showToast(exists ? 'Removed from saved' : 'Saved to wishlist');
      return next;
    });
  };

  const isSaved = (productId) => saved.includes(productId);

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    const discount = PROMO_CODES[clean];
    if (discount) {
      setPromo({ code: clean, pct: discount });
      showToast(`Promo ${clean} applied (${discount}% off)`);
      return true;
    }
    showToast('Invalid promo code');
    return false;
  };

  const removePromo = () => {
    setPromo(null);
  };

  const getTotals = (shippingSpeed = 'standard') => {
    const subtotal = bag.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = promo ? Math.round(subtotal * promo.pct) / 100 : 0;
    const discountedSubtotal = subtotal - discount;
    const freeShipLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
    const shipping =
      bag.length === 0
        ? 0
        : shippingSpeed === 'express'
        ? SHIPPING_OPTIONS.express.price
        : freeShipLeft === 0
        ? 0
        : SHIPPING_OPTIONS.standard.price;
    const tax = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
    const total = discountedSubtotal + shipping + tax;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      freeShipLeft,
      promo
    };
  };

  const totalCount = bag.reduce((sum, item) => sum + item.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        bag,
        saved,
        promo,
        totalCount,
        isBagOpen,
        setIsBagOpen,
        isMenuOpen,
        setIsMenuOpen,
        toastMessage,
        addToBag,
        addLookToBag,
        updateQty,
        removeFromBag,
        clearBag,
        toggleSave,
        isSaved,
        applyPromo,
        removePromo,
        getTotals
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
