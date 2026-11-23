export default function NotFound() {
  return (
    <div className="page" style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '12px' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--c-muted)', maxWidth: '480px', marginBottom: '24px' }}>
        The trail ends here. The page you are looking for does not exist or has moved.
      </p>
      <a 
        className="pill pill--ink" 
        href="/"
        style={{ height: '44px', padding: '0 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
      >
        Return to Shop
      </a>
    </div>
  );
}
