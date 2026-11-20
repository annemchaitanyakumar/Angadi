'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS, formatPrice } from '@/lib/data';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialGender = searchParams.get('gender') || 'All';
  const initialCategory = searchParams.get('category') || 'All';

  const { addToBag, toggleSave, isSaved } = useStore();
  const [gender, setGender] = useState(initialGender);
  const [category, setCategory] = useState(initialCategory);
  const [terrain, setTerrain] = useState('All');
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Jackets', 'Fleece & Hoodies', 'Vests & Packs', 'Tops', 'Accessories'];
  const terrains = ['All', 'Desert', 'Forest', 'Alpine', 'City'];
  const genders = ['All', 'Women', 'Men'];

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (gender !== 'All' && p.gender !== gender) return false;
      if (category !== 'All' && p.category !== category) return false;
      if (terrain !== 'All' && p.terrain !== terrain) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.terrain.toLowerCase().includes(q) ||
          p.color.name.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [gender, category, terrain, sort, search]);

  return (
    <div className="page-wrap">
      <header className="page-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Header />
      </header>

      <main className="shop-main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.03em' }}>
            Shop All Layers
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.7, margin: 0, maxWidth: '640px' }}>
            Built for trail running, mountain ridgelines and alpine ascents. Filter by weather, terrain or fit.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          padding: '16px 20px',
          background: 'rgba(0,0,0,0.03)',
          borderRadius: '12px'
        }}>
          {/* Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6 }}>Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="filter"
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gender */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6 }}>Fit:</span>
            {genders.map((g) => (
              <button
                key={g}
                type="button"
                className="filter"
                aria-pressed={gender === g}
                onClick={() => setGender(g)}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Terrain & Sort */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={terrain}
              onChange={(e) => setTerrain(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(0,0,0,0.15)',
                background: '#fff',
                font: 'inherit',
                fontSize: '13px',
                cursor: 'pointer'
              }}
              aria-label="Filter by terrain"
            >
              <option value="All">All Terrains</option>
              {terrains.filter(t => t !== 'All').map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(0,0,0,0.15)',
                background: '#fff',
                font: 'inherit',
                fontSize: '13px',
                cursor: 'pointer'
              }}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest first</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Count banner */}
        <p style={{ fontSize: '14px', opacity: 0.6, margin: '0 0 24px 0' }}>
          Showing {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
        </p>

        {/* Product grid */}
        <ul className="grid" aria-live="polite">
          {filtered.map((p) => {
            const saved = isSaved(p.id);
            return (
              <li key={p.id} className="gcard" data-id={p.id}>
                <Link className="gcard__link" href={`/product?id=${p.id}`} aria-label={`${p.name}, ${formatPrice(p.price)}`}>
                  <figure>
                    <img src={p.img} width="960" height="1280" alt={p.alt} loading="lazy" />
                  </figure>
                </Link>
                <div className="gcard__top">
                  <span className="gcard__tag">{p.terrain}</span>
                  <button
                    className="gcard__heart"
                    type="button"
                    aria-pressed={saved}
                    onClick={() => toggleSave(p.id)}
                    aria-label={`Save ${p.name}`}
                  >
                    <svg width="16" height="16" fill={saved ? 'currentColor' : 'none'}>
                      <use href="#i-heart" />
                    </svg>
                  </button>
                </div>
                <div className="gcard__info">
                  <h3 className="gcard__title">
                    <Link href={`/product?id=${p.id}`}>{p.name}</Link>
                  </h3>
                  <p className="gcard__meta">
                    <span>{p.color.name} · {p.gender}</span>
                    <strong className="gcard__price">{formatPrice(p.price)}</strong>
                  </p>
                  <button
                    className="pill pill--ink gcard__add"
                    type="button"
                    onClick={() => addToBag(p.id, 'M', 1)}
                  >
                    Add to bag
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px 20px', textAlign: 'center' }}>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
