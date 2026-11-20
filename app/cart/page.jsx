'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useStore } from '@/context/StoreContext';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/data';

export default function CartPage() {
  const { bag, updateQty, removeFromBag, applyPromo, removePromo, getTotals } = useStore();
  const [promoInput, setPromoInput] = useState('');
  const totals = getTotals('standard');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput) return;
    applyPromo(promoInput);
    setPromoInput('');
  };

  return (
    <div className="page-wrap">
      <header className="page-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Header />
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '0 0 32px 0' }}>
          Your Bag ({bag.reduce((s, i) => s + i.qty, 0)})
        </h1>

        {bag.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px' }}>
            <p style={{ fontSize: '18px', opacity: 0.7, marginBottom: '24px' }}>
              Your bag is empty. The trail is waiting.
            </p>
            <Link className="pill pill--ink" href="/shop">
              Explore the Shop
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
            {/* Bag items list */}
            <div>
              <div className="ship" style={{ marginBottom: '24px' }}>
                <p className="ship__text">
                  {totals.freeShipLeft <= 0
                    ? 'You have qualified for free shipping!'
                    : `Add ${formatPrice(totals.freeShipLeft)} more to reach free shipping.`}
                </p>
                <span className="ship__track">
                  <i
                    style={{
                      width: `${Math.min(100, Math.max(0, ((FREE_SHIPPING_THRESHOLD - totals.freeShipLeft) / FREE_SHIPPING_THRESHOLD) * 100))}%`
                    }}
                  ></i>
                </span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {bag.map((item) => (
                  <li
                    key={item.key}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      padding: '24px 0',
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ width: '90px', height: '120px', objectFit: 'cover', borderRadius: '8px', background: '#eae5dc' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>{item.name}</h3>
                      {item.size && <p style={{ fontSize: '13px', opacity: 0.6, margin: '0 0 8px 0' }}>Size: {item.size}</p>}
                      <p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px 0' }}>{formatPrice(item.price)}</p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          className="qtybtn"
                          onClick={() => updateQty(item.key, item.qty - 1)}
                        >
                          <svg width="14" height="14"><use href="#i-minus"/></svg>
                        </button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                        <button
                          type="button"
                          className="qtybtn"
                          onClick={() => updateQty(item.key, item.qty + 1)}
                        >
                          <svg width="14" height="14"><use href="#i-plus"/></svg>
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="iconbtn"
                      onClick={() => removeFromBag(item.key)}
                      aria-label="Remove item"
                    >
                      <svg width="18" height="18"><use href="#i-close"/></svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary card */}
            <div style={{ background: '#f5f0e8', padding: '32px', borderRadius: '16px', position: 'sticky', top: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px 0' }}>Order Summary</h2>

              {/* Promo input */}
              <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Promo code (e.g. TRAIL10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.15)',
                    background: '#fff',
                    font: 'inherit',
                    fontSize: '13px'
                  }}
                />
                <button className="pill pill--ink" type="submit" style={{ padding: '0 16px', fontSize: '13px' }}>
                  Apply
                </button>
              </form>

              {totals.promo && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#ff5c3d', marginBottom: '16px' }}>
                  <span>Code {totals.promo.code} ({totals.promo.pct}% off)</span>
                  <button type="button" onClick={removePromo} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
                    Remove
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ opacity: 0.7 }}>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>

              {totals.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#ff5c3d' }}>
                  <span>Discount</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ opacity: 0.7 }}>Estimated Shipping</span>
                <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                <span style={{ opacity: 0.7 }}>Estimated Tax (8%)</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>

              <Link className="pill pill--ink" href="/checkout" style={{ display: 'block', textAlign: 'center', width: '100%', height: '50px', lineHeight: '50px' }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
