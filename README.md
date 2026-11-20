# ANGADI — Trail & Outdoor Running Apparel

Next.js (App Router) e-commerce storefront for **ANGADI** — technical trail-running and mountain layers built for the long way out.

---

## 🚀 Getting Started

### 1. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 2. Build for Production

```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
d:\Projects\Solum\
├── app/
│   ├── layout.jsx               # Root layout (Google Fonts, Metadata, Providers, Minibar, Footer)
│   ├── page.jsx                 # Home page (Scrub film hero, Top picks, Pack, New arrivals, Lookbook)
│   ├── shop/page.jsx            # Shop catalog (Filtering by fit, category, terrain, search & sort)
│   ├── product/page.jsx         # Product detail (Galleries, color preview, size picker, specs)
│   ├── cart/page.jsx            # Bag / Cart (Shipping threshold meter, line items, promo codes)
│   ├── checkout/page.jsx        # Multi-step checkout with mock validation & order placement
│   ├── order/page.jsx           # Order tracking view with timeline and delivery carrier status
│   ├── account/page.jsx         # Customer profile, order history, and saved wishlist items
│   ├── about/page.jsx           # Brand story, lifetime repairs guarantee, circular sustainability
│   ├── help/page.jsx            # Customer care, shipping policies, returns, sizing charts
│   └── admin/page.jsx           # Store admin back-office dashboard (KPIs, orders, inventory)
│
├── components/
│   ├── Header.jsx               # Navigation bar with ANGADI logo, menu links, bag trigger
│   ├── Minibar.jsx              # Compact sticky bar sliding in during scroll
│   ├── CartDrawer.jsx           # Slide-out interactive cart drawer
│   ├── MobileMenu.jsx           # Slide-out mobile navigation drawer
│   ├── Footer.jsx               # Big statement footer, newsletter, company links
│   ├── Ticker.jsx               # Store promises ticker marquee
│   ├── Toast.jsx                # Toast notification system
│   └── Icons.jsx                # SVG symbols sprite sheet
│
├── context/
│   └── StoreContext.jsx         # React Context for bag, wishlist, promo codes & order state
│
├── lib/
│   └── data.js                  # Product catalog, lookbook outfits, sizes, promo codes
│
├── styles/
│   ├── shell.css                # Global theme variables, animations & layout styles
│   ├── pages.css                # Page-specific components & hero film styles
│   └── admin.css                # Back-office admin styles
│
└── public/
    ├── photos/158-solum/        # Product, lookbook, and campaign photography
    ├── video/158-solum/         # Scroll-scrub film & campaign video
    ├── textures/grain.png       # Film grain overlay
    └── favicon.*                # App icons
```

---

## ✨ Features

- **Next.js 15 App Router & React 19:** Fully componentized, SEO-optimized with static prerendering.
- **Brand Identity:** Renamed from SOLUM to **ANGADI** with custom logo badge, branding copy, and Colorado trail ethos.
- **Cleaned Codebase:** Removed Code and Chill preview bridge, iframe listeners, and "Buy this template" floating pill.
- **Scroll-Controlled Video Hero:** Interactive frame-scrubbing hero film that synchronizes with viewport scroll position.
- **Live Cart & Wishlist System:** Persistent client-side cart and wishlist stored in `localStorage` under `angadi:*`.
- **E-Commerce Workflows:** Catalog filtering, product detail configuration, checkout simulator, and shipment lookup.
- **Admin Dashboard:** Order management table with live status updates, inventory counts across XS–XL sizes, and revenue metrics.
