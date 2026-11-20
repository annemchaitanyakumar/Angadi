'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function Header() {
  const { totalCount, setIsBagOpen, setIsMenuOpen } = useStore();

  return (
    <nav className="nav" aria-label="Main" data-intro>
      <button
        className="nav__burger"
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-expanded="false"
        aria-controls="menu"
        aria-label="Open menu"
      >
        <svg width="22" height="22"><use href="#i-menu"/></svg>
      </button>

      <ul className="nav__links nav__links--l">
        <li><Link href="/shop">Shop</Link></li>
        <li><Link href="/shop?gender=Women">Women</Link></li>
        <li><Link href="/shop?gender=Men">Men</Link></li>
        <li><Link href="/#trail">Trail</Link></li>
      </ul>

      <Link className="nav__logo" href="/" aria-label="ANGADI, back to top">
        <svg className="nav__notch" viewBox="0 0 460 58" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H460C432 0 422 4 412 15L384 46C376 54 368 58 354 58H106C92 58 84 54 76 46L48 15C38 4 28 0 0 0Z"/>
        </svg>
        <span className="nav__word">ANGADI</span>
      </Link>

      <ul className="nav__links nav__links--r">
        <li><Link href="/#picks">Seasonal</Link></li>
        <li><Link href="/#look">Lookbook</Link></li>
      </ul>

      <div className="nav__actions">
        <Link className="pill pill--ink nav__sign" href="/account">Sign in</Link>
        <button
          className="iconbtn iconbtn--ink"
          type="button"
          onClick={() => setIsBagOpen(true)}
          aria-label={`Open bag, ${totalCount} items`}
        >
          <svg width="20" height="20"><use href="#i-bag"/></svg>
          {totalCount > 0 && <span className="badge">{totalCount}</span>}
        </button>
      </div>
    </nav>
  );
}
