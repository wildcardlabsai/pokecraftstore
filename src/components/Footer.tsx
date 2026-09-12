import React from 'react';
import { PokeCraftLogo } from './PokeCraftLogo';
import { Link, useRouter } from '../context/RouterContext';
import { ShieldCheck, Printer, HeartHandshake, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#071525] text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] border border-slate-700 flex items-center justify-center text-[#FFD21F] shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Ultra-Fine Prints</div>
              <div className="text-slate-400">0.12mm micro-layer detail</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] border border-slate-700 flex items-center justify-center text-[#FFD21F] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Collector Safe</div>
              <div className="text-slate-400">Non-toxic matte bio-PLA</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] border border-slate-700 flex items-center justify-center text-[#FFD21F] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">UK Print Studio</div>
              <div className="text-slate-400">Dispatched from Bristol, UK</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] border border-slate-700 flex items-center justify-center text-[#FFD21F] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Fan-Made Passion</div>
              <div className="text-slate-400">Created by collectors for fans</div>
            </div>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          
          {/* Brand info column */}
          <div className="col-span-2 space-y-4">
            <PokeCraftLogo size="md" variant="light" />
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              PokeCraft designs and crafts premium 3D printed physical display figures, LED bases, planters, and accessories. We do not sell trading cards or booster packs — only physical 3D art made to showcase.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Studio status: Printers currently running</span>
            </div>
          </div>

          {/* Column 1: SHOP */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/shop" className="hover:text-[#FFD21F] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop/figures" className="hover:text-[#FFD21F] transition-colors">
                  Figures
                </Link>
              </li>
              <li>
                <Link to="/shop/display-storage" className="hover:text-[#FFD21F] transition-colors">
                  Display & Storage
                </Link>
              </li>
              <li>
                <Link to="/shop/keychains" className="hover:text-[#FFD21F] transition-colors">
                  Keychains
                </Link>
              </li>
              <li>
                <Link to="/shop/accessories" className="hover:text-[#FFD21F] transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=new" className="hover:text-[#FFD21F] transition-colors">
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: HELP */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 mb-4">
              Help
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => alert('UK Tracked Delivery: £3.99 (Free over £50). Royal Mail 48 Tracked service. Dispatched in 24-48 hours.')}
                  className="hover:text-[#FFD21F] transition-colors text-left"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('30-Day Hassle-Free Returns: If your 3D print arrives with any transit flaw, we replace it immediately free of charge.')}
                  className="hover:text-[#FFD21F] transition-colors text-left"
                >
                  Returns & Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('PokeCraft FAQ: All prints use high-grade tough matte PLA+ filament with reinforced walls. Safe for display on desks and shelving.')}
                  className="hover:text-[#FFD21F] transition-colors text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Contact our studio team: support@pokecraft-collectibles.co.uk (Mon-Fri 9am-5pm BST)')}
                  className="hover:text-[#FFD21F] transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: ABOUT */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 mb-4">
              About
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/#about" className="hover:text-[#FFD21F] transition-colors">
                  About PokeCraft
                </Link>
              </li>
              <li>
                <Link to="/#about" className="hover:text-[#FFD21F] transition-colors">
                  Our Print Story
                </Link>
              </li>
              <li>
                <button
                  onClick={() => alert('Materials: We exclusively use premium plant-based matte PLA+ and recyclable PETG diffusers, printed at 215°C with 0.12-0.16mm layer height.')}
                  className="hover:text-[#FFD21F] transition-colors text-left"
                >
                  3D Materials & Finishes
                </button>
              </li>
            </ul>

            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 mt-6 mb-3">
              Follow Us
            </h4>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="hover:text-[#FFD21F] cursor-pointer">Instagram</span>
              <span>•</span>
              <span className="hover:text-[#FFD21F] cursor-pointer">TikTok</span>
              <span>•</span>
              <span className="hover:text-[#FFD21F] cursor-pointer">Facebook</span>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left max-w-2xl leading-relaxed text-slate-400 text-[11px]">
            PokeCraft is an independent fan-made 3D printing brand and is not affiliated with or endorsed by Nintendo, The Pokémon Company or Game Freak.
          </p>

          <div className="text-center md:text-right shrink-0">
            <p>© {new Date().getFullYear()} PokeCraft Collectibles Ltd. All rights reserved.</p>
            <div className="flex items-center justify-center md:justify-end gap-2 text-[10px] text-slate-400 mt-1">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Guest Prototype</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
