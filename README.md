# ANGADI — Trail & Outdoor Running Apparel

Next.js 15 (App Router) e-commerce storefront for **ANGADI** — technical trail-running and mountain layers built for the long way out.

---

## 🚀 Getting Started

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Local Production Build

```bash
npm run build
npm start
```

---

## 🌐 Universal Deployment Guide

This project is pre-configured with native configuration files, production Dockerfiles, and health check endpoints for **all major deployment platforms**.

---

### 1. Vercel (Recommended for Serverless / Edge)

- **Config:** [vercel.json](file:///d:/Projects/Solum/vercel.json)
- **Deployment:**
  - Push your repo to GitHub/GitLab/Bitbucket.
  - Import the repository in [Vercel](https://vercel.com/new).
  - Framework Preset: **Next.js** (detected automatically).
  - Click **Deploy**.

---

### 2. Netlify

- **Config:** [netlify.toml](file:///d:/Projects/Solum/netlify.toml)
- **Deployment:**
  - Push your repo to Git.
  - Connect to [Netlify](https://app.netlify.com/).
  - Build command: `npm run build`
  - Publish directory: `.next`
  - Netlify automatically utilizes the included `@netlify/plugin-nextjs`.

---

### 3. Docker / Self-Hosted (AWS ECS, Google Cloud Run, Azure Container Apps, VPS, Kubernetes)

- **Config:** [Dockerfile](file:///d:/Projects/Solum/Dockerfile) & [docker-compose.yml](file:///d:/Projects/Solum/docker-compose.yml)
- Utilizes Next.js multi-stage `output: 'standalone'` build for a lightweight image (~120MB) and non-root security.

**Run with Docker Compose:**
```bash
docker compose up -d --build
```

**Build & Run with Docker CLI:**
```bash
docker build -t angadi-storefront .
docker run -d -p 3000:3000 --name angadi angadi-storefront
```

---

### 4. Render

- **Config:** [render.yaml](file:///d:/Projects/Solum/render.yaml)
- **Deployment:**
  - In [Render Dashboard](https://dashboard.render.com/), select **New** > **Blueprint**.
  - Connect repository; Render reads `render.yaml` automatically with health checks on `/api/health`.

---

### 5. Railway

- **Config:** [railway.json](file:///d:/Projects/Solum/railway.json)
- **Deployment:**
  - In [Railway](https://railway.app/), create a **New Project** > **Deploy from GitHub repo**.
  - Railway detects the configuration and deploys with automatic restart policies.

---

### 6. Fly.io

- **Config:** [fly.toml](file:///d:/Projects/Solum/fly.toml)
- **Deployment:**
  ```bash
  fly launch
  fly deploy
  ```

---

### 7. Google Cloud Run

Deploy directly from source or container:

```bash
gcloud run deploy angadi-storefront \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

---

### 8. AWS App Runner / AWS Amplify

- **AWS App Runner:** Connect GitHub repository, select **Node.js 20** or use the included **Dockerfile**, specify port `3000` and health check `/api/health`.
- **AWS Amplify Hosting:** Connect repo, Amplify automatically detects Next.js SSR.

---

### 9. Linux VPS / Bare Metal with PM2 & Nginx

- **Config:** [ecosystem.config.js](file:///d:/Projects/Solum/ecosystem.config.js)

```bash
# On your server
git clone <repo-url> /var/www/angadi
cd /var/www/angadi
npm ci
npm run build

# Start cluster with PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Nginx Reverse Proxy Block:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🩺 Health Check & Monitoring

A dedicated health check endpoint is available at:
- **`GET /api/health`**
- Returns `{ "status": "ok", "service": "angadi-storefront", "timestamp": "..." }` with HTTP `200`.
- Integrated into Docker, AWS ALB target groups, Cloud Run, Kubernetes liveness probes, and uptime monitors.

---

## 🗂️ Project Structure

```
d:\Projects\Solum\
├── app/
│   ├── api/health/route.js      # Health check endpoint for container probes & load balancers
│   ├── layout.jsx               # Root layout (Google Fonts, SEO, SVG sprites, Bag/Menu drawers)
│   ├── page.jsx                 # Landing page (Scroll-scrub video, Picks, Pack, Arrivals, Lookbook)
│   ├── shop/page.jsx            # Shop catalog (Real-time category, gender & terrain filters)
│   ├── product/page.jsx         # Detail view (Interactive gallery, color previews, stock size picker)
│   ├── cart/page.jsx            # Bag (Free shipping threshold meter, quantity controls, promo codes)
│   ├── checkout/page.jsx        # Multi-step checkout simulator with order placement
│   ├── order/page.jsx           # Shipment lookup & 4-step delivery progress tracking
│   ├── account/page.jsx         # Runner account & saved wishlist
│   ├── about/page.jsx           # Brand narrative, lifetime repairs guarantee, circular sustainability
│   ├── help/page.jsx            # Customer care, shipping options, 60-day returns, sizing chart
│   └── admin/page.jsx           # Back-office dashboard (Orders management, inventory levels, revenue)
│
├── components/                  # Header, Minibar, CartDrawer, MobileMenu, Footer, Ticker, Toast, Icons
├── context/                     # Persistent StoreContext (localStorage bag & orders)
├── lib/                         # Product catalog, lookbook outfits, sizes, promo codes
├── styles/                      # Production CSS modules (shell.css, pages.css, admin.css)
├── public/                      # Static media (photos, videos, textures, favicons)
│
├── Dockerfile                   # Multi-stage production container build (Alpine Linux, non-root user)
├── docker-compose.yml           # Local & VPS container orchestration
├── vercel.json                  # Vercel configuration
├── netlify.toml                 # Netlify configuration
├── render.yaml                  # Render Blueprint definition
├── railway.json                 # Railway platform configuration
├── fly.toml                     # Fly.io configuration
├── Procfile                     # Heroku / Dokku / Platform.sh process file
├── ecosystem.config.js          # PM2 cluster configuration for VPS
├── next.config.mjs              # Standalone output, security headers, cache policies & rewrites
└── .env.example                 # Environment variable templates
```
