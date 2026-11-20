import { PRODUCTS } from '@/lib/data';
import ProductClient from './ProductClient';

function getRelated(product) {
  if (!product) return [];
  const others = PRODUCTS.filter(p => p.id !== product.id);
  const score = t => (t.category === product.category ? 2 : 0) + (t.terrain === product.terrain ? 1 : 0) + (t.gender === product.gender ? 0.5 : 0);
  return others.sort((a, b) => score(b) - score(a) || b.rating - a.rating).slice(0, 4);
}

export default async function ProductPage({ searchParams }) {
  const resolved = await searchParams;
  const id = resolved?.id || 'ridgeline';
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const related = getRelated(product);
  const stockKeys = Object.keys(product.stock);
  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
  const isSoldOut = totalStock === 0;
  const starsRatio = (product.rating / 5).toFixed(3);
  const starIcons = '<svg width="16" height="16"><use href="#i-star"/></svg>'.repeat(5);

  return (
    <div className="page page--product">
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
              <p className="eyebrow">{product.category} · {product.gender}</p>
              <h1 className="pd__title" data-pd-title>{product.name}</h1>
              <p className="pd__rating">
                <span className="stars" style={{ '--r': starsRatio }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: `${starIcons}<span class="stars__fill">${starIcons}</span>` }}></span>
                <span>{product.rating.toFixed(1)} · {product.reviews} reviews</span>
              </p>
              <p className="pd__price"><span>₹{product.price.toFixed(2)}</span></p>
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
              <p className="buybar__price">₹{product.price.toFixed(2)}</p>
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
                  <p className="prod__price">₹{item.price.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer" id="footer">
        <p className="footer__big" data-scramble>See you<br />out there</p>
        <div className="footer__cols">
          <form className="join" noValidate>
            <label className="join__label" htmlFor="join-email">First access to every drop</label>
            <div className="join__row">
              <input id="join-email" name="email" type="email" autoComplete="email" placeholder="you@trailmail.com" required />
              <button className="pill pill--clay" type="submit">Join</button>
            </div>
            <p className="join__msg" role="status" aria-live="polite"></p>
          </form>
          <nav className="footer__links" aria-label="Footer">
            <div>
              <h3>Dukanam</h3>
              <a href="/shop/">Dukanam</a>
              <a href="/shop/?category=Jackets">Jackets</a>
              <a href="/#look">Lookbook</a>
            </div>
            <div>
              <h3>Sahayam</h3>
              <a href="/help/#shipping">Shipping</a>
              <a href="/help/#returns">Returns</a>
              <a href="/help/#sizes">Size guide</a>
              <a href="/help/#contact">Contact</a>
            </div>
            <div>
              <h3>Company</h3>
              <a href="/about/">Maa Gurinchi</a>
              <a href="/about/#repairs">Repairs</a>
              <a href="/account/">Account</a>
              <a href="/admin/">Store admin</a>
            </div>
          </nav>
        </div>
        <div className="footer__base">
          <span>© 2026 ANGADI Outdoor</span>
          <span>Free returns within 60 days</span>
          <a href="#top">Back to top</a>
        </div>
      </footer>

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
