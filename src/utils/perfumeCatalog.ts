import type { Product } from '../types';

type CatalogCategory = 'Women Perfume' | 'Ladies Watch';

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
      colors: [{ name: 'Standard', hex: '#C6A56B' }],
      description: typeof item.description === 'string' ? item.description : '',
      details: [],
      material: config.material,
      lining: 'N/A',
      hardware: 'N/A',
      dimensions: { widthCm: 0, heightCm: 0, depthCm: 0, strapDropCm: 0 },
      weightGrams: 0,
      stock: typeof item.stock === 'number' && Number.isFinite(item.stock) ? item.stock : 0,
      rating: 0,
      reviewsCount: 0,
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
