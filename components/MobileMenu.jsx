'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function MobileMenu() {
  const { isMenuOpen, setIsMenuOpen, totalCount, setIsBagOpen } = useStore();

  if (!isMenuOpen) return null;

  return (
    <dialog
      className="menu"
      id="menu"
      open
      style={{ display: 'block' }}
      aria-label="Menu"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsMenuOpen(false);
      }}
    >
      <div className="menu__panel">
        <header className="menu__head">
          <Link className="menu__brand" href="/" onClick={() => setIsMenuOpen(false)}>
            ANGADI
          </Link>
          <button
            className="iconbtn iconbtn--ink"
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              setIsBagOpen(true);
            }}
            aria-label={`Open bag, ${totalCount} items`}
          >
            <svg width="20" height="20"><use href="#i-bag"/></svg>
            {totalCount > 0 && <span className="badge">{totalCount}</span>}
          </button>
          <button
            className="iconbtn menu__close"
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            autoFocus
          >
            <svg width="20" height="20"><use href="#i-close"/></svg>
          </button>
        </header>

        <nav className="menu__nav" aria-label="Mobile">
          <ol className="menu__list">
            <li>
              <Link className="menu__link" href="/shop" onClick={() => setIsMenuOpen(false)}>
                <span className="menu__no">01</span>
                <span className="menu__label"><span>Shop all</span></span>
                <svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg>
              </Link>
            </li>
            <li>
              <Link className="menu__link" href="/shop?gender=Women" onClick={() => setIsMenuOpen(false)}>
                <span className="menu__no">02</span>
                <span className="menu__label"><span>Women</span></span>
                <svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg>
              </Link>
            </li>
            <li>
              <Link className="menu__link" href="/shop?gender=Men" onClick={() => setIsMenuOpen(false)}>
                <span className="menu__no">03</span>
                <span className="menu__label"><span>Men</span></span>
                <svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg>
              </Link>
            </li>
            <li>
              <Link className="menu__link" href="/#look" onClick={() => setIsMenuOpen(false)}>
                <span className="menu__no">04</span>
                <span className="menu__label"><span>Lookbook</span></span>
                <svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg>
              </Link>
            </li>
            <li>
              <Link className="menu__link" href="/about" onClick={() => setIsMenuOpen(false)}>
                <span className="menu__no">05</span>
                <span className="menu__label"><span>Our story</span></span>
                <svg width="22" height="22" aria-hidden="true"><use href="#i-arrow-r"/></svg>
              </Link>
            </li>
          </ol>
        </nav>

        <div className="menu__feature">
          <Link className="menu__card" href="/shop?sort=new" onClick={() => setIsMenuOpen(false)}>
            <img src="/photos/158-solum/pick-2.jpg" width="1200" height="1600" alt="New arrivals" />
            <span className="menu__cardtext">
              <small>Just landed</small>New arrivals
            </span>
          </Link>
          <Link className="menu__card" href="/shop?category=Jackets" onClick={() => setIsMenuOpen(false)}>
            <img src="/photos/158-solum/pick-1.jpg" width="1200" height="1600" alt="Jackets" />
            <span className="menu__cardtext">
              <small>Built for weather</small>Jackets
            </span>
          </Link>
        </div>

        <footer className="menu__foot">
          <nav className="menu__sub" aria-label="More">
            <Link href="/account" onClick={() => setIsMenuOpen(false)}>
              <svg width="18" height="18" aria-hidden="true"><use href="#i-user"/></svg>Account
            </Link>
            <Link href="/order" onClick={() => setIsMenuOpen(false)}>
              <svg width="18" height="18" aria-hidden="true"><use href="#i-truck"/></svg>Track an order
            </Link>
            <Link href="/help" onClick={() => setIsMenuOpen(false)}>
              <svg width="18" height="18" aria-hidden="true"><use href="#i-return"/></svg>Help &amp; returns
            </Link>
          </nav>
          <p className="menu__note">Free shipping over INR 150 · Free returns within 60 days</p>
        </footer>
      </div>
    </dialog>
  );
}
