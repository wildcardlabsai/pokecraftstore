import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey support (Cmd+K or / to open, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isSearchOpen && (e.target as HTMLElement).tagName !== 'INPUT')) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts: Product[] = query.trim()
    ? PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
        );
      })
    : PRODUCTS.slice(0, 4); // show trending 4 items when search is empty

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${slug}`);
  };

  const quickSuggestions = ['Charizard', 'Poké Ball', 'Bulbasaur', 'Keychains', 'Displays', 'Planters'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#071525]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0D1B2A] border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-700 flex items-center gap-3 bg-[#071525]">
          <Search className="w-5 h-5 text-[#FFD21F] shrink-0" />
          <input
            ref={inputRef}
            id="search-modal-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 3D printed collectibles (e.g. Charizard, Planter, LED Base)..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-base sm:text-lg focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            id="close-search-modal-btn"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs px-2.5 font-medium border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-[#0A1624] border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FFD21F]" /> Popular:
          </span>
          {quickSuggestions.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-[#FFD21F]/20 hover:text-[#FFD21F] text-slate-300 border border-slate-700 shrink-0 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            {query.trim() ? `Search Results (${filteredProducts.length})` : 'Featured Collectibles'}
          </div>

          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product.slug)}
                className="group flex items-center justify-between p-3 rounded-xl bg-[#071525]/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-700/80 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-[#FFD21F] transition-colors text-sm sm:text-base flex items-center gap-2">
                      <span>{product.name}</span>
                      {product.bestSeller && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Best Seller
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {product.shortDescription}
                    </div>
                    <div className="text-xs font-mono font-bold text-[#FFD21F] mt-1">
                      £{product.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 group-hover:text-white text-xs font-medium pl-3 shrink-0">
                  <span className="hidden sm:inline">View Product</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD21F] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-white font-bold text-base">No collectibles found.</div>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                We couldn&apos;t find any 3D prints matching &ldquo;{query}&rdquo;. Try searching for figures, planters, keychains, or display bases.
              </p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-[#071525] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Search 3D printed models, stands & accessories</span>
          <span className="text-slate-500">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
