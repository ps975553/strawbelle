import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight, ShoppingBag, MessageCircle, Instagram } from 'lucide-react';
import { orderViaWhatsApp, orderViaInstagram } from '../../utils/socialOrder';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    formatPrice,
    navigateToProduct,
    addToCart,
    showToast
  } = useStore();

  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    return products.filter((p) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q));

      return matchesQuery;
    });
  }, [products, query]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (id: string) => {
    navigateToProduct(id);
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#F8F5F2] rounded-3xl w-full max-w-4xl shadow-2xl border border-[#C6A56B]/30 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Search Header */}
        <div className="p-6 bg-white border-b border-neutral-200 flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3 bg-[#F8F5F2] px-4 py-3 rounded-2xl border border-neutral-200 focus-within:border-[#C6A56B] transition-colors">
            <Search className="w-5 h-5 text-[#C6A56B] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handcrafted luxury pieces, collections, materials..."
              className="w-full bg-transparent text-sm sm:text-base font-medium text-[#1D1D1D] placeholder:text-neutral-400 focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-6 overflow-y-auto no-scrollbar flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium pb-2 border-b border-neutral-200/60">
            <span>
              {filteredResults.length} {filteredResults.length === 1 ? 'Item' : 'Items'} Found
            </span>
            {query && <span>Filtering for &quot;{query}&quot;</span>}
          </div>

          {filteredResults.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-lg text-neutral-700 font-semibold">No creations matched your search</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Try searching for specific collections, materials, or keywords.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#1D1D1D] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#C6A56B] transition-colors"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-3 border border-neutral-200/80 hover:border-[#C6A56B]/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                >
                  <div
                    onClick={() => handleSelectProduct(product.id)}
                    className="cursor-pointer"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 relative mb-3">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {product.discountPercentage && product.discountPercentage > 0 ? (
                        <span className="absolute top-2 left-2 bg-[#1D1D1D] text-[#C6A56B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C6A56B]">
                          -{product.discountPercentage}%
                        </span>
                      ) : null}
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A56B]">
                      {product.collection}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-[#1D1D1D] group-hover:text-[#C6A56B] transition-colors line-clamp-1">
                      {product.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm text-[#1D1D1D]">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-[11px] text-neutral-400 line-through ml-1.5">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>

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
                      <button
                        onClick={() => addToCart(product)}
                        className="p-1.5 rounded-lg bg-[#F8F5F2] hover:bg-[#1D1D1D] hover:text-white text-[#1D1D1D] transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSelectProduct(product.id)}
                        className="p-1.5 rounded-lg bg-[#1D1D1D] text-white hover:bg-[#C6A56B] transition-colors"
                        title="View Details"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
