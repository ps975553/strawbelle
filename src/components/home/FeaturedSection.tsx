import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const { products, setActiveView, setSelectedCategoryFilter } = useStore();
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new'>('featured');

  const filteredProducts = products.filter((p) => {
    if (p.status !== 'published') return false;
    if (activeTab === 'featured') return p.featured;
    if (activeTab === 'bestsellers') return p.bestSeller;
    if (activeTab === 'new') return p.isNewArrival;
    return true;
  });

  const handleViewAll = () => {
    setSelectedCategoryFilter(null);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-4 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-6">
          <div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#C6A56B] block">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1D] tracking-tight">
              Featured Creations
            </h2>
          </div>

          {/* Luxury Tab Switcher */}
          <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-[#F8F5F2] rounded-lg sm:rounded-xl border border-neutral-200 overflow-x-auto no-scrollbar self-start sm:self-auto">
            {(
              [
                { id: 'featured', label: 'Featured' },
                { id: 'bestsellers', label: 'Best Sellers' },
                { id: 'new', label: 'New Arrivals' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#1D1D1D] text-[#C6A56B] shadow-sm font-bold'
                    : 'text-neutral-600 hover:text-[#1D1D1D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-4 sm:mt-8 text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-5 py-2 sm:px-6 sm:py-2.5 bg-[#1D1D1D] hover:bg-[#C6A56B] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] rounded-lg sm:rounded-xl shadow-sm transition-all duration-300 group"
          >
            <span>View All Creations</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
