import { Product, ProductColor, HandbagCategory, ProductReview } from '../types';

/**
 * High-Performance Handbag Product Parser & Normalizer
 * Capable of handling massive catalogs (50+ products, 100MB+ JSON or TypeScript payloads)
 */

const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85';

const DEFAULT_COLORS: ProductColor[] = [
  { name: 'Noir Onyx', hex: '#1C1C1C' },
  { name: 'Tuscan Cognac', hex: '#8B4513' },
  { name: 'Chantilly Crème', hex: '#F5F2EB' },
];

/**
 * Fast bracket extraction without regex memory leaks
 */
function extractBalancedArray(str: string, startIndex: number): string | null {
  const openBracket = str.indexOf('[', startIndex);
  if (openBracket === -1) return null;

  let depth = 0;
  let inString = false;
  let quoteChar = '';

  const len = str.length;
  for (let i = openBracket; i < len; i++) {
    const char = str[i];
    const prevChar = i > 0 ? str[i - 1] : '';

    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        quoteChar = char;
      } else if (quoteChar === char) {
        inString = false;
        quoteChar = '';
      }
      continue;
    }

    if (inString) continue;

    if (char === '[') {
      depth++;
    } else if (char === ']') {
      depth--;
      if (depth === 0) {
        return str.substring(openBracket, i + 1);
      }
    }
  }

  return null;
}

/**
 * Relaxed parser with direct fast paths
 */
function parseRelaxedJson(rawText: string): any {
  // 1. Direct JSON parse (fastest for 100MB JSON)
  try {
    return JSON.parse(rawText);
  } catch {
    // Proceed to extraction
  }

  // 2. Clean comments
  const clean = rawText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '');

  try {
    const noTrailingCommas = clean.replace(/,\s*([\]}])/g, '$1');
    return JSON.parse(noTrailingCommas);
  } catch {
    // Continue
  }

  // 3. Convert single quotes and unquoted keys
  try {
    const sanitized = clean
      .replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":')
      .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"')
      .replace(/,\s*([\]}])/g, '$1');

    return JSON.parse(sanitized);
  } catch {
    // 4. Safe Function execution fallback
    try {
      const fn = new Function(`"use strict"; return (${clean});`);
      return fn();
    } catch (e: any) {
      throw new Error(`Invalid JSON / TypeScript object syntax: ${e?.message || 'Check format'}`);
    }
  }
}

/**
 * Normalize Category to exact HandbagCategory type
 */
export function normalizeCategory(rawCat: any): HandbagCategory {
  if (!rawCat || typeof rawCat !== 'string') return 'Top-Handle';
  const c = rawCat.toLowerCase().trim();

  if (c.includes('tote')) return 'Totes';
  if (c.includes('crossbody') || c.includes('cross-body')) return 'Crossbody';
  if (c.includes('shoulder')) return 'Shoulder Bags';
  if (c.includes('clutch')) return 'Clutches';
  if (c.includes('top-handle') || c.includes('top handle') || c.includes('tophandle')) return 'Top-Handle';
  if (c.includes('mini') || c.includes('pochette')) return 'Mini Bags';
  if (c.includes('backpack')) return 'Backpacks';

  return 'Top-Handle';
}

/**
 * Normalize Dimensions object
 */
export function normalizeDimensions(rawDim: any): { widthCm: number; heightCm: number; depthCm: number; strapDropCm: number } {
  if (rawDim && typeof rawDim === 'object') {
    return {
      widthCm: typeof rawDim.widthCm === 'number' ? rawDim.widthCm : 28,
      heightCm: typeof rawDim.heightCm === 'number' ? rawDim.heightCm : 20,
      depthCm: typeof rawDim.depthCm === 'number' ? rawDim.depthCm : 12,
      strapDropCm: typeof rawDim.strapDropCm === 'number' ? rawDim.strapDropCm : 55,
    };
  }

  if (typeof rawDim === 'string') {
    const nums = rawDim.match(/\d+(\.\d+)?/g);
    if (nums && nums.length >= 3) {
      return {
        widthCm: parseFloat(nums[0]) || 28,
        heightCm: parseFloat(nums[1]) || 20,
        depthCm: parseFloat(nums[2]) || 12,
        strapDropCm: nums[3] ? parseFloat(nums[3]) : 55,
      };
    }
  }

  return { widthCm: 28, heightCm: 20, depthCm: 12, strapDropCm: 55 };
}

/**
 * Main parse function for imported text
 */
