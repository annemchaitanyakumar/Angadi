import fs from 'fs';
import path from 'path';
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, PROMO_CODES, SHIPPING_OPTIONS, PRODUCTS } from '@/lib/data';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SETTINGS_FILE = path.resolve(DATA_DIR, 'store_settings.json');

const DEFAULT_SETTINGS = {
  taxes: {
    rate: TAX_RATE || 0.08, // 8% default
    label: 'Estimated GST / Tax',
    enabled: true
  },
  shipping: {
    standard: SHIPPING_OPTIONS?.standard?.price || 8.00,
    express: SHIPPING_OPTIONS?.express?.price || 18.00,
    freeThreshold: FREE_SHIPPING_THRESHOLD || 150.00
  },
  promos: [
    { code: 'TRAIL10', pct: 10, label: '10% Trail Launch Discount', active: true, minSpend: 0 },
    { code: 'FIRSTLIGHT', pct: 15, label: '15% First Light Runners Discount', active: true, minSpend: 0 },
    { code: 'FLASH20', pct: 20, label: '20% Flash Summit Deal', active: true, minSpend: 50 }
  ],
  flashSales: {
    active: true,
    bannerText: '🔥 SUMMIT FLASH SALE: Limited Time Performance Discounts Applied!',
    items: [
      { id: 'ridgeline', discountPct: 20, label: '20% Off Ridgeline Fleece' },
      { id: 'mesa', discountPct: 15, label: '15% Off Mesa Hoodie' }
    ]
  }
};

let inMemorySettings = null;
const TMP_FILE = path.resolve('/tmp', 'store_settings.json');

function ensureSettingsFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf8');
    }
  } catch {}
}

/**
 * Read store settings with in-memory caching and disk fallback
 */
export function getStoreSettings() {
  if (inMemorySettings) return inMemorySettings;
  ensureSettingsFile();
  try {
    let raw = null;
    if (fs.existsSync(TMP_FILE)) {
      raw = fs.readFileSync(TMP_FILE, 'utf8');
    } else if (fs.existsSync(SETTINGS_FILE)) {
      raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      inMemorySettings = {
        taxes: { ...DEFAULT_SETTINGS.taxes, ...(parsed.taxes || {}) },
        shipping: { ...DEFAULT_SETTINGS.shipping, ...(parsed.shipping || {}) },
        promos: Array.isArray(parsed.promos) ? parsed.promos : DEFAULT_SETTINGS.promos,
        flashSales: { ...DEFAULT_SETTINGS.flashSales, ...(parsed.flashSales || {}) }
      };
      return inMemorySettings;
    }
  } catch (err) {
    console.warn('Error reading store_settings.json, falling back to defaults:', err);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Persist updated store settings
 */
export function updateStoreSettings(updated) {
  const current = getStoreSettings();
  const merged = {
    taxes: { ...current.taxes, ...(updated.taxes || {}) },
    shipping: { ...current.shipping, ...(updated.shipping || {}) },
    promos: Array.isArray(updated.promos) ? updated.promos : current.promos,
    flashSales: { ...current.flashSales, ...(updated.flashSales || {}) },
    updatedAt: new Date().toISOString()
  };

  inMemorySettings = merged;

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf8');
  } catch {
    try {
      fs.writeFileSync(TMP_FILE, JSON.stringify(merged, null, 2), 'utf8');
    } catch {}
  }
  return merged;
}

/**
 * Validate promo code against active promos
 */
export function validatePromo(code, subtotal = 0) {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  const settings = getStoreSettings();
  const found = (settings.promos || []).find(p => p.active && p.code.toUpperCase() === clean);

  if (!found) return null;
  if (found.minSpend && subtotal < found.minSpend) {
    return { error: `Minimum order amount of ₹${found.minSpend} required for promo ${clean}.` };
  }

  return {
    code: found.code,
    pct: found.pct,
    label: found.label
  };
}

/**
 * Get product price factoring in flash sales / discounts
 */
export function getDiscountedProductPrice(productId, basePrice) {
  const settings = getStoreSettings();
  if (!settings.flashSales?.active) return { price: basePrice, isDiscounted: false };

  const flashItem = (settings.flashSales.items || []).find(i => i.id === productId);
  if (flashItem && flashItem.discountPct > 0) {
    const discounted = Math.round(basePrice * (1 - flashItem.discountPct / 100) * 100) / 100;
    return {
      price: discounted,
      originalPrice: basePrice,
      discountPct: flashItem.discountPct,
      isDiscounted: true,
      label: flashItem.label || `${flashItem.discountPct}% OFF Flash Sale`
    };
  }

  return { price: basePrice, isDiscounted: false };
}
