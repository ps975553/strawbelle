import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Package,
  MessageCircle,
  Instagram,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { HandbagCategory } from '../../types';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    activeView,
    setActiveView,
    setSelectedCategoryFilter,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAccountOpen,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: 'home' | 'shop' | 'about' | 'contact' | 'return-policy' | 'privacy-policy' | 'home', category?: HandbagCategory) => {
    if (category) {
      setSelectedCategoryFilter(category);
    } else if (view === 'shop') {
      setSelectedCategoryFilter(null);
    }
    setActiveView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F5F2]/95 backdrop-blur-md shadow-sm py-2 sm:py-2.5'
            : 'bg-[#F8F5F2] py-2.5 sm:py-3.5 md:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Mobile Toggle & Desktop Nav Links */}
            <div className="flex items-center gap-1 sm:gap-6 flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-[#1D1D1D] hover:text-[#C6A56B] transition-colors rounded-lg hover:bg-neutral-200/40"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#1D1D1D]">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`transition-colors hover:text-[#C6A56B] relative py-1 ${
                    activeView === 'home' ? 'text-[#C6A56B]' : ''
                  }`}
                >
                  Home
                  {activeView === 'home' && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C6A56B]" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setSelectedCategoryFilter(null);
                    setActiveView('shop');
                  }}
                  className={`transition-colors hover:text-[#C6A56B] relative py-1 ${
                    activeView === 'shop' ? 'text-[#C6A56B]' : ''
                  }`}
                >
                  Explore Handbags
                  {activeView === 'shop' && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C6A56B]" />
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('about')}
                  className={`transition-colors hover:text-[#C6A56B] relative py-1 ${activeView === 'about' ? 'text-[#C6A56B]' : ''}`}
                >
                  About Us
                </button>
                <button
                  onClick={() => handleNavClick('return-policy')}
                  className={`transition-colors hover:text-[#C6A56B] relative py-1 ${activeView === 'return-policy' ? 'text-[#C6A56B]' : ''}`}
                >
                  Return Policy
                </button>
                <button
                  onClick={() => handleNavClick('privacy-policy')}
                  className={`transition-colors hover:text-[#C6A56B] relative py-1 ${activeView === 'privacy-policy' ? 'text-[#C6A56B]' : ''}`}
                >
                  Privacy Policy
                </button>

                <button
                  onClick={() => handleNavClick('about')}
                  className="text-left py-3 px-3 rounded-xl transition-colors flex items-center justify-between hover:bg-neutral-200/50"
                >
                  <span>About Us</span><ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => handleNavClick('return-policy')}
                  className="text-left py-3 px-3 rounded-xl transition-colors flex items-center justify-between hover:bg-neutral-200/50"
                >
                  <span>Return Policy</span><ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => handleNavClick('privacy-policy')}
                  className="text-left py-3 px-3 rounded-xl transition-colors flex items-center justify-between hover:bg-neutral-200/50"
                >
                  <span>Privacy Policy</span><ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() => handleNavClick('contact')}
                  className={`transition-colors hover:text-[#C6A56B] relative py-1 ${
                    activeView === 'contact' ? 'text-[#C6A56B]' : ''
                  }`}
                >
                  Contact Us
                  {activeView === 'contact' && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C6A56B]" />
                  )}
                </button>
              </nav>
            </div>

            {/* Center: Brand Logo */}
            <div
              className="flex flex-col items-center justify-center cursor-pointer group px-1 sm:px-2 flex-shrink min-w-0"
              onClick={() => handleNavClick('home')}
            >
              <span className="font-serif text-lg sm:text-2xl md:text-3xl font-bold tracking-[0.16em] sm:tracking-[0.25em] text-[#1D1D1D] uppercase group-hover:text-[#C6A56B] transition-colors truncate">
                STRAWBELLE
              </span>
              <span className="hidden sm:block text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-neutral-500 font-medium -mt-0.5 whitespace-nowrap">
                Timeless Elegance
              </span>
            </div>

            {/* Right: Actions (Search, Wishlist, Cart, Account) */}
            <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 sm:p-2 text-[#1D1D1D] hover:text-[#C6A56B] transition-colors rounded-full hover:bg-neutral-200/50"
                title="Search"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-1.5 sm:p-2 text-[#1D1D1D] hover:text-[#C6A56B] transition-colors rounded-full hover:bg-neutral-200/50 relative"
                title="View Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#C6A56B] text-white text-[8px] sm:text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-1.5 sm:p-2 text-[#1D1D1D] hover:text-[#C6A56B] transition-colors rounded-full hover:bg-neutral-200/50 relative"
                title="View Cart"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#1D1D1D] text-[#C6A56B] text-[8px] sm:text-[9px] font-bold rounded-full flex items-center justify-center border border-[#C6A56B]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Customer Account & Profile */}
              <button
                onClick={() => setIsAccountOpen(true)}
                className="p-1.5 sm:p-2 text-[#1D1D1D] hover:text-[#C6A56B] transition-colors rounded-full hover:bg-neutral-200/50"
                title="My Account & Profile"
                aria-label="Account"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-[#F8F5F2] h-full shadow-2xl p-5 sm:p-6 overflow-y-auto flex flex-col justify-between z-10 border-r border-neutral-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div>
                  <span className="font-serif font-bold tracking-[0.2em] text-[#1D1D1D] text-lg block uppercase">
                    STRAWBELLE
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
                    Haute Maroquinerie
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-600 hover:text-[#1D1D1D] rounded-lg hover:bg-neutral-200/50"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-2 text-xs font-semibold uppercase tracking-wider text-[#1D1D1D]">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-left py-3 px-3 rounded-xl transition-colors flex items-center justify-between ${
                    activeView === 'home'
                      ? 'bg-[#1D1D1D] text-white'
                      : 'hover:bg-neutral-200/50'
                  }`}
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() => handleNavClick('shop')}
                  className={`text-left py-3 px-3 rounded-xl transition-colors flex items-center justify-between ${
                    activeView === 'shop'
                      ? 'bg-[#1D1D1D] text-white'
                      : 'hover:bg-neutral-200/50'
                  }`}
                >
                  <span>Explore Handbags</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() => handleNavClick('contact')}
                  className={`text-left py-3 px-3 rounded-xl transition-colors flex items-center justify-between ${
                    activeView === 'contact'
                      ? 'bg-[#1D1D1D] text-white'
                      : 'hover:bg-neutral-200/50'
                  }`}
                >
                  <span>Contact Us</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAccountOpen(true);
                  }}
                  className="text-left py-3 px-3 rounded-xl transition-colors flex items-center justify-between hover:bg-neutral-200/50 text-[#1D1D1D]"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#C6A56B]" />
                    My Account & Orders
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Bottom Contact Channels */}
            <div className="pt-6 border-t border-neutral-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Direct Concierge
              </span>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="https://wa.me/919517220111?text=Hello%20Strawbelle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-neutral-200 hover:border-[#25D366] text-[#25D366] text-[10px] font-semibold gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://www.instagram.com/strawbelle_bags?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-neutral-200 hover:border-[#E1306C] text-[#E1306C] text-[10px] font-semibold gap-1"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
                <a
                  href="mailto:concierge@strawbelle.com?subject=Strawbelle%20Luxury%20Inquiry&body=Hello%20Strawbelle%20Concierge%2C%0A%0AInstagram%3A%20https%3A%2F%2Fwww.instagram.com%2Fstrawbelle_bags%20(%40strawbelle_bags)%0A%0AInquiry%3A%20"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-neutral-200 hover:border-[#C6A56B] text-[#C6A56B] text-[10px] font-semibold gap-1"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
