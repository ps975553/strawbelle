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

const MainViewRouter: React.FC = () => {
  const { activeView, selectedProductId, setActiveView, navigateToProduct } = useStore();

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
