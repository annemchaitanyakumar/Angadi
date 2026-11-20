import Link from 'next/link';
import Header from '@/components/Header';
import { SIZE_CHART } from '@/lib/data';

export const metadata = {
  title: 'Help & Returns — ANGADI',
  description: 'Shipping info, 60-day returns, sizing conversion table, and contact.'
};

export default function HelpPage() {
  return (
    <div className="page-wrap">
      <header className="page-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Header />
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px 100px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, margin: '0 0 12px 0' }}>
          Help &amp; Customer Care
        </h1>
        <p style={{ opacity: 0.7, fontSize: '16px', marginBottom: '48px' }}>
          Find answers on shipping times, 60-day returns, warranty repairs, and sizing.
        </p>

        {/* Shipping */}
        <section id="shipping" style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Shipping Options &amp; Delivery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#f5f0e8', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>Standard Ground</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>3–5 business days. Free on all orders over USD 150 (otherwise $8.00).</p>
            </div>
            <div style={{ background: '#f5f0e8', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>Express Air</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>1–2 business days via FedEx priority ($18.00).</p>
            </div>
          </div>
        </section>

        {/* Returns */}
        <section id="returns" style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>60-Day Free Returns</h2>
          <p style={{ lineHeight: 1.6, opacity: 0.8, marginBottom: '16px' }}>
            Try your gear on the trail. If the fit isn't right, return unworn or trail-tested items within 60 days of delivery for a full refund. Pre-paid shipping labels are included in every package.
          </p>
        </section>

        {/* Sizing */}
        <section id="sizes" style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Size Conversion Guide (cm)</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #161616' }}>
                  <th style={{ padding: '12px 16px' }}>Size</th>
                  <th style={{ padding: '12px 16px' }}>Chest (cm)</th>
                  <th style={{ padding: '12px 16px' }}>Waist (cm)</th>
                  <th style={{ padding: '12px 16px' }}>Hips (cm)</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(SIZE_CHART).map((size) => (
                  <tr key={size} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>{size}</td>
                    <td style={{ padding: '12px 16px' }}>{SIZE_CHART[size][0]}</td>
                    <td style={{ padding: '12px 16px' }}>{SIZE_CHART[size][1]}</td>
                    <td style={{ padding: '12px 16px' }}>{SIZE_CHART[size][2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Get in Touch</h2>
          <p style={{ opacity: 0.8, marginBottom: '24px' }}>
            Have a question about sizing, repair status, or an upcoming gear drop? Reach our Boulder team directly.
          </p>
          <div style={{ background: '#f5f0e8', padding: '24px', borderRadius: '12px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '13px', opacity: 0.6 }}>Email</strong>
              <span style={{ fontSize: '15px' }}>support@angadi-trail.com</span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '13px', opacity: 0.6 }}>Hours</strong>
              <span style={{ fontSize: '15px' }}>Mon–Fri, 8:00 AM – 5:00 PM MT</span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '13px', opacity: 0.6 }}>Location</strong>
              <span style={{ fontSize: '15px' }}>Boulder, Colorado</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
