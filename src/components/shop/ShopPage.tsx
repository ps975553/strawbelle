import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  Filter,
  SlidersHorizontal
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    formatPrice
  } = useStore();

  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('newest');
  const [priceLimit, setPriceLimit] = useState<number>(4000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const resetFilters = () => {
    setSelectedCategoryFilter(null);
    setPriceLimit(4000);
    setSortBy('newest');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'published') return false;

        if (
          selectedCategoryFilter &&
          p.collection !== selectedCategoryFilter &&
          p.category !== selectedCategoryFilter
        ) {
          return false;
        }

        if (p.price > priceLimit) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'discount') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategoryFilter, priceLimit, sortBy]);

  const activeFiltersCount =
    (selectedCategoryFilter ? 1 : 0) +
    (priceLimit < 4000 ? 1 : 0);

  return (
    <div className="bg-[#F8F5F2] min-h-screen py-5 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="text-center py-2 sm:py-4 mb-4 sm:mb-6">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C6A56B]">
            Boutique Collection
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] mt-0.5">
            All Creations
          </h1>
          <p className="text-[11px] sm:text-xs text-neutral-500 font-light max-w-md mx-auto mt-1">
            Explore our handcrafted luxury pieces, designed for timeless elegance.
          </p>
        </div>

        {/* Main Grid + Filter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C6A56B]" />
                  <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1D1D1D]">
                    Refine Selection
                  </h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[10px] text-[#C6A56B] hover:underline font-semibold"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Price Filter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-neutral-800">
                  <span>Maximum Price</span>
                  <span className="text-[#C6A56B]">{formatPrice(priceLimit)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="50"
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(Number(e.target.value))}
                  className="w-full accent-[#C6A56B] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-neutral-400">
                  <span>{formatPrice(500)}</span>
                  <span>{formatPrice(4000)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Controls Bar */}
            <div className="bg-white px-3.5 py-2.5 rounded-xl border border-neutral-200/80 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="lg:hidden px-2.5 py-1 bg-[#1D1D1D] text-white rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"
                >
                  <Filter className="w-3 h-3 text-[#C6A56B]" />
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>

                <span className="text-[11px] text-neutral-500 font-medium">
                  <strong className="text-[#1D1D1D]">{filteredProducts.length}</strong> items
                </span>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-400 font-semibold uppercase tracking-wider hidden sm:inline text-[9px]">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F8F5F2] border border-neutral-200 rounded-lg px-2.5 py-1 text-[11px] font-medium text-[#1D1D1D] focus:outline-none focus:border-[#C6A56B] cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>

            {/* Mobile Filter Expand */}
            {isMobileFilterOpen && (
              <div className="lg:hidden bg-white p-4 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Price Limit: {formatPrice(priceLimit)}</span>
                  {activeFiltersCount > 0 && (
                    <button onClick={resetFilters} className="text-[#C6A56B] underline text-[11px]">
                      Reset
                    </button>
                  )}
                </div>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="50"
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(Number(e.target.value))}
                  className="w-full accent-[#C6A56B]"
                />
              </div>
            )}

            {/* Product Cards */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-neutral-200 space-y-3">
                <p className="font-serif text-lg font-bold text-[#1D1D1D]">
                  No items meet your filter criteria
                </p>
                <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                  Try adjusting your price range or clearing filters to reveal all pieces.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#1D1D1D] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#C6A56B] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
