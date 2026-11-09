import type { HandbagCategory, Product, ProductColor } from '../types';

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const parseDimensions = (value: unknown): Product['dimensions'] => {
  if (value && typeof value === 'object') {
    const dimensions = value as Record<string, unknown>;
    return {
      widthCm: asNumber(dimensions.widthCm),
      heightCm: asNumber(dimensions.heightCm),
      depthCm: asNumber(dimensions.depthCm),
      strapDropCm: asNumber(dimensions.strapDropCm),
    };
  }

  const text = typeof value === 'string' ? value : '';
  const read = (axis: string): number => {
    const match = new RegExp(`(?:${axis})\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)`, 'i').exec(text);
    return match ? Number(match[1]) : 0;
  };

  return {
    widthCm: read('W(?:idth)?'),
    heightCm: read('H(?:eight)?'),
    depthCm: read('D(?:epth)?'),
    strapDropCm: read('strap(?:\\s*drop)?'),
  };
};

const categoryFromCollection = (collection: string): HandbagCategory => {
  const name = collection.toLowerCase();
  if (name.includes('crossbody')) return 'Crossbody';
  if (name.includes('tote')) return 'Totes';
  if (name.includes('shoulder')) return 'Shoulder Bags';
  if (name.includes('clutch')) return 'Clutches';
  if (name.includes('top-handle') || name.includes('top handle')) return 'Top-Handle';
  if (name.includes('backpack')) return 'Backpacks';
  if (name.includes('mini')) return 'Mini Bags';
  return 'Handbag';
};

export const mapHandbagCatalog = (catalog: unknown): Product[] => {
  if (!Array.isArray(catalog)) return [];

  return catalog.flatMap((entry, index): Product[] => {
    if (!entry || typeof entry !== 'object') return [];

    const item = entry as Record<string, unknown>;
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const thumbnail = typeof item.thumbnail === 'string' ? item.thumbnail : '';
    if (!title || !thumbnail) return [];

    const slug = typeof item.slug === 'string' && item.slug.trim()
      ? item.slug.trim()
      : slugify(title) || `handbag-${index + 1}`;
    const sourceId = typeof item.id === 'string' && item.id.trim()
      ? item.id.trim()
      : `handbag-${slug}-${index + 1}`;
    const collection = typeof item.collection === 'string' && item.collection.trim()
      ? item.collection.trim()
      : 'Handbag';
    const galleryImages = Array.isArray(item.galleryImages)
      ? item.galleryImages.filter((image): image is string => typeof image === 'string' && image.length > 0)
      : [];
    const colors: ProductColor[] = Array.isArray(item.availableColors)
      ? item.availableColors.flatMap((color): ProductColor[] => {
          if (!color || typeof color !== 'object') return [];
          const availableColor = color as Record<string, unknown>;
          const name = typeof availableColor.name === 'string' ? availableColor.name.trim() : '';
          if (!name) return [];
          return [{
            name,
            hex: typeof availableColor.hex === 'string' ? availableColor.hex : '#C6A56B',
            ...(typeof availableColor.image === 'string' ? { image: availableColor.image } : {}),
          }];
        })
      : [];
    const createdAt = typeof item.createdAt === 'string' ? item.createdAt : '2026-11-09T00:00:00.000Z';
    const details = Array.isArray(item.details)
      ? item.details.filter((detail): detail is string => typeof detail === 'string')
      : [];

    return [{
      id: sourceId,
      title,
      slug,
      sku: typeof item.sku === 'string' && item.sku.trim()
        ? item.sku.trim()
        : `SB-HANDBAG-${sourceId.toUpperCase()}`,
      collection,
      category: categoryFromCollection(collection),
      price: asNumber(item.price),
      oldPrice: typeof item.oldPrice === 'number' ? item.oldPrice : undefined,
      discountPercentage: typeof item.discount === 'number' ? item.discount : undefined,
      // Keep the catalog image data exactly as provided; no resizing or re-encoding.
      thumbnail,
      galleryImages: galleryImages.length > 0 ? galleryImages : [thumbnail],
      colors: colors.length > 0 ? colors : [{ name: 'Standard', hex: '#C6A56B' }],
      description: typeof item.description === 'string' ? item.description : '',
      details,
      material: typeof item.material === 'string' ? item.material : 'Handbag',
      lining: typeof item.lining === 'string' ? item.lining : 'N/A',
      hardware: typeof item.hardware === 'string' ? item.hardware : 'N/A',
      dimensions: parseDimensions(item.dimensions),
      weightGrams: asNumber(item.weightGrams),
      stock: asNumber(item.stock),
      rating: asNumber(item.rating),
      reviewsCount: asNumber(item.reviewCount),
      featured: item.featured === true,
      bestSeller: item.bestSeller === true,
      isNewArrival: item.isNewArrival === true,
      status: item.status === 'draft' ? 'draft' : 'published',
      createdAt,
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : createdAt,
      reviews: [],
    }];
  });
};
