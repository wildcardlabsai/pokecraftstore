/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CustomerDashboard } from './pages/CustomerDashboard';

const AppContent: React.FC = () => {
  const { path } = useRouter();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [path]);

  // Route matching
  const renderRoute = () => {
    if (path === '/') return <HomePage />;
    if (path === '/shop') return <ShopPage initialCategory="all" />;
    if (path === '/shop/figures') return <ShopPage initialCategory="figures" />;
    if (path === '/shop/display-storage') return <ShopPage initialCategory="display-storage" />;
    if (path === '/shop/keychains') return <ShopPage initialCategory="keychains" />;
    if (path === '/shop/accessories') return <ShopPage initialCategory="accessories" />;
    
    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '').split('?')[0];
      return <ProductDetailPage slug={slug} />;
    }

    if (path === '/cart') return <CartPage />;
    if (path === '/checkout') return <CheckoutPage />;
    if (path === '/order-confirmation' || path.startsWith('/order-success')) return <OrderConfirmationPage />;
    
    // Auth & Accounts
    if (path === '/login') return <LoginPage />;
    if (path === '/admin/dashboard') return <AdminDashboard />;
    if (path === '/account/dashboard') return <CustomerDashboard />;

    // Default fallback
    return <ShopPage initialCategory="all" />;
  };

  // Hide header/footer on admin dashboard
  const isAdminRoute = path.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#172033] font-sans antialiased">
      {!isAdminRoute && <Header />}

      <main className="flex-1">
        {renderRoute()}
      </main>

      {!isAdminRoute && <Footer />}

      {!isAdminRoute && (
        <>
          <CartDrawer />
          <SearchModal />
        </>
      )}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </RouterProvider>
    </AuthProvider>
  );
}
