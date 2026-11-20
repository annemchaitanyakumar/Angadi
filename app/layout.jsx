import '@/styles/shell.css';
import '@/styles/pages.css';
import Icons from '@/components/Icons';
import { StoreProvider } from '@/context/StoreContext';

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'ANGADI — trail & outdoor running apparel',
  description: 'ANGADI makes trail-running and outdoor layers: breathable shells, fleeces and vests that move with you from first light to the last climb. Shop new arrivals and the lookbook.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    type: 'website',
    title: 'ANGADI — built for the long way out',
    description: 'Trail-running and outdoor layers that move with you from first light to the last climb.',
    images: ['/photos/158-angadi/group.jpg']
  }
};

export const viewport = {
  themeColor: '#ECE6DC'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function (d) {
                d.classList.add('js');
                if (matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('rm');
                setTimeout(function () { d.classList.add('failsafe'); }, 4000);
              })(document.documentElement);
            `
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..800&family=Geist:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Icons />

        <StoreProvider>
          {children}

          {/* ══ BAG DRAWER ══════════════════════════════════════════════════ */}
          <dialog className="bag" aria-labelledby="bag-h">
            <div className="bag__panel">
              <header className="bag__head">
                <h2 id="bag-h">Your bag</h2>
                <button className="iconbtn" type="button" data-close aria-label="Close bag">
                  <svg width="20" height="20"><use href="#i-close"/></svg>
                </button>
              </header>
              <div className="ship" data-ship>
                <p className="ship__text" data-ship-text></p>
                <span className="ship__track"><i data-ship-fill></i></span>
              </div>
              <ul className="bag__list" data-bag-list></ul>
              <div className="bag__empty" data-bag-empty>
                <p>Your bag is empty. The trail is waiting.</p>
                <a className="pill pill--ink" href="/shop">Shop all</a>
              </div>
              <footer className="bag__foot">
                <p className="bag__total"><span>Subtotal</span><strong data-bag-total>USD 0.00</strong></p>
                <p className="bag__ship">Shipping and tax are worked out at checkout.</p>
                <div className="bag__ctas">
                  <a className="pill pill--light" href="/cart">View bag</a>
                  <a className="pill pill--ink" href="/checkout" data-checkout>Checkout</a>
                </div>
              </footer>
            </div>
          </dialog>

          {/* ══ MOBILE MENU ═════════════════════════════════════════════════ */}
          <dialog className="menu" id="menu" aria-label="Menu">
            <div className="menu__panel">
              <header className="menu__head">
                <a className="menu__brand" href="/">ANGADI</a>
                <button className="iconbtn iconbtn--ink" type="button" data-open-bag aria-label="Open bag, 0 items">
                  <svg width="20" height="20"><use href="#i-bag"/></svg>
                  <span className="badge" data-bag-count hidden>0</span>
                </button>
                <button className="iconbtn menu__close" type="button" data-close aria-label="Close menu" autoFocus>
                  <svg width="20" height="20"><use href="#i-close"/></svg>
                </button>
              </header>

              <nav className="menu__nav" aria-label="Mobile">
                <ol className="menu__list">
                  <li><a className="menu__link" href="/shop"><span className="menu__no">01</span><span className="menu__label"><span>Shop all</span></span><svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg></a></li>
                  <li><a className="menu__link" href="/shop?gender=Women"><span className="menu__no">02</span><span className="menu__label"><span>Women</span></span><svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg></a></li>
                  <li><a className="menu__link" href="/shop?gender=Men"><span className="menu__no">03</span><span className="menu__label"><span>Men</span></span><svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg></a></li>
                  <li><a className="menu__link" href="/#look"><span className="menu__no">04</span><span className="menu__label"><span>Lookbook</span></span><svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg></a></li>
                  <li><a className="menu__link" href="/about"><span className="menu__no">05</span><span className="menu__label"><span>Our story</span></span><svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg></a></li>
                </ol>
              </nav>

              <div className="menu__feature">
                <a className="menu__card" href="/shop?sort=new">
                  <img src="/photos/158-angadi/pick-2.jpg" width="1200" height="1600" alt="" loading="lazy" decoding="async" />
                  <span className="menu__cardtext"><small>Just landed</small>New arrivals</span>
                </a>
                <a className="menu__card" href="/shop?category=Jackets">
                  <img src="/photos/158-angadi/pick-1.jpg" width="1200" height="1600" alt="" loading="lazy" decoding="async" />
                  <span className="menu__cardtext"><small>Built for weather</small>Jackets</span>
                </a>
              </div>

              <footer className="menu__foot">
                <nav className="menu__sub" aria-label="More">
                  <a href="/account"><svg width="18" height="18" aria-hidden="true"><use href="#i-user"/></svg>Account</a>
                  <a href="/order"><svg width="18" height="18" aria-hidden="true"><use href="#i-truck"/></svg>Track an order</a>
                  <a href="/help"><svg width="18" height="18" aria-hidden="true"><use href="#i-return"/></svg>Help &amp; returns</a>
                </nav>
                <p className="menu__note">Free shipping over USD 150 · Free returns within 60 days</p>
              </footer>
            </div>
          </dialog>

          <p className="toast" role="status" aria-live="polite"></p>
          <div className="grain" aria-hidden="true"></div>
        </StoreProvider>
      </body>
    </html>
  );
}
