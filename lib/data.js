const makeStock = (xs, s, m, l, xl) => ({ XS: xs, S: s, M: m, L: l, XL: xl });

export const PRODUCTS = [
  {
    id: 'ridgeline',
    sku: 'AG-JK-101',
    name: 'Ridgeline Hooded Fleece',
    price: 128,
    gender: 'Men',
    terrain: 'Desert',
    category: 'Fleece & Hoodies',
    color: { name: 'Charcoal', hex: '#3a3b38' },
    img: '/photos/158-solum/new-1.jpg',
    gallery: [
      '/photos/158-solum/new-1.jpg',
      '/photos/158-solum/detail-ridgeline.jpg'
    ],
    alt: 'Runner on a red-rock trail in a charcoal hooded fleece',
    blurb: 'A grid fleece that breathes on the climb and holds warmth at the top.',
    description: 'Ridgeline is the layer you forget you are wearing until the wind turns. A brushed grid fleece traps warm air in the channels and dumps heat through the thin walls between them, so it stays comfortable from a cold start to the summit push.',
    features: [
      'Grid fleece that breathes when you work hard',
      'Scuba hood that stays put under a shell',
      'Zipped chest pocket sized for a phone',
      'Thumb loops and a dropped back hem'
    ],
    materials: '92% recycled polyester, 8% elastane. Bluesign approved.',
    weight: '310 g',
    rating: 4.8,
    reviews: 214,
    stock: makeStock(4, 12, 18, 9, 3),
    isNew: true,
    createdAt: '2026-09-02'
  },
  {
    id: 'mesa',
    sku: 'AG-HD-102',
    name: 'Mesa Oversized Hoodie',
    price: 96,
    gender: 'Women',
    terrain: 'Desert',
    category: 'Fleece & Hoodies',
    color: { name: 'Clay rose', hex: '#c58a78' },
    img: '/photos/158-solum/new-2.jpg',
    gallery: [
      '/photos/158-solum/new-2.jpg',
      '/photos/158-solum/detail-mesa.jpg'
    ],
    alt: 'Runner in a clay-pink hoodie beside a dirt bike in the desert',
    blurb: 'Heavyweight loopback for camp, the drive home and every cold morning.',
    description: 'Mesa is cut wide and dropped at the shoulder, in a heavy loopback cotton that softens with every wash. It is the hoodie for the hour after the run, when the sun is down and the stove is on.',
    features: [
      '420 gsm organic loopback cotton',
      'Double-layer hood',
      'Kangaroo pocket with a hidden key loop',
      'Garment-dyed for a lived-in colour'
    ],
    materials: '100% organic cotton. Garment dyed.',
    weight: '640 g',
    rating: 4.7,
    reviews: 168,
    stock: makeStock(6, 10, 2, 0, 5),
    isNew: true,
    createdAt: '2026-09-10'
  },
  {
    id: 'pinefall',
    sku: 'AG-JK-103',
    name: 'Pinefall Storm Shell',
    price: 214,
    gender: 'Men',
    terrain: 'Forest',
    category: 'Jackets',
    color: { name: 'Moss', hex: '#4a5a44' },
    img: '/photos/158-solum/new-3.jpg',
    gallery: [
      '/photos/158-solum/new-3.jpg',
      '/photos/158-solum/detail-pinefall.jpg'
    ],
    alt: 'Runner in a moss-green shell in a misty pine forest',
    blurb: 'A three-layer waterproof that packs into its own chest pocket.',
    description: 'Pinefall is the shell for the day the forecast was wrong. A three-layer membrane keeps sustained rain out while letting sweat escape, and the whole jacket stuffs into its chest pocket when the sky clears.',
    features: [
      '20,000 mm waterproof, 20,000 g breathable',
      'Fully taped seams',
      'Packs into its own chest pocket',
      'Adjustable hood with a laminated brim'
    ],
    materials: '3L recycled nylon with a PFC-free DWR finish.',
    weight: '265 g',
    rating: 4.9,
    reviews: 302,
    stock: makeStock(3, 8, 14, 11, 6),
    isNew: true,
    createdAt: '2026-08-21'
  },
  {
    id: 'hollow',
    sku: 'AG-VS-104',
    name: 'Hollow Quilted Vest',
    price: 142,
    gender: 'Women',
    terrain: 'Forest',
    category: 'Vests & Packs',
    color: { name: 'Bone', hex: '#e6dfd2' },
    img: '/photos/158-solum/new-4.jpg',
    gallery: [
      '/photos/158-solum/new-4.jpg',
      '/photos/158-solum/detail-hollow.jpg'
    ],
    alt: 'Runner in a bone-white quilted vest in a pine forest',
    blurb: 'Synthetic insulation that keeps your core warm and your arms free.',
    description: 'Hollow puts warmth where it counts and nowhere else. Synthetic fill stays warm when damp, and the slim baffles sit flat under a shell or over a base layer for cold starts.',
    features: [
      '60 g recycled synthetic fill',
      'Warm when wet',
      'Two zipped hand pockets',
      'Packs into its own pocket'
    ],
    materials: 'Shell: 100% recycled nylon. Fill: 100% recycled polyester.',
    weight: '220 g',
    rating: 4.6,
    reviews: 97,
    stock: makeStock(5, 9, 7, 4, 1),
    isNew: true,
    createdAt: '2026-09-14'
  },
  {
    id: 'scree',
    sku: 'AG-JK-105',
    name: 'Scree Windbreaker',
    price: 158,
    gender: 'Men',
    terrain: 'Alpine',
    category: 'Jackets',
    color: { name: 'Sand', hex: '#cdb894' },
    img: '/photos/158-solum/new-5.jpg',
    gallery: [
      '/photos/158-solum/new-5.jpg',
      '/photos/158-solum/detail-scree.jpg'
    ],
    alt: 'Runner in a sand windbreaker on alpine scree',
    blurb: 'A 90-gram wind shell for ridgelines and fast descents.',
    description: 'Scree blocks the wind that strips heat on an exposed ridge, then disappears into a pocket the size of a fist. The ripstop face shrugs off light showers and scrapes against rock.',
    features: [
      'Weighs 90 g',
      'Ripstop face with a DWR finish',
      'Laser-cut vents across the back',
      'Reflective trims for early starts'
    ],
    materials: '100% recycled nylon ripstop.',
    weight: '90 g',
    rating: 4.7,
    reviews: 156,
    stock: makeStock(2, 6, 10, 8, 4),
    isNew: true,
    createdAt: '2026-09-18'
  },
  {
    id: 'col',
    sku: 'AG-JK-106',
    name: 'Col Puffer Jacket',
    price: 236,
    compareAt: 268,
    gender: 'Women',
    terrain: 'Alpine',
    category: 'Jackets',
    color: { name: 'Charcoal', hex: '#34352f' },
    img: '/photos/158-solum/new-6.jpg',
    gallery: [
      '/photos/158-solum/new-6.jpg',
      '/photos/158-solum/detail-col.jpg'
    ],
    alt: 'Runner in a charcoal puffer below a rocky ridge',
    blurb: 'Responsibly sourced down for alpine starts and summit waits.',
    description: 'Col is the warm layer for standing still in the cold: summit waits, aid stations, belays. 800-fill down is boxed into narrow baffles so the warmth stays even, and a stretch hood fits under a helmet.',
    features: [
      '800-fill RDS-certified down',
      'Box-wall baffles across the core',
      'Helmet-compatible stretch hood',
      'Two-way front zip'
    ],
    materials: 'Shell: recycled nylon. Fill: 800-fill RDS down.',
    weight: '380 g',
    rating: 4.9,
    reviews: 241,
    stock: makeStock(3, 5, 0, 2, 2),
    isNew: true,
    createdAt: '2026-09-25'
  },
  {
    id: 'underpass',
    sku: 'AG-TP-107',
    name: 'Underpass Half-Zip',
    price: 88,
    gender: 'Men',
    terrain: 'City',
    category: 'Tops',
    color: { name: 'Stone', hex: '#8f8b82' },
    img: '/photos/158-solum/new-7.jpg',
    gallery: [
      '/photos/158-solum/new-7.jpg',
      '/photos/158-solum/detail-underpass.jpg'
    ],
    alt: 'Runner in a stone-grey half-zip under a concrete underpass',
    blurb: 'A midweight half-zip for city loops and cool evening runs.',
    description: 'Underpass is a midweight knit with a brushed back, cut slim so it rides under a shell without bunching. The deep zip vents fast when the pace picks up.',
    features: [
      'Brushed-back midweight knit',
      'Deep 30 cm zip for venting',
      'Flatlock seams that never chafe',
      'Odour control that lasts'
    ],
    materials: '88% recycled polyester, 12% elastane.',
    weight: '240 g',
    rating: 4.5,
    reviews: 88,
    stock: makeStock(8, 14, 20, 16, 9),
    isNew: true,
    createdAt: '2026-10-01'
  },
  {
    id: 'drift',
    sku: 'AG-JK-108',
    name: 'Drift Camo Anorak',
    price: 174,
    gender: 'Women',
    terrain: 'City',
    category: 'Jackets',
    color: { name: 'Olive camo', hex: '#6b6a4a' },
    img: '/photos/158-solum/new-8.jpg',
    gallery: [
      '/photos/158-solum/new-8.jpg',
      '/photos/158-solum/detail-drift.jpg'
    ],
    alt: 'Runner in an olive camo anorak under a concrete underpass',
    blurb: 'A pullover anorak with a kangaroo pocket that fits a whole day.',
    description: 'Drift is an overhead anorak in a soft, quiet woven that resists wind and light rain. The big kangaroo pocket holds gloves, a buff and a snack, and side zips make it easy to pull on over a pack strap.',
    features: [
      'Wind- and shower-resistant woven',
      'Kangaroo pocket with a storm flap',
      'Side zips for easy on and off',
      'Adjustable hem and cuffs'
    ],
    materials: '100% recycled polyester with a PFC-free DWR.',
    weight: '330 g',
    rating: 4.6,
    reviews: 74,
    stock: makeStock(4, 7, 9, 3, 0),
    isNew: true,
    createdAt: '2026-10-06'
  },
  {
    id: 'butte',
    sku: 'AG-JK-109',
    name: 'Butte Anorak',
    price: 186,
    gender: 'Men',
    terrain: 'Alpine',
    category: 'Jackets',
    color: { name: 'Olive', hex: '#5c6145' },
    img: '/photos/158-solum/pick-1.jpg',
    gallery: [
      '/photos/158-solum/pick-1.jpg',
      '/photos/158-solum/detail-butte.jpg'
    ],
    alt: 'Runner from behind in an olive anorak with a sand sling pack',
    blurb: 'Our top pick: a technical anorak with room for a pack strap.',
    description: 'Butte is the anorak our team wears most. Articulated sleeves, a cut that clears a pack strap, and a two-way hood that cinches down in a headwind.',
    features: [
      'Stretch woven that moves with you',
      'Two-way adjustable hood',
      'Pit zips for venting',
      'Pack-strap friendly cut'
    ],
    materials: '94% recycled nylon, 6% elastane.',
    weight: '290 g',
    rating: 4.8,
    reviews: 189,
    stock: makeStock(2, 6, 11, 8, 5),
    isNew: false,
    createdAt: '2026-06-12'
  },
  {
    id: 'talus',
    sku: 'AG-JK-110',
    name: 'Talus Half-Zip Shell',
    price: 198,
    gender: 'Women',
    terrain: 'Alpine',
    category: 'Jackets',
    color: { name: 'Graphite', hex: '#3d3e3c' },
    img: '/photos/158-solum/pick-2.jpg',
    gallery: [
      '/photos/158-solum/pick-2.jpg',
      '/photos/158-solum/detail-talus.jpg'
    ],
    alt: 'Runner in a graphite half-zip shell with a clay zip pull',
    blurb: 'New for harder weather: a light shell with a clay zip pull.',
    description: 'Talus is a half-zip waterproof built for runners who hate rustle. A soft two-and-a-half-layer face keeps weather out quietly, and reflective trims light up in headlamp beams.',
    features: [
      '2.5L waterproof, quiet face fabric',
      'Half zip with a clay pull',
      'Reflective trims front and back',
      'Elastic cuffs'
    ],
    materials: '2.5L recycled nylon, PFC-free DWR.',
    weight: '210 g',
    rating: 4.7,
    reviews: 133,
    stock: makeStock(5, 8, 12, 6, 3),
    isNew: false,
    createdAt: '2026-07-03'
  },
  {
    id: 'arroyo',
    sku: 'AG-VS-111',
    name: 'Arroyo Running Vest 8L',
    price: 132,
    gender: 'Men',
    terrain: 'Desert',
    category: 'Vests & Packs',
    color: { name: 'Clay', hex: '#b5562f' },
    img: '/photos/158-solum/trail-left.jpg',
    gallery: [
      '/photos/158-solum/trail-left.jpg',
      '/photos/158-solum/detail-arroyo.jpg'
    ],
    alt: 'Hands tightening the straps of a clay-orange running vest',
    blurb: 'An 8-litre vest that carries a long day without a bounce.',
    description: 'Arroyo hugs the body like a shirt and holds a long day of kit: two soft flasks up front, a shell and food behind, poles on the side. Twin sternum straps slide to fit any chest.',
    features: [
      '8 L capacity',
      'Two 500 ml soft flasks included',
      'Sliding twin sternum straps',
      'Pole carry on both sides'
    ],
    materials: 'Stretch mesh body, recycled nylon pockets.',
    weight: '240 g',
    rating: 4.8,
    reviews: 121,
    stock: { S: 6, M: 9, L: 4 },
    isNew: false,
    createdAt: '2026-05-20'
  },
  {
    id: 'cairn',
    sku: 'AG-AC-112',
    name: 'Cairn Liner Gloves',
    price: 38,
    gender: 'Women',
    terrain: 'Forest',
    category: 'Accessories',
    color: { name: 'Black', hex: '#1f201e' },
    img: '/photos/158-solum/trail-right.jpg',
    gallery: [
      '/photos/158-solum/trail-right.jpg',
      '/photos/158-solum/detail-cairn.jpg'
    ],
    alt: 'A gloved hand resting on charcoal trail shorts',
    blurb: 'Thin, warm and touchscreen-ready for cold starts.',
    description: 'Cairn is a thin merino-blend liner for the first cold mile. Conductive fingertips work your watch and phone, and a silicone palm keeps a grip on poles.',
    features: [
      'Merino-blend knit',
      'Touchscreen fingertips',
      'Silicone grip palm',
      'Fits under a shell mitt'
    ],
    materials: '55% merino wool, 40% nylon, 5% elastane.',
    weight: '40 g',
    rating: 4.5,
    reviews: 62,
    stock: { S: 12, M: 20, L: 15 },
    isNew: false,
    createdAt: '2026-04-28'
  }
];

