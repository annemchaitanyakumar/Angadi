'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function Minibar() {
  const { totalCount, setIsBagOpen, setIsMenuOpen } = useStore();
  const pathname = usePathname();
  const [visible, setVisible] = useState(pathname !== '/');

  useEffect(() => {
    if (pathname !== '/') {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      // On home page, show minibar after scrolling past hero (~350px)
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <div className={`minibar ${visible ? 'is-on' : ''}`}>
      <button
        className="iconbtn minibar__menu"
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <svg width="22" height="22"><use href="#i-menu"/></svg>
      </button>

      <Link className="minibar__logo" href="/" aria-label="ANGADI, back to top">
        ANGADI
      </Link>

      <nav className="minibar__links" aria-label="Quick">
        <Link href="/shop">Dukanam</Link>
        <Link href="/#look">Lookbook</Link>
        <Link href="/about">Maa Gurinchi</Link>
        <Link href="/help">Sahayam</Link>
      </nav>

      <Link className="iconbtn" href="/account" aria-label="Your account">
        <svg width="20" height="20"><use href="#i-user"/></svg>
      </Link>

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
  );
}
