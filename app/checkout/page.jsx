'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useStore } from '@/context/StoreContext';
import { formatPrice, SHIPPING_OPTIONS } from '@/lib/data';

export default function CheckoutPage() {
  const router = useRouter();
  const { bag, clearBag, getTotals } = useStore();
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    region: 'CO',
    postal: '',
    country: 'US',
    cardNumber: '•••• •••• •••• 4242',
    exp: '12/28',
    cvc: '123'
  });
  const [submitting, setSubmitting] = useState(false);

  const totals = getTotals(shippingMethod);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.address) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);

    const orderId = `AG-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      customer: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.region} ${formData.postal}, ${formData.country}`,
      status: 'Processing',
      items: bag.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size || 'M',
        qty: item.qty,
        price: item.price,
        img: item.img
      })),
      shipping: totals.shipping,
      total: totals.total
    };

    try {
      const existing = JSON.parse(localStorage.getItem('angadi:orders') || '[]');
      localStorage.setItem('angadi:orders', JSON.stringify([newOrder, ...existing]));
    } catch (e) {}

    setTimeout(() => {
      clearBag();
      router.push(`/order?id=${orderId}`);
    }, 600);
  };

  if (bag.length === 0) {
    return (
      <div className="page-wrap">
        <header className="page-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Header />
        </header>
        <main style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
          <h2>Your bag is empty</h2>
          <p style={{ opacity: 0.7, marginBottom: '24px' }}>Add some layers before heading to checkout.</p>
          <Link className="pill pill--ink" href="/shop">Go to Shop</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <header className="page-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Header />
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 32px 0' }}>
          Secure Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
          {/* Form details */}
          <div>
            {/* Contact */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 32px 0' }}>
              <legend style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>1. Contact</legend>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }} htmlFor="email">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="runner@trailmail.com"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit', marginBottom: '12px' }}
              />
            </fieldset>

            {/* Shipping Address */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 32px 0' }}>
              <legend style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>2. Shipping Address</legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }} htmlFor="firstName">First name *</label>
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="Kai"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }} htmlFor="lastName">Last name *</label>
                  <input
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Nakamura"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }} htmlFor="address">Street address *</label>
                <input
                  id="address"
                  name="address"
                  required
                  placeholder="1042 Canyon Rd"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }} htmlFor="city">City *</label>
                  <input
                    id="city"
                    name="city"
                    required
                    placeholder="Boulder"
                    value={formData.city}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }} htmlFor="region">State *</label>
                  <input
                    id="region"
                    name="region"
                    required
                    placeholder="CO"
                    value={formData.region}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }} htmlFor="postal">ZIP *</label>
                  <input
                    id="postal"
                    name="postal"
                    required
                    placeholder="80302"
                    value={formData.postal}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit' }}
                  />
                </div>
              </div>
            </fieldset>

            {/* Shipping Speed */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 32px 0' }}>
              <legend style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>3. Delivery Method</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: shippingMethod === 'standard' ? '2px solid #161616' : '1px solid rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  background: '#fff'
                }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                    />
                    <div>
                      <strong>Standard Delivery</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.6 }}>3–5 business days</p>
                    </div>
                  </div>
                  <strong>{totals.freeShipLeft <= 0 ? 'Free' : '$8.00'}</strong>
                </label>

                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: shippingMethod === 'express' ? '2px solid #161616' : '1px solid rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  background: '#fff'
                }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <div>
                      <strong>Express Delivery</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.6 }}>1–2 business days</p>
                    </div>
                  </div>
                  <strong>$18.00</strong>
                </label>
              </div>
            </fieldset>

            {/* Payment */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 32px 0' }}>
              <legend style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>4. Payment</legend>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Card Number</label>
                <input
                  disabled
                  value={formData.cardNumber}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: '#f5f5f5', marginBottom: '12px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Expires</label>
                    <input
                      disabled
                      value={formData.exp}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: '#f5f5f5' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Security Code</label>
                    <input
                      disabled
                      value={formData.cvc}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: '#f5f5f5' }}
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <button
              className="pill pill--ink"
              type="submit"
              disabled={submitting}
              style={{ width: '100%', height: '54px', fontSize: '16px' }}
            >
              {submitting ? 'Placing order...' : `Pay ${formatPrice(totals.total)}`}
            </button>
          </div>

          {/* Sidebar summary */}
          <div style={{ background: '#f5f0e8', padding: '28px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0' }}>Order Summary</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
              {bag.map((item) => (
                <li key={item.key} style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'center' }}>
                  <img src={item.img} alt="" style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.6 }}>Qty: {item.qty} {item.size ? `· Size: ${item.size}` : ''}</p>
                  </div>
                  <strong style={{ fontSize: '14px' }}>{formatPrice(item.price * item.qty)}</strong>
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff5c3d' }}>
                  <span>Discount</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>Shipping</span>
                <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>Tax</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800 }}>
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
