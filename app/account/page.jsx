'use client';

import { useEffect, Suspense } from 'react';
import Footer from '@/components/Footer';
import AccountAuthSync from './AccountAuthSync';

function AccountInner() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('rm');
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/assets/account-OlIZwzsI.js';
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="page page--account">
      <AccountAuthSync />
      
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
    <div data-account></div>
  </main>

  {/*  ANGADI — trail & outdoor running apparel — © 2026 Hasib (OVERSHOOT). All rights reserved. Licensed, not sold: see LICENSE.md.  */}
<Footer />

    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="page page--account"></div>}>
      <AccountInner />
    </Suspense>
  );
}