export function parseProductData(inputText: string): { products: Product[]; error?: string } {
  if (!inputText || !inputText.trim()) {
    return { products: [], error: 'Input is empty. Please provide JSON or TypeScript data.' };
  }

  const raw = inputText.trim();
  let extractedString = raw;

  // Check if standard JSON directly
  let parsed: any = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // If not standard JSON, check for TypeScript keyword variables
    const keywordMatches = [
      'INITIAL_PRODUCTS',
      'products',
      'PRODUCTS',
      'export const INITIAL_PRODUCTS',
    ];

    for (const keyword of keywordMatches) {
      const idx = raw.indexOf(keyword);
      if (idx !== -1) {
        const arrayPart = extractBalancedArray(raw, idx);
        if (arrayPart) {
          extractedString = arrayPart;
          break;
        }
      }
    }

    if (extractedString === raw && !raw.startsWith('[') && !raw.startsWith('{')) {
      const firstBracket = raw.indexOf('[');
      if (firstBracket !== -1) {
        const balanced = extractBalancedArray(raw, firstBracket);
        if (balanced) {
          extractedString = balanced;
        }
      }
    }

    try {
      parsed = parseRelaxedJson(extractedString);
    } catch (err: any) {
      return { products: [], error: err.message || 'Syntax error in JSON/TypeScript input.' };
    }
  }

  // Resolve array from parsed container
  let rawList: any[] = [];
  if (Array.isArray(parsed)) {
    rawList = parsed;
  } else if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.products)) {
      rawList = parsed.products;
    } else if (Array.isArray(parsed.INITIAL_PRODUCTS)) {
      rawList = parsed.INITIAL_PRODUCTS;
    } else if (Array.isArray(parsed.items)) {
      rawList = parsed.items;
    } else if (Array.isArray(parsed.data)) {
      rawList = parsed.data;
    } else if (parsed.title || parsed.name || parsed.price) {
      rawList = [parsed];
    } else {
      return { products: [], error: 'Could not find a products array inside the provided data.' };
    }
  } else {
    return { products: [], error: 'Parsed data is neither an array nor a product object.' };
  }

  if (rawList.length === 0) {
    return { products: [], error: 'The provided data contains 0 products.' };
  }

  const now = new Date().toISOString();
  const normalizedProducts: Product[] = [];

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item || typeof item !== 'object') continue;

    const title = String(item.title || item.name || `Handbag Model ${i + 1}`).trim();
    const id = String(
      item.id ||
        `sb-prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}-${i + 1}`
    );
    const slug =
      item.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') ||
      `handbag-${id}`;

    const price = typeof item.price === 'number' && !isNaN(item.price) && item.price >= 0 ? item.price : 1200;
    const oldPrice = typeof item.oldPrice === 'number' ? item.oldPrice : undefined;
    const discountPercentage =
      typeof item.discountPercentage === 'number'
        ? item.discountPercentage
        : oldPrice && oldPrice > price
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : undefined;

    const thumbnail =
      typeof item.thumbnail === 'string' && item.thumbnail.trim()
        ? item.thumbnail.trim()
        : typeof item.image === 'string' && item.image.trim()
        ? item.image.trim()
        : DEFAULT_THUMBNAIL;

    let galleryImages: string[] = [];
    if (Array.isArray(item.galleryImages) && item.galleryImages.length > 0) {
      galleryImages = item.galleryImages.filter((img: any) => typeof img === 'string' && img.trim());
    }
    if (galleryImages.length === 0) {
      galleryImages = [thumbnail];
    }

    let colors: ProductColor[] = [];
    if (Array.isArray(item.colors) && item.colors.length > 0) {
      colors = item.colors
        .filter((c: any) => c && (typeof c === 'object' || typeof c === 'string'))
        .map((c: any) => {
          if (typeof c === 'string') {
            return { name: c, hex: '#1C1C1C' };
          }
          return {
            name: String(c.name || 'Signature'),
            hex: String(c.hex || '#1C1C1C'),
          };
        });
    }
    if (colors.length === 0) {
      colors = DEFAULT_COLORS;
    }

    const category = normalizeCategory(item.category);
    const status: 'published' | 'draft' = item.status === 'draft' ? 'draft' : 'published';

    let details: string[] = [];
    if (Array.isArray(item.details)) {
      details = item.details.map((d: any) => String(d)).filter(Boolean);
    }
    if (details.length === 0) {
      details = [
        '100% Full-grain French calfskin leather',
        '24K Gold-plated artisan hardware',
        'Supple Italian lambskin interior lining',
        'Handcrafted in Florence, Italy atelier',
      ];
    }

    const dimensions = normalizeDimensions(item.dimensions);
    const weightGrams = typeof item.weightGrams === 'number' ? item.weightGrams : 850;
    const reviews: ProductReview[] = Array.isArray(item.reviews) ? item.reviews : [];

    const product: Product = {
      id,
      title,
      slug,
      sku: String(item.sku || `SB-${Math.floor(1000 + Math.random() * 9000)}`),
      collection: String(item.collection || 'Heritage Classique'),
      category,
      price,
      oldPrice,
      discountPercentage,
      thumbnail,
      galleryImages,
      colors,
      description: String(
        item.description ||
          `${title} represents the pinnacle of luxury maroquinerie, sculpted by master Florentine artisans.`
      ),
      details,
      material: String(item.material || 'Full-Grain French Calfskin Leather'),
      lining: String(item.lining || 'Supple Italian Lambskin Nappa'),
      hardware: String(item.hardware || '24K Gold-Plated Solid Brass'),
      dimensions,
      weightGrams,
      stock: typeof item.stock === 'number' && !isNaN(item.stock) ? item.stock : 12,
      rating: typeof item.rating === 'number' && !isNaN(item.rating) ? item.rating : 5.0,
      reviewsCount: typeof item.reviewsCount === 'number' ? item.reviewsCount : reviews.length || 8,
      featured: typeof item.featured === 'boolean' ? item.featured : false,
      bestSeller: typeof item.bestSeller === 'boolean' ? item.bestSeller : false,
      isNewArrival: typeof item.isNewArrival === 'boolean' ? item.isNewArrival : false,
      status,
      createdAt: item.createdAt || now,
      updatedAt: now,
      reviews,
    };

    normalizedProducts.push(product);
  }

  if (normalizedProducts.length === 0) {
    return { products: [], error: 'No valid handbag products could be normalized from the input.' };
  }

  return { products: normalizedProducts };
}

