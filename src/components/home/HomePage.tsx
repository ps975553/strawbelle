import React from 'react';
import { useStore } from '../../context/StoreContext';
import type { HandbagCategory } from '../../types';
import { HeroBanner } from './HeroBanner';
import { FeaturedSection } from './FeaturedSection';

const categories: HandbagCategory[] = ['Women Perfume', 'Lady Watch'];

export const HomePage: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter } = useStore();

  const handleCategoryClick = (category: HandbagCategory) => {
    setSelectedCategoryFilter(category);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F8F5F2] min-h-screen">
      <HeroBanner />
      <section className="bg-white py-4 sm:py-5 border-b border-neutral-100" aria-label="Shop by category">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex flex-col items-center gap-2.5">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[#C6A56B]">
            Shop by Category
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className="rounded-full border border-neutral-200 bg-[#F8F5F2] px-4 py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#1D1D1D] transition-colors hover:border-[#C6A56B] hover:text-[#C6A56B]"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      <FeaturedSection />
    </div>
  );
};
