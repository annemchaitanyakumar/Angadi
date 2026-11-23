'use client';

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

function PrivacyInner() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('rm');
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/assets/store-DfXjkpw_.js';
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="page page--legal">
      {/* Top Navigation Bar */}
      <header className="topbar" data-topbar>
        <button
          className="iconbtn topbar__burger"
          type="button"
          data-open-menu
          aria-expanded="false"
          aria-controls="menu"
          aria-label="Open menu"
        >
          <svg width="22" height="22"><use href="#i-menu" /></svg>
        </button>
        <Link className="topbar__logo" href="/" aria-label="ANGADI home">
          ANGADI
        </Link>
        <nav className="topbar__links" aria-label="Main">
          <Link href="/shop" data-nav="shop">Dukanam</Link>
          <Link href="/shop?gender=Women" data-nav="shop-women">Stree</Link>
          <Link href="/shop?gender=Men" data-nav="shop-men">Purush</Link>
          <Link href="/#look">Lookbook</Link>
          <Link href="/about" data-nav="about">Maa Gurinchi</Link>
          <Link href="/help" data-nav="help">Sahayam</Link>
        </nav>
        <div className="topbar__actions">
          <Link className="iconbtn" href="/account" data-nav="account" aria-label="Your account">
            <svg width="20" height="20"><use href="#i-user" /></svg>
          </Link>
          <button className="iconbtn iconbtn--ink" type="button" data-open-bag aria-label="Open bag, 0 items">
            <svg width="20" height="20"><use href="#i-bag" /></svg>
            <span className="badge" data-bag-count hidden>0</span>
          </button>
        </div>
      </header>

      <main id="main">
        {/* Page Header */}
        <header className="phead">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/help">Sahayam</Link></li>
              <li aria-current="page">Privacy Policy</li>
            </ol>
          </nav>
          <h1 className="phead__title">Privacy Policy</h1>
          <p className="phead__lead">
            What data we collect, why we need it, and how your personal information is protected.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--c-muted)', marginTop: '4px' }}>
            Last updated: November 23, 2026 &middot; Compliant with DPDPA 2023 &amp; IT Act 2000
          </p>
        </header>

        {/* 2-Column Content Layout */}
        <div className="help">
          {/* Sticky Table of Contents */}
          <nav className="hnav" aria-label="Privacy topics">
            <a href="#principles">1. Principles</a>
            <a href="#collection">2. Data We Collect</a>
            <a href="#passkeys">3. Passkey Security</a>
            <a href="#usage">4. How We Use Data</a>
            <a href="#sharing">5. Third-Party Sharing</a>
            <a href="#payments">6. Payment Security</a>
            <a href="#cookies">7. Cookies &amp; Storage</a>
            <a href="#retention">8. Data Retention</a>
            <a href="#rights">9. Your Rights</a>
            <a href="#contact">10. Contact Officer</a>
          </nav>

          {/* Clauses & Sections */}
          <div>
            <section className="hsec" id="principles" aria-labelledby="h-principles">
              <h2 id="h-principles">1. Principles</h2>
              <div className="legal-clause">
                <p>
                  At <strong>ANGADI</strong>, we collect only the information necessary to fulfill your orders, deliver parcels, and provide customer support.
                </p>
                <div className="legal-callout">
                  <strong>Zero Data Brokering:</strong> We never sell, rent, monetize, or trade your personal information with external advertisers or data brokers.
                </div>
              </div>
            </section>

            <section className="hsec" id="collection" aria-labelledby="h-collection">
              <h2 id="h-collection">2. Information We Collect</h2>
              <div className="legal-clause">
                <p>We collect information in three categories:</p>
                <ul>
                  <li>
                    <strong>Order &amp; Fulfillment Information:</strong> Full name, shipping address, landmark, pin code, phone number, and email address required to dispatch parcels and send tracking updates.
                  </li>
                  <li>
                    <strong>Account &amp; Authentication Credentials:</strong> Your registered email, cryptographic public keys (for WebAuthn passkeys), and customer profile preferences.
                  </li>
                  <li>
                    <strong>Browsing &amp; Technical Diagnostics:</strong> Anonymized device telemetry, browser type, and interaction metrics to diagnose server latency and ensure smooth rendering.
                  </li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="passkeys" aria-labelledby="h-passkeys">
              <h2 id="h-passkeys">3. Passkey Security</h2>
              <div className="legal-clause">
                <p>
                  ANGADI supports passwordless login via the <strong>FIDO2 / WebAuthn standard</strong>.
                </p>
                <ul>
                  <li><strong>Local Authentication:</strong> When you use fingerprint recognition (Touch ID), Face ID, or Windows Hello to log in, biometric data never leaves your physical device.</li>
                  <li><strong>Public-Key Cryptography:</strong> Our servers only receive and store a mathematically verified public key. We never store passwords that could be compromised.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="usage" aria-labelledby="h-usage">
              <h2 id="h-usage">4. How We Use Your Information</h2>
              <div className="legal-clause">
                <p>We process your data for operational purposes:</p>
                <ul>
                  <li><strong>Order Processing &amp; Logistics:</strong> Generating shipping manifests and coordinating courier dispatches.</li>
                  <li><strong>Fulfillment Alerts:</strong> Transmitting transactional receipts, carrier tracking milestones, and delivery notifications.</li>
                  <li><strong>Newsletter:</strong> Sending product drops and stories only when you have explicitly entered your email. You can unsubscribe at any time.</li>
                  <li><strong>Fraud Prevention:</strong> Verifying order authenticity and preventing fraudulent transactions.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="sharing" aria-labelledby="h-sharing">
              <h2 id="h-sharing">5. Third-Party Service Providers</h2>
              <div className="legal-clause">
                <p>
                  We share minimal, necessary data with operational partners:
                </p>
                <ul>
                  <li><strong>Logistics Partners:</strong> Couriers receive your recipient name, address, and phone number solely for delivery fulfillment.</li>
                  <li><strong>Cloud Infrastructure:</strong> Database is hosted on secure cloud infrastructure with encryption at rest and Row-Level Security.</li>
                  <li><strong>Legal Compliance:</strong> We disclose information only when compelled by valid statutory obligations or lawful court orders in India.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="payments" aria-labelledby="h-payments">
              <h2 id="h-payments">6. Payment Security</h2>
              <div className="legal-clause">
                <div className="legal-callout">
                  <strong>PCI-DSS Compliance:</strong> All credit card, debit card, UPI, and net banking transactions are handled directly by authorized payment gateways. ANGADI never stores your 16-digit card number, CVV code, or banking PINs.
                </div>
              </div>
            </section>

            <section className="hsec" id="cookies" aria-labelledby="h-cookies">
              <h2 id="h-cookies">7. Cookies &amp; Local Storage</h2>
              <div className="legal-clause">
                <p>
                  We use browser storage (`localStorage` and essential session cookies) for functional purposes:
                </p>
                <ul>
                  <li><strong>Bag State:</strong> Preserving items in your shopping bag between pages.</li>
                  <li><strong>Sound Preferences:</strong> Remembering audio toggle state.</li>
                  <li><strong>Security Tokens:</strong> Maintaining your logged-in session between page navigations.</li>
                </ul>
                <p>We do not use third-party advertising tracking cookies.</p>
              </div>
            </section>

            <section className="hsec" id="retention" aria-labelledby="h-retention">
              <h2 id="h-retention">8. Data Retention</h2>
              <div className="legal-clause">
                <p>
                  We retain order records for the duration required by taxation and commercial laws (typically 7 years for GST compliance). Temporary browsing telemetry is cleared periodically.
                </p>
              </div>
            </section>

            <section className="hsec" id="rights" aria-labelledby="h-rights">
              <h2 id="h-rights">9. Your Legal Rights (DPDPA 2023)</h2>
              <div className="legal-clause">
                <p>Under the Digital Personal Data Protection Act, you possess the right to:</p>
                <ul>
                  <li><strong>Access:</strong> Request a summary of the personal data we hold about you.</li>
                  <li><strong>Correction:</strong> Update inaccurate or incomplete delivery addresses or account info.</li>
                  <li><strong>Erasure:</strong> Request the deletion of your account and personal identifiers, subject to statutory retention requirements.</li>
                  <li><strong>Withdrawal of Consent:</strong> Unsubscribe from email updates at any time.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="contact" aria-labelledby="h-contact">
              <h2 id="h-contact">10. Contact Officer</h2>
              <div className="legal-clause">
                <div style={{ background: 'var(--c-bone-2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--c-line)' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 600 }}>ANGADI Outdoor Gear Private Limited</p>
                  <p style={{ margin: '0 0 6px', color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Attention: Data Protection &amp; Privacy Officer</p>
                  <p style={{ margin: '0 0 6px', color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Address: Trail Ridge Rd, Gachibowli, Hyderabad, Telangana 500081, India</p>
                  <p style={{ margin: '0 0 6px', color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Email: <a href="mailto:privacy@angadi.in" className="link">privacy@angadi.in</a></p>
                  <p style={{ margin: 0, color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Support: <a href="mailto:support@angadi.in" className="link">support@angadi.in</a></p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="page page--legal" />}>
      <PrivacyInner />
    </Suspense>
  );
}
