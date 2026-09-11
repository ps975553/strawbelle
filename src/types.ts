export type HandbagCategory =
  | 'Totes'
  | 'Crossbody'
  | 'Shoulder Bags'
  | 'Clutches'
  | 'Top-Handle'
  | 'Mini Bags'
  | 'Backpacks';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  location?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  collection: string;
  category: HandbagCategory;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  thumbnail: string;
  galleryImages: string[];
  colors: ProductColor[];
  description: string;
  details: string[];
  material: string;
  lining: string;
  hardware: string;
  dimensions: {
    widthCm: number;
    heightCm: number;
    depthCm: number;
    strapDropCm: number;
  };
  weightGrams: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  bestSeller: boolean;
  isNewArrival: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  selectedColor?: ProductColor;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  isActive: boolean;
  usageCount: number;
  description?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'In Production' | 'Dispatched' | 'Delivered' | 'Cancelled' | 'Refunded';

export type PaymentMethod = 'WhatsApp' | 'Instagram' | 'Credit Card' | 'Wire Transfer' | 'Apple Pay';

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productThumbnail: string;
  selectedColor: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending Concierge' | 'Refunded';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
  tier: 'Boutique Client' | 'VIP Circle' | 'Haute Privilege';
  joinedDate: string;
}

export interface HomepageConfig {
  heroHeading: string;
  heroSubheading: string;
  heroBadge: string;
  heroImageUrl: string;
  heroVideoUrl?: string;
  heroType: 'image' | 'video';
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  sizeBytes: number;
  uploadedAt: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rateFromUSD: number;
}
