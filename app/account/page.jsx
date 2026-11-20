'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS, formatPrice } from '@/lib/data';

export default function AccountPage() {
  const { saved, addToBag, toggleSave } = useStore();
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (email) setSignedIn(true);
  };

  const savedProducts = PRODUCTS.filter((p) => saved.includes(p.id));

  return (
    <div className="page-wrap">
      <header className="page-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Header />
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {!signedIn ? (
          <div style={{ maxWidth: '440px', margin: '40px auto', background: '#f5f0e8', padding: '40px', borderRadius: '16px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', textAlign: 'center' }}>
              Runner Sign In
            </h1>
            <p style={{ opacity: 0.7, fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
              Access your order history, saved trail gear and fast checkout.
            </p>

            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }} htmlFor="acc-email">
                  Email
                </label>
                <input
                  id="acc-email"
                  type="email"
                  required
                  placeholder="runner@trailmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }} htmlFor="acc-pass">
                  Password
                </label>
                <input
                  id="acc-pass"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit' }}
                />
              </div>

              <button className="pill pill--ink" type="submit" style={{ height: '48px', fontSize: '15px', marginTop: '8px' }}>
                Sign In
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', opacity: 0.7, marginTop: '20px' }}>
              New to ANGADI? Any email works in this demo.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 6px 0' }}>
                  Welcome back, {email.split('@')[0]}
                </h1>
                <p style={{ opacity: 0.6, margin: 0, fontSize: '14px' }}>Member since 2024 · ANGADI Trail Club</p>
              </div>
              <button
                className="pill pill--light"
                type="button"
                onClick={() => setSignedIn(false)}
              >
                Sign out
              </button>
            </div>

            {/* Profile info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
              <div style={{ background: '#f5f0e8', padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0' }}>Profile Details</h3>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Email:</strong> {email}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Default Shipping:</strong> Boulder, CO</p>
                <p style={{ margin: 0, fontSize: '14px' }}><strong>Preferred Size:</strong> Medium (M)</p>
              </div>

              <div style={{ background: '#f5f0e8', padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0' }}>Recent Orders</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                  <Link href="/order?id=AG-10942" style={{ textDecoration: 'underline', fontWeight: 600 }}>Order #AG-10942</Link> · Delivered
                </p>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  <Link href="/order?id=AG-10821" style={{ textDecoration: 'underline', fontWeight: 600 }}>Order #AG-10821</Link> · Delivered
                </p>
              </div>
            </div>

            {/* Saved items */}
            <section>
              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 20px 0' }}>
                Saved Wishlist ({savedProducts.length})
              </h2>

              {savedProducts.length === 0 ? (
                <p style={{ opacity: 0.6 }}>No items saved yet. Tap the heart icon on any gear piece to save it.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                  {savedProducts.map((p) => (
                    <div key={p.id} className="gcard" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                      <Link href={`/product?id=${p.id}`}>
                        <img src={p.img} alt={p.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                      </Link>
                      <div style={{ padding: '16px' }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>{p.name}</h4>
                        <p style={{ margin: '0 0 12px 0', fontWeight: 700 }}>{formatPrice(p.price)}</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="pill pill--ink"
                            type="button"
                            onClick={() => addToBag(p.id, 'M', 1)}
                            style={{ flex: 1, padding: '0 12px', fontSize: '12px' }}
                          >
                            Add to bag
                          </button>
                          <button
                            className="iconbtn"
                            type="button"
                            onClick={() => toggleSave(p.id)}
                            aria-label="Remove from saved"
                          >
                            <svg width="16" height="16"><use href="#i-close" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
