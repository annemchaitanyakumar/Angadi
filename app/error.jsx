'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="page" style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', marginBottom: '12px' }}>
        Something went wrong
      </h2>
      <p style={{ color: 'var(--c-muted)', maxWidth: '480px', marginBottom: '24px' }}>
        We encountered a momentary issue loading this page. Please try again or return to the shop.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="pill pill--ink" 
          type="button" 
          onClick={() => reset()}
          style={{ height: '44px', padding: '0 24px' }}
        >
          Try again
        </button>
        <a 
          className="pill pill--light" 
          href="/"
          style={{ height: '44px', padding: '0 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
