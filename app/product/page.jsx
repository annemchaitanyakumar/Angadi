'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS, formatPrice } from '@/lib/data';

function ProductContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'butte';
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const { addToBag, toggleSave, isSaved } = useStore();
  const [selectedImg, setSelectedImg] = useState(product.gallery[0]);
  const [selectedSize, setSelectedSize] = useState(() => {
    if ((product.stock.M ?? 0) > 0) return 'M';
    const firstAvailable = Object.keys(product.stock).find((s) => (product.stock[s] ?? 0) > 0);
    return firstAvailable || 'M';
  });
  const [qty, setQty] = useState(1);

  const saved = isSaved(product.id);
  const availableStock = product.stock[selectedSize] ?? 0;

  return (
    <div className="page-wrap">
      <header className="page-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Header />
      </header>

      <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '13px', opacity: 0.6, marginBottom: '32px' }} aria-label="Breadcrumb">
          <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/shop">Shop</Link> &nbsp;/&nbsp; <span>{product.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
          {/* Gallery */}
          <div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#eae5dc', marginBottom: '16px' }}>
              <img
                src={selectedImg}
                alt={product.alt}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
            {product.gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImg(imgUrl)}
                    style={{
                      width: '80px',
                      height: '100px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      padding: 0,
                      border: selectedImg === imgUrl ? '2px solid #161616' : '1px solid transparent',
                      cursor: 'pointer',
                      background: '#eae5dc'
                    }}
                  >
                    <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Buy Box */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span className="gcard__tag">{product.category}</span>
              <span className="gcard__tag">{product.terrain}</span>
              {product.isNew && <span className="gcard__tag" style={{ background: '#ff5c3d', color: '#161616' }}>New</span>}
            </div>

            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 16px 0' }}>
              {formatPrice(product.price)}
            </p>

            <p style={{ fontSize: '16px', lineHeight: 1.6, opacity: 0.8, margin: '0 0 24px 0' }}>
              {product.description}
            </p>

            {/* Color preview */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Color: {product.color.name}
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: product.color.hex,
                border: '2px solid #161616',
                boxShadow: '0 0 0 2px #fff'
              }} />
            </div>

            {/* Size selector */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Select Size
                </span>
                <Link href="/help#sizes" style={{ fontSize: '12px', textDecoration: 'underline', opacity: 0.7 }}>
                  Size guide
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {Object.keys(product.stock).map((size) => {
                  const stockCount = product.stock[size];
                  const inStock = stockCount > 0;
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minWidth: '54px',
                        height: '44px',
                        padding: '0 14px',
                        borderRadius: '8px',
                        font: 'inherit',
                        fontSize: '14px',
                        fontWeight: 600,
                        border: isSelected ? '2px solid #161616' : '1px solid rgba(0,0,0,0.2)',
                        background: isSelected ? '#161616' : inStock ? '#fff' : 'rgba(0,0,0,0.05)',
                        color: isSelected ? '#fff' : inStock ? '#161616' : 'rgba(0,0,0,0.3)',
                        cursor: inStock ? 'pointer' : 'not-allowed',
                        textDecoration: inStock ? 'none' : 'line-through'
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {availableStock > 0 && availableStock <= 4 && (
                <p style={{ fontSize: '12px', color: '#ff5c3d', marginTop: '8px', fontWeight: 600 }}>
                  Only {availableStock} left in size {selectedSize}
                </p>
              )}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px' }}>
              <button
                className="pill pill--ink"
                type="button"
                disabled={availableStock === 0}
                onClick={() => addToBag(product.id, selectedSize, qty)}
                style={{ flex: 1, height: '52px', fontSize: '15px' }}
              >
                {availableStock > 0 ? 'Add to bag' : 'Sold out'}
              </button>
              <button
                className="iconbtn"
                type="button"
                onClick={() => toggleSave(product.id)}
                style={{ width: '52px', height: '52px' }}
                aria-label="Save to wishlist"
              >
                <svg width="22" height="22" fill={saved ? 'currentColor' : 'none'}>
                  <use href="#i-heart" />
                </svg>
              </button>
            </div>

            {/* Features & Specs */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Key Technical Details
              </h3>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '14px', opacity: 0.8, marginBottom: '24px' }}>
                {product.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px', background: 'rgba(0,0,0,0.03)', padding: '16px', borderRadius: '8px' }}>
                <div>
                  <strong style={{ display: 'block', opacity: 0.6 }}>Materials:</strong>
                  <span>{product.materials}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', opacity: 0.6 }}>Garment Weight:</strong>
                  <span>{product.weight}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', opacity: 0.6 }}>SKU:</strong>
                  <span>{product.sku}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', opacity: 0.6 }}>Rating:</strong>
                  <span>★ {product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px 20px', textAlign: 'center' }}>Loading product...</div>}>
      <ProductContent />
    </Suspense>
  );
}
