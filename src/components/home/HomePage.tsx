import React from 'react';
import { useStore } from '../../context/StoreContext';
import type { HandbagCategory } from '../../types';
import { HeroBanner } from './HeroBanner';
import { FeaturedSection } from './FeaturedSection';

const categories: HandbagCategory[] = ['Handbag', 'Women Perfume', 'Ladies Watch'];
const categoryImages: Partial<Record<HandbagCategory, string>> = {
  Handbag: './catalog/images/handbag-category.png',
  'Women Perfume': './catalog/images/women-perfume-category.png',
  'Ladies Watch': './catalog/images/rose-gold-crystal-studded-watch.png',
};

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
          <div className="w-full max-w-5xl rounded-lg border border-neutral-200/80 border-l-2 border-l-[#C6A56B] bg-[#F8F5F2]/60 px-3 py-2.5 text-center text-[11px] sm:text-xs leading-relaxed text-neutral-700">
            <p>
              <strong className="font-bold text-[#1D1D1D]">Note:</strong> Due to copyright rules, product names are changed on Strawbelle.com. The physical item arrives with the correct brand logo and spelling, but please note this is{' '}
              <strong className="font-bold text-[#1D1D1D]">UA quality</strong> (not from the official brand store). Check the photos or message our team for a real video of the product before ordering!
            </p>
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[#C6A56B]">
            Shop by Category
          </span>
          <div className="flex flex-wrap items-start justify-center gap-2">
            {categories.map((category) => (
              <div key={category} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className="min-h-10 rounded-full border border-neutral-200 bg-[#F8F5F2] px-4 py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#1D1D1D] transition-colors hover:border-[#C6A56B] hover:text-[#C6A56B]"
                >
                  {category}
                </button>
                {categoryImages[category] && (
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    aria-label={`Explore ${category}`}
                    className="h-[85px] w-[85px] overflow-hidden rounded-lg border border-neutral-200 bg-[#1D1D1D] shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <img
                      src={categoryImages[category]}
                      alt={`${category} category`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <FeaturedSection />
    </div>
  );
};
