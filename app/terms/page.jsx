'use client';

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

function TermsInner() {
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
              <li aria-current="page">Terms &amp; Conditions</li>
            </ol>
          </nav>
          <h1 className="phead__title">Terms &amp; Conditions</h1>
          <p className="phead__lead">
            The rules of the trail. Please review these terms carefully before placing an order or using ANGADI storefront and services.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--c-muted)', marginTop: '4px' }}>
            Last updated: November 23, 2026 &middot; Effective date: November 23, 2026
          </p>
        </header>

        {/* 2-Column Content Layout */}
        <div className="help">
          {/* Sticky Table of Contents */}
          <nav className="hnav" aria-label="Terms topics">
            <a href="#overview">1. Overview</a>
            <a href="#eligibility">2. Accounts &amp; Access</a>
            <a href="#products">3. Gear &amp; Accuracy</a>
            <a href="#pricing">4. Pricing &amp; Taxes</a>
            <a href="#payments">5. Payments</a>
            <a href="#shipping">6. Shipping &amp; Delivery</a>
            <a href="#returns">7. Returns &amp; Repairs</a>
            <a href="#intellectual">8. Intellectual Property</a>
            <a href="#disclaimers">9. Outdoor Disclaimers</a>
            <a href="#governing">10. Governing Law</a>
            <a href="#contact">11. Contact &amp; Grievance</a>
          </nav>

          {/* Clauses & Sections */}
          <div>
            <section className="hsec" id="overview" aria-labelledby="h-overview">
              <h2 id="h-overview">1. Overview &amp; Agreement</h2>
              <div className="legal-clause">
                <p>
                  These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the <strong>ANGADI</strong> online storefront, mobile interfaces, and physical fulfillment channels operated by ANGADI Outdoor Gear Private Limited (&ldquo;ANGADI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), registered in Telangana, India.
                </p>
                <p>
                  By visiting our website, browsing our collections, creating an account, or purchasing technical apparel and gear from us, you agree to be bound by these Terms and our companion <Link href="/privacy" className="link">Privacy Policy</Link>. If you do not agree with any part of these Terms, you must discontinue use of our site.
                </p>
                <div className="legal-callout">
                  <strong>The Trail Standard:</strong> We craft durable, mountain-tested apparel engineered for runners, climbers, and trail athletes. Our policies are written in plain language to ensure mutual trust and respect.
                </div>
              </div>
            </section>

            <section className="hsec" id="eligibility" aria-labelledby="h-eligibility">
              <h2 id="h-eligibility">2. Account Registration &amp; Passkey Security</h2>
              <div className="legal-clause">
                <p>
                  To place orders, track shipments, and access personalized gear recommendations, you may register an account using your email address, one-time verification passcode (OTP), or modern <strong>WebAuthn / Passkeys</strong> (fingerprint, Face ID, or device PIN).
                </p>
                <ul>
                  <li><strong>Eligibility:</strong> You must be at least 18 years of age or possess legal parental/guardian consent to enter into binding agreements.</li>
                  <li><strong>Account Integrity:</strong> You are responsible for maintaining the confidentiality of your device and authentication credentials. Any activity conducted under your authenticated session is deemed authorized by you.</li>
                  <li><strong>Accurate Information:</strong> You agree to provide accurate, current, and complete delivery addresses, phone numbers, and recipient details to ensure smooth fulfillment.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="products" aria-labelledby="h-products">
              <h2 id="h-products">3. Technical Gear, Sizing &amp; Accuracy</h2>
              <div className="legal-clause">
                <p>
                  We take extraordinary care in depicting our running shells, fleeces, base layers, and footwear with accurate color reproduction, dimensional charts, and hydrostatic head / breathability ratings.
                </p>
                <ul>
                  <li><strong>Color Display:</strong> Due to individual display calibrations, natural fibers, and outdoor lighting variations, actual fabric hues may exhibit subtle, natural variations.</li>
                  <li><strong>Sizing Guidelines:</strong> All garments follow standard athletic cut metrics (XS through XXL). Please consult our <Link href="/help#sizes" className="link">Size Guide</Link> prior to ordering.</li>
                  <li><strong>Batch Availability:</strong> Small-batch technical drops may sell out rapidly. Placing an item in your cart does not reserve inventory until checkout and authorization are finalized.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="pricing" aria-labelledby="h-pricing">
              <h2 id="h-pricing">4. Pricing, Currency &amp; Taxes</h2>
              <div className="legal-clause">
                <p>
                  All catalog prices on ANGADI are denominated in <strong>Indian Rupees (INR &middot; ₹)</strong> and include all applicable Goods and Services Tax (GST) unless explicitly indicated otherwise during promotional summaries.
                </p>
                <ul>
                  <li><strong>Promotional Discounts:</strong> Limited-time promotions (e.g. Flash sales, seasonal vouchers) are subject to specific validity windows and cannot be combined unless stated.</li>
                  <li><strong>Price Corrections:</strong> In the rare event of a typographical pricing error, we reserve the right to notify you and request confirmation or cancel the affected order before dispatch with an immediate full refund.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="payments" aria-labelledby="h-payments">
              <h2 id="h-payments">5. Payment Authorization &amp; Gateways</h2>
              <div className="legal-clause">
                <p>
                  We support secure payment options including UPI (Google Pay, PhonePe, Paytm, BHIM), major Credit &amp; Debit Cards (Visa, MasterCard, RuPay), Net Banking, and authorized digital wallets.
                </p>
                <ul>
                  <li><strong>Payment Security:</strong> All card transactions are routed through PCI-DSS Level 1 certified payment gateways with 256-bit SSL encryption. ANGADI does not store raw card numbers or CVV codes on our servers.</li>
                  <li><strong>Demo Mode Notice:</strong> In pre-production, staging, or testing modes where demo payment simulation is active, transactions are processed in sandbox environments for order flow verification without deducting real funds.</li>
                  <li><strong>Authorization Holds:</strong> For authorized card orders, funds may be temporarily held until our fulfillment studio confirms inventory readiness and generates shipping manifests.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="shipping" aria-labelledby="h-shipping">
              <h2 id="h-shipping">6. Shipping, Dispatches &amp; Delivery</h2>
              <div className="legal-clause">
                <p>
                  Every order ships from our fulfillment studio in Hyderabad, Telangana or regional hubs across India within 24 to 48 hours of authorization, excluding public holidays.
                </p>
                <ul>
                  <li><strong>Standard Delivery:</strong> 3 to 5 business days nationwide. Free on orders above ₹1,500.</li>
                  <li><strong>Express Trail Courier:</strong> 1 to 2 business days for select tier-1 metropolitan locations.</li>
                  <li><strong>Tracking &amp; Status:</strong> Upon dispatch, an automated SMS/email with carrier tracking numbers is sent. You can track fulfillment in real time on our <Link href="/order" className="link">Track Order page</Link>.</li>
                  <li><strong>Risk of Loss:</strong> Title and risk of loss pass to you upon carrier delivery to the specified destination address.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="returns" aria-labelledby="h-returns">
              <h2 id="h-returns">7. 60-Day Returns &amp; Trail Repair Guarantee</h2>
              <div className="legal-clause">
                <p>
                  We stand unreservedly behind the endurance of our gear. If you are not completely satisfied, you are protected by our customer-first policies:
                </p>
                <ul>
                  <li><strong>60-Day Return Window:</strong> You may return unworn, unwashed apparel with original tags within 60 calendar days of delivery for a full refund to your original payment method.</li>
                  <li><strong>Free Exchanges:</strong> If sizing is off, size and color exchanges are free with scheduled courier pickup from your doorstep.</li>
                  <li><strong>Lifetime Repair Guarantee:</strong> Blew a seam on the trail or snagged a zipper on alpine brush? Ship it to our studio in Hyderabad. We repair functional hardware free of charge for the life of the garment.</li>
                </ul>
              </div>
            </section>

            <section className="hsec" id="intellectual" aria-labelledby="h-intellectual">
              <h2 id="h-intellectual">8. Intellectual Property &amp; Content Rights</h2>
              <div className="legal-clause">
                <p>
                  All content featured on ANGADI &mdash; including the ANGADI wordmark, logo, custom garment patterning, product copy, lookbook photography, audio design, and user interfaces &mdash; is the proprietary property of ANGADI Outdoor Gear Private Limited.
                </p>
                <p>
                  You may not reproduce, redistribute, scrape, reverse engineer, or commercially exploit any material from our store without prior written authorization.
                </p>
              </div>
            </section>

            <section className="hsec" id="disclaimers" aria-labelledby="h-disclaimers">
              <h2 id="h-disclaimers">9. Outdoor Activity &amp; Limitation of Liability</h2>
              <div className="legal-clause">
                <p>
                  Trail running, ultra-marathons, scrambling, and alpine exploration carry inherent physical risks, variable weather conditions, and unpredictable terrain.
                </p>
                <div className="legal-callout">
                  <strong>Safety First:</strong> While our gear provides high-performance moisture management, wind resistance, and thermal insulation, you are solely responsible for proper physical conditioning, route planning, emergency hydration, navigation, and trail safety. ANGADI is not liable for personal injuries or outdoor accidents incurred during athletic activities.
                </div>
              </div>
            </section>

            <section className="hsec" id="governing" aria-labelledby="h-governing">
              <h2 id="h-governing">10. Governing Law &amp; Jurisdiction</h2>
              <div className="legal-clause">
                <p>
                  These Terms shall be governed by, interpreted, and construed in accordance with the laws of the <strong>Republic of India</strong>. Any dispute, claim, or controversy arising out of or relating to your use of this storefront shall be submitted to the exclusive jurisdiction of the competent courts in <strong>Hyderabad, Telangana, India</strong>.
                </p>
              </div>
            </section>

            <section className="hsec" id="contact" aria-labelledby="h-contact">
              <h2 id="h-contact">11. Contact &amp; Grievance Redressal</h2>
              <div className="legal-clause">
                <p>
                  In accordance with the Information Technology Act 2000 and Consumer Protection (E-Commerce) Rules 2020, our Grievance Officer details are published below:
                </p>
                <div style={{ background: 'var(--c-bone-2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--c-line)' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 600 }}>ANGADI Outdoor Gear Private Limited</p>
                  <p style={{ margin: '0 0 6px', color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Grievance Officer: Chaitanya Kumar</p>
                  <p style={{ margin: '0 0 6px', color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Studio &amp; Workshop: Trail Ridge Rd, Gachibowli, Hyderabad, Telangana 500081, India</p>
                  <p style={{ margin: '0 0 6px', color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Email: <a href="mailto:grievance@angadi.in" className="link">grievance@angadi.in</a> &middot; Support: <a href="mailto:support@angadi.in" className="link">support@angadi.in</a></p>
                  <p style={{ margin: 0, color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Response Time: Within 24–48 business hours</p>
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

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="page page--legal" />}>
      <TermsInner />
    </Suspense>
  );
}
