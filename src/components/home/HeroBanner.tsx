import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { homepageConfig, setActiveView, setSelectedCategoryFilter } = useStore();

  const handleShopNow = () => {
    setSelectedCategoryFilter(null);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCollections = () => {
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[220px] sm:min-h-[360px] md:min-h-[440px] bg-[#1D1D1D] overflow-hidden flex items-center">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {homepageConfig.heroType === 'video' && homepageConfig.heroVideoUrl ? (
          <video
            src={homepageConfig.heroVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
          />
        ) : (
          <img
            src={homepageConfig.heroImageUrl}
            alt="Strawbelle Luxury Collection"
            className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D] via-transparent to-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 md:py-14 w-full flex flex-col justify-center">
        <div className="max-w-2xl text-white space-y-2 sm:space-y-3 md:space-y-4">
          {/* Badge */}
          {homepageConfig.heroBadge && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#C6A56B]/40 text-[#C6A56B] text-[9px] sm:text-xs font-bold uppercase tracking-[0.22em] shadow-sm">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{homepageConfig.heroBadge}</span>
            </div>
          )}

          {/* Heading */}
          <h1 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8F5F2] leading-tight">
            {homepageConfig.heroHeading}
          </h1>

          {/* Subheading */}
          {homepageConfig.heroSubheading && (
            <p className="text-[11px] sm:text-sm md:text-base text-neutral-300 font-light leading-relaxed max-w-lg">
              {homepageConfig.heroSubheading}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              onClick={handleShopNow}
              className="py-2 px-3.5 sm:py-2.5 sm:px-6 bg-[#C6A56B] hover:bg-[#B28E4C] text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] rounded-lg sm:rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 group hover:gap-2 sm:hover:gap-2.5"
            >
              <span>{homepageConfig.primaryButtonText || 'Explore Handbags'}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            {homepageConfig.secondaryButtonText && (
              <button
                onClick={handleExploreCollections}
                className="py-2 px-3.5 sm:py-2.5 sm:px-6 bg-white/10 hover:bg-white hover:text-[#1D1D1D] text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] rounded-lg sm:rounded-xl backdrop-blur-md border border-white/20 hover:border-white transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <span>{homepageConfig.secondaryButtonText}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
