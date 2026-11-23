'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef(null);
  const watermarkRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    let animationFrameId = null;

    const updateWatermarkTransform = () => {
      if (!footerRef.current || !watermarkRef.current) return;

      // Honor user accessibility preference
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        watermarkRef.current.style.transform = 'translate3d(0, 0%, 0)';
        return;
      }

      const rect = footerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // Exact Srstii logic:
      // Framer Motion useScroll({ target: footerRef, offset: ["start end", "end end"] })
      // - "start end": top of footer touches bottom of viewport -> progress = 0
      // - "end end": bottom of footer touches bottom of viewport -> progress = 1
      const totalDistance = rect.height;
      if (totalDistance <= 0) return;

      const currentDistance = viewportHeight - rect.top;
      const progress = Math.min(1, Math.max(0, currentDistance / totalDistance));

      // useTransform(scrollYProgress, [0.35, 1], ["70%", "0%"])
      let y = 70;
      if (progress >= 1) {
        y = 0;
      } else if (progress <= 0.35) {
        y = 70;
      } else {
        const norm = (progress - 0.35) / 0.65;
        y = 70 * (1 - norm);
      }

      watermarkRef.current.style.transform = `translate3d(0, ${y.toFixed(2)}%, 0)`;
    };

    const handleScroll = () => {
      if (animationFrameId !== null) return;
      animationFrameId = requestAnimationFrame(() => {
        updateWatermarkTransform();
        animationFrameId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial calculation on mount
    updateWatermarkTransform();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleButtonPointerMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    buttonRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };

  const handleButtonPointerLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = 'translate3d(0px, 0px, 0)';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer ref={footerRef} aria-labelledby="footer-title" className="srsti-footer" id="footer">
      <h2 id="footer-title" className="sr-only">ANGADI footer</h2>

      {/* Massive Background Sculptural Brand Watermark with Dynamic Scroll Animation */}
      <div className="srsti-watermark-wrap" aria-hidden="true">
        <p ref={watermarkRef} className="srsti-watermark">
          ANGADI
        </p>
      </div>

      {/* Floating Glass Panel */}
      <div className="srsti-glass-panel">
        <div>
          <p className="srsti-eyebrow">The Trail Dispatch</p>
          <p className="srsti-headline">
            First word on each new drop, and the runners behind it.
          </p>

          <form className="srsti-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
            <input
              id="footer-newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@trailmail.com"
              aria-invalid="false"
              className="srsti-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              ref={buttonRef}
              type="submit"
              className="srsti-liquid-btn"
              tabIndex={0}
              onPointerMove={handleButtonPointerMove}
              onPointerLeave={handleButtonPointerLeave}
            >
              <span>Subscribe</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </form>

          {subscribed && (
            <p style={{ margin: '10px 0 0', fontSize: '13px', fontWeight: 600, color: 'var(--c-clay, #b5562f)' }} role="status">
              ✓ Welcome to the pack. Watch your inbox.
            </p>
          )}
        </div>

        <div className="srsti-nav-grid">
          <nav className="srsti-nav-col" aria-label="Explore">
            <p className="srsti-eyebrow">Explore</p>
            <ul>
              <li><Link href="/shop">Dukanam</Link></li>
              <li><Link href="/shop?category=Jackets">Jackets</Link></li>
              <li><Link href="/#look">Lookbook</Link></li>
              <li><Link href="/shop?gender=Women">Stree</Link></li>
              <li><Link href="/shop?gender=Men">Purush</Link></li>
              <li><Link href="/about">The Craft</Link></li>
            </ul>
          </nav>

          <nav className="srsti-nav-col" aria-label="Care">
            <p className="srsti-eyebrow">Care</p>
            <ul>
              <li><Link href="/order">Track Your Order</Link></li>
              <li><Link href="/help#shipping">Shipping</Link></li>
              <li><Link href="/help#returns">Returns</Link></li>
              <li><Link href="/help#sizes">Size Guide</Link></li>
              <li><Link href="/help#contact">Sahayam &amp; Contact</Link></li>
              <li><Link href="/admin">Store Admin</Link></li>
            </ul>
          </nav>
        </div>

        {/* Certifications & Trust Badges */}
        <ul className="srsti-badges" aria-label="Certifications and Guarantees">
          <li className="srsti-badge">Free 60-Day Returns</li>
          <li className="srsti-badge">Dispatches within 24h</li>
          <li className="srsti-badge">Ethically Crafted in India</li>
          <li className="srsti-badge">Plastic-Neutral Packaging</li>
          <li className="srsti-badge">Mountain Tested in Nilgiris</li>
        </ul>
      </div>

      {/* Bottom Bar */}
      <div className="srsti-bottom">
        <p>&copy; 2026 ANGADI Outdoor. Made slowly, for the trail.</p>
        <p>Performance layers &middot; Mountain tested &middot; High altitude verified</p>
      </div>
    </footer>
  );
}
