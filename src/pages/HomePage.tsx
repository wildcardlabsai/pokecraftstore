import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, HeartHandshake, Lock, CheckCircle2, Flame, Layers } from 'lucide-react';
import { heroBannerImg } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { PromoStrip } from '../components/PromoStrip';
import { CollectionCards } from '../components/CollectionCards';
import { useRouter } from '../context/RouterContext';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  // The 8 specified featured products
  const featuredProductSlugs = [
    'charizard-display-figure',
    'pikachu-display-figure',
    'mewtwo-figure',
    'poke-ball-display',
    'bulbasaur-planter',
    'eevee-keychain',
    'gengar-storage-box',
    'poke-ball-phone-stand',
  ];

  const featuredProducts = featuredProductSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];

  // New releases (4 items)
  const newReleases = products.filter((p) => p.newRelease).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubmitted(true);
  };

  return (
    <div className="space-y-0">
      
      {/* SECTION 1 — CINEMATIC HERO */}
      <section className="relative bg-[#071525] text-white overflow-hidden border-b border-slate-800">
        {/* Ambient subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#FFD21F]/10 via-[#0D1B2A]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1B2A] border border-slate-700 text-[#FFD21F] text-xs font-bold uppercase tracking-wider shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD21F]" />
                <span>100% 3D Printed Collectibles & Display Art</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Bring Your Collection <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#FFD21F]">
                  To Life
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                3D printed collectibles, displays &amp; accessories made for Pokémon fans. Precision-engineered display figures, LED bases, planters, and desk accessories.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-shop-now-btn"
                  onClick={() => navigate('/shop')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#FFD21F]/10 flex items-center justify-center gap-2.5 active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-explore-releases-btn"
                  onClick={() => navigate('/shop?filter=new')}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0D1B2A] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-bold text-sm uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Explore New Releases</span>
                  <Sparkles className="w-4 h-4 text-[#FFD21F]" />
                </button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD21F]" />
                  <span>Physical 3D Prints Only</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Free UK Delivery Over £50</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Matte PLA+ Precision Infill</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Product Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-2 bg-gradient-to-b from-slate-700/50 via-slate-800/40 to-transparent shadow-2xl">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square bg-slate-900 border border-slate-700/80">
                  <img
                    src={heroBannerImg}
                    alt="PokeCraft 3D Printed Collectibles & Display Pedestals"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Product Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#071525]/90 backdrop-blur-md border border-slate-700/90 rounded-xl p-3.5 flex items-center justify-between text-white shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFD21F] text-[#071525] flex items-center justify-center font-black text-xs shrink-0">
                        3D
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Charizard &amp; Poké Ball LED Base</div>
                        <div className="text-[11px] text-slate-400">Micro-layer PLA+ • Studio Finished</div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/product/charizard-display-figure')}
                      className="text-xs font-bold text-[#FFD21F] hover:underline shrink-0"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROMOTIONAL FEATURE STRIP */}
      <PromoStrip />

      {/* COLLECTIONS SECTION */}
      <CollectionCards />

      {/* FEATURED PRODUCTS SECTION */}
      <section id="featured-products" className="bg-[#F5F7FA] py-16 sm:py-24 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-200/80 px-3 py-1 rounded-md inline-block mb-2">
                Handpicked Favourites
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#071525] tracking-tight">
                Featured Products
              </h2>
            </div>

            <button
              id="view-all-products-link"
              onClick={() => navigate('/shop')}
              className="text-sm font-bold text-[#071525] hover:text-amber-600 flex items-center gap-1.5 transition-colors group"
            >
              <span>View All Products ({products.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 8 Featured Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* NEW RELEASES SECTION: "JUST PRINTED" */}
      <section className="bg-[#0D1B2A] text-white py-16 sm:py-24 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD21F]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD21F] bg-[#071525] border border-slate-700 px-3 py-1 rounded-md mb-3">
                <Flame className="w-3.5 h-3.5 text-[#FFD21F]" />
                <span>Fresh Off The Build Plate</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Just Printed
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Fresh off the printer and ready for your collection.
              </p>
            </div>

            <button
              id="view-all-new-releases-btn"
              onClick={() => navigate('/shop?filter=new')}
              className="px-6 py-3 rounded-xl bg-[#071525] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <span>View All New Releases</span>
              <ArrowRight className="w-4 h-4 text-[#FFD21F]" />
            </button>
          </div>

          {/* 4 New Releases Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newReleases.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY POKECRAFT SECTION */}
      <section className="bg-white py-16 sm:py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              The PokeCraft Standard
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#071525]">
              Why Collectors Choose PokeCraft
            </h2>
            <p className="text-slate-600 text-sm">
              We design and print dedicated physical pieces made specifically to elevate real fan collections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#071525] text-[#FFD21F] flex items-center justify-center mb-5 shadow-md">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#071525] uppercase tracking-wide mb-2">
                Fast Shipping
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tracked delivery on every order. Secure padded packaging ensures prints arrive in mint condition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#071525] text-[#FFD21F] flex items-center justify-center mb-5 shadow-md">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#071525] uppercase tracking-wide mb-2">
                Quality Prints
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Carefully printed and finished collectibles using premium matte PLA+ and micro-layer calibration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#071525] text-[#FFD21F] flex items-center justify-center mb-5 shadow-md">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#071525] uppercase tracking-wide mb-2">
                Made For Collectors
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Designed with real fans in mind. Every stand, pedestal, and figure is built around standard collector displays.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#071525] text-[#FFD21F] flex items-center justify-center mb-5 shadow-md">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#071525] uppercase tracking-wide mb-2">
                Secure Checkout
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Safe and simple checkout experience. Guest-friendly purchasing with zero account hassles.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT / BRAND STORY SECTION */}
      <section id="about" className="bg-[#071525] text-white py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFD21F] bg-[#0D1B2A] px-3 py-1 rounded-md border border-slate-700 inline-block">
                Our Story &amp; Craft
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Built For The Collection
              </h2>
              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  PokeCraft was born out of frustration with generic, cheap plastic knick-knacks. As longtime fans, we wanted physical art and display solutions that felt worthy of sitting next to premium statues, on high-end gaming desks, and in dedicated display cases.
                </p>
                <p>
                  Every piece in our shop is engineered in-house and printed on fine-tuned machines using matte, low-glare filaments. From illuminated LED Poké Ball pedestals to dual-extruded weighted figures, we make Pokémon collections more fun, vibrant, and rewarding to showcase.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="about-explore-collection-btn"
                  onClick={() => navigate('/shop')}
                  className="px-8 py-4 rounded-xl bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-black text-sm uppercase tracking-wider transition-all flex items-center gap-2.5 active:scale-95 shadow-lg"
                >
                  <span>Explore The Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-[#0D1B2A] border border-slate-700/80">
                  <div className="font-display font-black text-3xl text-[#FFD21F]">0.12mm</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">Micro Layer Height</div>
                  <p className="text-xs text-slate-400 mt-2">Smooth surface contours without jagged stepping.</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0D1B2A] border border-slate-700/80">
                  <div className="font-display font-black text-3xl text-emerald-400">100%</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">Bio-Sourced PLA+</div>
                  <p className="text-xs text-slate-400 mt-2">Non-toxic, odor-free, renewable plant-based polymers.</p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-6 rounded-2xl bg-[#0D1B2A] border border-slate-700/80">
                  <div className="font-display font-black text-3xl text-cyan-400">48 Hr</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">Studio Dispatch</div>
                  <p className="text-xs text-slate-400 mt-2">Carefully hand-inspected before leaving Bristol, UK.</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0D1B2A] border border-slate-700/80">
                  <div className="font-display font-black text-3xl text-[#FFD21F]">0 Cards</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">100% 3D Prints</div>
                  <p className="text-xs text-slate-400 mt-2">Purely physical sculptures, stands &amp; desk accessories.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA SECTION */}
      <section className="bg-gradient-to-b from-[#0D1B2A] to-[#071525] text-white py-16 sm:py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071525] border border-slate-700 text-[#FFD21F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collector Drops</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Don&apos;t Miss The Next Drop
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
            Get first access to new releases, limited prints, exclusive filament colors, and PokeCraft news.
          </p>

          {newsletterSubmitted ? (
            <div className="p-5 rounded-2xl bg-[#071525] border border-emerald-500/40 text-emerald-300 max-w-md mx-auto flex items-center justify-center gap-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-sm font-semibold text-left">
                <div>Welcome to the PokeCraft Club!</div>
                <div className="text-xs text-slate-400 font-normal">You&apos;ll get priority notification on our next print run.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
              <input
                id="newsletter-email-input"
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3.5 rounded-xl bg-[#071525] border border-slate-700 focus:border-[#FFD21F] text-white placeholder-slate-400 text-sm focus:outline-none"
              />
              <button
                id="newsletter-submit-btn"
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-black text-xs uppercase tracking-wider transition-colors shrink-0 shadow-md"
              >
                Join The Club
              </button>
            </form>
          )}

          <p className="text-slate-400 text-xs">
            No spam, ever. Unsubscribe with one click anytime.
          </p>
        </div>
      </section>

    </div>
  );
};
