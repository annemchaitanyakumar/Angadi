'use client';

import { useEffect } from 'react';
import { sound } from '@/lib/sound';

export default function SoundProvider() {
  useEffect(() => {
    function handlePointerDown(e) {
      try {
        const target = e.target;
        if (!target) {
          sound.playPebbleTap();
          return;
        }

        // 1. Check if clicking Add to Cart / Bag or Save Wishlist
        const isBagAction = target.closest(
          '[data-add], [data-shop-look], .prod__add, [data-save], [data-checkout], [data-open-bag]'
        );
        if (isBagAction) {
          sound.playBagAdd();
          return;
        }

        // 2. Check if clicking buttons, links, controls, interactive elements
        const isInteractive = target.closest(
          'button, a, input, select, textarea, .pill, .iconbtn, .filter, [role="button"], label, summary, [data-open-menu], [data-close], [data-open-video], .chip, .tcard, .pcard, .gcard, .pd__shot, .pd__thumb'
        );
        if (isInteractive) {
          sound.playButtonSnap();
          return;
        }

        // 3. Any other tap or click anywhere on the page (ambient trail pebble tap)
        sound.playPebbleTap();
      } catch (err) {
        // Audio error protection
      }
    }

    // Listen on window with capture: true so it triggers instantly on pointerdown
    window.addEventListener('pointerdown', handlePointerDown, { passive: true, capture: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
    };
  }, []);

  return null;
}
