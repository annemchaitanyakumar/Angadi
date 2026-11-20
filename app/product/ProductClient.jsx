'use client';

import { useEffect } from 'react';

export default function ProductClient({ productId }) {
  useEffect(() => {
    document.documentElement.classList.add('js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('rm');
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = `/assets/product-nfrmIRU5.js?v=${Date.now()}`;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [productId]);

  return null;
}
