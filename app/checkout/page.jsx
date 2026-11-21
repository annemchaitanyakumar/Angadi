'use client';

import { Suspense } from 'react';
import CheckoutFlow from './CheckoutFlow';

function CheckoutInner() {
  return (
    <div className="page page--checkout">
      
      {/* ANGADI Topbar Header */}
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

      <main id="main">
        <header className="phead">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><a href="/cart/">Bag</a></li>
              <li aria-current="page">Checkout</li>
            </ol>
          </nav>
          <h1 className="phead__title" data-scramble>Checkout</h1>
        </header>

        {/* Enterprise Giant-Tier Checkout Component */}
        <CheckoutFlow />
      </main>

      {/* ANGADI Footer */}
      <footer className="footer" id="footer">
        <p className="footer__big" data-scramble>See you<br />out there</p>
        <div className="footer__cols">
          <form className="join" noValidate>
            <label className="join__label" htmlFor="join-email">First access to every drop</label>
            <div className="join__row">
              <input id="join-email" name="email" type="email" autoComplete="email" placeholder="you@trailmail.com" required />
              <button className="pill pill--clay" type="submit">Join</button>
            </div>
            <p className="join__msg" role="status" aria-live="polite"></p>
          </form>
          <nav className="footer__links" aria-label="Footer">
            <div>
              <h3>Dukanam</h3>
              <a href="/shop/">Dukanam</a>
              <a href="/shop/?category=Jackets">Jackets</a>
              <a href="/#look">Lookbook</a>
            </div>
            <div>
              <h3>Sahayam</h3>
              <a href="/help/#shipping">Shipping</a>
              <a href="/help/#returns">Returns</a>
              <a href="/help/#sizes">Size guide</a>
              <a href="/help/#contact">Contact</a>
            </div>
            <div>
              <h3>Company</h3>
              <a href="/about/">Maa Gurinchi</a>
              <a href="/about/#repairs">Repairs</a>
              <a href="/account/">Account</a>
              <a href="/admin/">Store admin</a>
            </div>
          </nav>
        </div>
        <div className="footer__base">
          <span>© 2026 ANGADI Outdoor</span>
          <span>Free returns within 60 days</span>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="page page--checkout"></div>}>
      <CheckoutInner />
    </Suspense>
  );
}
