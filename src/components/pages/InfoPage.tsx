import React from 'react';

export const InfoPage: React.FC<{ title: string }> = ({ title }) => (
  <section className="min-h-[60vh] py-16 sm:py-24">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1D1D1D] mb-8">{title}</h1>
      <div className="text-sm sm:text-base text-neutral-700 leading-8 whitespace-pre-line">
        {`Premium Luxury, Now Within Reach\nWe bring you premium-quality products inspired by the brands you’ve always admired. Our collection is carefully curated to deliver exceptional craftsmanship, superior quality, and a luxury feel—at prices you won’t find elsewhere. We offer Pan India delivery along with international shipping to multiple countries, ensuring a seamless shopping experience wherever you are. To build complete trust and transparency, we also provide a live video call service. You can personally view the product in real time or request a detailed live video before placing your order—so you shop with full confidence. Experience luxury, quality, and convenience—all in one place.`}
      </div>
    </div>
  </section>
);
