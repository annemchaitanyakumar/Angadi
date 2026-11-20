'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer className="footer" id="footer">
      <p className="footer__big">See you<br />out there</p>
      <div className="footer__cols">
        <form className="join" onSubmit={handleSubmit} noValidate>
          <label className="join__label" htmlFor="join-email">First access to every drop</label>
          <div className="join__row">
            <input
              id="join-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@trailmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="pill pill--clay" type="submit">Join</button>
          </div>
          {subscribed && (
            <p className="join__msg" role="status" aria-live="polite" style={{ display: 'block', marginTop: '8px', color: 'var(--c-clay, #ff5c3d)' }}>
              Welcome to the pack. Watch your inbox.
            </p>
          )}
        </form>

        <nav className="footer__links" aria-label="Footer">
          <div>
            <h3>Shop</h3>
            <Link href="/shop">Shop all</Link>
            <Link href="/shop?category=Jackets">Jackets</Link>
            <Link href="/#look">Lookbook</Link>
          </div>
          <div>
            <h3>Help</h3>
            <Link href="/help#shipping">Shipping</Link>
            <Link href="/help#returns">Returns</Link>
            <Link href="/help#sizes">Size guide</Link>
            <Link href="/help#contact">Contact</Link>
          </div>
          <div>
            <h3>Company</h3>
            <Link href="/about">Our story</Link>
            <Link href="/about#repairs">Repairs</Link>
            <Link href="/account">Account</Link>
            <Link href="/admin">Store admin</Link>
          </div>
        </nav>
      </div>

      <div className="footer__base">
        <span>&copy; 2026 ANGADI Outdoor</span>
        <span>Free returns within 60 days</span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}
