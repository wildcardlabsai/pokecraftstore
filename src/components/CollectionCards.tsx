import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useRouter } from '../context/RouterContext';

export const CollectionCards: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFD21F] bg-[#071525] px-3 py-1 rounded-md border border-slate-700 inline-block mb-3">
            Handcrafted Catalogue
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#071525] tracking-tight">
            Shop Our Collections
          </h2>
        </div>
        <p className="text-slate-600 text-sm sm:text-base max-w-md">
          Explore custom 3D printed designs built for display cabinets, gaming desks, and on-the-go fans.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            id={`collection-card-${cat.slug}`}
            onClick={() => navigate(`/shop/${cat.slug}`)}
            className="group relative h-96 sm:h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071525] via-[#071525]/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
              {/* Top Tag */}
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFD21F] bg-[#071525]/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#FFD21F]/30">
                  Collection
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#FFD21F] group-hover:text-[#071525] group-hover:rotate-45 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom text */}
              <div className="space-y-2 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                <h3 className="font-display font-extrabold text-2xl text-white group-hover:text-[#FFD21F] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal">
                  {cat.tagline}
                </p>
                <div className="pt-2 text-xs font-bold uppercase tracking-wider text-[#FFD21F] flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                  <span>Browse Category</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
