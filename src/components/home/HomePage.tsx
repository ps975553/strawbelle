import React from 'react';
import { HeroBanner } from './HeroBanner';
import { FeaturedSection } from './FeaturedSection';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-[#F8F5F2] min-h-screen">
      <HeroBanner />
      <FeaturedSection />
    </div>
  );
};
