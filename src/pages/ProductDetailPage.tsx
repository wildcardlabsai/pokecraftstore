import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  Layers,
  ShieldCheck,
  ChevronRight,
  Heart,
  CheckCircle2,
  Clock,
  Ruler,
  Cpu,
  Sparkles,
  Plus,
  Minus,
  Info,
} from 'lucide-react';
import { MOCK_REVIEWS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { Link, useRouter } from '../context/RouterContext';
import { Product } from '../types';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { navigate } = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const wishlisted = product ? isWishlisted(product.id) : false;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'care' | 'reviews'>('desc');

  useEffect(() => {
    setIsLoading(true);
    // Fetch all and filter for simplicity
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: Product) => p.slug === slug);
        if (found) {
          setProduct(found);
          const related = data.filter((p: Product) => p.id !== found.id && (p.category === found.category || p.featured)).slice(0, 4);
          setRelatedProducts(related);
        }
        setIsLoading(false);
      });
  }, [slug]);

  // Reset states when slug changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
    window.scrollTo(0, 0);
  }, [slug, product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedVariant);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity, selectedVariant);
      navigate('/checkout');
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#071525]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to="/shop" className="hover:text-slate-900 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link
              to={`/shop/${product.category}`}
              className="hover:text-slate-900 transition-colors capitalize"
            >
              {product.category.replace('-', ' & ')}
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          
          {/* LEFT: PRODUCT GALLERY */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image Viewer */}
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm flex items-center justify-center">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={`${product.name} 3D print render view ${selectedImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Badges on stage */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
                    Special Offer
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[#071525] text-[#FFD21F] border border-[#FFD21F]/30 shadow-md">
                  3D Print Collectible
                </span>
              </div>

              {/* Wishlist Button on image */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
                  wishlisted
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600'
                }`}
                title={wishlisted ? 'Saved in wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>

              {/* Filament Layer Quality Indicator */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-slate-300 bg-[#071525]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                <span className="font-mono flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD21F]" />
                  Layer Height: 0.12mm Ultra-Fine
                </span>
                <span className="text-slate-400">Print time: ~{product.printTime}</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all bg-white p-0.5 ${
                      selectedImageIndex === idx
                        ? 'border-[#071525] shadow-md ring-2 ring-[#FFD21F]'
                        : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS, OPTIONS & BUY ACTIONS */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-slate-500">
                  {product.category.replace('-', ' & ')}
                </span>
                <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFD21F] text-[#FFD21F]" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800 text-xs">{product.rating.toFixed(1)}</span>
                  <span className="text-slate-500 text-xs">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#071525] tracking-tight">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#071525]">
                  £{product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="font-mono text-lg text-slate-400 line-through">
                    £{product.compareAtPrice.toFixed(2)}
                  </span>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Save £{(product.compareAtPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Short Tagline / Description */}
              <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Variant Selector (if available) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-700">
                    Filament Finish / Variant
                  </span>
                  <span className="text-slate-500 font-medium">{selectedVariant}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedVariant === v
                          ? 'bg-[#071525] text-[#FFD21F] border-[#071525] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Status */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Quantity
                </span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-mono font-bold text-sm text-slate-900 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock ({product.stock} available)
                </span>
                <div className="text-[11px] text-slate-500 mt-1">Ready to pack &amp; dispatch</div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-3 pt-2">
              <button
                id="product-add-to-cart-btn"
                onClick={handleAddToCart}
                className="w-full py-4 px-6 rounded-2xl bg-[#071525] hover:bg-slate-900 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2.5 active:scale-95 group"
              >
                <ShoppingBag className="w-5 h-5 text-[#FFD21F] group-hover:scale-110 transition-transform" />
                <span>Add to Cart • £{(product.price * quantity).toFixed(2)}</span>
              </button>

              <button
                id="product-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-black text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (Guest Checkout)</span>
              </button>
            </div>

            {/* Assurance Guarantee Strip */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 text-xs text-slate-600 shadow-sm">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#071525] shrink-0" />
                <div>
                  <strong className="text-slate-900">Tracked UK Shipping:</strong> Standard £3.99, or FREE on orders over £50.
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-[#071525] shrink-0" />
                <div>
                  <strong className="text-slate-900">30-Day Guarantee:</strong> If your print arrives with any defect, we replace it free.
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#071525] shrink-0" />
                <div>
                  <strong className="text-slate-900">Collector Grade Finish:</strong> Fine 0.12mm layer lines with weighted core.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* DETAILS, SPECS, CARE & REVIEWS SECTION */}
        <div className="mt-16 sm:mt-24">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 overflow-x-auto gap-4 sm:gap-8 text-sm font-bold tracking-wide">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 px-2 border-b-2 uppercase tracking-wider transition-colors shrink-0 ${
                activeTab === 'desc'
                  ? 'border-[#071525] text-[#071525]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 px-2 border-b-2 uppercase tracking-wider transition-colors shrink-0 ${
                activeTab === 'specs'
                  ? 'border-[#071525] text-[#071525]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-4 px-2 border-b-2 uppercase tracking-wider transition-colors shrink-0 ${
                activeTab === 'care'
                  ? 'border-[#071525] text-[#071525]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Care Information
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-2 border-b-2 uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-[#071525] text-[#071525]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Reviews</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-xs font-mono">
                {product.reviewCount}
              </span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 mt-6 shadow-sm">
            {activeTab === 'desc' && (
              <div className="space-y-6 max-w-3xl text-slate-700 leading-relaxed text-sm sm:text-base">
                <h3 className="font-display font-extrabold text-2xl text-[#071525]">
                  About the {product.name}
                </h3>
                <p>{product.description}</p>
                <p>
                  Unlike mass-produced cheap injection molded plastic toys, every PokeCraft model undergoes an individual multi-hour print cycle on our high-resolution machines. We use proprietary temperature-tuned profiles to ensure crisp overhangs, sturdy walls, and saturated matte color transitions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Anti-Glare Matte Finish</div>
                      <div className="text-xs text-slate-600 mt-0.5">Doesn&apos;t reflect harsh room or lamp lighting in photos or display shelves.</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Balanced Center of Gravity</div>
                      <div className="text-xs text-slate-600 mt-0.5">Weighted base prevents tip-overs from desk vibrations or bumps.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-6 max-w-3xl">
                <h3 className="font-display font-extrabold text-2xl text-[#071525]">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Height</div>
                    <div className="font-bold text-slate-900 text-base mt-1 flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-slate-600" />
                      {product.height}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Dimensions</div>
                    <div className="font-bold text-slate-900 text-base mt-1">
                      {product.dimensions}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Material</div>
                    <div className="font-bold text-slate-900 text-base mt-1 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-slate-600" />
                      {product.material}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Print Time</div>
                    <div className="font-bold text-slate-900 text-base mt-1 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-600" />
                      {product.printTime}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Finish</div>
                    <div className="font-bold text-slate-900 text-base mt-1">
                      {product.finish}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Recommended Age</div>
                    <div className="font-bold text-slate-900 text-base mt-1">
                      {product.recommendedAge}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-6 max-w-3xl">
                <h3 className="font-display font-extrabold text-2xl text-[#071525]">
                  Caring For Your 3D Print
                </h3>
                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3.5 text-xs sm:text-sm text-amber-900">
                  <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <p>{product.careInstructions}</p>
                </div>
                <div className="space-y-3 text-slate-600 text-sm">
                  <p>
                    <strong>Dusting:</strong> Use a dry makeup brush, soft microfiber cloth, or low-pressure compressed air duster.
                  </p>
                  <p>
                    <strong>Temperature:</strong> PLA+ begins to soften above 55°C (131°F). Do not leave in a hot enclosed car during peak summer or on top of hot radiator heaters.
                  </p>
                  <p>
                    <strong>Display environment:</strong> Ideal for indoor display shelving, gaming setups, and study desks.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <h3 className="font-display font-extrabold text-2xl text-[#071525]">
                      Collector Reviews
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#FFD21F] text-[#FFD21F]" />
                        ))}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {product.rating.toFixed(1)} out of 5
                      </span>
                      <span className="text-slate-500 text-xs">
                        Based on {product.reviewCount} customer reviews
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
                    100% Verified Buyer Feedback
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_REVIEWS.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#FFD21F] text-[#FFD21F]" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>

                      <div className="font-bold text-slate-900 text-sm">{rev.title}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                        <span className="font-medium text-slate-700">{rev.author}</span>
                        {rev.verified && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-20 sm:mt-28">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Expand Your Collection
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#071525]">
                Related Collectibles
              </h2>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="text-xs font-bold uppercase tracking-wider text-[#071525] hover:text-amber-600"
            >
              View More →
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
