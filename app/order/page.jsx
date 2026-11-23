'use client';

import { Suspense } from 'react';
import Footer from '@/components/Footer';
import OrderTrackingClient from './OrderTrackingClient';

function OrderInner() {
  return (
    <div className="page page--order">
      {/* Topbar Header */}
      <header className="topbar" data-topbar>
        <button className="iconbtn topbar__burger" type="button" data-open-menu aria-expanded="false" aria-controls="menu" aria-label="Open menu">
          <svg width="22" height="22"><use href="#i-menu"/></svg>
        </button>
        <a className="topbar__logo" href="/" aria-label="ANGADI home">ANGADI</a>
        <nav className="topbar__links" aria-label="Main">
          <a href="/shop/" data-nav="shop">Dukanam</a>
          <a href="/shop/?gender=Women" data-nav="shop-women">Stree</a>
          <a href="/shop/?gender=Men" data-nav="shop-men">Purush</a>
          <a href="/#look">Lookbook</a>
          <a href="/about/" data-nav="about">Maa Gurinchi</a>
          <a href="/help/" data-nav="help">Sahayam</a>
        </nav>
        <div className="topbar__actions">
          <a className="iconbtn" href="/account/" data-nav="account" aria-label="Your account">
            <svg width="20" height="20"><use href="#i-user"/></svg>
          </a>
          <button className="iconbtn iconbtn--ink" type="button" data-open-bag aria-label="Open bag, 0 items">
            <svg width="20" height="20"><use href="#i-bag"/></svg>
            <span className="badge" data-bag-count hidden>0</span>
          </button>
        </div>
      </header>

      {/* Main Order Tracking & Details */}
      <main id="main">
        <Suspense fallback={<div style={{ padding: '80px 20px', textAlign: 'center' }}>Loading order tracking...</div>}>
          <OrderTrackingClient />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="page page--order"></div>}>
      <OrderInner />
    </Suspense>
  );
}
