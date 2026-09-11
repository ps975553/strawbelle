import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How are Strawbelle handbags handcrafted?',
      a: 'Every Strawbelle handbag is crafted exclusively in our Florence, Italy atelier. Our artisans use traditional double-saddle stitching with waxed linen thread, hand-skived edges, and four coats of artisanal edge lacquer. Up to 48 hours of meticulous craftsmanship go into each individual piece.'
    },
    {
      q: 'What type of leather does Strawbelle use?',
      a: 'We select only the top 1% of full-grain French alpine calfskin and Italian lambskin. Our leathers are tanned using natural vegetable extracts in certified Tuscan tanneries, ensuring they remain exceptionally soft, durable, and develop a rich patina over decades of use.'
    },
    {
      q: 'Is the hardware real gold?',
      a: 'Yes. All Strawbelle lock clasps, chain links, and protective base studs are carved from solid jewelry-grade brass and electroplated with 24-karat gold for lustrous, scratch-resistant longevity.'
    },
    {
      q: 'How does complimentary global shipping work?',
      a: 'We provide complimentary DHL Express shipping to over 120 countries worldwide. Orders are dispatched from Florence within 24 hours. Transit time is typically 2–4 business days with signature required upon delivery.'
    },
    {
      q: 'What is the 30-Day Return & Exchange Policy?',
      a: 'If your handbag does not exceed your expectations, you may return or exchange it within 30 days of receipt in its original, pristine condition with security tags and silk packaging intact. We arrange complimentary courier pickup from your home.'
    },
    {
      q: 'What warranty is included with my purchase?',
      a: 'Every handbag is accompanied by an embossed Strawbelle Certificate of Authenticity and an official 2-Year Atelier Warranty covering any structural craftsmanship defects, hardware repairs, or stitch rejuvenation.'
    },
    {
      q: 'Do you offer custom leather monogramming?',
      a: 'Yes. We offer complimentary hot-stamp foil monogramming in 24K Gold, Silver, or Blind Deboss on the internal leather passport patch of select silhouettes.'
    }
  ];

  return (
    <div className="bg-[#F8F5F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C6A56B]">
            Client Care & Services
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D1D1D]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-lg mx-auto">
            Everything you need to know about our leather origins, bespoke care, warranties, and international delivery.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-md divide-y divide-neutral-200">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-5 first:pt-0 last:pb-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#1D1D1D] group-hover:text-[#C6A56B] transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#C6A56B]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
