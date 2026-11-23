'use client';

import { useEffect, Suspense } from 'react';

function CartInner() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('rm');
    }

    // Immediately fetch authoritative settings from backend and seed localStorage['angadi:settings']
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.settings) {
          localStorage.setItem('angadi:settings', JSON.stringify(data.settings));
          window.dispatchEvent(new StorageEvent('storage', { key: 'angadi:settings' }));
        }
      })
      .catch(() => {});

    // Listen to live cross-tab settings updates
    const handleSettingsUpdate = (e) => {
      if (!e || e.key === 'angadi:settings' || e.type === 'angadi:settings-updated') {
        window.dispatchEvent(new StorageEvent('storage', { key: 'angadi:bag2' }));
      }
    };
    window.addEventListener('storage', handleSettingsUpdate);
    window.addEventListener('angadi:settings-updated', handleSettingsUpdate);

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/assets/cart-D2yeZsU3.js?v=2';
    document.body.appendChild(script);

    return () => {
      script.remove();
      window.removeEventListener('storage', handleSettingsUpdate);
      window.removeEventListener('angadi:settings-updated', handleSettingsUpdate);
    };
  }, []);

  return (
    <div className="page page--cart">
      
      {/*  ANGADI — trail & outdoor running apparel — © 2026 Hasib (OVERSHOOT). All rights reserved. Licensed, not sold: see LICENSE.md.  */}


  {/*  ANGADI — trail & outdoor running apparel — © 2026 Hasib (OVERSHOOT). All rights reserved. Licensed, not sold: see LICENSE.md.  */}

<header className="topbar" data-topbar>
  <button className="iconbtn topbar__burger" type="button" data-open-menu aria-expanded="false" aria-controls="menu" aria-label="Open menu"><svg width="22" height="22"><use href="#i-menu"/></svg></button>
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
    <a className="iconbtn" href="/account/" data-nav="account" aria-label="Your account"><svg width="20" height="20"><use href="#i-user"/></svg></a>
    <button className="iconbtn iconbtn--ink" type="button" data-open-bag aria-label="Open bag, 0 items">
      <svg width="20" height="20"><use href="#i-bag"/></svg>
      <span className="badge" data-bag-count hidden>0</span>
    </button>
  </div>
</header>


  <main id="main">
    <header className="phead phead--row">
      <h1 className="phead__title" data-scramble>Your bag</h1>
      <p className="toolbar__count" data-count aria-live="polite"></p>
    </header>
    <div className="cart__grid">
      <section aria-label="Items in your bag">
        <ul className="lines" data-lines></ul>
        <div className="empty" data-empty hidden>
          <h2>Your bag is empty</h2>
          <p>The trail is waiting. Start with our newest layers.</p>
          <a className="pill pill--ink" href="/shop/">Dukanam</a>
        </div>
      </section>
      <aside className="summary" aria-labelledby="sum-h" data-summary>
        <h2 id="sum-h">Order summary</h2>
        <div className="ship" data-cart-ship>
          <p className="ship__text" data-cart-ship-text></p>
          <span className="ship__track"><i data-cart-ship-fill></i></span>
        </div>
        <dl className="sum" data-sum></dl>
        <form className="promo" noValidate data-promo>
          <label className="field__label" htmlFor="promo-code">Promo code</label>
          <div className="promo__row">
            <input id="promo-code" name="code" autoComplete="off" placeholder="TRAIL10" aria-describedby="promo-msg" />
            <button className="pill pill--light" type="submit">Apply</button>
          </div>
          <p className="promo__msg" id="promo-msg" role="status" aria-live="polite"></p>
        </form>
        <a className="pill pill--ink" href="/checkout/" data-go-checkout>Checkout</a>
        <p className="secure">Free shipping over ₹1,500 · 60-day returns</p>
      </aside>
    </div>
    <section className="also" aria-labelledby="also-h" data-also>
      <h2 id="also-h" data-scramble>Complete the kit</h2>
      <ul className="plist" data-also-list></ul>
    </section>
  </main>

  {/*  ANGADI — trail & outdoor running apparel — © 2026 Hasib (OVERSHOOT). All rights reserved. Licensed, not sold: see LICENSE.md.  */}
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
      <div><h3>Dukanam</h3><a href="/shop/">Dukanam</a><a href="/shop/?category=Jackets">Jackets</a><a href="/#look">Lookbook</a></div>
      <div><h3>Sahayam</h3><a href="/help/#shipping">Shipping</a><a href="/help/#returns">Returns</a><a href="/help/#sizes">Size guide</a><a href="/help/#contact">Contact</a></div>
      <div><h3>Company</h3><a href="/about/">Maa Gurinchi</a><a href="/about/#repairs">Repairs</a><a href="/account/">Account</a><a href="/admin/">Store admin</a></div>
    </nav>
  </div>
  <div className="footer__base">
    <span>© 2026 ANGADI Outdoor</span>
    <span>Free returns within 60 days</span>
    <a href="#top">Back to top</a>
  </div>
</footer>

  {/*  ANGADI — trail & outdoor running apparel — © 2026 Hasib (OVERSHOOT). All rights reserved. Licensed, not sold: see LICENSE.md.  */}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="page page--cart"></div>}>
      <CartInner />
    </Suspense>
  );
}
