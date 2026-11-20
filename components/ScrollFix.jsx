'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollFix() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Close any dangling dialogs from previous route
    document.querySelectorAll('dialog[open]').forEach(d => {
      try {
        d.close();
      } catch {}
    });

    // 2. Remove any body/html scroll locks
    document.documentElement.classList.remove('has-sheet', 'lenis-stopped');
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow-y');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow-y');

    // 3. Resume Lenis smooth scroll engine
    if (window.__lenis) {
      try {
        window.__lenis.isStopped = false;
        window.__lenis.isLocked = false;
        window.__lenis.start();
      } catch {}
    }
  }, [pathname]);

  useEffect(() => {
    // Ensure navigation from inside any modal unlocks body/html
    function handleCaptureClick(e) {
      const link = e.target.closest('a[href]');
      if (link) {
        document.querySelectorAll('dialog[open]').forEach(d => {
          try {
            d.close();
          } catch {}
        });
        document.documentElement.classList.remove('has-sheet', 'lenis-stopped');
        document.documentElement.style.removeProperty('overflow');
        document.documentElement.style.removeProperty('overflow-y');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('overflow-y');
        if (window.__lenis) {
          try {
            window.__lenis.isStopped = false;
            window.__lenis.isLocked = false;
            window.__lenis.start();
          } catch {}
        }
      }
    }

    // Stop Lenis from intercepting wheel events on inner scrollables (like the cart list or menu)
    function handleInnerWheel(e) {
      const innerScrollable = e.target.closest('[data-bag-list], .bag__list, .menu__panel, dialog[open]');
      if (innerScrollable) {
        e.stopPropagation();
      }
    }

    document.addEventListener('click', handleCaptureClick, { capture: true });
    window.addEventListener('wheel', handleInnerWheel, { capture: true, passive: true });

    return () => {
      document.removeEventListener('click', handleCaptureClick, { capture: true });
      window.removeEventListener('wheel', handleInnerWheel, { capture: true });
    };
  }, []);

  return null;
}
