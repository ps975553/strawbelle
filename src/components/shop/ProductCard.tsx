import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Heart, ShoppingBag, Star, MessageCircle, Instagram } from 'lucide-react';
import { orderViaWhatsApp, orderViaInstagram } from '../../utils/socialOrder';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    isInWishlist,
    toggleWishlist,
    navigateToProduct,
    showToast
  } = useStore();

  const isLiked = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, undefined, 1);
  };

  const handleOrderWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    orderViaWhatsApp({
      product,
      quantity: 1,
      formatPrice,
      onToast: showToast
    });
  };

  const handleOrderInstagram = (e: React.MouseEvent) => {
    e.stopPropagation();
    orderViaInstagram({
      product,
      quantity: 1,
      formatPrice,
      onToast: showToast
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigateToProduct(product.id)}
      className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border border-neutral-200/80 hover:border-[#C6A56B]/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Visual Frame */}
        <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-[#FAF8F5] relative flex items-center justify-center p-2 sm:p-2.5">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Badges Overlay */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10 pointer-events-none">
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <span className="bg-[#1D1D1D] text-[#C6A56B] text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-[#C6A56B] shadow-sm uppercase tracking-wider">
                -{product.discountPercentage}%
              </span>
            ) : null}
            {product.bestSeller && (
              <span className="bg-[#C6A56B] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
                Best Seller
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-white/95 text-[#1D1D1D] text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-sm uppercase tracking-wider border border-neutral-200">
                New
              </span>
            )}
          </div>

          {/* Floating Wishlist Action */}
          <div className="absolute top-1.5 right-1.5 z-10">
            <button
              onClick={handleToggleWishlist}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm ${
                isLiked
                  ? 'bg-white text-rose-500 shadow-md'
                  : 'bg-white/80 text-neutral-600 hover:text-rose-500 hover:bg-white'
              }`}
              title="Save to Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Desktop Hover Quick Actions */}
          <div className="absolute bottom-1.5 inset-x-1.5 hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-10">
            <button
              onClick={handleQuickAdd}
              className="flex-1 py-1.5 bg-[#1D1D1D]/95 backdrop-blur-md hover:bg-[#C6A56B] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md"
            >
              <ShoppingBag className="w-3 h-3 text-[#C6A56B] group-hover:text-white" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleOrderWhatsApp}
              className="py-1.5 px-2 bg-[#25D366]/95 backdrop-blur-md hover:bg-[#25D366] text-white text-[10px] font-bold rounded-lg transition-all shadow-md flex items-center justify-center"
              title="Order via WhatsApp"
            >
              <MessageCircle className="w-3 h-3 fill-current" />
            </button>
            <button
              onClick={handleOrderInstagram}
              className="py-1.5 px-2 bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] backdrop-blur-md hover:opacity-95 text-white text-[10px] font-bold rounded-lg transition-all shadow-md flex items-center justify-center"
              title="Order via Instagram"
            >
              <Instagram className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] text-[#C6A56B]">
              Handcrafted
            </span>
            <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] text-neutral-600 font-semibold">
              <Star className="w-2.5 h-2.5 text-[#C6A56B] fill-[#C6A56B]" />
              <span>{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
            </div>
          </div>

          <h3 className="font-serif text-xs sm:text-sm font-semibold text-[#1D1D1D] group-hover:text-[#C6A56B] transition-colors line-clamp-1">
            {product.title}
          </h3>
        </div>
      </div>

      {/* Pricing & Mobile-Optimized Add to Cart */}
      <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
        <div className="min-w-0">
          <span className="font-serif text-xs sm:text-sm font-bold text-[#1D1D1D] truncate block">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-[9px] sm:text-[10px] text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Compact Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Social Buttons on Mobile */}
          <button
            onClick={handleOrderWhatsApp}
            className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
            title="Order via WhatsApp"
            aria-label="Order via WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
          </button>
          
          {/* Mobile & Tablet Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#1D1D1D] hover:bg-[#C6A56B] active:scale-95 text-white transition-all shadow-sm"
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-3 h-3 text-[#C6A56B]" />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
              + Cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
