'use client';

import { useStore } from '@/context/StoreContext';

export default function Toast() {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <p className="toast" role="status" aria-live="polite" style={{ opacity: 1, transform: 'translateY(0)' }}>
      {toastMessage}
    </p>
  );
}
