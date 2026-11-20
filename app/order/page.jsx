'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { formatPrice } from '@/lib/data';

function OrderContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');
  const [orderIdInput, setOrderIdInput] = useState(queryId || '');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (queryId) {
      lookupOrder(queryId);
    }
  }, [queryId]);

  const lookupOrder = (id) => {
    setSearched(true);
    try {
      const stored = JSON.parse(localStorage.getItem('angadi:orders') || '[]');
      const found = stored.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
      if (found) {
        setOrder(found);
      } else {
        setOrder({
          id: id.toUpperCase(),
          date: '2026-11-18',
          status: 'Shipped',
          carrier: 'FedEx Ground',
          tracking: '782940184920',
          deliveryDate: 'Monday, Nov 24',
          customer: 'Sam Rivera',
          address: '402 Canyon Rd, Boulder, CO 80302, United States',
          items: [
            { id: 'butte', name: 'Butte Anorak', size: 'M', qty: 1, price: 186, img: '/photos/158-solum/pick-1.jpg' }
          ],
          total: 186
        });
      }
    } catch (e) {
      setOrder(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderIdInput) return;
    lookupOrder(orderIdInput);
  };

  const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
  const currentStep = order?.status === 'Delivered' ? 3 : order?.status === 'Shipped' ? 2 : 1;

  return (
    <div className="page-wrap">
      <header className="page-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Header />
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 12px 0' }}>
          Track Your Shipment
        </h1>
        <p style={{ opacity: 0.7, marginBottom: '32px' }}>
          Enter your order number from your confirmation email.
        </p>

        {/* Lookup form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '500px', marginBottom: '48px' }}>
          <input
            type="text"
            placeholder="e.g. AG-84920"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', font: 'inherit' }}
          />
          <button className="pill pill--ink" type="submit">
            Track
          </button>
        </form>

        {searched && order && (
          <div style={{ background: '#f5f0e8', borderRadius: '16px', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
              <div>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>Order Number</span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 0 0' }}>{order.id}</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="gcard__tag" style={{ background: '#161616', color: '#fff', fontSize: '13px', padding: '6px 14px' }}>
                  {order.status}
                </span>
                <p style={{ fontSize: '12px', opacity: 0.6, margin: '6px 0 0 0' }}>Placed on {order.date}</p>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '40px 0', padding: '0 10px' }}>
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '20px',
                right: '20px',
                height: '3px',
                background: 'rgba(0,0,0,0.1)',
                zIndex: 1
              }}>
                <div style={{
                  height: '100%',
                  background: '#ff5c3d',
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {steps.map((step, idx) => (
                <div key={step} style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: idx <= currentStep ? '#ff5c3d' : '#e6dfd2',
                    color: idx <= currentStep ? '#fff' : '#888',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px auto',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}>
                    {idx <= currentStep ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: idx <= currentStep ? 700 : 500, opacity: idx <= currentStep ? 1 : 0.6 }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipment information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Estimated Delivery</strong>
                <span style={{ fontSize: '15px', fontWeight: 700 }}>{order.deliveryDate || 'Within 3 business days'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Carrier &amp; Tracking</strong>
                <span style={{ fontSize: '14px' }}>{order.carrier || 'FedEx'} #{order.tracking || '7892183921'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Shipping Address</strong>
                <span style={{ fontSize: '13px', lineHeight: 1.4, display: 'block' }}>{order.address}</span>
              </div>
            </div>

            {/* Items */}
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Items in this order</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {order.items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <img src={item.img} alt="" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.6 }}>Size: {item.size} · Qty: {item.qty}</p>
                  </div>
                  <strong>{formatPrice(item.price * item.qty)}</strong>
                </li>
              ))}
            </ul>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <span style={{ fontSize: '14px', opacity: 0.7 }}>Order Total: </span>
              <strong style={{ fontSize: '18px' }}>{formatPrice(order.total)}</strong>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px 20px', textAlign: 'center' }}>Loading order details...</div>}>
      <OrderContent />
    </Suspense>
  );
}
