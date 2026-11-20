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
    document.documentElement.classList.remove('has-sheet');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');

    // 3. Resume Lenis smooth scroll engine
    if (window.__lenis) {
      window.__lenis.start();
    }
  }, [pathname]);

  useEffect(() => {
    function handleCaptureClick(e) {
      const link = e.target.closest('a[href]');
      if (link) {
        document.querySelectorAll('dialog[open]').forEach(d => {
          try {
            d.close();
          } catch {}
        });
        document.documentElement.classList.remove('has-sheet');
        document.documentElement.style.removeProperty('overflow');
        document.body.style.removeProperty('overflow');
        if (window.__lenis) {
          window.__lenis.start();
        }
      }
    }

    document.addEventListener('click', handleCaptureClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleCaptureClick, { capture: true });
    };
  }, []);

  return null;
}
