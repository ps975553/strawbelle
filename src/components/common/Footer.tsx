import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight, Mail, MessageCircle, Instagram, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setActiveView,
    showToast
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    showToast(
      'Club Welcome',
      'Use promo code STRAWBELLE10 for 10% off your boutique order.',
      'gold'
    );
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#151515] text-[#F8F5F2] pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Newsletter Card */}
        <div className="bg-[#1D1D1D] rounded-3xl p-8 sm:p-12 border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#C6A56B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boutique Circle</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Receive Atelier Release Updates
            </h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Subscribe to receive preview allocations, bespoke leather releases, and an immediate welcome privilege.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:max-w-md flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C6A56B]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#C6A56B] hover:bg-[#B28E4C] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <span>Join Circle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Brand & Contact Us Grid */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
          <div className="lg:col-span-6 space-y-3">
            <div>
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white block uppercase">
                STRAWBELLE
              </span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#C6A56B] font-semibold mt-0.5">
                Timeless Elegance • Effortless Style
              </p>
            </div>

            <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-md">
              Strawbelle is an independent luxury house specializing solely in the creation of peerless, handcrafted leather goods.
            </p>
          </div>

          {/* Contact Us Buttons */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-lg-end gap-2.5 sm:gap-3">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#C6A56B] flex items-center gap-1.5 sm:mr-2">
              <Headphones className="w-3.5 h-3.5" />
              <span>Contact Us:</span>
            </div>

            <div className="grid grid-cols-3 w-full sm:w-auto sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5">
              {/* WhatsApp Button */}
              <a
                id="footer-contact-whatsapp"
                href="https://wa.me/919517220111?text=Hello%20Strawbelle%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20your%20collection."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-[#25D366]/20 border border-neutral-800 hover:border-[#25D366]/60 text-neutral-300 hover:text-[#25D366] text-[11px] sm:text-xs font-semibold transition-all group text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366] shrink-0" />
                <span>WhatsApp</span>
              </a>

              {/* Instagram Button */}
              <a
                id="footer-contact-instagram"
                href="https://www.instagram.com/strawbelle_bags?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-[#E1306C]/20 border border-neutral-800 hover:border-[#E1306C]/60 text-neutral-300 hover:text-[#E1306C] text-[11px] sm:text-xs font-semibold transition-all group text-center"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E1306C] shrink-0" />
                <span>Instagram</span>
              </a>

              {/* Email Button */}
              <a
                id="footer-contact-email"
                href="mailto:concierge@strawbelle.com?subject=Strawbelle%20Luxury%20Inquiry&body=Hello%20Strawbelle%20Concierge%2C%0A%0AInstagram%3A%20https%3A%2F%2Fwww.instagram.com%2Fstrawbelle_bags%20(%40strawbelle_bags)%0A%0AInquiry%20Details%3A%0A"
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-[#C6A56B]/20 border border-neutral-800 hover:border-[#C6A56B]/60 text-neutral-300 hover:text-[#C6A56B] text-[11px] sm:text-xs font-semibold transition-all group text-center"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C6A56B] shrink-0" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} STRAWBELLE. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                setActiveView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#C6A56B] transition-colors"
            >
              Concierge Services
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
