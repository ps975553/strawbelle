import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, Instagram, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <footer className="bg-[#151515] text-[#F8F5F2] pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
            <div className="pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5F2]">Contact an Advisor</h4>
              <p className="mt-1 text-xs text-neutral-400 font-light leading-relaxed max-w-md">
                STRAWBELLE advisors are available to assist you with your questions. Monday to Sunday.
              </p>
            </div>
            <div className="pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5F2]">Payment Methods</h4>
              <p className="mt-1 text-xs text-neutral-400 font-light leading-relaxed max-w-md">
                To reduce taxes and keep prices affordable for buyers and waive other costs, we accept payment by Pay On Delivery and Bank Transfer. Please note that cash on delivery is not available for some postal codes; customers in these areas can pay by bank transfer.
              </p>
            </div>
          </div>

          {/* Contact Us Buttons */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-lg-end gap-2.5 sm:gap-3">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#C6A56B] flex items-center gap-1.5 sm:mr-2">
              <Headphones className="w-3.5 h-3.5" />
              <span>Contact Us:</span>
            </div>

            <div className="grid grid-cols-2 w-full sm:w-auto sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5">
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

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} STRAWBELLE. All rights reserved.</p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <button onClick={() => { setActiveView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#C6A56B] transition-colors">Concierge Services</button>
            <button onClick={() => { setActiveView('return-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#C6A56B] transition-colors">Return Policy</button>
            <button onClick={() => { setActiveView('privacy-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#C6A56B] transition-colors">Privacy Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
