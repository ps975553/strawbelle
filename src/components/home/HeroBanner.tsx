import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

type HeroSlide = {
  imageUrl: string;
  badge: string;
  heading: string;
  subheading: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  contentClass: string;
  overlayClass: string;
  offerSlide?: boolean;
};

export const HeroBanner: React.FC = () => {
  const { homepageConfig, setActiveView, setSelectedCategoryFilter } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides: HeroSlide[] = [
    {
      imageUrl: './banners/premium-imported-quality.webp',
      badge: 'PREMIUM IMPORTED QUALITY',
      heading: 'Premium Imported UA Quality.',
      subheading: 'Same Look & Feel as Branded.',
      primaryButtonText: 'Shop Handbags',
      secondaryButtonText: 'View Collection',
      contentClass: 'items-center text-center mx-auto',
      overlayClass: 'bg-gradient-to-r from-black/80 via-black/55 to-black/25',
    },
    {
      imageUrl: homepageConfig.heroImageUrl,
      badge: homepageConfig.heroBadge || '',
      heading: homepageConfig.heroHeading || 'Timeless Handbags. Effortless Style.',
      subheading: homepageConfig.heroSubheading || '',
      primaryButtonText: homepageConfig.primaryButtonText || 'Explore Handbags',
      secondaryButtonText: homepageConfig.secondaryButtonText || 'Explore Collections',
      contentClass: 'items-start text-left',
      overlayClass: 'bg-gradient-to-r from-black/85 via-black/55 to-black/30',
    },
    {
      imageUrl: './banners/first-order-welcome.webp',
      badge: 'EXCLUSIVE WELCOME OFFER',
      heading: 'UP TO 35% OFF',
      subheading: 'ON FIRST ORDER',
      primaryButtonText: 'ORDER NOW',
      secondaryButtonText: undefined,
      contentClass: 'items-center text-center md:items-start md:text-left md:w-[58%]',
      overlayClass: 'bg-gradient-to-r from-[#F7EBDD]/90 via-[#F7EBDD]/42 to-transparent',
      offerSlide: true,
    },
  ];

  const handleShopNow = () => {
    setSelectedCategoryFilter(null);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCollections = () => {
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  useEffect(() => {
    setActiveSlide(0);
  }, [homepageConfig.heroImageUrl, homepageConfig.heroHeading]);

  const current = slides[activeSlide];

  return (
    <section
      className="relative w-full min-h-[220px] sm:min-h-[360px] md:min-h-[440px] bg-[#1D1D1D] overflow-hidden flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Strawbelle featured banners"
    >
      <div className="absolute inset-0 z-0">
        {activeSlide === 1 && homepageConfig.heroType === 'video' && homepageConfig.heroVideoUrl ? (
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
            src={current.imageUrl}
            alt={activeSlide === 2 ? 'Strawbelle exclusive welcome offer' : 'Strawbelle premium handbag collection'}
            className="w-full h-full object-cover opacity-70 scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        )}

        <div className={`absolute inset-0 ${current.overlayClass}`} />
        <div className={`absolute inset-0 ${current.offerSlide ? 'bg-gradient-to-t from-transparent via-transparent to-white/10' : 'bg-gradient-to-t from-[#1D1D1D]/45 via-transparent to-black/10'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 md:py-14 w-full">
        <div className={`max-w-2xl text-white space-y-2 sm:space-y-3 md:space-y-4 flex flex-col ${current.contentClass}`}>
          {current.offerSlide ? (
            <>
              <div className="flex items-center justify-center md:justify-start gap-4 w-full max-w-xl">
                <span className="hidden sm:block h-px flex-1 max-w-20 bg-[#C6A56B]" />
                <span className="text-[#1D1D1D] text-[10px] sm:text-xs font-medium uppercase tracking-[0.34em] whitespace-nowrap">
                  EXCLUSIVE WELCOME OFFER
                </span>
                <span className="hidden sm:block h-px flex-1 max-w-20 bg-[#C6A56B]" />
              </div>

              <div className="w-full max-w-xl mt-1">
                <h1 className="font-serif font-medium leading-[0.92] tracking-tight text-[#1D1D1D] whitespace-nowrap">
                  <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl">UP TO </span>
                  <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-[#B77A16] drop-shadow-[0_2px_8px_rgba(122,76,15,0.15)]">35%</span>
                  <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl"> OFF</span>
                </h1>
              </div>

              <div className="w-full max-w-xl text-center md:text-left">
                <p className="text-[#1D1D1D] font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-medium uppercase tracking-[0.18em]">
                  ON FIRST ORDER
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3 w-full max-w-xl py-1 sm:py-2">
                <span className="h-px flex-1 max-w-24 bg-[#C6A56B]" />
                <span className="text-[#C38A25] text-2xl leading-none">⌁</span>
                <span className="h-px flex-1 max-w-24 bg-[#C6A56B]" />
              </div>
            </>
          ) : (
            <>
              {current.badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full backdrop-blur-md border border-[#C6A56B]/55 bg-black/20 text-[#D7B77A] text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] shadow-[0_8px_30px_rgba(0,0,0,0.18)] w-fit">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{current.badge}</span>
                </div>
              )}

              <div className="flex items-center gap-3 w-full max-w-3xl justify-center">
                <span className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent to-[#C6A56B]/80" />
                <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[0.015em] text-[#FBF8F3] leading-[1.04] drop-shadow-[0_3px_18px_rgba(0,0,0,0.38)] max-w-3xl">
                  {current.heading}
                </h1>
                <span className="hidden sm:block h-px w-10 bg-gradient-to-l from-transparent to-[#C6A56B]/80" />
              </div>

              {current.subheading && (
                <p className="text-[11px] sm:text-sm md:text-base text-[#E8E0D6] font-light leading-relaxed tracking-[0.08em] max-w-xl uppercase">
                  {current.subheading}
                </p>
              )}
            </>
          )}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              onClick={handleShopNow}
              className={`py-2.5 px-5 sm:py-3 sm:px-8 text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.22em] rounded-lg sm:rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 group ${current.offerSlide ? 'bg-[#1D1D1D] hover:bg-black text-[#F7EBDD] border border-[#C6A56B]/70 shadow-[0_8px_26px_rgba(0,0,0,0.2)]' : 'bg-[#C6A56B] hover:bg-[#B28E4C] text-white'}`}
            >
              <span>{current.primaryButtonText}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            {current.secondaryButtonText && (
              <button
                onClick={handleExploreCollections}
                className="py-2 px-3.5 sm:py-2.5 sm:px-6 bg-white/10 hover:bg-white hover:text-[#1D1D1D] text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] rounded-lg sm:rounded-xl backdrop-blur-md border border-white/20 hover:border-white transition-all duration-300"
              >
                <span>{current.secondaryButtonText}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to banner ${index + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === activeSlide ? 'w-7 bg-[#C6A56B]' : 'w-3 bg-white/45 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous banner"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/25 hover:bg-black/45 text-white backdrop-blur-sm border border-white/10 transition-all"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
        aria-label="Next banner"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/25 hover:bg-black/45 text-white backdrop-blur-sm border border-white/10 transition-all"
      >
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </section>
  );
};
