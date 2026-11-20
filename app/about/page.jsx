import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: 'Our Story — ANGADI',
  description: 'The story behind ANGADI: trail-running and mountain layers built for the long way out.'
};

export default function AboutPage() {
  return (
    <div className="page-wrap">
      <header className="page-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Header />
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px 100px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff5c3d' }}>
          Our Story
        </span>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, margin: '12px 0 24px 0', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          Built for the long way out.
        </h1>

        <p style={{ fontSize: '20px', lineHeight: 1.6, opacity: 0.85, maxWidth: '780px', marginBottom: '48px' }}>
          ANGADI began on the high ridges above Boulder, Colorado. We wanted running layers that could withstand alpine weather swings without the bulk of mountaineering shells or the fragility of ultralight road gear.
        </p>

        <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '64px' }}>
          <img
            src="/photos/158-solum/trail-main.jpg"
            alt="Runner in an ANGADI hooded shell"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', marginBottom: '80px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>01. Weather Without Weight</h2>
            <p style={{ lineHeight: 1.7, opacity: 0.8 }}>
              Every gram counts when the ascent steepens. We engineer our membranes to vent heat during maximum exertion while stopping cold ridgeline winds. Most shells pack into their own pockets.
            </p>
          </div>
          <div id="repairs">
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>02. Repairs for Life</h2>
            <p style={{ lineHeight: 1.7, opacity: 0.8 }}>
              Torn your shell on granite or blew a zipper on a 50-miler? Send it back. Our Boulder workshop repairs, reinforces, and returns every ANGADI garment to the trail free of charge.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>03. Circular Recycled Materials</h2>
            <p style={{ lineHeight: 1.7, opacity: 0.8 }}>
              Over 90% of our fabrics are spun from recycled ocean-bound plastics and post-consumer nylon, paired exclusively with PFC-free water-repellent coatings and RDS-certified down.
            </p>
          </div>
        </div>

        <div style={{ background: '#f5f0e8', padding: '48px', borderRadius: '16px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>Ready for your next ascent?</h2>
          <p style={{ opacity: 0.8, maxWidth: '520px', margin: '0 auto 24px auto' }}>
            Discover our technical shells, insulated vests, and trail fleeces built for the miles ahead.
          </p>
          <Link className="pill pill--ink" href="/shop">
            Shop the Collection
          </Link>
        </div>
      </main>
    </div>
  );
}
