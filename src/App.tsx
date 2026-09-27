import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { WishlistDrawer } from './components/customer/WishlistDrawer';
import { AccountModal } from './components/customer/AccountModal';
import { FloatingContact } from './components/common/FloatingContact';
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetail } from './components/shop/ProductDetail';
import { AboutPage } from './components/pages/AboutPage';
import { LookbookPage } from './components/pages/LookbookPage';
import { ContactPage } from './components/pages/ContactPage';
import { FAQPage } from './components/pages/FAQPage';
import { InfoPage } from './components/pages/InfoPage';
import { ArrowLeft } from 'lucide-react';

const MainViewRouter: React.FC = () => {
  const { activeView, selectedProductId, setActiveView, goBack, navigateToProduct } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  useEffect(() => {
    const openProductFromHash = () => {
      const hash = window.location.hash;
      const prefix = '#product-';
      if (!hash.startsWith(prefix)) return;

      const productId = decodeURIComponent(hash.slice(prefix.length));
      if (productId) {
        navigateToProduct(productId);
      }
    };

    openProductFromHash();
    window.addEventListener('hashchange', openProductFromHash);
    return () => window.removeEventListener('hashchange', openProductFromHash);
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F2] text-[#1D1D1D] selection:bg-[#C6A56B] selection:text-white">
      <Header />

      {activeView !== 'home' && (
        <button
          onClick={goBack}
          aria-label="Go back to the previous page"
          className="fixed top-[76px] sm:top-[88px] left-3 sm:left-6 z-30 inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200 shadow-md text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#1D1D1D] hover:text-[#C6A56B] hover:border-[#C6A56B]/50 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      )}

      <main className="flex-1">
        {activeView === 'home' && <HomePage />}
        {activeView === 'shop' && <ShopPage />}
        {(activeView === 'product-detail') && (
          <ProductDetail key={selectedProductId || 'default'} />
        )}
        {activeView === 'about' && <AboutPage />}
        {activeView === 'contact' && <ContactPage />}
        {activeView === 'return-policy' && <InfoPage title="Return Policy" />}
        {activeView === 'privacy-policy' && <InfoPage title="Privacy Policy" />}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainViewRouter />
      <SearchModal />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <AccountModal />
      <FloatingContact />
      <ToastContainer />
    </StoreProvider>
  );
}
