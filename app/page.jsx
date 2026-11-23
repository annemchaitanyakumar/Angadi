'use client';

import { useEffect } from 'react';
import Footer from '@/components/Footer';

export default function HomePage() {
  useEffect(() => {
    // Ensure documentElement has js class for animation start states
    document.documentElement.classList.add('js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('rm');
    }

    // Load home animation module (GSAP, ScrollTrigger, Lenis, Flip, blinds, reel scrub)
    const script = document.createElement('script');
    script.type = 'module';
    script.src = `/assets/home-B2ae6dCl.js?v=${Date.now()}`;
    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      script.remove();
    };
  }, []);

  return (
    <>
      <header className="hero" id="top">
        <div className="hero__panel">
          <div className="hero__rays" aria-hidden="true"></div>

          <nav className="nav" aria-label="Main" data-intro>
            <button className="nav__burger" type="button" data-open-menu aria-expanded="false" aria-controls="menu" aria-label="Open menu">
              <svg width="22" height="22"><use href="#i-menu"/></svg>
            </button>
            <ul className="nav__links nav__links--l">
              <li><a href="/shop">Dukanam</a></li>
              <li><a href="/shop?gender=Women">Stree</a></li>
              <li><a href="/shop?gender=Men">Purush</a></li>
              <li><a href="#trail">Trail</a></li>
            </ul>
            <a className="nav__logo" href="#top" aria-label="ANGADI, back to top">
              <svg className="nav__notch" viewBox="0 0 460 58" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H460C432 0 422 4 412 15L384 46C376 54 368 58 354 58H106C92 58 84 54 76 46L48 15C38 4 28 0 0 0Z"/></svg>
              <span className="nav__word">ANGADI</span>
            </a>
            <ul className="nav__links nav__links--r">
              <li><a href="#picks">Seasonal</a></li>
              <li><a href="#look">Lookbook</a></li>
            </ul>
            <div className="nav__actions">
              <a className="pill pill--ink nav__sign" href="/account">Sign in</a>
              <button className="iconbtn iconbtn--ink" type="button" data-open-bag aria-label="Open bag, 0 items">
                <svg width="20" height="20"><use href="#i-bag"/></svg>
                <span className="badge" data-bag-count hidden>0</span>
              </button>
            </div>
          </nav>

          <div className="hero__copy">
            <h1 className="hero__title" data-scramble>Built for the long<br />way out</h1>
            <div className="hero__ctas" data-intro>
              <a className="pill pill--ink" href="/shop">Ippude Konandi</a>
              <a className="pill pill--light" href="#new">Kothaga Vachinavi</a>
            </div>
          </div>

          <figure className="hero__model" data-bands="12">
            <img src="/photos/158-angadi/hero-model.webp?v=3" width="949" height="1400" alt="Trail runner in a clay-orange ANGADI running shell" fetchPriority="high" />
          </figure>

          <aside className="hero__proof" data-intro>
            <div className="avatars" aria-hidden="true">
              <img src="/photos/158-angadi/avatar-1.jpg" width="160" height="160" alt="" />
              <img src="/photos/158-angadi/avatar-2.jpg" width="160" height="160" alt="" />
              <img src="/photos/158-angadi/avatar-3.jpg" width="160" height="160" alt="" />
            </div>
            <p className="hero__rating"><strong>4.9</strong> from 12,400 trail runners</p>
            <p className="hero__blurb">Breathable shells and trail layers that move with you, from first light to the last climb.</p>
          </aside>

          {/* The scroll film. At the top of the page it IS the small film card;
               scrolling grows it to fill the panel while scroll position plays it. */}
          <div className="reel" data-reel aria-hidden="true">
            <video data-reel-video src="/video/158-angadi/hero-scrub.mp4" poster="/photos/158-angadi/hero-scrub-poster.jpg" muted playsInline preload="auto" disablePictureInPicture></video>
            <div className="reel__scrim"></div>
          </div>

          <button className="hero__clip" type="button" data-intro data-open-video aria-label="Play the SS26 trail film with sound">
            <img className="hero__poster" src="/photos/158-angadi/hero-scrub-poster.jpg" width="1280" height="720" alt="" />
            <span className="hero__play"><svg width="22" height="22"><use href="#i-play"/></svg></span>
            <span className="hero__cliplabel">SS26 trail film</span>
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
            <span className="rail__time" data-rail-time>00:00</span>
            <span className="rail__track"><i data-rail-fill></i></span>
            <span className="rail__time" data-rail-end>00:00</span>
          </div>
        </div>
      </header>

      {/* compact header: slides in once the hero has gone */}
      <div className="minibar" data-minibar>
        <button className="iconbtn minibar__menu" type="button" data-open-menu aria-expanded="false" aria-controls="menu" aria-label="Open menu"><svg width="22" height="22"><use href="#i-menu"/></svg></button>
        <a className="minibar__logo" href="#top" aria-label="ANGADI, back to top">ANGADI</a>
        <nav className="minibar__links" aria-label="Quick">
          <a href="/shop">Dukanam</a>
          <a href="#look">Lookbook</a>
          <a href="/about">Maa Gurinchi</a>
          <a href="/help">Sahayam</a>
        </nav>
        <a className="iconbtn" href="/account" aria-label="Your account"><svg width="20" height="20"><use href="#i-user"/></svg></a>
        <button className="iconbtn iconbtn--ink" type="button" data-open-bag aria-label="Open bag, 0 items">
          <svg width="20" height="20"><use href="#i-bag"/></svg>
          <span className="badge" data-bag-count hidden>0</span>
        </button>
      </div>

      <main id="main">
        {/* ══ PROMISES ticker ══════════════════════════════════════════════ */}
        <div className="promise" role="region" aria-label="Store promises">
          <ul className="promise__track">
            <li>Free shipping over ₹1,500</li><li>60-day free returns</li><li>Repairs for life</li><li>Recycled nylon shells</li><li>Carbon-neutral delivery</li>
            <li aria-hidden="true">Free shipping over ₹1,500</li><li aria-hidden="true">60-day free returns</li><li aria-hidden="true">Repairs for life</li><li aria-hidden="true">Recycled nylon shells</li><li aria-hidden="true">Carbon-neutral delivery</li>
          </ul>
        </div>

        {/* ══ TRAIL cluster ════════════════════════════════════════════════ */}
        <section className="trail" id="trail" aria-labelledby="trail-h">
          <div className="trail__stage">
            <h2 className="sr-only" id="trail-h">Trail</h2>
            <p className="trail__note trail__note--r">Stay light, stay dry. Our shells pack into their own pocket and shrug off the weather halfway up.</p>
            <figure className="tcard tcard--left" data-blinds><img src="/photos/158-angadi/trail-left.jpg?v=2" width="960" height="1280" alt="Hands tightening the straps of a clay-orange running vest" loading="lazy" /></figure>
            <div className="trail__word" aria-hidden="true"><span>T</span><span>R</span><span>A</span><span>I</span><span>L</span></div>
            <figure className="tcard tcard--main" data-blinds><img src="/photos/158-angadi/trail-main.jpg?v=2" width="960" height="1280" alt="Runner in a moss-green hooded shell and neck gaiter" loading="lazy" /></figure>
            <figure className="tcard tcard--right" data-blinds><img src="/photos/158-angadi/trail-right.jpg?v=2" width="960" height="1280" alt="Gloved hand on charcoal trail shorts" loading="lazy" /></figure>
            <p className="trail__note trail__note--l">Performance layers for runners who leave the road, built for summer heat and alpine cold.</p>
          </div>
        </section>

        {/* ══ TOP PICKS ════════════════════════════════════════════════════ */}
        <section className="picks" id="picks" aria-labelledby="picks-h">
          <div className="sechead">
            <p className="eyebrow">Our top picks</p>
            <h2 className="sechead__title" id="picks-h" data-scramble>Gear that goes<br />further than you</h2>
            <p className="sechead__aside">The pieces our runners reach for first, picked for the season ahead.</p>
          </div>
          <div className="picks__row">
            <a className="pcard" href="/product?id=butte" data-vt="butte">
              <figure data-blinds><img src="/photos/158-angadi/pick-1.jpg?v=2" width="960" height="1280" alt="Runner in an olive anorak with a sand sling pack" loading="lazy" /></figure>
              <span className="pcard__season">Spring / Summer<br />2026</span>
              <span className="pcard__title" data-scramble>Packed light,<br />built to last</span>
              <span className="pcard__chip"><i></i>Kothaga Vachinavi</span>
            </a>
            <a className="pcard" href="/product?id=talus" data-vt="talus">
              <figure data-blinds><img src="/photos/158-angadi/pick-2.jpg?v=2" width="960" height="1280" alt="Runner in a charcoal half-zip shell with a clay zip pull" loading="lazy" /></figure>
              <span className="pcard__season">Spring / Summer<br />2026</span>
              <span className="pcard__title" data-scramble>New shells for<br />harder weather</span>
              <span className="pcard__chip"><i></i>Kothaga Vachinavi</span>
            </a>
          </div>
        </section>

        {/* ══ PACK (pinned group card) ═════════════════════════════════════ */}
        <section className="pack" aria-labelledby="pack-h">
          <div className="pack__stage">
            <div className="pack__row pack__row--top" aria-hidden="true"><span>Into the wild · Into the wild · Into the wild ·</span></div>
            <article className="pack__card">
              <figure data-blinds><img src="/photos/158-angadi/group.jpg?v=2" width="960" height="1280" alt="Four trail runners in ANGADI layers standing together" loading="lazy" /></figure>
              <p className="pack__logo" aria-hidden="true">ANGADI</p>
              <p className="pack__eyebrow">Level up</p>
              <h2 className="pack__title" id="pack-h" data-scramble>Run with<br />the pack</h2>
            </article>
            <div className="pack__row pack__row--bottom" aria-hidden="true"><span>Into the wild · Into the wild · Into the wild ·</span></div>
          </div>
        </section>

        {/* ══ NEW ARRIVALS ════════════════════════════════════════════════ */}
        <section className="new" id="new" aria-labelledby="new-h">
          <div className="sechead sechead--center">
            <p className="eyebrow">Kothaga Vachinavi</p>
            <h2 className="sechead__title" id="new-h" data-scramble>Fresh layers for your<br />next ascent</h2>
            <div className="filters" role="group" aria-label="Filter by terrain">
              <button type="button" className="filter" aria-pressed="true" data-f="All">All</button>
              <button type="button" className="filter" aria-pressed="false" data-f="Women">Stree</button>
              <button type="button" className="filter" aria-pressed="false" data-f="Men">Purush</button>
              <button type="button" className="filter" aria-pressed="false" data-f="Desert">Desert</button>
              <button type="button" className="filter" aria-pressed="false" data-f="Forest">Forest</button>
              <button type="button" className="filter" aria-pressed="false" data-f="Alpine">Alpine</button>
              <button type="button" className="filter" aria-pressed="false" data-f="City">City</button>
            </div>
          </div>
          <ul className="grid" data-grid aria-live="polite"></ul>
          <p className="new__all"><a className="pill pill--ink" href="/shop">Dukanam lo Anni Choodandi <svg width="18" height="18" aria-hidden="true"><use href="#i-arrow-r"/></svg></a></p>
        </section>

        {/* ══ LOOKBOOK (pinned card swaps outfits) ═════════════════════════ */}
        <section className="look" id="look" aria-labelledby="look-h">
          <h2 className="sr-only" id="look-h">Spring / Summer 2026 lookbook</h2>
          <div className="look__stage">
            <div className="look__row look__row--top" aria-hidden="true"><span>Your next ascent · Your next ascent · Your next ascent ·</span></div>
            <div className="look__card" data-look></div>
            <div className="look__row look__row--bottom" aria-hidden="true"><span>Your next ascent · Your next ascent · Your next ascent ·</span></div>
          </div>
        </section>
      </main>

      <Footer />

      <dialog className="film" aria-label="SS26 trail film">
        <button className="iconbtn iconbtn--light film__close" type="button" data-close aria-label="Close film"><svg width="20" height="20"><use href="#i-close"/></svg></button>
        <video src="/video/158-angadi/hero-clip.mp4" controls playsInline preload="none"></video>
      </dialog>
    </>
  );
}
