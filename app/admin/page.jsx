'use client';

import { useEffect, Suspense } from 'react';
import AdminRealtimeSync from './AdminRealtimeSync';

function AdminInner() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('rm');
    }

    // Pre-seed admin session so native template router initializes signed-in state immediately
    try {
      if (localStorage.getItem('angadi:admin-session') === 'true') {
        sessionStorage.setItem('angadi:admin-session', 'true');
      }
    } catch {}

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/assets/admin-Bvqj5XCD.js';
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="page--admin">
      <link rel="stylesheet" href="/assets/admin-BkH4inUM.css" />
      <link rel="stylesheet" href="/assets/admin-fixes.css" />

      {/*  ══ SIGN-IN ════════════════════════════════════════════════════════  */}
      <div className="signin" id="signin" hidden>
        <div className="signin__brand" aria-hidden="true">
          <img className="signin__photo" src="/photos/158-angadi/trail-main.jpg" alt="" width="1600" height="1067" />
          <div className="signin__veil"></div>
          <p className="signin__mark">ANGADI</p>
          <p className="signin__tag">Back office<br />for the long way out</p>
        </div>
        <main className="signin__main" id="signin-main">
          <div className="signin__card">
            <p className="signin__mark signin__mark--sm" aria-hidden="true">ANGADI</p>
            <h1 className="signin__title">Sign in to the admin</h1>
            <p className="signin__note">
              <strong>Demo account.</strong> The details are filled in for you. This is a front-end demo, so the sign-in
              only lives in this tab; a real admin sign-in needs a server.
            </p>
            <form className="signin__form" id="signin-form" noValidate>
              <div className="field">
                <label className="field__label" htmlFor="si-email">Email</label>
                <input id="si-email" name="email" type="email" autoComplete="username" required />
                <p className="field__err" id="si-email-err" hidden></p>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="si-pw">Password</label>
                <div className="pw">
                  <input id="si-pw" name="password" type="password" autoComplete="current-password" required />
                  <button type="button" className="pw__toggle" aria-pressed="false" aria-controls="si-pw">Show</button>
                </div>
                <p className="field__err" id="si-pw-err" hidden></p>
              </div>
              <p className="formmsg" id="si-msg" role="alert" hidden></p>
              <button type="submit" className="btn btn--dark btn--lg btn--block" id="si-submit"><span>Sign in</span></button>
            </form>
            <a className="link signin__back" href="/">Back to the shop</a>
          </div>
        </main>
      </div>

      {/*  ══ SHELL ══════════════════════════════════════════════════════════  */}
      <div className="shell" id="shell" hidden>
        <aside className="side" id="side">
          <a className="side__brand" href="#/overview" aria-label="ANGADI admin, overview">
            <span className="side__mark">ANGADI</span><span className="side__sub">Admin</span>
            <span className="side__glyph" aria-hidden="true">A</span>
          </a>
          <nav className="side__nav" aria-label="Admin sections">
            <span className="side__ind" aria-hidden="true"></span>
            <ul>
              <li><a className="side__link" href="#/overview" data-nav="overview" title="Overview"><span data-icon="overview"></span><span className="side__label">Overview</span></a></li>
              <li><a className="side__link" href="#/orders" data-nav="orders" title="Orders"><span data-icon="orders"></span><span className="side__label">Orders</span><span className="side__badge" data-badge hidden></span></a></li>
              <li><a className="side__link" href="#/products" data-nav="products" title="Products"><span data-icon="products"></span><span className="side__label">Products</span></a></li>
              <li><a className="side__link" href="#/customers" data-nav="customers" title="Customers"><span data-icon="customers"></span><span className="side__label">Customers</span></a></li>
            </ul>
          </nav>
          <div className="side__foot">
            <a className="side__link side__link--quiet" href="/" target="_blank" rel="noopener"><span data-icon="store"></span><span className="side__label">View store</span></a>
            <div className="side__user">
              <span className="avatar avatar--dark" aria-hidden="true">AD</span>
              <span className="side__label"><span className="side__who">Store admin</span><span className="side__email">admin@angadi.store</span></span>
            </div>
          </div>
        </aside>

        <div className="frame">
          <header className="top">
            <a className="top__mark" href="#/overview" aria-label="ANGADI admin, overview">ANGADI</a>
            <h1 className="top__title" id="page-title" tabIndex="-1">Overview</h1>
            <div className="top__actions">
              <button type="button" className="top__search" id="open-palette" aria-keyshortcuts="Meta+K Control+K">
                <span data-icon="search"></span><span className="top__search-label">Search</span><kbd className="top__kbd" id="kbd-hint">⌘K</kbd>
              </button>
              <AdminRealtimeSync />
              <a className="iconbtn top__store" href="/" target="_blank" rel="noopener" aria-label="View store (opens in a new tab)" title="View store"><span data-icon="store"></span></a>
              <button type="button" className="iconbtn" id="sign-out" aria-label="Sign out" title="Sign out"><span data-icon="signout"></span></button>
            </div>
          </header>
          <main className="main" id="main" tabIndex="-1"></main>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="page page--admin"></div>}>
      <AdminInner />
    </Suspense>
  );
}
