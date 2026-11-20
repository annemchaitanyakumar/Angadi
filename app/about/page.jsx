'use client';

import { useEffect, Suspense } from 'react';

function AboutInner() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('rm');
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/assets/about-BYz9LVay.js';
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="page page--about">
      
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
    <section className="ab-hero" aria-labelledby="ab-h">
      <p className="eyebrow" data-reveal>Our story</p>
      <h1 id="ab-h" data-scramble>We make gear for the long way out</h1>
      <div className="ab-strip" data-strip>
        <figure data-blinds><img src="/photos/158-angadi/trail-main.jpg" width="1200" height="1600" alt="Runner in a moss hooded shell and neck gaiter" /></figure>
        <figure data-blinds><img src="/photos/158-angadi/pick-1.jpg" width="1200" height="1600" alt="Runner from behind in an olive anorak with a sling pack" /></figure>
        <figure data-blinds><img src="/photos/158-angadi/trail-left.jpg" width="1200" height="1600" alt="Hands tightening the straps of a clay running vest" /></figure>
      </div>
    </section>

    <section className="ab-story" aria-labelledby="story-h">
      <figure data-blinds><img src="/photos/158-angadi/pick-2.jpg" width="1200" height="1600" alt="Runner in a graphite half-zip shell" loading="lazy" /></figure>
      <div>
        <p className="eyebrow" data-reveal>Since 2019</p>
        <h2 id="story-h" data-scramble>Started on a dirt road at dawn</h2>
        <p data-reveal>ANGADI began with three runners, one workshop and a pile of jackets that had given up halfway through a season. We wanted layers that breathe on the climb, keep the wind off on the ridge, and last long enough to be passed on.</p>
        <p data-reveal>Everything we make is tested on the trails around our studio in the high desert, from summer heat to the first snow on the mesas. If it does not survive a year out there, it does not ship.</p>
      </div>
    </section>

    <section className="stats" aria-label="ANGADI in numbers">
      <div className="stat" data-reveal><strong data-count-to="92" data-suffix="%">0%</strong><span>of our fabrics are recycled</span></div>
      <div className="stat" data-reveal><strong data-count-to="4800" data-sep>0</strong><span>repairs done last year</span></div>
      <div className="stat" data-reveal><strong data-count-to="60">0</strong><span>days to return anything, free</span></div>
      <div className="stat" data-reveal><strong data-count-to="1" data-suffix="%">0%</strong><span>of sales to trail building</span></div>
    </section>

    <section className="ab-values" aria-labelledby="val-h">
      <h2 id="val-h" data-scramble>What we stand on</h2>
      <div className="vgrid">
        <article className="vcard" data-reveal><span className="vcard__icon"><svg width="26" height="26" aria-hidden="true"><use href="#i-leaf"/></svg></span><h3>Recycled first</h3><p>Shells, fleece and fill are made from recycled nylon and polyester, finished without PFCs.</p></article>
        <article className="vcard" data-reveal><span className="vcard__icon"><svg width="26" height="26" aria-hidden="true"><use href="#i-repair"/></svg></span><h3>Repairs for life</h3><p>Rips, zips and worn cuffs: send it in and we fix it, for as long as you own it.</p></article>
        <article className="vcard" data-reveal><span className="vcard__icon"><svg width="26" height="26" aria-hidden="true"><use href="#i-truck"/></svg></span><h3>Carbon-neutral delivery</h3><p>Every parcel's shipping emissions are measured and offset, and our packaging is paper only.</p></article>
      </div>
    </section>

    <section className="ab-repair" id="repairs" aria-labelledby="rep-h">
      <div>
        <h2 id="rep-h" data-scramble>Repairs for life</h2>
        <p data-reveal>The greenest jacket is the one you already own. Every ANGADI piece is covered by free repairs for as long as you wear it.</p>
      </div>
      <ol className="rsteps">
        <li data-reveal><div><strong>Send it in</strong><span>Print a free label from your account or the help page.</span></div></li>
        <li data-reveal><div><strong>We fix it</strong><span>Our repair bench patches, re-zips and re-seals in about ten days.</span></div></li>
        <li data-reveal><div><strong>Back on the trail</strong><span>It comes home ready for another season, at no cost.</span></div></li>
      </ol>
    </section>

    <section className="cta-band" aria-labelledby="cta-h">
      <h2 id="cta-h" data-scramble>Find your layer</h2>
      <a className="pill pill--ink" href="/shop/">Shop all products</a>
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

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="page page--about"></div>}>
      <AboutInner />
    </Suspense>
  );
}
