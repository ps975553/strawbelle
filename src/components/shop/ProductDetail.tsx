import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Heart,
  ShoppingBag,
  ChevronRight,
  Share2,
  ArrowLeft,
  Plus,
  Minus,
  Star,
  MessageCircle,
  Instagram,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ChevronLeft,
  Scan
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { orderViaWhatsApp, orderViaInstagram } from '../../utils/socialOrder';

export const ProductDetail: React.FC = () => {
  const {
    selectedProductId,
    products,
    formatPrice,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setActiveView,
    setSelectedCategoryFilter,
    setIsCartOpen,
    showToast
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  useEffect(() => {
    setActiveImageIndex(0);
    setLightboxZoom(1);
  }, [product?.id]);

  // Handle ESC and Arrow keys in Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        const allMedia = product?.galleryImages && product.galleryImages.length > 0
          ? product.galleryImages
          : [product?.thumbnail || ''];
        setActiveImageIndex((prev) => (prev + 1) % allMedia.length);
        setLightboxZoom(1);
      } else if (e.key === 'ArrowLeft') {
        const allMedia = product?.galleryImages && product.galleryImages.length > 0
          ? product.galleryImages
          : [product?.thumbnail || ''];
        setActiveImageIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
        setLightboxZoom(1);
      }
    },
    [isLightboxOpen, product]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold">Product not found</h2>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-4 px-6 py-2.5 bg-[#1D1D1D] text-white rounded-xl text-xs uppercase tracking-wider"
        >
          Return to Handbags
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const allMedia = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.thumbnail];

  const currentMediaUrl = allMedia[activeImageIndex] || product.thumbnail;

  const handleAddToCart = () => {
    addToCart(product, undefined, quantity);
    setIsCartOpen(true);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to clipboard.', 'gold');
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#F8F5F2] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-6 uppercase tracking-wider overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveView('home')}
            className="hover:text-[#1D1D1D] transition-colors whitespace-nowrap"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
          <button
            onClick={() => {
              setSelectedCategoryFilter(null);
              setActiveView('shop');
            }}
            className="hover:text-[#1D1D1D] transition-colors whitespace-nowrap"
          >
            Creations
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
          <button
            onClick={() => {
              setSelectedCategoryFilter(product.category);
              setActiveView('shop');
            }}
            className="hover:text-[#1D1D1D] transition-colors whitespace-nowrap"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
          <span className="text-[#1D1D1D] font-bold max-w-full break-words whitespace-normal line-clamp-2 leading-snug">{product.title}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => setActiveView('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#1D1D1D] mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Handbags</span>
        </button>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-sm">
          {/* Left Column: Visual Media Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Container with Full Size / Uncropped Display */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF8F5] border border-neutral-200 group flex items-center justify-center p-2 sm:p-6">
              <img
                src={currentMediaUrl}
                alt={product.title}
                onClick={() => setIsLightboxOpen(true)}
                className={`w-full h-full cursor-zoom-in transition-all duration-300 ${
                  fitMode === 'contain' ? 'object-contain' : 'object-cover'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Badges Overlay */}
              {product.discountPercentage && product.discountPercentage > 0 ? (
                <span className="absolute top-3 left-3 bg-[#1D1D1D] text-[#C6A56B] text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-[#C6A56B] shadow-sm uppercase tracking-wider z-10">
                  -{product.discountPercentage}% OFF
                </span>
              ) : null}

              {/* View Control Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                {/* Fit Mode Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFitMode((prev) => (prev === 'contain' ? 'cover' : 'contain'));
                  }}
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-neutral-700 shadow-sm border border-neutral-200/80 backdrop-blur-sm transition-all"
                  title={fitMode === 'contain' ? 'Switch to Fill View' : 'Switch to Full Fit (Uncropped)'}
                  aria-label="Toggle image fit"
                >
                  <Scan className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1D1D1D]" />
                </button>

                {/* Full-Screen Lightbox Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-neutral-700 shadow-sm border border-neutral-200/80 backdrop-blur-sm transition-all flex items-center gap-1 text-[11px] font-semibold"
                  title="View Full Size Uncropped Photo"
                  aria-label="Expand full size"
                >
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1D1D1D]" />
                  <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-[#1D1D1D]">Full Size</span>
                </button>
              </div>

              {/* Bottom Hint */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5 whitespace-nowrap">
                <ZoomIn className="w-3 h-3" />
                <span>Click image to view full high-res photo</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {allMedia.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                  }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 bg-[#FAF8F5] p-1 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#C6A56B] shadow-sm ring-2 ring-[#C6A56B]/30'
                      : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Wishlist and Share */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C6A56B]">
                  Handcrafted Atelier
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white border border-neutral-200 hover:text-[#C6A56B] transition-colors"
                    title="Share Product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2 rounded-full bg-white border border-neutral-200 hover:text-rose-500 transition-colors"
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title & Rating */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] leading-tight break-words whitespace-normal [overflow-wrap:anywhere]">
                  {product.title}
                </h1>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex items-center text-[#C6A56B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C6A56B]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1D1D1D]">
                    {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
                  </span>
                  <span className="text-[11px] text-neutral-400">/ 5.0</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="text-[11px] font-bold text-[#C6A56B] uppercase tracking-wider bg-[#1D1D1D] px-2 py-0.5 rounded-full">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="pt-3 border-t border-neutral-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-300 rounded-xl bg-white p-1 shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-neutral-600 hover:text-[#C6A56B] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-sm px-4 text-[#1D1D1D]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                      className="p-2 text-neutral-600 hover:text-[#C6A56B] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 sm:px-6 bg-[#1D1D1D] hover:bg-[#C6A56B] text-[#F8F5F2] text-xs font-bold uppercase tracking-[0.18em] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C6A56B] group-hover:text-white transition-colors" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Direct Order Buttons: WhatsApp & Instagram */}
                <div className="pt-2 border-t border-neutral-100 space-y-2">
                  <div className="text-[11px] text-neutral-500">
                    <span className="font-medium uppercase tracking-wider text-[10px] text-neutral-400">Direct Order via Social</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Order via WhatsApp */}
                    <button
                      id="order-via-whatsapp-btn"
                      onClick={() => orderViaWhatsApp({ product, quantity, formatPrice, onToast: showToast })}
                      className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer"
                      title="Order this handbag directly via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                      <span>Order via WhatsApp</span>
                    </button>

                    {/* Order via Instagram */}
                    <button
                      id="order-via-instagram-btn"
                      onClick={() => orderViaInstagram({ product, quantity, formatPrice, onToast: showToast })}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer"
                      title="Order this handbag directly via Instagram DM"
                    >
                      <Instagram className="w-4 h-4 shrink-0" />
                      <span>Order via Instagram</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Handbags Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-300">
            <div className="text-center mb-6">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C6A56B]">
                Curated Recommendations
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1D1D1D] mt-0.5">
                You May Also Admire
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full-Size High-Resolution Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white">
              <h3 className="font-serif text-base sm:text-lg font-bold max-w-sm sm:max-w-md break-words whitespace-normal line-clamp-2 leading-snug">
                {product.title}
              </h3>
              <p className="text-xs text-neutral-400">
                Photo {activeImageIndex + 1} of {allMedia.length} • High Resolution Full Size
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLightboxZoom((prev) => Math.min(3, prev + 0.5))}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxZoom((prev) => Math.max(1, prev - 0.5))}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxZoom(1)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                title="Reset Zoom"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-all ml-2"
                title="Close (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Full-Size Image Display */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Navigation Arrow */}
            {allMedia.length > 1 && (
              <button
                onClick={() => {
                  setActiveImageIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
                  setLightboxZoom(1);
                }}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all border border-white/10 shadow-lg"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div
              className="max-w-full max-h-[80vh] flex items-center justify-center transition-transform duration-300 select-none"
              style={{ transform: `scale(${lightboxZoom})` }}
            >
              <img
                src={currentMediaUrl}
                alt={product.title}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Next Navigation Arrow */}
            {allMedia.length > 1 && (
              <button
                onClick={() => {
                  setActiveImageIndex((prev) => (prev + 1) % allMedia.length);
                  setLightboxZoom(1);
                }}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all border border-white/10 shadow-lg"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {allMedia.length > 1 && (
            <div
              className="flex justify-center gap-2 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {allMedia.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setLightboxZoom(1);
                  }}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 bg-neutral-900 transition-all p-0.5 ${
                    activeImageIndex === idx
                      ? 'border-[#C6A56B] ring-2 ring-[#C6A56B]/50 scale-105'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
