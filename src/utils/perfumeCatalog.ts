import type { Product, ProductColor } from '../types';

type CatalogCategory = 'Women Perfume' | 'Ladies Watch' | 'Ladies Sunglasses' | 'Luxury Scarves';

type CatalogConfig = {
  category: CatalogCategory;
  idPrefix: string;
  skuPrefix: string;
  collectionFallback: string;
  material: string;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const mapCatalog = (catalog: unknown, config: CatalogConfig): Product[] => {
  if (!Array.isArray(catalog)) return [];

  return catalog.flatMap((entry, index): Product[] => {
    if (!entry || typeof entry !== 'object') return [];

    const item = entry as Record<string, unknown>;
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const thumbnail = typeof item.thumbnail === 'string' ? item.thumbnail : '';
    if (!title || !thumbnail) return [];

    const slug = slugify(title) || `${config.idPrefix}-${index + 1}`;
    const galleryImages = Array.isArray(item.galleryImages)
      ? item.galleryImages.filter((image): image is string => typeof image === 'string' && image.length > 0)
      : [];
    const keepsCatalogColors = config.category === 'Ladies Sunglasses' || config.category === 'Luxury Scarves';
    const colors: ProductColor[] = keepsCatalogColors && Array.isArray(item.availableColors)
      ? item.availableColors.flatMap((color): ProductColor[] => {
          if (!color || typeof color !== 'object') return [];
          const availableColor = color as Record<string, unknown>;
          const name = typeof availableColor.name === 'string' ? availableColor.name.trim() : '';
          if (!name) return [];
          return [{
            name,
            hex: typeof availableColor.hex === 'string' ? availableColor.hex : '#C6A56B',
          }];
        })
      : [{ name: 'Standard', hex: '#C6A56B' }];
    const createdAt = typeof item.createdAt === 'string' ? item.createdAt : '2026-11-07T00:00:00.000Z';

    return [{
      id: `${config.idPrefix}-${slug}-${index + 1}`,
      title,
      slug: `${slug}-${index + 1}`,
      sku: `${config.skuPrefix}-${String(index + 1).padStart(3, '0')}`,
      collection: typeof item.collection === 'string' ? item.collection : config.collectionFallback,
      category: config.category,
      price: typeof item.price === 'number' && Number.isFinite(item.price) ? item.price : 0,
      oldPrice: typeof item.oldPrice === 'number' ? item.oldPrice : undefined,
      discountPercentage: typeof item.discount === 'number' ? item.discount : undefined,
      thumbnail,
      galleryImages: galleryImages.length > 0 ? galleryImages : [thumbnail],
      colors: colors.length > 0 ? colors : [{ name: 'Standard', hex: '#C6A56B' }],
      description: typeof item.description === 'string' ? item.description : '',
      details: [],
      material: keepsCatalogColors && typeof item.material === 'string'
        ? item.material
        : config.material,
      lining: 'N/A',
      hardware: 'N/A',
      dimensions: { widthCm: 0, heightCm: 0, depthCm: 0, strapDropCm: 0 },
      weightGrams: 0,
      stock: typeof item.stock === 'number' && Number.isFinite(item.stock) ? item.stock : 0,
      rating: keepsCatalogColors && typeof item.rating === 'number' ? item.rating : 0,
      reviewsCount: keepsCatalogColors && typeof item.reviewCount === 'number' ? item.reviewCount : 0,
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

export const mapWomenPerfumeCatalog = (catalog: unknown): Product[] =>
  mapCatalog(catalog, {
    category: 'Women Perfume',
    idPrefix: 'perfume',
    skuPrefix: 'SB-PERFUME',
    collectionFallback: 'Perfume For Women',
    material: "Women's fragrance",
  });

export const mapLadyWatchCatalog = (catalog: unknown): Product[] =>
  mapCatalog(catalog, {
    category: 'Ladies Watch',
    idPrefix: 'watch',
    skuPrefix: 'SB-WATCH',
    collectionFallback: 'Ladies Watch',
    material: 'Watch',
  }).map((product) => ({ ...product, collection: 'Ladies Watch' }));

export const mapLadiesSunglassesCatalog = (catalog: unknown): Product[] =>
  mapCatalog(catalog, {
    category: 'Ladies Sunglasses',
    idPrefix: 'sunglasses',
    skuPrefix: 'SB-SUNGLASSES',
    collectionFallback: 'Ladies Sunglasses',
    material: 'Sunglasses',
  });

export const mapLuxuryScarvesCatalog = (catalog: unknown): Product[] =>
  mapCatalog(catalog, {
    category: 'Luxury Scarves',
    idPrefix: 'scarf',
    skuPrefix: 'SB-SCARF',
    collectionFallback: 'Luxury Scarves',
    material: 'Luxury scarf',
  });
