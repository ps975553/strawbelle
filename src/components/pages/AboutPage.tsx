import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ShieldCheck, Award, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <div className="bg-[#F8F5F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Editorial Top Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C6A56B]">
            Artisanal Leathercraft Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1D1D1D] tracking-tight">
            The Art of Strawbelle
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-neutral-600">
            &quot;True luxury is not loud; it is the quiet harmony of uncompromised materials, flawless proportions, and centuries of artisanal devotion.&quot;
          </p>
        </div>

        {/* Large Visual Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-neutral-900">
            <img
              src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C6A56B]">
              Handcrafted Excellence • Circa 1988
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1D1D1D]">
              Born From a Passion for Fine Leather
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Nestled along the banks of the Arno river in Florence, our master leather atelier represents over three decades of unbroken artisanal tradition. Each Strawbelle silhouette begins not as an algorithmic render, but as a hand-drawn blueprint on parchment, sculpted with wooden forms, and assembled by senior artisans who have dedicated their lives to the craft.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              We reject the rush of mass production. Every handbag undergoes up to 48 hours of meticulous manual labor, including 1,200 saddle-stitches, hand-lacquered edge painting in four successive coats, and jewelry-grade 24K gold hardware fitting.
            </p>
          </div>
        </div>

        {/* The 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-neutral-200">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D1D] text-[#C6A56B] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1D1D1D]">100% French Calfskin</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Sourced exclusively from certified eco-conscious French alpine tanneries. Supple, full-grain, and developing a magnificent patina.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D1D] text-[#C6A56B] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1D1D1D]">24-Karat Gold Plating</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Solid brass turnlocks, buckles, and feet electroplated with pure 24K gold to ensure lifetime shine without oxidation or tarnishing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D1D] text-[#C6A56B] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1D1D1D]">Numbered Archival Editions</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Every handbag features an embossed internal leather passport and verifiable serial number stamped in gold foil.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D1D] text-[#C6A56B] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1D1D1D]">Sustainable Stewardship</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Organic vegetable tanning processes free from harsh heavy metals, zero-waste pattern drafting, and lifelong repairability.
            </p>
          </div>
        </div>

        {/* Atelier Quote Banner */}
        <div className="bg-[#1D1D1D] rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C6A56B]">
              The Master Craftsman&apos;s Promise
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-[#F8F5F2]">
              &quot;A Strawbelle handbag is not merely an accessory for a season; it is an heirloom to be passed down through generations.&quot;
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              — Marco Bellini, Head of Atelier & Master Leatherwright
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveView('shop')}
              className="px-8 py-3.5 bg-[#C6A56B] hover:bg-[#B28E4C] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>Explore The Current Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
