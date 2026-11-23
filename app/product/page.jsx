import { getProduct, getProducts } from '@/lib/db';
import Footer from '@/components/Footer';
import ProductClient from './ProductClient';

function getRelated(product, allProducts = []) {
  if (!product) return [];
  const others = allProducts.filter(p => p.id !== product.id);
  const score = t => (t.category === product.category ? 2 : 0) + (t.terrain === product.terrain ? 1 : 0) + (t.gender === product.gender ? 0.5 : 0);
  return others.sort((a, b) => score(b) - score(a) || b.rating - a.rating).slice(0, 4);
}

export default async function ProductPage({ searchParams }) {
  const resolved = await searchParams;
  const id = resolved?.id || 'ridgeline';
  const [product, allProducts] = await Promise.all([
    getProduct(id),
    getProducts()
  ]);
  const related = getRelated(product, allProducts);
  const stockKeys = Object.keys(product.stock);
  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
  const isSoldOut = totalStock === 0;
  const starsRatio = (product.rating / 5).toFixed(3);
  const starIcons = '<svg width="16" height="16"><use href="#i-star"/></svg>'.repeat(5);

  return (
    <div className="page page--product">
      <style>{`
        /* Desktop defaults: mobile-only elements hidden */
        .pd__heart-mobile {
          display: none !important;
        }
        .pd__stepper-mobile {
          display: none !important;
        }
        @media (max-width: 1000px) {
          /* 1. Mobile fixed wishlist heart on top-right of product gallery */
          .pd__gallery {
            position: relative !important;
            display: block !important;
          }
          .pd__stage {
            position: static !important;
          }
          .pd__heart-mobile {
            display: inline-grid !important;
            position: absolute !important;
            top: 14px !important;
            right: 14px !important;
            z-index: 30 !important;
            width: 44px !important;
            height: 44px !important;
            border-radius: 50% !important;
            background: rgba(244, 239, 230, 0.94) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(46, 58, 47, 0.14) !important;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12) !important;
            color: var(--c-moss, #2e3a2f) !important;
            place-items: center !important;
            cursor: pointer !important;
            padding: 0 !important;
          }
          .pd__heart-mobile svg {
            fill: none;
            transition: fill 0.2s, transform 0.2s;
          }
          .pd__heart-mobile[aria-pressed="true"] {
            color: var(--c-clay, #b5562f) !important;
          }
          .pd__heart-mobile[aria-pressed="true"] svg {
            fill: var(--c-clay, #b5562f) !important;
          }

          /* 2. Hide separate quantity stepper and desktop heart from .pd__buy on mobile */
          .pd__buy .qty,
          .pd__buy > .qty,
          .pd__buy .iconbtn,
          .pd__buy > .iconbtn {
            display: none !important;
          }
          .pd__buy {
            display: block !important;
            grid-template-columns: 1fr !important;
            width: 100% !important;
            margin-top: 16px !important;
          }
          .pd__buy .pd__add {
            width: 100% !important;
            height: 56px !important;
            position: relative !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 999px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
          }

          /* 3. In-button Stepper inside "Butta lo Vey" when active on mobile */
          .pd__add.has-stepper {
            background: var(--c-moss, #2e3a2f) !important;
            padding: 0 8px !important;
          }
          .pd__add.has-stepper .label-add,
          .pd__add.has-stepper .label-done {
            display: none !important;
          }
          .pd__add.has-stepper .pd__stepper-mobile {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 4px !important;
            user-select: none !important;
          }
          .pd__stepper-mobile .btn-step {
            width: 44px !important;
            height: 44px !important;
            border-radius: 50% !important;
            display: inline-grid !important;
            place-items: center !important;
            background: rgba(244, 239, 230, 0.22) !important;
            color: #fff8f0 !important;
            cursor: pointer !important;
            transition: background-color 0.2s, transform 0.15s !important;
            flex-shrink: 0 !important;
          }
          .pd__stepper-mobile .btn-step:hover,
          .pd__stepper-mobile .btn-step:active {
            background: var(--c-clay, #b5562f) !important;
            transform: scale(0.92) !important;
          }
          .pd__stepper-mobile .btn-step__txt {
            font-size: 14px !important;
            font-weight: 600 !important;
            letter-spacing: 0.04em !important;
            color: #fff8f0 !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
          }
          .pd__stepper-mobile [data-qty-mobile] {
            font-size: 17px !important;
            font-weight: 700 !important;
            min-width: 16px !important;
            text-align: center !important;
          }
        }
      `}</style>
      <header className="topbar" data-topbar>
        <button className="iconbtn topbar__burger" type="button" data-open-menu aria-expanded="false" aria-controls="menu" aria-label="Open menu">
          <svg width="22" height="22"><use href="#i-menu" /></svg>
        </button>
        <a className="topbar__logo" href="/" aria-label="ANGADI home">ANGADI</a>
        <nav className="topbar__links" aria-label="Main">
          <a href="/shop/" data-nav="shop">Dukanam</a>
          <a href="/shop/?gender=Women" data-nav="shop-women">Stree</a>
          <a href="/shop/?gender=Men" data-nav="shop-men">Purush</a>
          <a href="/#look">Lookbook</a>
          <a href="/about/" data-nav="about">Maa Gurinchi</a>
          <a href="/help/" data-nav="help">Sahayam</a>
        </nav>
        <div className="topbar__actions">
          <a className="iconbtn" href="/account/" data-nav="account" aria-label="Your account">
            <svg width="20" height="20"><use href="#i-user" /></svg>
          </a>
          <button className="iconbtn iconbtn--ink" type="button" data-open-bag aria-label="Open bag, 0 items">
            <svg width="20" height="20"><use href="#i-bag" /></svg>
            <span className="badge" data-bag-count hidden>0</span>
          </button>
        </div>
      </header>

      <main id="main">
        <div data-product>
          <nav className="crumbs crumbs--pd" aria-label="Breadcrumb">
            <ol>
              <li><a href="/shop/">Dukanam</a></li>
              <li><a href={`/shop/?category=${encodeURIComponent(product.category)}`}>{product.category}</a></li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <article className="pd">
            <div className="pd__gallery" role="group" aria-label={`Photos of ${product.name}`}>
              <div className="pd__stage" data-stage>
                {product.gallery.map((src, idx) => (
                  <button
                    key={idx}
                    className={`pd__shot ${idx === 0 ? 'is-on' : ''}`}
                    type="button"
                    data-zoom={idx}
                    aria-label={`Enlarge photo ${idx + 1} of ${product.gallery.length}`}
                    tabIndex={idx === 0 ? 0 : -1}
                  >
                    <img
                      src={src}
                      width="960"
                      height="1280"
                      alt={idx === 0 ? product.alt : `${product.name}, close-up`}
                      fetchPriority={idx === 0 ? 'high' : undefined}
                      loading={idx === 0 ? undefined : 'lazy'}
                    />
                  </button>
                ))}
                {product.gallery.length > 1 && (
                  <>
                    <button className="iconbtn pd__arrow pd__arrow--prev" type="button" data-step="-1" aria-label="Previous photo">
                      <svg width="20" height="20" style={{ transform: 'scaleX(-1)' }}><use href="#i-arrow" /></svg>
                    </button>
                    <button className="iconbtn pd__arrow pd__arrow--next" type="button" data-step="1" aria-label="Next photo">
                      <svg width="20" height="20"><use href="#i-arrow" /></svg>
                    </button>
                    <p className="pd__count" aria-live="polite" data-count>1 / {product.gallery.length}</p>
                  </>
                )}
              </div>
              <button className="iconbtn pd__heart-mobile" type="button" data-save={product.id} aria-pressed="false" aria-label={`Save ${product.name}`}>
                <svg width="22" height="22"><use href="#i-heart" /></svg>
              </button>
              {product.gallery.length > 1 && (
                <div className="pd__thumbs">
                  {product.gallery.map((src, idx) => (
                    <button
                      key={idx}
                      className="pd__thumb"
                      type="button"
                      data-thumb={idx}
                      aria-current={idx === 0}
                      aria-label={`Show photo ${idx + 1} of ${product.gallery.length}`}
                    >
                      <img src={src} width="160" height="213" alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pd__info">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <p className="eyebrow" style={{ margin: 0 }}>{product.category} · {product.gender}</p>
                {product.isFlashSale && (
                  <span className="tag tag--flash" style={{
                    background: '#b5562f',
                    color: '#fff8f0',
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(181, 86, 47, 0.25)'
                  }}>
                    ⚡ Flash Sale · {product.discountPct}% OFF
                  </span>
                )}
              </div>
              <h1 className="pd__title" data-pd-title>{product.name}</h1>
              <p className="pd__rating">
                <span className="stars" style={{ '--r': starsRatio }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: `${starIcons}<span class="stars__fill">${starIcons}</span>` }}></span>
                <span>{product.rating.toFixed(1)} · {product.reviews} reviews</span>
              </p>
              <p className="pd__price">
                <span>₹{product.price.toFixed(2)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <s style={{ color: '#8c827a', fontSize: '0.85em', marginLeft: '10px', textDecoration: 'line-through' }} aria-label={`was ₹${product.compareAtPrice.toFixed(2)}`}>
                    ₹{product.compareAtPrice.toFixed(2)}
                  </s>
                )}
                {product.isFlashSale && (
                  <span style={{
                    marginLeft: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#b5562f',
                    background: '#f8ebe4',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    Save {product.discountPct}%
                  </span>
                )}
              </p>
              <p className="pd__blurb">{product.blurb}</p>
              <p className="pd__color">
                Colour <strong>{product.color.name}</strong>
                <span className="swatch" style={{ '--c': product.color.hex }} aria-hidden="true"></span>
              </p>

              <fieldset className="sizes" data-sizes>
                <legend><span>Size</span><button className="link" type="button" data-size-guide>Size guide</button></legend>
                <div className="sizes__grid" style={{ gridTemplateColumns: `repeat(${Math.max(3, stockKeys.length)}, 1fr)` }}>
                  {stockKeys.map(size => {
                    const count = product.stock[size] ?? 0;
                    return (
                      <label key={size} className="size">
                        <input type="radio" name="size" value={size} disabled={count === 0} defaultChecked={size === 'M' || (!product.stock['M'] && count > 0)} aria-describedby="size-note" />
                        <span>{size}<span className="sr-only">{count === 0 ? ', sold out' : count <= 3 ? `, only ${count} left` : ''}</span></span>
                      </label>
                    );
                  })}
                </div>
                <p className="sizes__note" id="size-note" aria-live="polite" data-size-note></p>
              </fieldset>

              <div className="pd__buy">
                <div className="qty qty--lg">
                  <button type="button" data-q="-1" aria-label="One fewer"><svg width="16" height="16"><use href="#i-minus" /></svg></button>
                  <output aria-label="Quantity" data-qty>1</output>
                  <button type="button" data-q="1" aria-label="One more"><svg width="16" height="16"><use href="#i-plus" /></svg></button>
                </div>
                <button className="pill pill--ink pd__add" type="button" data-pd-add disabled={isSoldOut}>
                  <span className="label-add">{isSoldOut ? 'Sold out' : <>Butta lo Vey · <span data-line-price>₹{product.price.toFixed(2)}</span></>}</span>
                  <span className="label-done"><svg width="18" height="18" aria-hidden="true"><use href="#i-check" /></svg>Added to bag</span>
                  <div className="pd__stepper-mobile" data-stepper-mobile>
                    <span className="btn-step btn-step--dec" data-q-mobile="-1" role="button" aria-label="One fewer">
                      <svg width="16" height="16"><use href="#i-minus" /></svg>
                    </span>
                    <span className="btn-step__txt">
                      <output data-qty-mobile>1</output> in bag
                    </span>
                    <span className="btn-step btn-step--inc" data-q-mobile="1" role="button" aria-label="One more">
                      <svg width="16" height="16"><use href="#i-plus" /></svg>
                    </span>
                  </div>
                </button>
                <button className="iconbtn" type="button" data-save={product.id} aria-pressed="false" aria-label={`Save ${product.name}`}>
                  <svg width="22" height="22"><use href="#i-heart" /></svg>
                </button>
              </div>
              <p className="pd__error" role="alert" data-pd-error></p>

              <ul className="perks">
                <li><svg width="20" height="20" aria-hidden="true"><use href="#i-truck" /></svg>Free shipping on orders over ₹1,500</li>
                <li><svg width="20" height="20" aria-hidden="true"><use href="#i-return" /></svg>Free returns within 60 days</li>
                <li><svg width="20" height="20" aria-hidden="true"><use href="#i-repair" /></svg>Free repairs for life</li>
              </ul>

              <div className="acc">
                <details open><summary>Description <svg width="18" height="18" aria-hidden="true"><use href="#i-chev" /></svg></summary><div className="acc__body"><p>{product.description}</p></div></details>
                <details><summary>Features <svg width="18" height="18" aria-hidden="true"><use href="#i-chev" /></svg></summary><div className="acc__body"><ul>{product.features.map((feat, idx) => <li key={idx}>{feat}</li>)}</ul></div></details>
                <details><summary>Materials &amp; weight <svg width="18" height="18" aria-hidden="true"><use href="#i-chev" /></svg></summary><div className="acc__body"><p>{product.materials}</p><p>Weight: {product.weight} (size M). SKU {product.sku}.</p></div></details>
                <details><summary>Shipping &amp; returns <svg width="18" height="18" aria-hidden="true"><use href="#i-chev" /></svg></summary><div className="acc__body"><p>Standard shipping takes 3–5 business days and is free over INR 150. Express takes 1–2 days for ₹180. Return anything unworn within 60 days, free. <a className="link" href="/help/#returns">More on returns</a></p></div></details>
              </div>
            </div>
          </article>

          <div className="buybar" data-buybar aria-hidden="true">
            <div className="buybar__txt">
              <p className="buybar__name">{product.name}</p>
              <p className="buybar__price">
                ₹{product.price.toFixed(2)}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <s style={{ color: '#8c827a', fontSize: '0.8em', marginLeft: '6px' }}>₹{product.compareAtPrice.toFixed(2)}</s>
                )}
              </p>
            </div>
            <button className="pill pill--ink" type="button" data-pd-add tabIndex={-1} disabled={isSoldOut}>
              {isSoldOut ? 'Sold out' : 'Butta lo Vey'}
            </button>
          </div>
        </div>

        <section className="related" aria-labelledby="rel-h" data-related>
          <h2 id="rel-h" data-scramble>You may also like</h2>
          <ul className="plist" data-related-list>
            {related.map(item => (
              <li key={item.id} className="prod" data-id={item.id}>
                <div className="prod__frame">
                  <a className="prod__media" href={`/product?id=${encodeURIComponent(item.id)}`} data-vt={item.id} tabIndex={-1} aria-hidden="true">
                    <img className="prod__img" src={item.img} alt={item.alt} width="800" height="1067" loading="lazy" />
                    {item.gallery[1] && <img className="prod__img prod__img--alt" src={item.gallery[1]} alt="" width="800" height="1067" loading="lazy" />}
                  </a>
                  {item.isFlashSale && (
                    <div className="prod__tags" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 3 }}>
                      <span className="tag tag--flash" style={{ background: '#b5562f', color: '#fff8f0', fontWeight: 700, fontSize: '11px', padding: '3px 10px', borderRadius: '999px' }}>
                        ⚡ Flash -{item.discountPct}%
                      </span>
                    </div>
                  )}
                  <button className="prod__heart" type="button" data-save={item.id} aria-pressed="false" aria-label={`Save ${item.name}`}>
                    <svg width="20" height="20"><use href="#i-heart" /></svg>
                  </button>
                  <button className="prod__add" type="button" data-quick-add={item.id} aria-label={`Add ${item.name} to bag`}>
                    <svg width="18" height="18" aria-hidden="true"><use href="#i-bag" /></svg>
                    <span>Butta lo Vey</span>
                  </button>
                </div>
                <div className="prod__body">
                  <h3 className="prod__name"><a href={`/product?id=${encodeURIComponent(item.id)}`}>{item.name}</a></h3>
                  <p className="prod__meta">{item.category} · {item.gender}</p>
                  <p className="prod__price">
                    <span>₹{item.price.toFixed(2)}</span>
                    {item.compareAtPrice && item.compareAtPrice > item.price && (
                      <s style={{ color: '#8c827a', fontSize: '0.85em', marginLeft: '6px' }}>₹{item.compareAtPrice.toFixed(2)}</s>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />

      <dialog className="zoom" aria-label="Product photos">
        <img className="zoom__img" src="" alt="" />
        <button className="iconbtn iconbtn--light zoom__close" type="button" data-close aria-label="Close photos">
          <svg width="20" height="20"><use href="#i-close" /></svg>
        </button>
        <button className="iconbtn iconbtn--light zoom__nav zoom__nav--prev" type="button" data-zstep="-1" aria-label="Previous photo">
          <svg width="22" height="22" style={{ transform: 'scaleX(-1)' }}><use href="#i-arrow" /></svg>
        </button>
        <button className="iconbtn iconbtn--light zoom__nav zoom__nav--next" type="button" data-zstep="1" aria-label="Next photo">
          <svg width="22" height="22"><use href="#i-arrow" /></svg>
        </button>
        <p className="zoom__count" aria-live="polite"></p>
      </dialog>

      <dialog className="sg" aria-labelledby="sg-h">
        <div className="sg__in">
          <div className="sg__head">
            <h2 id="sg-h">Size guide</h2>
            <button className="iconbtn" type="button" data-close aria-label="Close size guide">
              <svg width="20" height="20"><use href="#i-close" /></svg>
            </button>
          </div>
          <p className="field__hint">Body measurements. Between sizes? Size up for layering, down for a closer fit.</p>
          <div className="units" role="group" aria-label="Units">
            <button type="button" data-unit="cm" aria-pressed="true">cm</button>
            <button type="button" data-unit="in" aria-pressed="false">in</button>
          </div>
          <div className="table-wrap" data-size-table></div>
        </div>
      </dialog>

      <ProductClient productId={product.id} />
    </div>
  );
}
