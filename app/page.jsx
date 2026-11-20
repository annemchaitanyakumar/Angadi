'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Ticker from '@/components/Ticker';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS, LOOKS, formatPrice } from '@/lib/data';

export default function HomePage() {
  const { addToBag, addLookToBag, toggleSave, isSaved } = useStore();
  const [filter, setFilter] = useState('All');
  const [isFilmOpen, setIsFilmOpen] = useState(false);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const videoRef = useRef(null);

  // Video scrub on scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 1.5;
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
      if (video.duration) {
        video.currentTime = progress * video.duration;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const newProducts = PRODUCTS.filter((p) => p.isNew);
  const filteredProducts = newProducts.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'Men' || filter === 'Women') return p.gender === filter;
    return p.terrain.toLowerCase() === filter.toLowerCase();
  });

  const activeLook = LOOKS[activeLookIndex];

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <header className="hero" id="top">
        <div className="hero__panel">
          <div className="hero__rays" aria-hidden="true"></div>

          <Header />

          <div className="hero__copy">
            <h1 className="hero__title">
              Built for the long<br />way out
            </h1>
            <div className="hero__ctas" data-intro>
              <Link className="pill pill--ink" href="/shop">Shop now</Link>
              <a className="pill pill--light" href="#new">New arrivals</a>
            </div>
          </div>

          <figure className="hero__model" data-bands="12">
            <img
              src="/photos/158-solum/hero-model.webp"
              width="949"
              height="1400"
              alt="Trail runner in a clay-orange ANGADI running shell"
              fetchPriority="high"
            />
          </figure>

          <aside className="hero__proof" data-intro>
            <div className="avatars" aria-hidden="true">
              <img src="/photos/158-solum/avatar-1.jpg" width="160" height="160" alt="" />
              <img src="/photos/158-solum/avatar-2.jpg" width="160" height="160" alt="" />
              <img src="/photos/158-solum/avatar-3.jpg" width="160" height="160" alt="" />
            </div>
            <p className="hero__rating">
              <strong>4.9</strong> from 12,400 trail runners
            </p>
            <p className="hero__blurb">
              Breathable shells and trail layers that move with you, from first light to the last climb.
            </p>
          </aside>

          {/* Scroll film */}
          <div className="reel" data-reel aria-hidden="true">
            <video
              ref={videoRef}
              src="/video/158-solum/hero-scrub.mp4"
              poster="/photos/158-solum/hero-scrub-poster.jpg"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
            ></video>
            <div className="reel__scrim"></div>
          </div>

          <button
            className="hero__clip"
            type="button"
            data-intro
            onClick={() => setIsFilmOpen(true)}
            aria-label="Play the trail film with sound"
          >
            <img
              className="hero__poster"
              src="/photos/158-solum/hero-scrub-poster.jpg"
              width="1280"
              height="720"
              alt="Film preview"
            />
            <span className="hero__play">
              <svg width="22" height="22"><use href="#i-play"/></svg>
            </span>
            <span className="hero__cliplabel">Trail film</span>
          </button>

          <div className="beats" aria-live="off">
            <div className="beat" data-beat>
              <p className="beat__eyebrow">01 &mdash; First light</p>
              <p className="beat__line">Out before<br />the city wakes</p>
            </div>
            <div className="beat" data-beat>
              <p className="beat__eyebrow">02 &mdash; Every mile</p>
              <p className="beat__line">Dust, heat and<br />the long climb</p>
            </div>
            <div className="beat" data-beat>
              <p className="beat__eyebrow">03 &mdash; Built to last</p>
              <p className="beat__line">Gear that goes<br />the distance</p>
            </div>
          </div>

          <div className="rail" aria-hidden="true">
            <span className="rail__time">00:00</span>
            <span className="rail__track"><i></i></span>
            <span className="rail__time">00:24</span>
          </div>
        </div>
      </header>

      <main id="main">
        {/* ══ PROMISES ticker ══════════════════════════════════════════════ */}
        <Ticker />

        {/* ══ TRAIL cluster ════════════════════════════════════════════════ */}
        <section className="trail" id="trail" aria-labelledby="trail-h">
          <div className="trail__stage">
            <h2 className="sr-only" id="trail-h">Trail</h2>
            <p className="trail__note trail__note--r">
              Stay light, stay dry. Our shells pack into their own pocket and shrug off the weather halfway up.
            </p>
            <figure className="tcard tcard--left">
              <img
                src="/photos/158-solum/trail-left.jpg"
                width="960"
                height="1280"
                alt="Hands tightening the straps of a clay-orange running vest"
                loading="lazy"
              />
            </figure>
            <div className="trail__word" aria-hidden="true">
              <span>T</span><span>R</span><span>A</span><span>I</span><span>L</span>
            </div>
            <figure className="tcard tcard--main">
              <img
                src="/photos/158-solum/trail-main.jpg"
                width="960"
                height="1280"
                alt="Runner in a moss-green hooded shell and neck gaiter"
                loading="lazy"
              />
            </figure>
            <figure className="tcard tcard--right">
              <img
                src="/photos/158-solum/trail-right.jpg"
                width="960"
                height="1280"
                alt="Gloved hand on charcoal trail shorts"
                loading="lazy"
              />
            </figure>
            <p className="trail__note trail__note--l">
              Performance layers for runners who leave the road, built for summer heat and alpine cold.
            </p>
          </div>
        </section>

        {/* ══ TOP PICKS ════════════════════════════════════════════════════ */}
        <section className="picks" id="picks" aria-labelledby="picks-h">
          <div className="sechead">
            <p className="eyebrow">Our top picks</p>
            <h2 className="sechead__title" id="picks-h">
              Gear that goes<br />further than you
            </h2>
            <p className="sechead__aside">The pieces our runners reach for first, picked for the season ahead.</p>
          </div>
          <div className="picks__row">
            <Link className="pcard" href="/product?id=butte">
              <figure>
                <img
                  src="/photos/158-solum/pick-1.jpg"
                  width="960"
                  height="1280"
                  alt="Runner in an olive anorak with a sand sling pack"
                  loading="lazy"
                />
              </figure>
              <span className="pcard__season">Spring / Summer<br />2026</span>
              <span className="pcard__title">Packed light,<br />built to last</span>
              <span className="pcard__chip"><i></i>Top 2026 pick</span>
            </Link>
            <Link className="pcard" href="/product?id=talus">
              <figure>
                <img
                  src="/photos/158-solum/pick-2.jpg"
                  width="960"
                  height="1280"
                  alt="Runner in a charcoal half-zip shell with a clay zip pull"
                  loading="lazy"
                />
              </figure>
              <span className="pcard__season">Spring / Summer<br />2026</span>
              <span className="pcard__title">New shells for<br />harder weather</span>
              <span className="pcard__chip"><i></i>New arrival</span>
            </Link>
          </div>
        </section>

        {/* ══ PACK (pinned group card) ═════════════════════════════════════ */}
        <section className="pack" aria-labelledby="pack-h">
          <div className="pack__stage">
            <div className="pack__row pack__row--top" aria-hidden="true">
              <span>Into the wild · Into the wild · Into the wild ·</span>
            </div>
            <article className="pack__card">
              <figure>
                <img
                  src="/photos/158-solum/group.jpg"
                  width="960"
                  height="1280"
                  alt="Four trail runners in ANGADI layers standing together"
                  loading="lazy"
                />
              </figure>
              <p className="pack__logo" aria-hidden="true">ANGADI</p>
              <p className="pack__eyebrow">Level up</p>
              <h2 className="pack__title" id="pack-h">
                Run with<br />the pack
              </h2>
            </article>
            <div className="pack__row pack__row--bottom" aria-hidden="true">
              <span>Into the wild · Into the wild · Into the wild ·</span>
            </div>
          </div>
        </section>

        {/* ══ NEW ARRIVALS ════════════════════════════════════════════════ */}
        <section className="new" id="new" aria-labelledby="new-h">
          <div className="sechead sechead--center">
            <p className="eyebrow">New arrivals</p>
            <h2 className="sechead__title" id="new-h">
              Fresh layers for your<br />next ascent
            </h2>
            <div className="filters" role="group" aria-label="Filter by terrain">
              {['All', 'Women', 'Men', 'Desert', 'Forest', 'Alpine', 'City'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="filter"
                  aria-pressed={filter === cat}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <ul className="grid" aria-live="polite">
            {filteredProducts.map((p) => {
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
                      <span>{p.color.name}</span>
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

          <p className="new__all">
            <Link className="pill pill--ink" href="/shop">
              Shop all products <svg width="18" height="18" aria-hidden="true"><use href="#i-arrow-r"/></svg>
            </Link>
          </p>
        </section>

        {/* ══ LOOKBOOK (interactive outfit cards) ═════════════════════════ */}
        <section className="look" id="look" aria-labelledby="look-h">
          <h2 className="sr-only" id="look-h">Spring / Summer Lookbook</h2>
          <div className="look__stage">
            <div className="look__row look__row--top" aria-hidden="true">
              <span>Your next ascent · Your next ascent · Your next ascent ·</span>
            </div>

            <div className="look__card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '640px', borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src={activeLook.img}
                  alt={activeLook.alt}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  background: 'rgba(22, 22, 22, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '20px 24px',
                  borderRadius: '8px',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff5c3d', fontWeight: 600 }}>
                      Look {activeLook.id.slice(-1).padStart(2, '0')}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '4px 0', whiteSpace: 'pre-line' }}>
                      {activeLook.title}
                    </h3>
                    <p style={{ fontSize: '13px', opacity: 0.8, margin: 0, whiteSpace: 'pre-line' }}>
                      {activeLook.items}
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: 700, margin: '8px 0 0 0' }}>
                      {formatPrice(activeLook.price)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <button
                      className="pill pill--clay"
                      type="button"
                      onClick={() => addLookToBag(activeLook.id)}
                    >
                      Add look
                    </button>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {LOOKS.map((look, i) => (
                        <button
                          key={look.id}
                          type="button"
                          onClick={() => setActiveLookIndex(i)}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            background: i === activeLookIndex ? '#ff5c3d' : 'rgba(255,255,255,0.4)'
                          }}
                          aria-label={`View look ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="look__row look__row--bottom" aria-hidden="true">
              <span>Your next ascent · Your next ascent · Your next ascent ·</span>
            </div>
          </div>
        </section>
      </main>

      {/* ══ VIDEO lightbox ════════════════════════════════════════════════ */}
      {isFilmOpen && (
        <dialog
          className="film"
          open
          style={{ display: 'flex' }}
          aria-label="SS26 trail film"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFilmOpen(false);
          }}
        >
          <button
            className="iconbtn iconbtn--light film__close"
            type="button"
            onClick={() => setIsFilmOpen(false)}
            aria-label="Close film"
          >
            <svg width="20" height="20"><use href="#i-close"/></svg>
          </button>
          <video src="/video/158-solum/hero-clip.mp4" controls autoPlay playsInline></video>
        </dialog>
      )}
    </>
  );
}
