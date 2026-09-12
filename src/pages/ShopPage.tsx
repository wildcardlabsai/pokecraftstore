import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check, Star, Search, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductCategory, SortOption } from '../types';
import { Link, useRouter } from '../context/RouterContext';

interface ShopPageProps {
  initialCategory?: ProductCategory | 'all';
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory = 'all' }) => {
  const { path, navigate } = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine current active category from path or prop
  const currentCategoryFromPath = useMemo(() => {
    if (path === '/shop/figures') return 'figures';
    if (path === '/shop/display-storage') return 'display-storage';
    if (path === '/shop/keychains') return 'keychains';
    if (path === '/shop/accessories') return 'accessories';
    return initialCategory;
  }, [path, initialCategory]);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(currentCategoryFromPath);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(60);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products", err);
        setIsLoading(false);
      });
  }, []);

  // Sync category if URL changes
  useEffect(() => {
    setSelectedCategory(currentCategoryFromPath);
  }, [currentCategoryFromPath]);

  // Check URL search params for quick filters like ?filter=new or ?filter=bestsellers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter');
      if (filter === 'new') {
        setFilterTag('newRelease');
        setSortBy('newest');
      } else if (filter === 'bestsellers') {
        setFilterTag('bestSeller');
        setSortBy('best-selling');
      } else {
        setFilterTag(null);
      }
    }
  }, [path]);

  // Category metadata for hero banner
  const activeCategoryMeta = CATEGORIES.find((c) => c.slug === selectedCategory);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Quick tags filter (?filter=new or bestsellers)
      if (filterTag === 'newRelease' && !product.newRelease) return false;
      if (filterTag === 'bestSeller' && !product.bestSeller) return false;

      // Price filter
      if (product.price > maxPrice) return false;

      // Stock filter
      if (inStockOnly && product.stock <= 0) return false;

      // Rating filter
      if (minRating > 0 && product.rating < minRating) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.newRelease ? 1 : 0) - (a.newRelease ? 1 : 0);
      if (sortBy === 'best-selling') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || b.reviewCount - a.reviewCount;
      // Default: featured
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, maxPrice, inStockOnly, minRating, searchQuery, sortBy, filterTag]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(60);
    setInStockOnly(false);
    setMinRating(0);
    setSearchQuery('');
    setSortBy('featured');
    setFilterTag(null);
    navigate('/shop');
  };

  const handleCategorySelect = (cat: ProductCategory | 'all') => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${cat}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      
      {/* Category / Shop Header Hero Banner */}
      <div className="bg-[#071525] text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-medium">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/shop" className="hover:text-white transition-colors">
              Shop
            </Link>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[#FFD21F] capitalize font-semibold">
                  {selectedCategory.replace('-', ' & ')}
                </span>
              </>
            )}
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#FFD21F] bg-[#0D1B2A] px-2.5 py-1 rounded border border-slate-700">
              <span>PokeCraft 3D Physical Catalogue</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white capitalize">
              {activeCategoryMeta ? activeCategoryMeta.name : filterTag === 'newRelease' ? 'New Releases' : filterTag === 'bestSeller' ? 'Best Sellers' : 'Shop All Products'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {activeCategoryMeta
                ? activeCategoryMeta.description
                : 'Discover 3D printed collectibles, displays and accessories for your collection. Every model is engineered in-house and printed in fine-detail matte PLA+.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Top Control Bar: Search & Sort & Mobile Filter Toggle */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search bar inside shop */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="shop-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prints in shop..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#071525]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Controls: Count, Mobile filter button & Sort */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 sm:gap-4">
            
            {/* Mobile Filter Button */}
            <button
              id="mobile-filter-open-btn"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Filter className="w-4 h-4 text-[#071525]" />
              <span>Filters</span>
            </button>

            {/* Product Count */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> collectibles
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="shop-sort-select" className="hidden sm:inline text-xs text-slate-500 font-medium">
                Sort:
              </label>
              <div className="relative">
                <select
                  id="shop-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl pl-3 pr-8 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="best-selling">Best Selling</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>

        {/* 2-Column Desktop Grid: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP SIDEBAR FILTER */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wide text-[#071525]">
                <SlidersHorizontal className="w-4 h-4 text-[#FFD21F]" />
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Category
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-[#071525] text-[#FFD21F] font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>All Collectibles</span>
                  <span className="text-[11px] font-mono opacity-75">{products.length}</span>
                </button>

                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat.slug).length;
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.slug as ProductCategory)}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#071525] text-[#FFD21F] font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] font-mono opacity-75">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-700">Max Price</span>
                <span className="font-mono font-bold text-slate-900">Up to £{maxPrice.toFixed(2)}</span>
              </div>
              <input
                id="filter-price-slider"
                type="range"
                min={7}
                max={60}
                step={1}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#071525] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>£7</span>
                <span>£30</span>
                <span>£60</span>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Availability
              </span>
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer font-medium select-none">
                <input
                  id="filter-in-stock-checkbox"
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#071525] accent-[#071525]"
                />
                <span>In Stock Prints Only</span>
              </label>
            </div>

            {/* Minimum Rating Filter */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Rating
              </span>
              <div className="space-y-1 text-xs">
                {[0, 4.8, 4.9].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMinRating(val)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${
                      minRating === val ? 'bg-slate-100 font-bold text-[#071525]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {val === 0 ? (
                        <span>All Ratings</span>
                      ) : (
                        <>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#FFD21F] text-[#FFD21F]" />
                            ))}
                          </div>
                          <span>{val} &amp; above</span>
                        </>
                      )}
                    </div>
                    {minRating === val && <Check className="w-3.5 h-3.5 text-[#071525]" />}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* MAIN PRODUCT GRID */}
          <main className="lg:col-span-9">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#071525]"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  No 3D prints match your criteria
                </h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Try clearing your active filters or expanding the price range slider.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#071525] text-white hover:bg-[#FFD21F] hover:text-[#071525] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#071525]/70 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-display font-bold text-base text-slate-900">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6 flex-1">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      handleCategorySelect('all');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg ${selectedCategory === 'all' ? 'bg-[#071525] text-[#FFD21F] font-bold' : 'text-slate-600'}`}
                  >
                    All Collectibles
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategorySelect(cat.slug as ProductCategory);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg ${selectedCategory === cat.slug ? 'bg-[#071525] text-[#FFD21F] font-bold' : 'text-slate-600'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-700">Max Price</span>
                  <span className="font-mono font-bold">£{maxPrice.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={7}
                  max={60}
                  step={1}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#071525]"
                />
              </div>

              {/* In stock */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#071525]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#071525] text-white font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2 text-xs text-slate-500 font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