export const LOOKS = [
  {
    id: 'look-1',
    title: 'Tech tee &\nbase layer',
    items: 'Trail pant\nTrail shoe',
    price: 312,
    img: '/photos/158-solum/look-1.webp',
    alt: 'Look 1: clay tech tee over a white base layer with charcoal trail pants'
  },
  {
    id: 'look-2',
    title: 'Thermal\nlong-sleeve',
    items: 'Run tight\nSoft flask',
    price: 246,
    img: '/photos/158-solum/look-2.webp',
    alt: 'Look 2: black thermal long-sleeve, black tights and a moss cap'
  },
  {
    id: 'look-3',
    title: 'Hoodie &\nchest sling',
    items: 'Cargo jogger\nTrucker cap',
    price: 289,
    img: '/photos/158-solum/look-3.webp',
    alt: 'Look 3: black hoodie with a chest sling and clay-red cargo joggers'
  }
];

export const PROMO_CODES = {
  TRAIL10: 10,
  FIRSTLIGHT: 15
};

export const SHIPPING_OPTIONS = {
  standard: { label: 'Standard', days: '3–5 business days', price: 8 },
  express: { label: 'Express', days: '1–2 business days', price: 18 }
};

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 150;

export const SIZE_CHART = {
  XS: ['84–88', '70–74', '86–90'],
  S: ['89–94', '75–80', '91–96'],
  M: ['95–100', '81–86', '97–102'],
  L: ['101–107', '87–93', '103–108'],
  XL: ['108–114', '94–100', '109–114']
};

export function formatPrice(num) {
  return `₹${Number(num).toFixed(2)}`;
}
