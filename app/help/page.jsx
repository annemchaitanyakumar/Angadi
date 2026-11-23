'use client';

import { useEffect, Suspense } from 'react';
import Footer from '@/components/Footer';

function HelpInner() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('rm');
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/assets/help-B-KjyptW.js';
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="page page--help">
      
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
    <header className="phead">
      <h1 className="phead__title" data-scramble>Help &amp; FAQ</h1>
      <p className="phead__lead" data-reveal>Shipping, returns, sizing, and a real person when you need one.</p>
    </header>
    <div className="help">
      <nav className="hnav" aria-label="Help topics">
        <a href="#shipping">Shipping</a><a href="#returns">Returns</a><a href="#sizes">Size guide</a><a href="#faq">FAQ</a><a href="#contact">Contact</a>
      </nav>
      <div>
        <section className="hsec" id="shipping" aria-labelledby="h-ship">
          <h2 id="h-ship">Shipping</h2>
          <p>Orders leave our studio within one business day. Shipping is free on orders over ₹1,500 after any promo code.</p>
          <div className="table-wrap" data-reveal>
            <table className="t">
              <caption className="sr-only">Shipping methods</caption>
              <thead><tr><th scope="col">Method</th><th scope="col">Delivery</th><th scope="col">Price</th></tr></thead>
              <tbody>
                <tr><th scope="row">Standard</th><td>3–5 business days</td><td>INR 8.00, free over ₹1,500</td></tr>
                <tr><th scope="row">Express</th><td>1–2 business days</td><td>INR 18.00</td></tr>
                <tr><th scope="row">Canada</th><td>5–8 business days</td><td>INR 14.00</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="hsec" id="returns" aria-labelledby="h-ret">
          <h2 id="h-ret">Returns</h2>
          <p>Changed your mind? Return anything unworn within 60 days for a full refund. Returns are free.</p>
          <ol className="rsteps rsteps--light">
            <li data-reveal><div><strong>Start a return</strong><span>Open the order from your account, or use the contact form below with your order number.</span></div></li>
            <li data-reveal><div><strong>Drop it off</strong><span>We email a prepaid label. Any carrier drop-off point works.</span></div></li>
            <li data-reveal><div><strong>Get refunded</strong><span>Refunds land on your original payment within 5 business days of arrival.</span></div></li>
          </ol>
        </section>

        <section className="hsec" id="sizes" aria-labelledby="h-size">
          <h2 id="h-size">Size guide</h2>
          <p>Body measurements. Between sizes? Size up for layering, down for a closer fit.</p>
          <div className="units" role="group" aria-label="Units" data-reveal><button type="button" data-unit="cm" aria-pressed="true">cm</button><button type="button" data-unit="in" aria-pressed="false">in</button></div>
          <div className="table-wrap" style={{"marginTop":"14px"}} data-size-table data-reveal></div>
        </section>

        <section className="hsec faq" id="faq" aria-labelledby="h-faq">
          <h2 id="h-faq">FAQ</h2>
          <div className="acc" data-faq></div>
        </section>

        <section className="hsec" id="contact" aria-labelledby="h-contact">
          <h2 id="h-contact">Contact us</h2>
          <p>We answer every message within one business day, Monday to Friday.</p>
          <form className="form" noValidate data-contact>
            <div className="row2 row2--stack">
              <label className="field"><span>Name</span><input name="name" autoComplete="name" required aria-describedby="e-name" /><em className="field__err" id="e-name"></em></label>
              <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required aria-describedby="e-email" /><em className="field__err" id="e-email"></em></label>
            </div>
            <div className="row2 row2--stack">
              <label className="field"><span>Topic</span><select name="topic"><option>An order</option><option>A return</option><option>A repair</option><option>Sizing</option><option>Something else</option></select></label>
              <label className="field"><span>Order number <small className="field__hint">(optional)</small></span><input name="order" placeholder="SOL-10471" aria-describedby="e-order" /><em className="field__err" id="e-order"></em></label>
            </div>
            <label className="field"><span>Message</span><textarea name="message" required aria-describedby="e-msg"></textarea><em className="field__err" id="e-msg"></em></label>
            <button className="pill pill--ink" type="submit">Send message</button>
          </form>
          <div className="sent" data-sent hidden tabIndex="-1"><strong>Message sent.</strong><span>Thanks — we’ll reply to your email within one business day.</span></div>
        </section>
      </div>
    </div>
  </main>

  {/*  ANGADI — trail & outdoor running apparel — © 2026 Hasib (OVERSHOOT). All rights reserved. Licensed, not sold: see LICENSE.md.  */}
<Footer />

  {/*  ANGADI — trail & outdoor running apparel — © 2026 Hasib (OVERSHOOT). All rights reserved. Licensed, not sold: see LICENSE.md.  */}
    </div>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={<div className="page page--help"></div>}>
      <HelpInner />
    </Suspense>
  );
}
