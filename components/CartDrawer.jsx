'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/data';

export default function CartDrawer() {
  const { isBagOpen, setIsBagOpen, bag, updateQty, removeFromBag, getTotals } = useStore();
  const totals = getTotals('standard');

  if (!isBagOpen) return null;

  return (
    <dialog
      className="bag"
      open
      style={{ display: 'block' }}
      aria-labelledby="bag-h"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsBagOpen(false);
      }}
    >
      <div className="bag__panel">
        <header className="bag__head">
          <h2 id="bag-h">Your bag</h2>
          <button
            className="iconbtn"
            type="button"
            onClick={() => setIsBagOpen(false)}
            aria-label="Close bag"
          >
            <svg width="20" height="20"><use href="#i-close"/></svg>
          </button>
        </header>

        <div className="ship">
          <p className="ship__text">
            {totals.freeShipLeft <= 0
              ? 'You have qualified for free standard shipping!'
              : `Add ${formatPrice(totals.freeShipLeft)} more to reach free shipping.`}
          </p>
          <span className="ship__track">
            <i
              style={{
                width: `${Math.min(100, Math.max(0, ((FREE_SHIPPING_THRESHOLD - totals.freeShipLeft) / FREE_SHIPPING_THRESHOLD) * 100))}%`
              }}
            ></i>
          </span>
        </div>

        {bag.length === 0 ? (
          <div className="bag__empty" style={{ display: 'flex' }}>
            <p>Your bag is empty. The trail is waiting.</p>
            <Link className="pill pill--ink" href="/shop" onClick={() => setIsBagOpen(false)}>
              Shop all
            </Link>
          </div>
        ) : (
          <ul className="bag__list">
            {bag.map((item) => (
              <li key={item.key} className="bagitem">
                <img className="bagitem__img" src={item.img} alt={item.name} width="72" height="96" />
                <div className="bagitem__info">
                  <h3 className="bagitem__title">{item.name}</h3>
                  {item.size && <p className="bagitem__meta">Size: {item.size}</p>}
                  <p className="bagitem__price">{formatPrice(item.price)}</p>
                  <div className="bagitem__qty">
                    <button
                      className="qtybtn"
                      type="button"
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <svg width="14" height="14"><use href="#i-minus"/></svg>
                    </button>
                    <span className="qtyval">{item.qty}</span>
                    <button
                      className="qtybtn"
                      type="button"
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <svg width="14" height="14"><use href="#i-plus"/></svg>
                    </button>
                  </div>
                </div>
                <button
                  className="iconbtn bagitem__del"
                  type="button"
                  onClick={() => removeFromBag(item.key)}
                  aria-label={`Remove ${item.name}`}
                >
                  <svg width="16" height="16"><use href="#i-close"/></svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {bag.length > 0 && (
          <footer className="bag__foot">
            <p className="bag__total">
              <span>Subtotal</span>
              <strong>{formatPrice(totals.subtotal)}</strong>
            </p>
            <p className="bag__ship">Shipping and tax are calculated at checkout.</p>
            <div className="bag__ctas">
              <Link
                className="pill pill--light"
                href="/cart"
                onClick={() => setIsBagOpen(false)}
              >
                View bag
              </Link>
              <Link
                className="pill pill--ink"
                href="/checkout"
                onClick={() => setIsBagOpen(false)}
              >
                Checkout
              </Link>
            </div>
          </footer>
        )}
      </div>
    </dialog>
  );
}
