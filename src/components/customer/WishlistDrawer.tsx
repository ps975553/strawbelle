import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, X, ShoppingBag, Trash2, ArrowRight, MessageCircle, Instagram } from 'lucide-react';
import { orderViaWhatsApp, orderViaInstagram } from '../../utils/socialOrder';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    formatPrice,
    navigateToProduct,
    setActiveView,
    showToast
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToBag = (product: any) => {
    addToCart(product);
  };

  const handleProductClick = (id: string) => {
    navigateToProduct(id);
    setIsWishlistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F5F2] shadow-2xl flex flex-col justify-between border-l border-[#C6A56B]/30 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 bg-white border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="font-serif text-lg font-bold tracking-wider uppercase text-[#1D1D1D]">
                Wishlist
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#F8F5F2] text-neutral-600 rounded-full border border-neutral-200">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-300">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1D1D1D]">No favorites yet</h3>
                  <p className="text-xs text-neutral-500 max-w-xs mt-1 leading-relaxed">
                    Tap the heart icon on any piece to save it to your private wishlist.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setActiveView('shop');
                  }}
                  className="px-6 py-3 bg-[#1D1D1D] text-white text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-[#C6A56B] transition-colors"
                >
                  Explore Handbags
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-sm flex gap-4 relative group"
                >
                  <div
                    onClick={() => handleProductClick(product.id)}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 cursor-pointer border border-neutral-200/80 flex items-center justify-center p-1.5"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A56B]">
                          {product.collection}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-neutral-400 hover:text-rose-500 p-1"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4
                        onClick={() => handleProductClick(product.id)}
                        className="font-serif text-sm font-semibold text-[#1D1D1D] hover:text-[#C6A56B] cursor-pointer line-clamp-1"
                      >
                        {product.title}
                      </h4>
                      <p className="text-xs font-semibold text-neutral-900 mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleMoveToBag(product)}
                        className="py-1.5 px-2.5 bg-[#1D1D1D] hover:bg-[#C6A56B] text-white text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            orderViaWhatsApp({
                              product,
                              quantity: 1,
                              formatPrice,
                              onToast: showToast
                            })
                          }
                          className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                          title="Order via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() =>
                            orderViaInstagram({
                              product,
                              quantity: 1,
                              formatPrice,
                              onToast: showToast
                            })
                          }
                          className="p-1.5 rounded-lg bg-pink-50 text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-colors"
                          title="Order via Instagram"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-6 bg-white border-t border-neutral-200">
              <button
                onClick={() => {
                  wishlistProducts.forEach((p) => addToCart(p));
                  setIsWishlistOpen(false);
                }}
                className="w-full py-3.5 bg-[#1D1D1D] text-white hover:bg-[#C6A56B] text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Move All to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
