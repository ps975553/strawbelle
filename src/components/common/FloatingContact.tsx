import React, { useState } from 'react';
import { MessageCircle, Instagram, Mail, X, ExternalLink, Headphones, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setActiveView } = useStore();

  const handleOpenContactPage = () => {
    setActiveView('contact');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Contact Options Popup */}
      {isOpen && (
        <div
          id="contact-popup-menu"
          className="mb-2 w-[calc(100vw-1.5rem)] max-w-[275px] sm:w-80 bg-[#1D1D1D] text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-neutral-700/80 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wide text-white">
                Contact Concierge
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800"
              aria-label="Close Contact Menu"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <p className="text-[10px] sm:text-[11px] text-neutral-400 mb-2 leading-relaxed">
            Direct access to our luxury advisors:
          </p>

          <div className="space-y-1.5">
            {/* WhatsApp */}
            <a
              id="floating-contact-whatsapp"
              href="https://wa.me/919517220111?text=Hello%20Strawbelle%2C%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20handbag%20collection."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-1.5 sm:p-2.5 rounded-xl bg-neutral-900/90 hover:bg-[#25D366]/20 border border-neutral-800 hover:border-[#25D366]/50 transition-all group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-semibold text-white group-hover:text-[#25D366] transition-colors">
                    WhatsApp
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] text-neutral-400">+91 95172 20111</div>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500 group-hover:text-[#25D366] transition-colors shrink-0" />
            </a>

            {/* Instagram */}
            <a
              id="floating-contact-instagram"
              href="https://www.instagram.com/strawbelle_bags?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-1.5 sm:p-2.5 rounded-xl bg-neutral-900/90 hover:bg-[#E1306C]/20 border border-neutral-800 hover:border-[#E1306C]/50 transition-all group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#E1306C]/20 text-[#E1306C] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-semibold text-white group-hover:text-[#E1306C] transition-colors">
                    Instagram Direct
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] text-neutral-400">@strawbelle_bags</div>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500 group-hover:text-[#E1306C] transition-colors shrink-0" />
            </a>

            {/* Email */}
            <a
              id="floating-contact-email"
              href="mailto:concierge@strawbelle.com?subject=Strawbelle%20Luxury%20Inquiry&body=Hello%20Strawbelle%20Concierge%2C%0A%0AInstagram%3A%20https%3A%2F%2Fwww.instagram.com%2Fstrawbelle_bags%20(%40strawbelle_bags)%0A%0AInquiry%20Details%3A%0A"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-1.5 sm:p-2.5 rounded-xl bg-neutral-900/90 hover:bg-[#C6A56B]/20 border border-neutral-800 hover:border-[#C6A56B]/50 transition-all group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#C6A56B]/20 text-[#C6A56B] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-semibold text-white group-hover:text-[#C6A56B] transition-colors">
                    Email Inquiries
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] text-neutral-400">concierge@strawbelle.com</div>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500 group-hover:text-[#C6A56B] transition-colors shrink-0" />
            </a>

            {/* Direct Page Link */}
            <button
              onClick={handleOpenContactPage}
              className="w-full mt-1.5 py-1.5 px-2.5 bg-neutral-800 hover:bg-[#C6A56B] text-neutral-200 hover:text-white rounded-xl text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
            >
              <span>Visit Contact Atelier</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Small Floating Trigger Button on Mobile */}
      <button
        id="floating-contact-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2.5 bg-[#1D1D1D] hover:bg-[#C6A56B] active:scale-95 text-white rounded-full shadow-lg border border-[#C6A56B]/40 hover:border-white transition-all duration-300 group cursor-pointer"
        title="Contact Us"
        aria-label="Contact Us"
      >
        <div className="relative shrink-0">
          <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C6A56B] group-hover:text-white transition-colors" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 ring-1.5 sm:ring-2 ring-[#1D1D1D]" />
        </div>
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider pr-0.5">Contact Us</span>
      </button>
    </div>
  );
};
