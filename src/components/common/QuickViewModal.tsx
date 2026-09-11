import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Heart,
  ArrowRight,
  Star,
  MessageCircle,
  Instagram,
  Maximize2
} from 'lucide-react';
import { orderViaWhatsApp, orderViaInstagram } from '../../utils/socialOrder';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    formatPrice,
    addToCart,
    isInWishlist,
    toggleWishlist,
    navigateToProduct,
    showToast
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, undefined, quantity);
  };

  const handleViewFullProduct = () => {
    navigateToProduct(quickViewProduct.id);
    setQuickViewProduct(null);
  };

  const isLiked = isInWishlist(quickViewProduct.id);
  const allMedia = [quickViewProduct.thumbnail, ...quickViewProduct.galleryImages];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#F8F5F2] rounded-3xl w-full max-w-4xl shadow-2xl border border-[#C6A56B]/30 overflow-hidden my-auto relative">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-neutral-700 shadow-md backdrop-blur-sm transition-colors"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Gallery Preview - Uncropped Full Size Stage */}
          <div className="space-y-4">
            <div className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] relative border border-neutral-200 flex items-center justify-center p-3 sm:p-4">
              <img
                src={allMedia[activeImageIndex] || quickViewProduct.thumbnail}
                alt={quickViewProduct.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {quickViewProduct.discountPercentage && quickViewProduct.discountPercentage > 0 ? (
                <span className="absolute top-3 left-3 bg-[#1D1D1D] text-[#C6A56B] text-xs font-bold px-2.5 py-1 rounded-full border border-[#C6A56B]">
                  -{quickViewProduct.discountPercentage}% OFF
                </span>
              ) : null}

              <button
                onClick={handleViewFullProduct}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-neutral-700 shadow-sm border border-neutral-200/80 backdrop-blur-sm transition-all flex items-center gap-1 text-[11px] font-semibold"
                title="View in High-Res Studio"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#1D1D1D]" />
                <span className="text-[10px] uppercase tracking-wider text-[#1D1D1D]">Full View</span>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {allMedia.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImageIndex(i);
                  }}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 bg-[#FAF8F5] p-1 transition-all ${
                    activeImageIndex === i
                      ? 'border-[#C6A56B] shadow-md ring-2 ring-[#C6A56B]/30'
                      : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Action */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C6A56B]">
                  Handcrafted Edition
                </span>
                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors"
                  title="Toggle wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                </button>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1D1D1D] mt-1">
                {quickViewProduct.title}
              </h2>

              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex text-[#C6A56B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1D1D1D]">
                  {quickViewProduct.rating ? Number(quickViewProduct.rating).toFixed(1) : '5.0'}
                </span>
                <span className="text-[10px] text-neutral-400">/ 5.0</span>
              </div>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-serif text-2xl font-bold text-[#1D1D1D]">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.oldPrice && quickViewProduct.oldPrice > quickViewProduct.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(quickViewProduct.oldPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-neutral-200">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 bg-[#1D1D1D] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-[#C6A56B]" />
                <span>Add to Cart</span>
              </button>

              {/* Social Order Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="quickview-order-whatsapp"
                  onClick={() =>
                    orderViaWhatsApp({
                      product: quickViewProduct,
                      quantity,
                      formatPrice,
                      onToast: showToast
                    })
                  }
                  className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  title="Order via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>WhatsApp</span>
                </button>

                <button
                  id="quickview-order-instagram"
                  onClick={() =>
                    orderViaInstagram({
                      product: quickViewProduct,
                      quantity,
                      formatPrice,
                      onToast: showToast
                    })
                  }
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-95 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  title="Order via Instagram"
                >
                  <Instagram className="w-3.5 h-3.5 shrink-0" />
                  <span>Instagram</span>
                </button>
              </div>

              <button
                onClick={handleViewFullProduct}
                className="w-full py-2 text-center text-xs text-neutral-600 hover:text-[#1D1D1D] font-medium flex items-center justify-center gap-1 group pt-1"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
