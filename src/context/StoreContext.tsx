import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  CartItem,
  Coupon,
  Order,
  Customer,
  Address,
  HomepageConfig,
  MediaAsset,
  Currency,
  CurrencyConfig,
  ProductColor,
  OrderStatus,
  HandbagCategory
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_MEDIA_ASSETS,
  COLLECTIONS_DATA
} from '../data/initialData';
import {
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
  pruneLegacyStorage,
  idbGet,
  idbSet,
  saveProductsPersistently
} from '../utils/storage';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'gold';
  title: string;
  message: string;
}

const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateFromUSD: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rateFromUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rateFromUSD: 0.79 },
  INR: { code: 'INR', symbol: '₹', rateFromUSD: 83.5 },
};

interface StoreContextType {
  // Products & Collections
  products: Product[];
  collections: typeof COLLECTIONS_DATA;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  
  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, selectedColor?: ProductColor, quantity?: number) => void;
  removeFromCart: (productId: string, colorName: string) => void;
  updateCartQuantity: (productId: string, colorName: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartEstimatedDuty: number;
  cartDutyDiscount: number;
  cartTax: number;
  cartTotal: number;
  cartCount: number;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Coupons & Checkout
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;
  
  // Orders & Tracking
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courierName?: string) => void;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;
  
  // Customers
  customers: Customer[];
  activeCustomer: Customer | null;
  setActiveCustomer: (customer: Customer | null) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  addCustomerAddress: (customerId: string, address: Address) => void;
  deleteCustomerAddress: (customerId: string, addressIndex: number) => void;
  
  // Homepage & Media
  homepageConfig: HomepageConfig;
  updateHomepageConfig: (updates: Partial<HomepageConfig>) => void;
  mediaAssets: MediaAsset[];
  addMediaAsset: (asset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  deleteMediaAsset: (id: string) => void;
  
  // Currency & Formatter
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdAmount: number) => string;
  
  // Views and Navigation
  activeView: 'home' | 'shop' | 'product-detail' | 'about' | 'contact' | 'return-policy' | 'privacy-policy';
  setActiveView: (view: 'home' | 'shop' | 'product-detail' | 'about' | 'contact' | 'return-policy' | 'privacy-policy') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategoryFilter: HandbagCategory | null;
  setSelectedCategoryFilter: (cat: HandbagCategory | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateToProduct: (productId: string) => void;
  navigateToCategory: (category: HandbagCategory) => void;
  setAllProducts: (products: Product[]) => void;
  
  // UI Modals / Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  
  // Recently Viewed
  recentlyViewed: string[];
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error' | 'gold') => void;
  dismissToast: (id: string) => void;
  
  // System / Persistence
  resetToDefaultData: () => void;
  exportStoreData: () => void;
  importStoreData: (jsonData: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const [products, setProducts] = useState<Product[]>(() => {
    return safeGetItem<Product[]>('products', INITIAL_PRODUCTS);
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const parsed = safeGetItem<CartItem[]>('cart', []);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => item && item.product && item.product.id)
        .map((item) => {
          const validQuantity =
            typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0
              ? item.quantity
              : 1;
          const validColor =
            item.selectedColor && typeof item.selectedColor === 'object' && item.selectedColor.name
              ? item.selectedColor
              : item.product.colors?.[0] || { name: 'Signature', hex: '#1D1D1D' };
          return {
            product: item.product,
            selectedColor: validColor,
            quantity: validQuantity,
          };
        });
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const loaded = safeGetItem<string[]>('wishlist', []);
    if (
      Array.isArray(loaded) &&
      loaded.length === 2 &&
      loaded.includes('sb-prod-01') &&
      loaded.includes('sb-prod-02')
    ) {
      return [];
    }
    return Array.isArray(loaded) ? loaded : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    return safeGetItem<Coupon[]>('coupons', INITIAL_COUPONS);
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    return safeGetItem<Order[]>('orders', INITIAL_ORDERS);
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    return safeGetItem<Customer[]>('customers', INITIAL_CUSTOMERS);
  });

  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(INITIAL_CUSTOMERS[0] || null);

  const sanitizeHomepageConfig = (config: HomepageConfig): HomepageConfig => {
    const cleaned = { ...config };
    if (!cleaned.heroHeading || cleaned.heroHeading === 'Handcrafted Luxury Leather Handbags') {
      cleaned.heroHeading = 'Timeless Handbags. Effortless Style.';
    }
    if (cleaned.heroSubheading === 'Exclusively sculpted in Florence with uncompromised French calfskin and 24K gold hardware.') {
      cleaned.heroSubheading = '';
    }
    if (cleaned.heroBadge === 'Haute Maroquinerie • Florence Atelier') {
      cleaned.heroBadge = '';
    }
    if (!cleaned.primaryButtonText || cleaned.primaryButtonText === 'Explore Collection') {
      cleaned.primaryButtonText = 'Explore Handbags';
    }
    if (!cleaned.secondaryButtonText || cleaned.secondaryButtonText === 'View Lookbook') {
      cleaned.secondaryButtonText = 'Explore Collections';
    }
    return cleaned;
  };

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    const loaded = safeGetItem<HomepageConfig>('homepage', INITIAL_HOMEPAGE_CONFIG);
    return sanitizeHomepageConfig(loaded);
  });

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    return safeGetItem<MediaAsset[]>('media', INITIAL_MEDIA_ASSETS);
  });

  const [currency, setCurrency] = useState<Currency>('USD');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(['sb-prod-01', 'sb-prod-02', 'sb-prod-03']);

  // Navigation and UI State
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'product-detail' | 'about' | 'contact' | 'return-policy' | 'privacy-policy'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<HandbagCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hydrate all state asynchronously from IndexedDB on initial mount
  useEffect(() => {
    pruneLegacyStorage();

    const hydrateFromStorage = async () => {
      try {
        const [
          idbProducts,
          idbCart,
          idbWishlist,
          idbOrders,
          idbCoupons,
          idbHomepage,
          idbMedia,
          idbCustomers,
        ] = await Promise.all([
          idbGet<Product[]>('products'),
          idbGet<CartItem[]>('cart'),
          idbGet<string[]>('wishlist'),
          idbGet<Order[]>('orders'),
          idbGet<Coupon[]>('coupons'),
          idbGet<HomepageConfig>('homepage'),
          idbGet<MediaAsset[]>('media'),
          idbGet<Customer[]>('customers'),
        ]);

        if (Array.isArray(idbProducts) && idbProducts.length > 0) {
          setProducts(idbProducts);
        } else {
          setProducts((prev) => (prev && prev.length > 0 ? prev : INITIAL_PRODUCTS));
        }
        if (Array.isArray(idbCart)) {
          setCart(idbCart);
        }
        if (Array.isArray(idbWishlist)) {
          if (
            idbWishlist.length === 2 &&
            idbWishlist.includes('sb-prod-01') &&
            idbWishlist.includes('sb-prod-02')
          ) {
            setWishlist([]);
          } else {
            setWishlist(idbWishlist);
          }
        }
        if (Array.isArray(idbOrders)) {
          setOrders(idbOrders);
        }
        if (Array.isArray(idbCoupons)) {
          setCoupons(idbCoupons);
        }
        if (idbHomepage && typeof idbHomepage === 'object') {
          setHomepageConfig(sanitizeHomepageConfig(idbHomepage));
        }
        if (Array.isArray(idbMedia)) {
          setMediaAssets(idbMedia);
        }
        if (Array.isArray(idbCustomers)) {
          setCustomers(idbCustomers);
        }
      } catch (err) {
        console.warn('[Store] Hydration notice:', err);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrateFromStorage();
  }, []);

  const setAllProducts = (newProducts: Product[]) => {
    saveProductsPersistently(newProducts);
    setProducts(newProducts);
  };

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' | 'gold' = 'gold') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to local storage and IndexedDB only AFTER initial hydration completes
  useEffect(() => {
    if (!isHydrated) return;
    safeSetItem('products', products);
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    safeSetItem('cart', cart);
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    safeSetItem('wishlist', wishlist);
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    safeSetItem('orders', orders);
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    safeSetItem('coupons', coupons);
  }, [coupons, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    safeSetItem('homepage', homepageConfig);
  }, [homepageConfig, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    safeSetItem('media', mediaAssets);
  }, [mediaAssets, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    safeSetItem('customers', customers);
  }, [customers, isHydrated]);

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `sb-prod-${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      reviews: productData.reviews || [],
      rating: productData.rating || 5.0,
      stock: productData.stock ?? 10,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Handbag Added', `"${newProduct.title}" is now in the boutique.`, 'gold');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
    showToast('Collection Updated', 'Handbag details updated successfully.', 'info');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Handbag Removed', `"${target?.title || 'Product'}" has been deleted.`, 'info');
  };

  const duplicateProduct = (id: string) => {
    const original = products.find((p) => p.id === id);
    if (!original) return;
    const copyId = `sb-prod-${Date.now().toString(36)}`;
    const copy: Product = {
      ...original,
      id: copyId,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      sku: `${original.sku}-CPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [copy, ...prev]);
    showToast('Handbag Duplicated', `Created copy of "${original.title}".`, 'info');
  };

  // Cart Management
  const addToCart = (product: Product, selectedColor?: any, quantity: any = 1) => {
    if (!product || !product.id) return;

    let finalColor: ProductColor;
    let finalQuantity: number;

    if (typeof selectedColor === 'number') {
      finalQuantity = selectedColor;
      finalColor =
        quantity && typeof quantity === 'object' && quantity.name
          ? quantity
          : product.colors?.[0] || { name: 'Signature', hex: '#1D1D1D' };
    } else {
      finalColor =
        selectedColor && typeof selectedColor === 'object' && selectedColor.name
          ? selectedColor
          : product.colors?.[0] || { name: 'Signature', hex: '#1D1D1D' };
      finalQuantity = typeof quantity === 'number' && !isNaN(quantity) ? quantity : 1;
    }

    if (finalQuantity <= 0 || isNaN(finalQuantity)) {
      finalQuantity = 1;
    }
    
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor?.name === finalColor.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const prevQty = Number(updated[existingIndex].quantity) || 0;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: prevQty + finalQuantity,
        };
        return updated;
      } else {
        return [...prev, { product, selectedColor: finalColor, quantity: finalQuantity }];
      }
    });

    showToast('Added to Cart', `${product.title}`, 'gold');
  };

  const removeFromCart = (productId: string, colorName: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (item.selectedColor?.name === colorName || !colorName)
          )
      )
    );
    showToast('Removed from Cart', 'Item removed from cart.', 'info');
  };

  const updateCartQuantity = (productId: string, colorName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorName);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor?.name === colorName
          ? { ...item, quantity: Number(quantity) || 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = Number(item.product?.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      cartDiscount = (cartSubtotal * (Number(appliedCoupon.discountValue) || 0)) / 100;
    } else {
      cartDiscount = Math.min(cartSubtotal, Number(appliedCoupon.discountValue) || 0);
    }
  }

  const cartShipping = 0;
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartEstimatedDuty = Number((taxableAmount * 0.08).toFixed(2)) || 0;
  const cartDutyDiscount = cartEstimatedDuty;
  const cartTax = 0;
  const cartTotal = Math.max(0, taxableAmount + cartShipping + cartTax);
  const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const product = products.find((p) => p.id === productId);
      if (exists) {
        showToast('Removed from Wishlist', product?.title || 'Handbag', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', product?.title || 'Handbag', 'gold');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or inactive promotional code.' };
    }

    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount of $${found.minOrderAmount} required for this code.`,
      };
    }

    setAppliedCoupon(found);
    showToast('Promo Code Applied', `Code "${found.code}" applied successfully!`, 'gold');
    return { success: true, message: `Promo code ${found.code} applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Promotional code has been removed.', 'info');
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      usageCount: 0,
      code: couponData.code.toUpperCase(),
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast('Promo Code Created', `Code "${newCoupon.code}" is now active.`, 'gold');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Promo Code Deleted', 'Coupon removed from boutique.', 'info');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const orderNum = `SB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      trackingNumber: `SB-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courierName: 'DHL Express Worldwide',
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);

    setCustomers((prev) =>
      prev.map((c) =>
        c.email.toLowerCase() === newOrder.customer.email.toLowerCase()
          ? {
              ...c,
              totalOrders: c.totalOrders + 1,
              totalSpent: c.totalSpent + newOrder.total,
            }
          : c
      )
    );

    setProducts((prev) =>
      prev.map((p) => {
        const matchingItem = newOrder.items.find((it) => it.productId === p.id);
        if (matchingItem) {
          return { ...p, stock: Math.max(0, p.stock - matchingItem.quantity) };
        }
        return p;
      })
    );

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    courierName?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            orderStatus: status,
            paymentStatus: status === 'Refunded' ? 'Refunded' : ord.paymentStatus,
            trackingNumber: trackingNumber || ord.trackingNumber,
            courierName: courierName || ord.courierName,
          };
        }
        return ord;
      })
    );
    showToast('Order Updated', `Order status updated to ${status}.`, 'info');
  };

  const getOrderById = (query: string): Order | undefined => {
    const q = query.trim().toLowerCase();
    return orders.find(
      (o) =>
        o.id.toLowerCase() === q ||
        o.orderNumber.toLowerCase() === q ||
        o.customer.email.toLowerCase() === q ||
        o.trackingNumber?.toLowerCase() === q
    );
  };

  // Homepage Config
  const updateHomepageConfig = (updates: Partial<HomepageConfig>) => {
    setHomepageConfig((prev) => ({ ...prev, ...updates }));
    showToast('Hero Settings Saved', 'Homepage banner & content updated.', 'gold');
  };

  // Media Management
  const addMediaAsset = (asset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => {
    const newAsset: MediaAsset = {
      ...asset,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setMediaAssets((prev) => [newAsset, ...prev]);
    showToast('Media Uploaded', `Asset "${newAsset.name}" is ready to use.`, 'gold');
  };

  const deleteMediaAsset = (id: string) => {
    setMediaAssets((prev) => prev.filter((m) => m.id !== id));
    showToast('Asset Deleted', 'Media file removed from library.', 'info');
  };

  // Customer Profile & Address Management
  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
    );
    if (activeCustomer && activeCustomer.id === customerId) {
      setActiveCustomer((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Profile Updated', 'Your profile details have been saved.', 'gold');
  };

  const addCustomerAddress = (customerId: string, address: Address) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, addresses: [...c.addresses, address] } : c
      )
    );
    if (activeCustomer && activeCustomer.id === customerId) {
      setActiveCustomer((prev) =>
        prev ? { ...prev, addresses: [...prev.addresses, address] } : null
      );
    }
    showToast('Address Saved', 'New delivery address added to your profile.', 'gold');
  };

  const deleteCustomerAddress = (customerId: string, addressIndex: number) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, addresses: c.addresses.filter((_, idx) => idx !== addressIndex) }
          : c
      )
    );
    if (activeCustomer && activeCustomer.id === customerId) {
      setActiveCustomer((prev) =>
        prev
          ? {
              ...prev,
              addresses: prev.addresses.filter((_, idx) => idx !== addressIndex),
            }
          : null
      );
    }
    showToast('Address Removed', 'Delivery address removed.', 'info');
  };

  // Navigation helpers
  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  const navigateToCategory = (category: HandbagCategory) => {
    setSelectedCategoryFilter(category);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Currency Converter
  const formatPrice = (usdAmount: number): string => {
    const cfg = CURRENCY_CONFIGS[currency];
    const converted = usdAmount * cfg.rateFromUSD;
    return `${cfg.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Store Reset and Backup
  const resetToDefaultData = () => {
    pruneLegacyStorage();
    safeRemoveItem('products');
    safeRemoveItem('cart');
    safeRemoveItem('wishlist');
    safeRemoveItem('orders');
    safeRemoveItem('coupons');
    safeRemoveItem('homepage');
    safeRemoveItem('media');
    safeRemoveItem('customers');

    setProducts(INITIAL_PRODUCTS);
    setCoupons(INITIAL_COUPONS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setHomepageConfig(INITIAL_HOMEPAGE_CONFIG);
    setMediaAssets(INITIAL_MEDIA_ASSETS);
    setWishlist(['sb-prod-01', 'sb-prod-02']);
    setCart([]);
    showToast('Store Reset', 'Restored default luxury handbag collection and settings.', 'gold');
  };

  const exportStoreData = () => {
    const backup = {
      products,
      coupons,
      orders,
      customers,
      homepageConfig,
      mediaAssets,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strawbelle-store-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Store Exported', 'Downloaded complete database JSON snapshot.', 'gold');
  };

  const importStoreData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.products && Array.isArray(parsed.products)) {
        setProducts(parsed.products);
      }
      if (parsed.coupons && Array.isArray(parsed.coupons)) {
        setCoupons(parsed.coupons);
      }
      if (parsed.orders && Array.isArray(parsed.orders)) {
        setOrders(parsed.orders);
      }
      if (parsed.homepageConfig) {
        setHomepageConfig(parsed.homepageConfig);
      }
      if (parsed.mediaAssets && Array.isArray(parsed.mediaAssets)) {
        setMediaAssets(parsed.mediaAssets);
      }
      showToast('Data Restored', 'Successfully imported store data from file.', 'gold');
      return true;
    } catch (e) {
      showToast('Import Failed', 'Invalid JSON backup file provided.', 'error');
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        collections: COLLECTIONS_DATA,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartEstimatedDuty,
        cartDutyDiscount,
        cartTax,
        cartTotal,
        cartCount,

        wishlist,
        toggleWishlist,
        isInWishlist,

        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,

        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,

        customers,
        activeCustomer,
        setActiveCustomer,
        updateCustomer,
        addCustomerAddress,
        deleteCustomerAddress,

        homepageConfig,
        updateHomepageConfig,
        mediaAssets,
        addMediaAsset,
        deleteMediaAsset,

        currency,
        setCurrency,
        formatPrice,

        activeView,
        setActiveView,
        selectedProductId,
        setSelectedProductId,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        navigateToProduct,
        navigateToCategory,
        setAllProducts,

        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        isAccountOpen,
        setIsAccountOpen,

        recentlyViewed,

        toasts,
        showToast,
        dismissToast,

        resetToDefaultData,
        exportStoreData,
        importStoreData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
