import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronDown, Sparkles, Layers, Box, Key, Zap, ShieldCheck, Heart, UserCircle } from 'lucide-react';
import { PokeCraftLogo } from './PokeCraftLogo';
import { Link, useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { WishlistModal } from './WishlistModal';

export const Header: React.FC = () => {
  const { path, navigate } = useRouter();
  const { cartCount, wishlistCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const { user } = useAuth();
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shopDropdownItems = [
    { label: 'All Products', path: '/shop', desc: 'Browse the entire 3D printed catalogue', icon: Box },
    { label: 'Figures', path: '/shop/figures', desc: 'Iconic Pokémon display figures with weighted bases', icon: Sparkles },
    { label: 'Display & Storage', path: '/shop/display-storage', desc: 'LED stands, risers & magnetic dice jars', icon: Layers },
    { label: 'Keychains', path: '/shop/keychains', desc: 'High-density pocket collectibles with steel rings', icon: Key },
    { label: 'Accessories', path: '/shop/accessories', desc: 'Succulent planters & ergonomic phone stands', icon: Zap },
    { label: 'New Releases', path: '/shop?filter=new', desc: 'Fresh prints hot off the machines', icon: Sparkles },
    { label: 'Best Sellers', path: '/shop?filter=bestsellers', desc: 'Fan favourite collector prints', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#050E1A] text-slate-300 text-xs py-2 px-4 border-b border-slate-800 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FFD21F] animate-pulse inline-block" />
        <span>Free UK delivery on orders over £50</span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <span className="hidden sm:inline text-slate-400">Crafted & inspected in our UK print studio</span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#071525]/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" id="brand-logo-link" className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <PokeCraftLogo size="md" variant="light" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold tracking-wide text-slate-200">
            <Link
              to="/"
              id="nav-home"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                path === '/' ? 'text-[#FFD21F] bg-white/5' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>

            {/* Shop with Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button
                id="nav-shop-dropdown-btn"
                onClick={() => navigate('/shop')}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                  path.startsWith('/shop') ? 'text-[#FFD21F] bg-white/5' : 'hover:text-white hover:bg-white/5'
                }`}
                aria-expanded={isShopDropdownOpen}
              >
                <span>Shop</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isShopDropdownOpen ? 'rotate-180 text-[#FFD21F]' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu */}
              {isShopDropdownOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-[#0D1B2A] border border-slate-700/80 rounded-xl shadow-2xl p-2.5 backdrop-blur-xl">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 flex justify-between items-center">
                      <span>Explore Catalogue</span>
                      <span className="text-[#FFD21F] text-[10px]">3D Printed Only</span>
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {shopDropdownItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setIsShopDropdownOpen(false)}
                            className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all text-left"
                          >
                            <div className="p-2 rounded-md bg-[#071525] border border-slate-700 group-hover:border-[#FFD21F]/50 group-hover:text-[#FFD21F] transition-colors shrink-0">
                              <Icon className="w-4 h-4 text-slate-300 group-hover:text-[#FFD21F]" />
                            </div>
                            <div>
                              <div className="font-medium text-white group-hover:text-[#FFD21F] transition-colors text-sm">
                                {item.label}
                              </div>
                              <div className="text-xs text-slate-400 line-clamp-1">
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/#collections"
              id="nav-collections"
              onClick={() => {
                if (path === '/') {
                  document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/shop');
                }
              }}
              className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
            >
              Collections
            </Link>

            <Link
              to="/shop?filter=new"
              id="nav-new-releases"
              className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <span>New Releases</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD21F]" />
            </Link>

            <Link
              to="/#about"
              id="nav-about"
              onClick={() => {
                if (path === '/') {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Action Icons & Search */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Trigger / Input Button */}
            <button
              id="header-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3.5 py-2 bg-[#0D1B2A] hover:bg-slate-800 border border-slate-700/80 rounded-lg text-slate-300 text-sm w-44 lg:w-56 transition-all group"
              title="Search collectibles (press / or click)"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#FFD21F] transition-colors" />
              <span className="text-xs text-slate-400 group-hover:text-slate-200">Search prints...</span>
              <kbd className="ml-auto text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Icon Button */}
            <button
              id="mobile-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Search prints"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Icon */}
            <button
              id="header-account-btn"
              onClick={() => {
                if (!user) navigate('/login');
                else if (user.role === 'admin') navigate('/admin/dashboard');
                else navigate('/account/dashboard');
              }}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={user ? "My Account" : "Sign In"}
              aria-label="Account"
            >
              <UserCircle className="w-5 h-5" />
            </button>

            {/* Wishlist Icon & Counter */}
            <button
              id="header-wishlist-btn"
              onClick={() => setIsWishlistModalOpen(true)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-white/10 transition-colors"
              title="Saved items"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon & Item Count */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0D1B2A] hover:bg-slate-800 border border-slate-700/80 text-white transition-all group"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-200 group-hover:text-[#FFD21F] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#FFD21F] text-[#071525] font-black text-[11px] flex items-center justify-center shadow-md animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold text-xs tracking-wide">
                Cart
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#071525]/95 backdrop-blur-xl text-white">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <PokeCraftLogo size="sm" variant="light" />
            <button
              id="close-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Quick Search inside mobile drawer */}
            <button
              id="mobile-drawer-search-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center gap-3 p-3 bg-[#0D1B2A] border border-slate-700 rounded-xl text-slate-300 text-sm"
            >
              <Search className="w-4 h-4 text-[#FFD21F]" />
              <span>Search Charizard, Planters, Displays...</span>
            </button>

            {/* Links list */}
            <div className="space-y-1 text-base font-semibold">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-3 rounded-lg ${path === '/' ? 'text-[#FFD21F] bg-white/5' : 'text-slate-200'}`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-3 rounded-lg ${path === '/shop' ? 'text-[#FFD21F] bg-white/5' : 'text-slate-200'}`}
              >
                All Products
              </Link>
              <div className="pl-3 py-1 space-y-1 text-sm text-slate-300 border-l border-slate-800 ml-3">
                <Link
                  to="/shop/figures"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-2 hover:text-[#FFD21F]"
                >
                  • Display Figures
                </Link>
                <Link
                  to="/shop/display-storage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-2 hover:text-[#FFD21F]"
                >
                  • Display & Storage Stands
                </Link>
                <Link
                  to="/shop/keychains"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-2 hover:text-[#FFD21F]"
                >
                  • Sturdy Keychains
                </Link>
                <Link
                  to="/shop/accessories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-2 hover:text-[#FFD21F]"
                >
                  • Desk Accessories & Planters
                </Link>
              </div>

              <Link
                to="/shop?filter=new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-3 rounded-lg text-slate-200 hover:text-[#FFD21F]"
              >
                New Releases
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-3 rounded-lg text-slate-200 hover:text-[#FFD21F]"
              >
                Shopping Cart ({cartCount})
              </Link>
              <Link
                to="/#about"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                }}
                className="block py-3 px-3 rounded-lg text-slate-200 hover:text-[#FFD21F]"
              >
                About PokeCraft
              </Link>
            </div>

            {/* Value strip in mobile menu */}
            <div className="p-4 rounded-xl bg-[#0D1B2A] border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-[#FFD21F]" />
                <span>3D Printed Fan Craftsmanship</span>
              </div>
              <p className="text-slate-400">
                100% physical 3D prints crafted from high-precision matte PLA+. No cards or booster packs.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Wishlist Slide-Over Modal */}
      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
      />
    </>
  );
};
