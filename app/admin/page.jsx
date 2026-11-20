'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, formatPrice } from '@/lib/data';

export default function AdminPage() {
  const [tab, setTab] = useState('orders');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [orders, setOrders] = useState([
    { id: 'AG-10942', customer: 'Sam Rivera', city: 'Boulder, CO', date: '2026-11-19', status: 'Processing', total: 214, items: 'Pinefall Storm Shell (M)' },
    { id: 'AG-10941', customer: 'Aiko Tanaka', city: 'Portland, OR', date: '2026-11-19', status: 'Shipped', total: 186, items: 'Butte Anorak (S)' },
    { id: 'AG-10940', customer: 'Jonas Weber', city: 'Denver, CO', date: '2026-11-18', status: 'Delivered', total: 128, items: 'Ridgeline Hooded Fleece (L)' },
    { id: 'AG-10939', customer: 'Priya Nair', city: 'Seattle, WA', date: '2026-11-18', status: 'Pending', total: 96, items: 'Mesa Oversized Hoodie (M)' },
    { id: 'AG-10938', customer: 'Maya Okafor', city: 'Bend, OR', date: '2026-11-17', status: 'Delivered', total: 236, items: 'Col Puffer Jacket (XS)' },
    { id: 'AG-10937', customer: 'Hannah Kim', city: 'Flagstaff, AZ', date: '2026-11-17', status: 'Shipped', total: 158, items: 'Scree Windbreaker (M)' },
    { id: 'AG-10936', customer: 'Leo Brandt', city: 'Austin, TX', date: '2026-11-16', status: 'Delivered', total: 142, items: 'Hollow Quilted Vest (S)' }
  ]);

  const updateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.city.toLowerCase().includes(q);
    }
    return true;
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f2eb', color: '#161616', padding: '32px 24px' }}>
      <header style={{
        maxWidth: '1300px',
        margin: '0 auto 32px auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '0.04em', textDecoration: 'none', color: '#161616' }}>
            ANGADI
          </Link>
          <span style={{ fontSize: '13px', background: '#161616', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontWeight: 600 }}>
            ADMIN
          </span>
        </div>
        <Link href="/" className="pill pill--light" style={{ fontSize: '13px', textDecoration: 'none' }}>
          ← View Storefront
        </Link>
      </header>

      <main style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>Total Revenue</span>
            <p style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 0 0' }}>{formatPrice(totalRevenue)}</p>
          </div>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>Active Orders</span>
            <p style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 0 0' }}>{orders.length}</p>
          </div>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>Catalog Pieces</span>
            <p style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 0 0' }}>{PRODUCTS.length}</p>
          </div>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>Units in Stock</span>
            <p style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 0 0' }}>
              {PRODUCTS.reduce((sum, p) => sum + Object.values(p.stock).reduce((s, v) => s + v, 0), 0)}
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            type="button"
            className="filter"
            aria-pressed={tab === 'orders'}
            onClick={() => setTab('orders')}
            style={{ fontSize: '14px', padding: '10px 20px' }}
          >
            Orders ({orders.length})
          </button>
          <button
            type="button"
            className="filter"
            aria-pressed={tab === 'products'}
            onClick={() => setTab('products')}
            style={{ fontSize: '14px', padding: '10px 20px' }}
          >
            Products &amp; Inventory ({PRODUCTS.length})
          </button>
        </div>

        {tab === 'orders' ? (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {/* Search and filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search order or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', minWidth: '260px' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className="filter"
                    aria-pressed={statusFilter === st}
                    onClick={() => setStatusFilter(st)}
                    style={{ fontSize: '12px' }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.6)' }}>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Customer</th>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px' }}>Items</th>
                    <th style={{ padding: '12px 16px' }}>Total</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        <Link href={`/order?id=${o.id}`} style={{ textDecoration: 'underline' }}>{o.id}</Link>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <strong>{o.customer}</strong>
                        <span style={{ display: 'block', fontSize: '12px', opacity: 0.6 }}>{o.city}</span>
                      </td>
                      <td style={{ padding: '14px 16px', opacity: 0.7 }}>{o.date}</td>
                      <td style={{ padding: '14px 16px' }}>{o.items}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{formatPrice(o.total)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="gcard__tag" style={{
                          background: o.status === 'Delivered' ? '#4a5a44' : o.status === 'Shipped' ? '#161616' : '#c58a78',
                          color: '#fff'
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.6)' }}>
                    <th style={{ padding: '12px 16px' }}>Piece</th>
                    <th style={{ padding: '12px 16px' }}>SKU</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Price</th>
                    <th style={{ padding: '12px 16px' }}>Stock XS / S / M / L / XL</th>
                    <th style={{ padding: '12px 16px' }}>Total Units</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.map((p) => {
                    const totalUnits = Object.values(p.stock).reduce((s, v) => s + v, 0);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={p.img} alt="" style={{ width: '40px', height: '52px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div>
                              <strong style={{ display: 'block' }}>{p.name}</strong>
                              <span style={{ fontSize: '12px', opacity: 0.6 }}>{p.color.name} · {p.gender}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', opacity: 0.7, fontFamily: 'monospace' }}>{p.sku}</td>
                        <td style={{ padding: '14px 16px' }}>{p.category}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>{formatPrice(p.price)}</td>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '13px' }}>
                          {p.stock.XS ?? '-'} / {p.stock.S ?? '-'} / {p.stock.M ?? '-'} / {p.stock.L ?? '-'} / {p.stock.XL ?? '-'}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                          <span style={{ color: totalUnits < 15 ? '#ff5c3d' : 'inherit' }}>
                            {totalUnits}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
