import React from 'react';
import { useStore } from '../../context/StoreContext';

export const LookbookPage: React.FC = () => {
  const { products, navigateToProduct } = useStore();

  const looks = [
    {
      id: 'look-1',
      title: 'Monochrome Parisian Tailoring',
      season: 'Spring / Summer 2026',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
      featuredProductId: 'sb-prod-01',
      tagline: 'Paired with The Aurelia Heritage Top-Handle in Noir'
    },
    {
      id: 'look-2',
      title: 'Tuscan Sunset Cashmere',
      season: 'Autumn / Winter 2026',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      featuredProductId: 'sb-prod-02',
      tagline: 'Styled with The Celestine Flap Crossbody in Cognac'
    },
    {
      id: 'look-3',
      title: 'Riviera Linen & Morning Breeze',
      season: 'Resort Collection 2026',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85',
      featuredProductId: 'sb-prod-03',
      tagline: 'Featuring The Palais Grande Tote in Blush'
    },
    {
      id: 'look-4',
      title: 'Midnight Gala Velvet',
      season: 'Haute Couture 2026',
      image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=85',
      featuredProductId: 'sb-prod-05',
      tagline: 'Accompanied by The Ophelia Minaudière Clutch in Gold'
    }
  ];

  return (
    <div className="bg-[#F8F5F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C6A56B]">
            Editorial Runway
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D1D1D]">
            Lookbook & Editorial Styling
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
            Curated styling visions from Milan and Paris fashion weeks, captured by our atelier photographers.
          </p>
        </div>

        {/* Lookbook Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {looks.map((look) => {
            const matchedProduct = products.find((p) => p.id === look.featuredProductId);

            return (
              <div
                key={look.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-200/80 group flex flex-col justify-between"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-[#1D1D1D]">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    {matchedProduct && (
                      <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-2xl">
                        <div className="min-w-0 pr-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#C6A56B]">
                            Featured Piece
                          </p>
                          <p className="font-serif text-xs font-bold text-[#1D1D1D] truncate">
                            {matchedProduct.title}
                          </p>
                        </div>
                        <button
                          onClick={() => navigateToProduct(matchedProduct.id)}
                          className="px-3 py-1.5 bg-[#1D1D1D] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#C6A56B] transition-colors shrink-0"
                        >
                          View Piece
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {look.season}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#1D1D1D]">{look.title}</h3>
                  <p className="text-xs text-neutral-500 font-light">{look.tagline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
