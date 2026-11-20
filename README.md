# SOLUM — Trail & Outdoor Running Apparel

Exact replica of the **SOLUM** storefront demo ([https://demo.codeandchill.store/solum/](https://demo.codeandchill.store/solum/)).

Built for high performance with vanilla TypeScript/JavaScript, CSS, GSAP, Lenis smooth scroll, responsive design, and mock e-commerce state.

---

## 🚀 Quick Start

Run the included local development server (supports streaming video, HTTP range requests, and `/solum/` route matching):

```bash
npm start
```
or:
```bash
node server.js
```

Then open your browser at:
- **[http://localhost:3000/](http://localhost:3000/)** (or [http://localhost:3000/solum/](http://localhost:3000/solum/))

---

## 🗂️ Project Structure

```
d:\Projects\Solum\
├── index.html                   # Home page with scroll film & interactive sections
├── package.json                 # Project configuration and start scripts
├── server.js                    # Zero-dependency HTTP server with byte-range streaming
├── README.md                    # Documentation
│
├── shop\index.html              # Full catalog with filtering, sorting, & grid view
├── product\index.html           # Single product detail view, color/size selection
├── cart\index.html              # Shopping bag / cart view
├── checkout\index.html          # Multi-step checkout process
├── order\index.html             # Order tracking page
├── account\index.html           # Customer account & sign-in
├── about\index.html             # Brand story, repairs, sustainability
├── help\index.html              # FAQs, shipping, returns, sizing guide
├── admin\index.html             # Store admin back-office dashboard
│
├── assets\                      # Compiled JavaScript & CSS bundles
│   ├── home-*.js                # Home page scripts & animations
│   ├── store-*.js               # State management, mock product catalog & cart
│   ├── shell-*.js & *.css       # Global layout, navigation, drawer, dialogs
│   ├── pages-*.css              # Page-specific styling
│   ├── admin-*.js & *.css       # Admin panel functionality & styles
│   └── ...                      # Flip animations, common helpers, page modules
│
├── photos\158-solum\            # High-resolution product & editorial photography
│   ├── hero-model.webp          # Hero section model portrait
│   ├── hero-scrub-poster.jpg    # Video poster preview
│   ├── new-1.jpg .. new-8.jpg   # New arrivals products
│   ├── detail-*.jpg             # High-detail gallery closeups for each product
│   ├── pick-1.jpg, pick-2.jpg   # Top seasonal picks
│   ├── look-1.webp .. 3.webp    # Seasonal lookbook outfit images
│   ├── trail-*.jpg              # Trail cluster campaign images
│   ├── avatar-*.jpg             # Customer review avatars
│   └── group.jpg                # Pack campaign visual
│
├── video\158-solum\             # Video assets
│   ├── hero-scrub.mp4           # Interactive scroll-scrubbed hero film
│   └── hero-clip.mp4            # Lightbox full trail campaign film
│
├── textures\                    # Visual textures
│   └── grain.png                # Film grain overlay
│
├── solum\                       # Base-path mirror ensuring direct compatibility
└── favicon.*                    # App icons & touch icons
```

---

## ✨ Features Included

1. **Interactive Hero Film:**
   - Scroll-driven frame scrub video (`hero-scrub.mp4`) that expands smoothly to fill the screen as you scroll.
   - Lightbox modal with full sound video playback (`hero-clip.mp4`).

2. **Full E-Commerce Catalog & Navigation:**
   - **Shop:** Real-time filtering by category (Jackets, Fleece, Vests, Pants, Accessories), gender (Men, Women), terrain (Desert, Forest, Alpine, City), and sorting.
   - **Product Detail:** Dynamic image galleries, color swatches with live hex previews, size picker, and instant "Add to Bag".
   - **Interactive Bag Drawer:** Side-drawer cart with free shipping progress bar, quantity toggles, and total calculation.
   - **Checkout & Order Tracking:** Realistic checkout workflow with mock validation and order status lookup.
   - **Account & Sign In:** Customer profile and order history views.

3. **Admin Dashboard:**
   - Accessible via `/admin/` (or footer link).
   - Order management, product inventory table, customer list, and operational metrics.

4. **Animations & Polish:**
   - Text scrambler on section headers.
   - View transitions between pages.
   - Blinds / curtain reveal effect on editorial photography.
   - Dynamic micro-interactions, responsive mobile menu drawer, and film grain texture.