/**
 * Generator for a curated luxury catalog of 50 distinct handcrafted handbags
 */
export function generate50LuxuryBags(): Product[] {
  const categories: HandbagCategory[] = [
    'Top-Handle',
    'Totes',
    'Crossbody',
    'Shoulder Bags',
    'Clutches',
    'Mini Bags',
    'Backpacks',
  ];

  const collections = [
    'Heritage Classique',
    'Riviera Solaire',
    'Nocturne Étoile',
    'Monogramme Atelier',
    'Palais Royale',
    'Tuscan Equestrian',
  ];

  const bagNames = [
    'The Aurelia Top-Handle',
    'The Bellagio Grande Weekender',
    'The Céleste Diamond Crossbody',
    'The Dauphine Saffiano Structured',
    'The Élysée Soft Hobo',
    'The Florenza Flap Satchel',
    'The Genevieve Evening Minaudière',
    'The Hermosa Woven Cabas',
    'The Imperia Micro Vanity',
    'The Juliette Saddle Bag',
    'The Kensington Trapeze Tote',
    'The Laurentine Envelope Clutch',
    'The Mirabelle Bucket Bag',
    'The Noémie Pouch with Chain',
    'The Ophelia Box Bag',
    'The Penelope Crescent Shoulder',
    'The Quintana Geometric Frame',
    'The Riviera Raffia Summer Tote',
    'The Sorbonne City Backpack',
    'The Tivoli Accordion Crossbody',
    'The Umbria Suede Doctor Bag',
    'The Vivienne Lock Satchel',
    'The Willow Structured Briefcase',
    'The Xenia Sculptural Minaudière',
    'The Yasmin Bamboo Handle Bag',
    'The Zephyr Ultra-Lightweight Tote',
    'The Allegra Duo-Tone Flap',
    'The Brigitte Trapezoid Handbag',
    'The Camille Ruched Leather Bag',
    'The Delphine Quilted Camera Bag',
    'The Estelle Pleated Pouch',
    'The Fiorella Studded Bucket',
    'The Giselle Croc-Embossed Tote',
    'The Helene Minimalist Sling',
    'The Ines Envelope Crossbody',
    'The Josephine Regal Top-Handle',
    'The Katia Soft Calfskin Hobo',
    'The Luciana Foldover Clutch',
    'The Marguerite Floral Embossed Bag',
    'The Nadia Modern Satchel',
    'The Odette Pearl-Accented Clutch',
    'The Paloma Textured Shopper',
    'The Rosalia Heritage Doctor Bag',
    'The Simone Architectural Tote',
    'The Thalia Metallic Evening Bag',
    'The Ursula Structured Crossbody',
    'The Valentina Heart-Padlock Bag',
    'The Wendy Leather Backpack',
    'The Yvette Slim Pochette',
    'The Zara Artisan Weave Satchel',
  ];

  const curatedImages = [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
  ];

  const colorPalettes: ProductColor[][] = [
    [
      { name: 'Noir Onyx', hex: '#1C1C1C' },
      { name: 'Tuscan Cognac', hex: '#8B4513' },
      { name: 'Chantilly Crème', hex: '#F5F2EB' },
    ],
    [
      { name: 'Bordeaux Rouge', hex: '#631524' },
      { name: 'Emerald Vert', hex: '#1A4D3E' },
      { name: 'Midnight Marine', hex: '#1B263B' },
    ],
    [
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Cashmere Beige', hex: '#E6D7C3' },
      { name: 'Rose Poudré', hex: '#D8A49B' },
    ],
    [
      { name: 'Espresso Brun', hex: '#3E2723' },
      { name: 'Olive Toscane', hex: '#556B2F' },
      { name: 'Saddle Tan', hex: '#C19A6B' },
    ],
  ];

  const materials = [
    'Full-Grain French Box Calfskin',
    'Hand-Buffed Tuscan Saddle Leather',
    'Supple Italian Clemence Bullcalf',
    'Textured Epsom Grain Calfskin',
    'Hand-Polished Crocodile-Embossed Leather',
    'Silk-Touch Italian Nappa Leather',
    'Water-Resistant Coated Monogram Canvas & Leather',
  ];

  const now = new Date().toISOString();
  const products: Product[] = [];

  for (let i = 0; i < 50; i++) {
    const title = bagNames[i] || `Strawbelle Edition No. ${i + 1}`;
    const id = `sb-prod-${String(i + 1).padStart(2, '0')}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = categories[i % categories.length];
    const collection = collections[i % collections.length];
    const img1 = curatedImages[i % curatedImages.length];
    const img2 = curatedImages[(i + 1) % curatedImages.length];
    const img3 = curatedImages[(i + 2) % curatedImages.length];
    const palette = colorPalettes[i % colorPalettes.length];
    const basePrice = 850 + (i * 75) % 3200;
    const hasDiscount = i % 4 === 0;
    const oldPrice = hasDiscount ? Math.round(basePrice * 1.2) : undefined;
    const discountPercentage = hasDiscount ? 15 : undefined;
    const material = materials[i % materials.length];

    products.push({
      id,
      title,
      slug,
      sku: `SB-${2000 + i}`,
      collection,
      category,
      price: basePrice,
      oldPrice,
      discountPercentage,
      thumbnail: img1,
      galleryImages: [img1, img2, img3],
      colors: palette,
      description: `The ${title} is meticulously crafted in our Florentine atelier from ${material.toLowerCase()}, featuring polished brass hardware and artisan saddle stitching.`,
      details: [
        `Crafted from 100% ${material}`,
        'Hand-finished Italian edge paint & saddle stitching',
        '24K Gold-plated solid brass architectural hardware',
        'Supple Italian lambskin interior with slip pockets',
        'Accompanied by silk dust bag and certificate of authenticity',
      ],
      material,
      lining: 'Supple Italian Lambskin Nappa',
      hardware: i % 2 === 0 ? '24K Gold Plated Solid Brass' : 'Palladium-Plated Solid Brass',
      dimensions: {
        widthCm: 24 + (i % 15),
        heightCm: 18 + (i % 12),
        depthCm: 10 + (i % 8),
        strapDropCm: 50 + (i % 15),
      },
      weightGrams: 700 + (i * 15) % 600,
      stock: 5 + (i % 20),
      rating: +(4.7 + ((i * 3) % 4) * 0.1).toFixed(1),
      reviewsCount: 6 + (i * 3) % 45,
      featured: i < 8 || i % 6 === 0,
      bestSeller: i % 3 === 0,
      isNewArrival: i > 35,
      status: 'published',
      createdAt: now,
      updatedAt: now,
      reviews: [
        {
          id: `rev-${i}-1`,
          author: 'Éléonore de Valois',
          rating: 5,
          date: '2026-06-12',
          comment: `The leather quality and hand-burnished edges of this bag are unrivaled. It arrived in exquisite packaging.`,
          verified: true,
          location: 'Paris, France',
        },
      ],
    });
  }

  return products;
}
