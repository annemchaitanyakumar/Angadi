export default function Ticker() {
  const promises = [
    'Free shipping over USD 150',
    '60-day free returns',
    'Repairs for life',
    'Recycled nylon shells',
    'Carbon-neutral delivery'
  ];

  return (
    <div className="promise" role="region" aria-label="Store promises">
      <ul className="promise__track">
        {promises.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
        {promises.map((p, i) => (
          <li key={`clone-${i}`} aria-hidden="true">{p}</li>
        ))}
      </ul>
    </div>
  );
}
